// ============================================================
// Aging Takes Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgingTakeRow } from '@cfb-social/types';

/**
 * Mark a post for aging — set a revisit date to check if the take aged well.
 */
export async function markForAging(
  client: SupabaseClient,
  postId: string,
  revisitDate: string
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('aging_takes')
    .insert({
      post_id: postId,
      user_id: user.id,
      revisit_date: revisitDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data as AgingTakeRow;
}

/**
 * Vote on an aging take — aged well or aged poorly.
 */
export async function voteOnAgingTake(
  client: SupabaseClient,
  agingTakeId: string,
  vote: 'well' | 'poorly'
) {
  const column = vote === 'well' ? 'aged_well_votes' : 'aged_poorly_votes';

  // Get current count first
  const { data: current, error: fetchError } = await client
    .from('aging_takes')
    .select(column)
    .eq('id', agingTakeId)
    .single();

  if (fetchError) throw fetchError;

  const currentCount = (current as Record<string, number | null>)[column] ?? 0;

  const { data, error } = await client
    .from('aging_takes')
    .update({ [column]: currentCount + 1 })
    .eq('id', agingTakeId)
    .select()
    .single();

  if (error) throw error;
  return data as AgingTakeRow;
}
