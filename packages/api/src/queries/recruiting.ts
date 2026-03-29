// ============================================================
// Recruiting Queries
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

export interface RecruitingSchoolStats {
  schoolId: string;
  schoolName: string;
  abbreviation: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  conference: string;
  mascot: string;
  playersLost: number;
  playersGained: number;
  totalClaims: number;
  avgStarRating: number;
  netMovement: number;
  activityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
}

function getActivityLevel(score: number): 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' {
  if (score >= 15) return 'VERY_HIGH';
  if (score >= 8) return 'HIGH';
  if (score >= 3) return 'MODERATE';
  return 'LOW';
}

/**
 * Aggregate recruiting stats for all FBS schools.
 * Derives data from portal_players and roster_claims — no new tables needed.
 */
export async function getRecruitingStats(client: SupabaseClient): Promise<RecruitingSchoolStats[]> {
  // 1. Get all FBS schools
  const { data: schools, error: schoolErr } = await client
    .from('schools')
    .select('id, name, abbreviation, slug, primary_color, secondary_color, conference, mascot')
    .eq('is_fbs', true)
    .order('name');

  if (schoolErr || !schools) return [];

  // 2. Get portal players (all statuses) for counting lost/gained
  const { data: portalPlayers } = await client
    .from('portal_players')
    .select('previous_school_id, committed_school_id, star_rating, status');

  // 3. Get roster claims counts
  const { data: claims } = await client
    .from('roster_claims')
    .select('school_id');

  // Build lookup maps
  const lostMap = new Map<string, number>();
  const gainedMap = new Map<string, number>();
  const starsMap = new Map<string, number[]>();

  for (const p of portalPlayers ?? []) {
    if (p.previous_school_id) {
      lostMap.set(p.previous_school_id, (lostMap.get(p.previous_school_id) ?? 0) + 1);
    }
    if (p.committed_school_id) {
      gainedMap.set(p.committed_school_id, (gainedMap.get(p.committed_school_id) ?? 0) + 1);
    }
    if (p.previous_school_id && p.star_rating) {
      const arr = starsMap.get(p.previous_school_id) ?? [];
      arr.push(p.star_rating);
      starsMap.set(p.previous_school_id, arr);
    }
  }

  const claimsMap = new Map<string, number>();
  for (const c of claims ?? []) {
    if (c.school_id) {
      claimsMap.set(c.school_id, (claimsMap.get(c.school_id) ?? 0) + 1);
    }
  }

  // Merge into stats
  return schools.map((school) => {
    const lost = lostMap.get(school.id) ?? 0;
    const gained = gainedMap.get(school.id) ?? 0;
    const totalClaims = claimsMap.get(school.id) ?? 0;
    const stars = starsMap.get(school.id) ?? [];
    const avgStarRating = stars.length > 0
      ? Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 10) / 10
      : 0;
    const activityScore = lost + gained + totalClaims;

    return {
      schoolId: school.id,
      schoolName: school.name,
      abbreviation: school.abbreviation,
      slug: school.slug,
      primaryColor: school.primary_color,
      secondaryColor: school.secondary_color,
      conference: school.conference,
      mascot: school.mascot,
      playersLost: lost,
      playersGained: gained,
      totalClaims,
      avgStarRating,
      netMovement: gained - lost,
      activityLevel: getActivityLevel(activityScore),
    };
  });
}
