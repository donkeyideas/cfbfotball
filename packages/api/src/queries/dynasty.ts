// ============================================================
// Dynasty Mode Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AchievementRow, UserAchievementRow, XPLogEntryRow } from '@cfb-social/types';

/**
 * Get all achievements (active only)
 */
export async function getAchievements(client: SupabaseClient) {
  const { data, error } = await client
    .from('achievements')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('requirement_value', { ascending: true });

  if (error) throw error;
  return data as AchievementRow[];
}

/**
 * Get achievements unlocked by a user
 */
export async function getUserAchievements(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements!user_achievements_achievement_id_fkey(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data as (UserAchievementRow & { achievement: AchievementRow })[];
}

/**
 * Get XP log for a user (recent activity)
 */
export async function getXPLog(client: SupabaseClient, userId: string, limit = 20) {
  const { data, error } = await client
    .from('xp_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as XPLogEntryRow[];
}

/**
 * Get dynasty profile (XP, level, tier, achievements, recent XP)
 */
export async function getDynastyProfile(client: SupabaseClient, userId: string) {
  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp, level, dynasty_tier, post_count, touchdown_count, follower_count, challenge_wins, correct_predictions')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  const [achievements, xpLog] = await Promise.all([
    getUserAchievements(client, userId),
    getXPLog(client, userId, 10),
  ]);

  return {
    profile,
    achievements,
    xpLog,
  };
}

/**
 * Get the all-time leaderboard directly from profiles
 */
export async function getDynastyLeaderboard(
  client: SupabaseClient,
  options: { schoolId?: string; limit?: number } = {}
) {
  const { schoolId, limit = 25 } = options;

  let query = client
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp, level, dynasty_tier, school_id')
    .gt('xp', 0)
    .order('xp', { ascending: false })
    .limit(limit);

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
