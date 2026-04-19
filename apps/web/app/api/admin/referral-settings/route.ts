import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { createAdminClient } from '@/lib/admin/supabase/admin';

const REFERRAL_SETTING_KEYS = [
  'referral_system_enabled',
  'referral_char_limits_enabled',
  'referral_base_char_limit',
  'referral_xp_reward',
  'referral_tiers',
];

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const supabase = createAdminClient();

  // Fetch settings
  const { data: settingsData } = await supabase
    .from('admin_settings')
    .select('key, value')
    .in('key', REFERRAL_SETTING_KEYS);

  const settings: Record<string, string> = {};
  for (const row of settingsData ?? []) {
    settings[row.key as string] = row.value as string;
  }

  // Fetch stats
  const { count: totalCodes } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .not('referral_code', 'is', null);

  const { count: totalReferrals } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true });

  const { count: activatedReferrals } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'ACTIVATED');

  const { count: pendingReferrals } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'PENDING');

  // Top recruiters
  const { data: topRecruiters } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, referral_count, referral_code')
    .gt('referral_count', 0)
    .order('referral_count', { ascending: false })
    .limit(20);

  // Recent referrals
  const { data: recentReferrals } = await supabase
    .from('referrals')
    .select('id, referrer_id, referred_id, referral_code, status, activated_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  // All users with referral data
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, referral_code, referral_count, referred_by, char_limit, created_at, school_id')
    .order('referral_count', { ascending: false })
    .limit(500);

  // Build a lookup: profile id -> username for "referred by" display
  const usernameLookup: Record<string, string> = {};
  for (const u of allUsers ?? []) {
    usernameLookup[u.id as string] = (u.username as string) || (u.display_name as string) || (u.id as string);
  }

  return NextResponse.json({
    settings,
    stats: {
      totalCodes: totalCodes ?? 0,
      totalReferrals: totalReferrals ?? 0,
      activatedReferrals: activatedReferrals ?? 0,
      pendingReferrals: pendingReferrals ?? 0,
    },
    topRecruiters: topRecruiters ?? [],
    recentReferrals: recentReferrals ?? [],
    allUsers: (allUsers ?? []).map((u: Record<string, unknown>) => ({
      id: u.id,
      username: u.username ?? null,
      display_name: u.display_name ?? null,
      referral_code: u.referral_code ?? null,
      referral_count: (u.referral_count as number) ?? 0,
      referred_by: u.referred_by ? usernameLookup[u.referred_by as string] ?? u.referred_by : null,
      char_limit: (u.char_limit as number) ?? 3000,
      created_at: u.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const { settings } = body as { settings: Record<string, string> };

  if (!settings || typeof settings !== 'object') {
    return NextResponse.json({ error: 'settings object required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const errors: string[] = [];

  for (const [key, value] of Object.entries(settings)) {
    if (!REFERRAL_SETTING_KEYS.includes(key)) continue;
    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key, value: String(value) }, { onConflict: 'key' });
    if (error) errors.push(`${key}: ${error.message}`);
  }

  if (errors.length) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
