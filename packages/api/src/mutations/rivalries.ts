// ============================================================
// Rivalry Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { RivalryVoteRow, RivalryTakeRow } from '@cfb-social/types';

/**
 * Vote on a rivalry for a specific school.
 * Each user can only vote once per rivalry (enforced by UNIQUE constraint).
 */
export async function voteOnRivalry(
  client: SupabaseClient,
  rivalryId: string,
  schoolId: string
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('rivalry_votes')
    .insert({
      rivalry_id: rivalryId,
      user_id: user.id,
      school_id: schoolId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as RivalryVoteRow;
}

/**
 * Submit a take (hot take / opinion) on a rivalry
 */
export async function submitRivalryTake(
  client: SupabaseClient,
  rivalryId: string,
  content: string,
  schoolId?: string
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('rivalry_takes')
    .insert({
      rivalry_id: rivalryId,
      user_id: user.id,
      content,
      school_id: schoolId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as RivalryTakeRow;
}
