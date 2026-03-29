// ============================================================
// Mascot Wars Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get the currently active bracket.
 */
export async function getActiveBracket(client: SupabaseClient) {
  const { data, error } = await client
    .from('mascot_brackets')
    .select('*')
    .eq('status', 'ACTIVE')
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Get a bracket by ID.
 */
export async function getBracketById(client: SupabaseClient, bracketId: string) {
  const { data, error } = await client
    .from('mascot_brackets')
    .select('*')
    .eq('id', bracketId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get matchups for a bracket, optionally filtered by round.
 * Includes school joins for display.
 */
export async function getBracketMatchups(
  client: SupabaseClient,
  bracketId: string,
  round?: number
) {
  let query = client
    .from('mascot_matchups')
    .select(`
      *,
      school_1:schools!mascot_matchups_school_1_id_fkey(
        id, name, abbreviation, slug, primary_color, secondary_color, mascot
      ),
      school_2:schools!mascot_matchups_school_2_id_fkey(
        id, name, abbreviation, slug, primary_color, secondary_color, mascot
      )
    `)
    .eq('bracket_id', bracketId)
    .order('round')
    .order('position');

  if (round !== undefined) {
    query = query.eq('round', round);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Get the current user's votes for a bracket.
 */
export async function getUserMascotVotes(client: SupabaseClient, bracketId: string) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return [];

  // Get all matchup IDs for this bracket, then get votes
  const { data: matchups } = await client
    .from('mascot_matchups')
    .select('id')
    .eq('bracket_id', bracketId);

  if (!matchups || matchups.length === 0) return [];

  const matchupIds = matchups.map((m) => m.id);

  const { data, error } = await client
    .from('mascot_votes')
    .select('*')
    .eq('user_id', user.id)
    .in('matchup_id', matchupIds);

  if (error) throw error;
  return data ?? [];
}
