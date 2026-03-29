// ============================================================
// Transfer Portal Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PortalPlayerRow, RosterClaimRow } from '@cfb-social/types';

interface PortalFilters {
  status?: string;
  position?: string;
  starRating?: number;
  schoolId?: string;
  portalWindow?: string;
  seasonYear?: number;
  cursor?: string;
  limit?: number;
}

/**
 * Get portal players with optional filters
 */
export async function getPortalPlayers(
  client: SupabaseClient,
  filters: PortalFilters = {}
) {
  const {
    status,
    position,
    starRating,
    schoolId,
    portalWindow,
    seasonYear,
    cursor,
    limit = 20,
  } = filters;

  let query = client
    .from('portal_players')
    .select(`
      *,
      previous_school:previous_school_id (
        id, name, abbreviation, slug, primary_color, logo_url
      ),
      committed_school:committed_school_id (
        id, name, abbreviation, slug, primary_color, logo_url
      )
    `)
    .order('star_rating', { ascending: false })
    .order('entered_portal_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  if (position) {
    query = query.eq('position', position);
  }

  if (starRating) {
    query = query.gte('star_rating', starRating);
  }

  if (schoolId) {
    query = query.eq('previous_school_id', schoolId);
  }

  if (portalWindow) {
    query = query.eq('portal_window', portalWindow);
  }

  if (seasonYear) {
    query = query.eq('season_year', seasonYear);
  }

  if (cursor) {
    query = query.lt('entered_portal_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (PortalPlayerRow & {
    previous_school: Record<string, unknown> | null;
    committed_school: Record<string, unknown> | null;
  })[];
}

/**
 * Get a single portal player by ID with school and claim info
 */
export async function getPortalPlayer(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('portal_players')
    .select(`
      *,
      previous_school:previous_school_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot
      ),
      committed_school:committed_school_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PortalPlayerRow & {
    previous_school: Record<string, unknown> | null;
    committed_school: Record<string, unknown> | null;
  };
}

/**
 * Get all claims for a portal player with user and school info
 */
export async function getPlayerClaims(client: SupabaseClient, playerId: string) {
  const { data, error } = await client
    .from('roster_claims')
    .select(`
      *,
      user:user_id (
        id, username, display_name, avatar_url, dynasty_tier
      ),
      school:school_id (
        id, name, abbreviation, slug, primary_color, logo_url
      )
    `)
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (RosterClaimRow & {
    user: Record<string, unknown>;
    school: Record<string, unknown>;
  })[];
}
