// ============================================================
// Prediction Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PredictionRow } from '@cfb-social/types';

interface PredictionFilters {
  result?: string;
  category?: string;
  userId?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Get predictions with optional filters
 */
export async function getPredictions(
  client: SupabaseClient,
  filters: PredictionFilters = {}
) {
  const { result, category, userId, cursor, limit = 20 } = filters;

  let query = client
    .from('predictions')
    .select(`
      *,
      user:predictions_user_id_fkey (
        id, username, display_name, avatar_url, dynasty_tier
      ),
      post:predictions_post_id_fkey (
        id, content, created_at, touchdown_count, fumble_count
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (result) {
    query = query.eq('result', result);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (PredictionRow & {
    user: Record<string, unknown> | null;
    post: Record<string, unknown> | null;
  })[];
}

/**
 * Get a single prediction by ID
 */
export async function getPredictionById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('predictions')
    .select(`
      *,
      user:predictions_user_id_fkey (
        id, username, display_name, avatar_url, dynasty_tier, school_id
      ),
      post:predictions_post_id_fkey (
        id, content, created_at, touchdown_count, fumble_count
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PredictionRow & {
    user: Record<string, unknown> | null;
    post: Record<string, unknown> | null;
  };
}

/**
 * Get predictions for a specific user
 */
export async function getUserPredictions(
  client: SupabaseClient,
  userId: string,
  filters: { result?: string; limit?: number } = {}
) {
  const { result, limit = 20 } = filters;

  let query = client
    .from('predictions')
    .select(`
      *,
      post:predictions_post_id_fkey (
        id, content, created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (result) {
    query = query.eq('result', result);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (PredictionRow & {
    post: Record<string, unknown> | null;
  })[];
}

/**
 * Get prediction leaderboard — top users by correct predictions
 */
export async function getPredictionLeaderboard(
  client: SupabaseClient,
  limit = 20
) {
  const { data, error } = await client
    .from('profiles')
    .select('id, username, display_name, avatar_url, dynasty_tier, correct_predictions, prediction_count')
    .gt('prediction_count', 0)
    .order('correct_predictions', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
