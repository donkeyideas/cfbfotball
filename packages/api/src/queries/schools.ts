// ============================================================
// School Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { SchoolRow } from '@cfb-social/types';

/**
 * Get all active FBS schools, ordered by name
 */
export async function getSchools(client: SupabaseClient) {
  const { data, error } = await client
    .from('schools')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as SchoolRow[];
}

/**
 * Get a single school by its URL slug
 */
export async function getSchoolBySlug(client: SupabaseClient, slug: string) {
  const { data, error } = await client
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as SchoolRow;
}

/**
 * Get a single school by ID
 */
export async function getSchoolById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('schools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as SchoolRow;
}

/**
 * Search schools by name, abbreviation, or mascot using trigram similarity
 */
export async function searchSchools(client: SupabaseClient, query: string) {
  const searchTerm = `%${query}%`;

  const { data, error } = await client
    .from('schools')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.${searchTerm},abbreviation.ilike.${searchTerm},mascot.ilike.${searchTerm}`)
    .order('name', { ascending: true })
    .limit(20);

  if (error) throw error;
  return data as SchoolRow[];
}
