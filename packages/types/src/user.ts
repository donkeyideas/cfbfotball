// ============================================================
// User / Profile Types - Matches profiles table schema
// ============================================================

import type { UserRole, UserStatus, DynastyTier } from './enums';

export interface Profile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  schoolId: string | null;
  role: UserRole;
  status: UserStatus;

  // Denormalized counts
  postCount: number;
  touchdownCount: number;
  fumbleCount: number;
  followerCount: number;
  followingCount: number;

  // Dynasty mode
  xp: number;
  level: number;
  dynastyTier: DynastyTier;

  // Predictions
  predictionCount: number;
  correctPredictions: number;
  challengeWins: number;
  challengeLosses: number;

  // Moderation
  banReason: string | null;
  bannedUntil: string | null;
  bannedBy: string | null;

  termsAcceptedAt: string | null;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Row shape as returned from Supabase (snake_case) */
export interface ProfileRow {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  school_id: string | null;
  role: string;
  status: string;
  post_count: number;
  touchdown_count: number;
  fumble_count: number;
  follower_count: number;
  following_count: number;
  xp: number;
  level: number;
  dynasty_tier: string;
  prediction_count: number;
  correct_predictions: number;
  challenge_wins: number;
  challenge_losses: number;
  ban_reason: string | null;
  banned_until: string | null;
  banned_by: string | null;
  terms_accepted_at: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

/** The session user - combines Supabase auth user with profile data */
export interface UserSession {
  id: string;
  email: string;
  profile: Profile;
}

/** Public-facing profile (omits moderation/ban fields) */
export interface PublicProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  schoolId: string | null;
  role: UserRole;
  postCount: number;
  touchdownCount: number;
  fumbleCount: number;
  followerCount: number;
  followingCount: number;
  xp: number;
  level: number;
  dynastyTier: DynastyTier;
  predictionCount: number;
  correctPredictions: number;
  challengeWins: number;
  challengeLosses: number;
  createdAt: string;
}

/** Convert a Supabase profile row to a Profile interface */
export function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    schoolId: row.school_id,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    postCount: row.post_count,
    touchdownCount: row.touchdown_count,
    fumbleCount: row.fumble_count,
    followerCount: row.follower_count,
    followingCount: row.following_count,
    xp: row.xp,
    level: row.level,
    dynastyTier: row.dynasty_tier as DynastyTier,
    predictionCount: row.prediction_count,
    correctPredictions: row.correct_predictions,
    challengeWins: row.challenge_wins,
    challengeLosses: row.challenge_losses,
    banReason: row.ban_reason,
    bannedUntil: row.banned_until,
    bannedBy: row.banned_by,
    termsAcceptedAt: row.terms_accepted_at,
    lastActiveAt: row.last_active_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Convert a Profile to a PublicProfile (strips sensitive fields) */
export function toPublicProfile(profile: Profile): PublicProfile {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    schoolId: profile.schoolId,
    role: profile.role,
    postCount: profile.postCount,
    touchdownCount: profile.touchdownCount,
    fumbleCount: profile.fumbleCount,
    followerCount: profile.followerCount,
    followingCount: profile.followingCount,
    xp: profile.xp,
    level: profile.level,
    dynastyTier: profile.dynastyTier,
    predictionCount: profile.predictionCount,
    correctPredictions: profile.correctPredictions,
    challengeWins: profile.challengeWins,
    challengeLosses: profile.challengeLosses,
    createdAt: profile.createdAt,
  };
}
