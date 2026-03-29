// ============================================================
// Mascot Wars Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Vote on a mascot matchup. UNIQUE constraint prevents double-voting.
 */
export async function voteOnMascotMatchup(
  client: SupabaseClient,
  matchupId: string,
  schoolId: string
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('mascot_votes')
    .insert({
      matchup_id: matchupId,
      user_id: user.id,
      school_id: schoolId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Advance bracket to next round:
 * 1. Resolve all VOTING matchups in current round (set winners by vote count)
 * 2. Create next round matchups pairing adjacent winners
 * 3. Advance bracket's current_round
 */
export async function advanceBracketRound(client: SupabaseClient, bracketId: string) {
  // Get bracket
  const { data: bracket, error: bracketErr } = await client
    .from('mascot_brackets')
    .select('*')
    .eq('id', bracketId)
    .single();

  if (bracketErr || !bracket) throw bracketErr ?? new Error('Bracket not found');

  const currentRound = bracket.current_round;

  // Get current round matchups
  const { data: matchups, error: matchErr } = await client
    .from('mascot_matchups')
    .select('*')
    .eq('bracket_id', bracketId)
    .eq('round', currentRound)
    .eq('status', 'VOTING')
    .order('position');

  if (matchErr) throw matchErr;
  if (!matchups || matchups.length === 0) throw new Error('No voting matchups to resolve');

  // Resolve each matchup
  const winners: string[] = [];
  for (const matchup of matchups) {
    const winnerId = matchup.school_1_votes >= matchup.school_2_votes
      ? matchup.school_1_id
      : matchup.school_2_id;

    await client
      .from('mascot_matchups')
      .update({ winner_id: winnerId, status: 'COMPLETED', updated_at: new Date().toISOString() })
      .eq('id', matchup.id);

    winners.push(winnerId);
  }

  const nextRound = currentRound + 1;

  // Check if this was the final round
  if (nextRound > bracket.total_rounds) {
    await client
      .from('mascot_brackets')
      .update({
        status: 'COMPLETED',
        champion_school_id: winners[0],
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bracketId);
    return { status: 'COMPLETED', champion: winners[0] };
  }

  // Create next round matchups (pair adjacent winners)
  const now = new Date();
  const votingEnd = new Date(now.getTime() + bracket.voting_hours * 60 * 60 * 1000);

  const nextMatchups = [];
  for (let i = 0; i < winners.length; i += 2) {
    nextMatchups.push({
      bracket_id: bracketId,
      round: nextRound,
      position: Math.floor(i / 2),
      school_1_id: winners[i],
      school_2_id: winners[i + 1] ?? null,
      status: 'VOTING',
      voting_starts_at: now.toISOString(),
      voting_ends_at: votingEnd.toISOString(),
    });
  }

  await client.from('mascot_matchups').insert(nextMatchups);

  // Advance bracket round
  await client
    .from('mascot_brackets')
    .update({ current_round: nextRound, updated_at: new Date().toISOString() })
    .eq('id', bracketId);

  return { status: 'ADVANCED', nextRound, matchups: nextMatchups.length };
}
