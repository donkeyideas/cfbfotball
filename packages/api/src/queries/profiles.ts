// ============================================================
// Profile Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileRow } from '@cfb-social/types';

/**
 * Get a profile by user ID
 */
export async function getProfile(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

/**
 * Get a profile by username
 */
export async function getProfileByUsername(client: SupabaseClient, username: string) {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

/**
 * Search profiles by username or display name
 */
export async function searchProfiles(client: SupabaseClient, query: string) {
  const searchTerm = `%${query}%`;

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('status', 'ACTIVE')
    .or(`username.ilike.${searchTerm},display_name.ilike.${searchTerm}`)
    .order('follower_count', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as ProfileRow[];
}

/**
 * Get leaderboard for a given period, optionally filtered by school
 */
export async function getLeaderboard(
  client: SupabaseClient,
  period: string,
  schoolId?: string
) {
  let query = client
    .from('leaderboard_snapshots')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        display_name,
        avatar_url,
        school_id,
        xp,
        level,
        dynasty_tier
      )
    `)
    .eq('period', period)
    .order('rank', { ascending: true })
    .limit(100);

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  // Get the most recent snapshot for this period
  query = query.order('snapshot_date', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
