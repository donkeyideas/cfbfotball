// ============================================================
// Moderation Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ModerationEventRow, ReportRow, AppealRow } from '@cfb-social/types';

/**
 * Get flagged posts for moderation queue
 */
export async function getFlaggedPosts(client: SupabaseClient, limit = 50) {
  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url),
      school:schools!posts_school_id_fkey(id, name, abbreviation, primary_color)
    `)
    .eq('status', 'FLAGGED')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get moderation events for a post
 */
export async function getPostModerationEvents(client: SupabaseClient, postId: string) {
  const { data, error } = await client
    .from('moderation_events')
    .select(`
      *,
      moderator:profiles!moderation_events_moderator_id_fkey(id, username, display_name)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (ModerationEventRow & { moderator: Record<string, unknown> | null })[];
}

/**
 * Get pending reports
 */
export async function getPendingReports(client: SupabaseClient, limit = 50) {
  const { data, error } = await client
    .from('reports')
    .select(`
      *,
      reporter:profiles!reports_reporter_id_fkey(id, username, display_name),
      post:posts!reports_post_id_fkey(id, content, post_type, author_id, status),
      reported_user:profiles!reports_reported_user_id_fkey(id, username, display_name)
    `)
    .in('status', ['PENDING', 'REVIEWING'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as (ReportRow & {
    reporter: Record<string, unknown> | null;
    post: Record<string, unknown> | null;
    reported_user: Record<string, unknown> | null;
  })[];
}

/**
 * Get pending appeals
 */
export async function getPendingAppeals(client: SupabaseClient, limit = 50) {
  const { data, error } = await client
    .from('appeals')
    .select(`
      *,
      user:profiles!appeals_user_id_fkey(id, username, display_name),
      post:posts!appeals_post_id_fkey(id, content, post_type, status)
    `)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as (AppealRow & {
    user: Record<string, unknown> | null;
    post: Record<string, unknown> | null;
  })[];
}

/**
 * Get user's moderation history (violation count)
 */
export async function getUserModerationHistory(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('moderation_events')
    .select('id, event_type, action_taken, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Pick<ModerationEventRow, 'id' | 'event_type' | 'action_taken' | 'created_at'>[];
}
