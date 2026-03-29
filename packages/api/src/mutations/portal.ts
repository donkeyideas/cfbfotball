// ============================================================
// Transfer Portal Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { RosterClaimRow } from '@cfb-social/types';

/**
 * Claim a portal player will commit to a specific school.
 * Each user can only claim once per player (enforced by UNIQUE constraint).
 */
export async function claimPlayer(
  client: SupabaseClient,
  playerId: string,
  schoolId: string,
  confidence: number,
  reasoning?: string
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  if (confidence < 1 || confidence > 100) {
    throw new Error('Confidence must be between 1 and 100');
  }

  const { data, error } = await client
    .from('roster_claims')
    .insert({
      player_id: playerId,
      user_id: user.id,
      school_id: schoolId,
      confidence,
      reasoning: reasoning ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as RosterClaimRow;
}
