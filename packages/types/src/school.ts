// ============================================================
// School Types - Matches schools table schema
// ============================================================

import { SchoolClassification } from './enums';

export interface School {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  slug: string;
  mascot: string;
  conference: string;
  division: string | null;
  classification: SchoolClassification;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string | null;
  logoUrl: string | null;
  stadium: string | null;
  city: string | null;
  state: string | null;
  isFbs: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Row shape as returned from Supabase (snake_case) */
export interface SchoolRow {
  id: string;
  name: string;
  short_name: string;
  abbreviation: string;
  slug: string;
  mascot: string;
  conference: string;
  division: string | null;
  classification: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string | null;
  logo_url: string | null;
  stadium: string | null;
  city: string | null;
  state: string | null;
  is_fbs: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Convert a Supabase school row to a School interface */
export function toSchool(row: SchoolRow): School {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    abbreviation: row.abbreviation,
    slug: row.slug,
    mascot: row.mascot,
    conference: row.conference,
    division: row.division,
    classification: row.classification as SchoolClassification,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    tertiaryColor: row.tertiary_color,
    logoUrl: row.logo_url,
    stadium: row.stadium,
    city: row.city,
    state: row.state,
    isFbs: row.is_fbs,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
