import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/admin/supabase/admin';

export const runtime = 'nodejs';

/**
 * Bot system health check / diagnostics endpoint.
 * Accessible by admin or with CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  // Auth: CRON_SECRET or dev mode
  const authHeader = request.headers.get('authorization');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Check bots_global_active setting
    const { data: globalSetting } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'bots_global_active')
      .single();

    // 2. Count total and active bots
    const { count: totalBots } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_bot', true);

    const { count: activeBots } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_bot', true)
      .eq('bot_active', true);

    // 3. Last bot activity
    const { data: lastActivity } = await supabase
      .from('bot_activity_log')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 4. Last 5 bot posts
    const { data: recentBotPosts } = await supabase
      .from('posts')
      .select('content, created_at, profiles!posts_author_id_fkey(username)')
      .eq('status', 'PUBLISHED')
      .eq('profiles.is_bot', true)
      .order('created_at', { ascending: false })
      .limit(5);

    // Filter to only bot posts (the join filter may not exclude non-bot rows)
    // Use a direct approach: get bot IDs first, then query posts
    const { data: botIds } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_bot', true);

    const botIdList = botIds?.map((b) => b.id) ?? [];

    const { data: last5Posts } = await supabase
      .from('posts')
      .select('content, created_at, author_id, profiles!posts_author_id_fkey(username)')
      .eq('status', 'PUBLISHED')
      .in('author_id', botIdList.length > 0 ? botIdList : ['__none__'])
      .order('created_at', { ascending: false })
      .limit(5);

    // 5. Posts last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: postsLast24h } = await supabase
      .from('bot_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('action_type', 'POST')
      .eq('success', true)
      .gte('created_at', twentyFourHoursAgo);

    // 6. Reactions last 24h
    const { count: reactionsLast24h } = await supabase
      .from('bot_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('action_type', 'REACT')
      .eq('success', true)
      .gte('created_at', twentyFourHoursAgo);

    // 7. Replies last 24h
    const { count: repliesLast24h } = await supabase
      .from('bot_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('action_type', 'REPLY')
      .eq('success', true)
      .gte('created_at', twentyFourHoursAgo);

    return NextResponse.json({
      bots_global_active: globalSetting?.value === 'true',
      total_bots: totalBots ?? 0,
      active_bots: activeBots ?? 0,
      deepseek_configured: !!process.env.DEEPSEEK_API_KEY,
      cron_secret_configured: !!process.env.CRON_SECRET,
      last_bot_activity: lastActivity?.created_at ?? null,
      last_5_posts: (last5Posts ?? []).map((p: any) => ({
        author: p.profiles?.username ?? 'unknown',
        content_preview: typeof p.content === 'string' ? p.content.slice(0, 120) : '',
        created_at: p.created_at,
      })),
      posts_last_24h: postsLast24h ?? 0,
      reactions_last_24h: reactionsLast24h ?? 0,
      replies_last_24h: repliesLast24h ?? 0,
    });
  } catch (error) {
    console.error('[BOT DIAGNOSE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
