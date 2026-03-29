// ============================================================
// Rivalry Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { RivalryRow } from '@cfb-social/types';

/**
 * Get all active rivalries with school info
 */
export async function getRivalries(client: SupabaseClient) {
  const { data, error } = await client
    .from('rivalries')
    .select(`
      *,
      school_1:school_1_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot
      ),
      school_2:school_2_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot
      )
    `)
    .in('status', ['UPCOMING', 'ACTIVE', 'VOTING'])
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (RivalryRow & {
    school_1: Record<string, unknown>;
    school_2: Record<string, unknown>;
  })[];
}

/**
 * Get the currently featured rivalry
 */
export async function getFeaturedRivalry(client: SupabaseClient) {
  const { data, error } = await client
    .from('rivalries')
    .select(`
      *,
      school_1:school_1_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot
      ),
      school_2:school_2_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot
      )
    `)
    .eq('is_featured', true)
    .in('status', ['ACTIVE', 'VOTING'])
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data as (RivalryRow & {
    school_1: Record<string, unknown>;
    school_2: Record<string, unknown>;
  }) | null;
}

/**
 * Get a single rivalry by ID with school info and recent takes
 */
export async function getRivalryById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('rivalries')
    .select(`
      *,
      school_1:school_1_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot, stadium, city, state
      ),
      school_2:school_2_id (
        id, name, abbreviation, slug, primary_color, secondary_color, logo_url, mascot, stadium, city, state
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as RivalryRow & {
    school_1: Record<string, unknown>;
    school_2: Record<string, unknown>;
  };
}
