// ============================================================
// Game Thread Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Find or create a game thread from ESPN data.
 */
export async function findOrCreateGameThread(
  client: SupabaseClient,
  espnGameId: string,
  title: string,
  awayTeam: string,
  homeTeam: string,
  gameDate: string,
  status: string,
  statusDetail: string,
  awayScore: number,
  homeScore: number
) {
  // Try to find existing thread
  const { data: existing } = await client
    .from('game_threads')
    .select('*')
    .eq('espn_game_id', espnGameId)
    .maybeSingle();

  if (existing) {
    // Update score and status
    const { data, error } = await client
      .from('game_threads')
      .update({
        away_score: awayScore,
        home_score: homeScore,
        status,
        status_detail: statusDetail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create new thread
  const { data, error } = await client
    .from('game_threads')
    .insert({
      espn_game_id: espnGameId,
      title,
      away_team: awayTeam,
      home_team: homeTeam,
      away_score: awayScore,
      home_score: homeScore,
      status,
      status_detail: statusDetail,
      game_date: gameDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Send a chat message or reaction in a game thread.
 */
export async function sendGameMessage(
  client: SupabaseClient,
  threadId: string,
  content: string,
  messageType: 'CHAT' | 'REACTION' = 'CHAT'
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('game_thread_messages')
    .insert({
      game_thread_id: threadId,
      user_id: user.id,
      content,
      message_type: messageType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update game score from ESPN data.
 */
export async function updateGameScore(
  client: SupabaseClient,
  espnGameId: string,
  awayScore: number,
  homeScore: number,
  status: string,
  statusDetail: string
) {
  const { data, error } = await client
    .from('game_threads')
    .update({
      away_score: awayScore,
      home_score: homeScore,
      status,
      status_detail: statusDetail,
      updated_at: new Date().toISOString(),
    })
    .eq('espn_game_id', espnGameId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
