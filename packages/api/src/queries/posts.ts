// ============================================================
// Post Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PostRow, FeedFilters } from '@cfb-social/types';

/** Default number of posts per page */
const DEFAULT_LIMIT = 20;

/**
 * Get a paginated feed of published posts.
 * Supports filtering by school and post type, with cursor-based pagination.
 */
export async function getFeed(
  client: SupabaseClient,
  options: FeedFilters = {}
) {
  const { schoolId, type, cursor, limit = DEFAULT_LIMIT } = options;

  let query = client
    .from('posts')
    .select(`
      *,
      author:author_id (
        id,
        username,
        display_name,
        avatar_url,
        school_id,
        dynasty_tier,
        role
      ),
      school:school_id (
        id,
        name,
        abbreviation,
        slug,
        primary_color,
        logo_url
      )
    `)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }

  if (type) {
    query = query.eq('post_type', type);
  }

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (PostRow & { author: Record<string, unknown>; school: Record<string, unknown> | null })[];
}

/**
 * Get a single post by ID with author and school info
 */
export async function getPost(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      author:author_id (
        id,
        username,
        display_name,
        avatar_url,
        school_id,
        dynasty_tier,
        role
      ),
      school:school_id (
        id,
        name,
        abbreviation,
        slug,
        primary_color,
        logo_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PostRow & { author: Record<string, unknown>; school: Record<string, unknown> | null };
}

/**
 * Get replies to a post, ordered by creation time
 */
export async function getPostReplies(
  client: SupabaseClient,
  postId: string,
  options: { cursor?: string; limit?: number } = {}
) {
  const { cursor, limit = DEFAULT_LIMIT } = options;

  let query = client
    .from('posts')
    .select(`
      *,
      author:author_id (
        id,
        username,
        display_name,
        avatar_url,
        school_id,
        dynasty_tier,
        role
      )
    `)
    .eq('parent_id', postId)
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (cursor) {
    query = query.gt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (PostRow & { author: Record<string, unknown> })[];
}

/**
 * Get all posts by a specific user
 */
export async function getUserPosts(
  client: SupabaseClient,
  userId: string,
  options: { cursor?: string; limit?: number } = {}
) {
  const { cursor, limit = DEFAULT_LIMIT } = options;

  let query = client
    .from('posts')
    .select(`
      *,
      school:school_id (
        id,
        name,
        abbreviation,
        slug,
        primary_color,
        logo_url
      )
    `)
    .eq('author_id', userId)
    .eq('status', 'PUBLISHED')
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (PostRow & { school: Record<string, unknown> | null })[];
}
