import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/admin/supabase/admin';
import { botReactToPosts, botReplyToPost } from '@/lib/admin/bots/engine';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Engagement-only cron (every 5 minutes).
 * Does NOT create new posts - only reactions and replies.
 * Anti-pile limits: max 2 bot replies per post, max 4 bot reactions per post.
 */
export async function GET(request: NextRequest) {
  const start = Date.now();

  // Auth: CRON_SECRET, Vercel cron header, or dev mode bypass
  const authHeader = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !vercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[BOT ENGAGE] Auth failed - no valid CRON_SECRET or Vercel header');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`[BOT ENGAGE] Starting engagement cycle at ${new Date().toISOString()} (auth: ${vercelCron ? 'vercel' : isDev ? 'dev' : 'secret'})`);

  try {
    const supabase = createAdminClient();

    // Check global bot toggle
    const { data: setting } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'bots_global_active')
      .single();

    if (setting?.value !== 'true') {
      console.log('[BOT ENGAGE] Bots globally disabled, skipping');
      return NextResponse.json({ skipped: true, reason: 'bots_disabled' });
    }

    // Fetch 3-5 random active bots
    const { data: activeBots } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_bot', true)
      .eq('bot_active', true);

    if (!activeBots?.length) {
      console.log('[BOT ENGAGE] No active bots found');
      return NextResponse.json({ skipped: true, reason: 'no_active_bots' });
    }

    // Shuffle and pick 3-5 bots
    const shuffled = activeBots.sort(() => Math.random() - 0.5);
    const botCount = Math.min(3 + Math.floor(Math.random() * 3), shuffled.length); // 3-5
    const selectedBots = shuffled.slice(0, botCount);

    let totalReactions = 0;
    let totalReplies = 0;
    let engaged = 0;

    for (const bot of selectedBots) {
      try {
        // Always react
        const reactResult = await botReactToPosts(bot.id);
        if (reactResult.success && reactResult.count > 0) {
          totalReactions += reactResult.count;
          engaged++;
        }

        // 40% chance this bot also replies
        if (Math.random() < 0.4) {
          // Anti-pile check: find a post that doesn't already have 2+ bot replies
          const replyResult = await botReplyToPost(bot.id);
          if (replyResult.success && replyResult.postId) {
            totalReplies++;
          }
        }
      } catch (botError) {
        console.error(`[BOT ENGAGE] Error with bot ${bot.id}:`, botError);
      }
    }

    const elapsed = Date.now() - start;
    console.log(`[BOT ENGAGE] Completed in ${elapsed}ms - engaged: ${engaged}, reactions: ${totalReactions}, replies: ${totalReplies}`);

    return NextResponse.json({
      engaged,
      reactions: totalReactions,
      replies: totalReplies,
      botsSelected: selectedBots.length,
      elapsedMs: elapsed,
    });
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(`[BOT ENGAGE] Failed after ${elapsed}ms:`, error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error', elapsedMs: elapsed },
      { status: 500 }
    );
  }
}
