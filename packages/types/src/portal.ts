// ============================================================
// Transfer Portal Types
// ============================================================

import type { PortalPlayerStatus, PredictionResult } from './enums';

export interface PortalPlayer {
  id: string;
  name: string;
  position: string;
  previousSchoolId: string | null;
  previousSchoolName: string | null;
  starRating: number;
  height: string | null;
  weight: string | null;
  classYear: 'FR' | 'SO' | 'JR' | 'SR' | 'GR' | null;
  stats: Record<string, unknown> | null;
  status: PortalPlayerStatus;
  committedSchoolId: string | null;
  committedAt: string | null;
  enteredPortalAt: string;
  portalWindow: 'SPRING' | 'WINTER' | null;
  seasonYear: number | null;
  totalClaims: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortalPlayerRow {
  id: string;
  name: string;
  position: string;
  previous_school_id: string | null;
  previous_school_name: string | null;
  star_rating: number;
  height: string | null;
  weight: string | null;
  class_year: string | null;
  stats: Record<string, unknown> | null;
  status: string;
  committed_school_id: string | null;
  committed_at: string | null;
  entered_portal_at: string;
  portal_window: string | null;
  season_year: number | null;
  total_claims: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface RosterClaim {
  id: string;
  playerId: string;
  userId: string;
  schoolId: string;
  confidence: number;
  reasoning: string | null;
  isCorrect: boolean | null;
  xpAwarded: number;
  createdAt: string;
}

export interface RosterClaimRow {
  id: string;
  player_id: string;
  user_id: string;
  school_id: string;
  confidence: number;
  reasoning: string | null;
  is_correct: boolean | null;
  xp_awarded: number;
  created_at: string;
}

export interface Prediction {
  id: string;
  userId: string;
  postId: string | null;
  predictionText: string;
  category: 'GAME_OUTCOME' | 'SEASON_RECORD' | 'PLAYER_PERFORMANCE' | 'RECRUITING' | 'AWARD' | 'CUSTOM' | null;
  targetDate: string | null;
  result: PredictionResult;
  verifiedAt: string | null;
  verifiedBy: string | null;
  xpAwarded: number;
  createdAt: string;
  updatedAt: string;
}

export interface PredictionRow {
  id: string;
  user_id: string;
  post_id: string | null;
  prediction_text: string;
  category: string | null;
  target_date: string | null;
  result: string;
  verified_at: string | null;
  verified_by: string | null;
  xp_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface AgingTake {
  id: string;
  postId: string;
  userId: string;
  revisitDate: string;
  isSurfaced: boolean;
  surfacedAt: string | null;
  communityVerdict: 'AGED_WELL' | 'AGED_POORLY' | 'PENDING' | null;
  agedWellVotes: number;
  agedPoorlyVotes: number;
  createdAt: string;
}

export interface AgingTakeRow {
  id: string;
  post_id: string;
  user_id: string;
  revisit_date: string;
  is_surfaced: boolean;
  surfaced_at: string | null;
  community_verdict: string | null;
  aged_well_votes: number;
  aged_poorly_votes: number;
  created_at: string;
}

export function toPortalPlayer(row: PortalPlayerRow): PortalPlayer {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    previousSchoolId: row.previous_school_id,
    previousSchoolName: row.previous_school_name,
    starRating: row.star_rating,
    height: row.height,
    weight: row.weight,
    classYear: row.class_year as PortalPlayer['classYear'],
    stats: row.stats,
    status: row.status as PortalPlayerStatus,
    committedSchoolId: row.committed_school_id,
    committedAt: row.committed_at,
    enteredPortalAt: row.entered_portal_at,
    portalWindow: row.portal_window as PortalPlayer['portalWindow'],
    seasonYear: row.season_year,
    totalClaims: row.total_claims,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRosterClaim(row: RosterClaimRow): RosterClaim {
  return {
    id: row.id,
    playerId: row.player_id,
    userId: row.user_id,
    schoolId: row.school_id,
    confidence: row.confidence,
    reasoning: row.reasoning,
    isCorrect: row.is_correct,
    xpAwarded: row.xp_awarded,
    createdAt: row.created_at,
  };
}

export function toPrediction(row: PredictionRow): Prediction {
  return {
    id: row.id,
    userId: row.user_id,
    postId: row.post_id,
    predictionText: row.prediction_text,
    category: row.category as Prediction['category'],
    targetDate: row.target_date,
    result: row.result as PredictionResult,
    verifiedAt: row.verified_at,
    verifiedBy: row.verified_by,
    xpAwarded: row.xp_awarded,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
