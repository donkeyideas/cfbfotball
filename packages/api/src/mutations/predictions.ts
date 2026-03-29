// ============================================================
// Prediction Mutations
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PredictionRow } from '@cfb-social/types';

/**
 * Create a prediction linked to a post.
 * Creates a PREDICTION-type post and a predictions row.
 */
export async function createPrediction(
  client: SupabaseClient,
  predictionText: string,
  category: string,
  targetDate?: string
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get user's school_id
  const { data: profile } = await client
    .from('profiles')
    .select('school_id')
    .eq('id', user.id)
    .single();

  // Create the post first
  const { data: post, error: postError } = await client
    .from('posts')
    .insert({
      author_id: user.id,
      content: predictionText,
      post_type: 'PREDICTION',
      school_id: profile?.school_id ?? null,
    })
    .select()
    .single();

  if (postError) throw postError;

  // Create the prediction record
  const { data: prediction, error: predError } = await client
    .from('predictions')
    .insert({
      user_id: user.id,
      post_id: post.id,
      prediction_text: predictionText,
      category,
      target_date: targetDate ?? null,
    })
    .select()
    .single();

  if (predError) throw predError;

  // Increment prediction_count on the user's profile
  const { data: prof } = await client
    .from('profiles')
    .select('prediction_count')
    .eq('id', user.id)
    .single();
  if (prof) {
    await client
      .from('profiles')
      .update({ prediction_count: (prof.prediction_count ?? 0) + 1 })
      .eq('id', user.id);
  }

  return prediction as PredictionRow;
}
