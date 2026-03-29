// ============================================================
// Game Thread Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get game threads, optionally filtered by status.
 */
export async function getGameThreads(
  client: SupabaseClient,
  options: { status?: string[]; limit?: number } = {}
) {
  const { status, limit = 50 } = options;

  let query = client
    .from('game_threads')
    .select('*')
    .order('game_date', { ascending: false })
    .limit(limit);

  if (status && status.length > 0) {
    query = query.in('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Get a single game thread by ESPN game ID.
 */
export async function getGameThread(client: SupabaseClient, espnGameId: string) {
  const { data, error } = await client
    .from('game_threads')
    .select('*')
    .eq('espn_game_id', espnGameId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Get messages for a game thread with author profiles.
 */
export async function getGameThreadMessages(
  client: SupabaseClient,
  threadId: string,
  options: { limit?: number; cursor?: string } = {}
) {
  const { limit = 50, cursor } = options;

  let query = client
    .from('game_thread_messages')
    .select(`
      *,
      author:profiles!game_thread_messages_user_id_fkey(
        id, username, display_name, avatar_url, school_id, dynasty_tier
      )
    `)
    .eq('game_thread_id', threadId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (cursor) {
    query = query.gt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
