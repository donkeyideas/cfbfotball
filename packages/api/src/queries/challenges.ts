// ============================================================
// Challenge Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ChallengeRow } from '@cfb-social/types';

/**
 * Get challenges with participant info, optionally filtered by status.
 */
export async function getChallenges(
  client: SupabaseClient,
  options: { status?: string[]; limit?: number; cursor?: string } = {}
) {
  const { status = ['PENDING', 'ACTIVE', 'VOTING'], limit = 20, cursor } = options;

  let query = client
    .from('challenges')
    .select(`
      *,
      challenger:challenger_id (
        id, username, display_name, avatar_url, school_id, dynasty_tier
      ),
      challenged:challenged_id (
        id, username, display_name, avatar_url, school_id, dynasty_tier
      ),
      challenger_school:profiles!challenges_challenger_id_fkey (
        school:school_id (id, name, abbreviation, primary_color, logo_url)
      ),
      challenged_school:profiles!challenges_challenged_id_fkey (
        school:school_id (id, name, abbreviation, primary_color, logo_url)
      )
    `)
    .in('status', status)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (ChallengeRow & { challenger: Record<string, unknown>; challenged: Record<string, unknown> })[];
}

/**
 * Get a single challenge by ID with full participant details.
 */
export async function getChallengeById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('challenges')
    .select(`
      *,
      challenger:challenger_id (
        id, username, display_name, avatar_url, school_id, dynasty_tier
      ),
      challenged:challenged_id (
        id, username, display_name, avatar_url, school_id, dynasty_tier
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ChallengeRow & {
    challenger: Record<string, unknown>;
    challenged: Record<string, unknown>;
  };
}

/**
 * Get challenges involving a specific user.
 */
export async function getUserChallenges(
  client: SupabaseClient,
  userId: string,
  options: { limit?: number } = {}
) {
  const { limit = 20 } = options;

  const { data, error } = await client
    .from('challenges')
    .select(`
      *,
      challenger:challenger_id (
        id, username, display_name, avatar_url
      ),
      challenged:challenged_id (
        id, username, display_name, avatar_url
      )
    `)
    .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as (ChallengeRow & { challenger: Record<string, unknown>; challenged: Record<string, unknown> })[];
}
