// ============================================================
// Dynasty Mode / Gamification Types
// ============================================================

import { type AchievementCategory, type XPSource, type LeaderboardPeriod, DynastyTier } from './enums';

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string | null;
  category: AchievementCategory;
  xpReward: number;
  requirementType: string;
  requirementValue: number;
  isActive: boolean;
  createdAt: string;
}

export interface AchievementRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string | null;
  category: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
}

export interface UserAchievementRow {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface XPLogEntry {
  id: string;
  userId: string;
  amount: number;
  source: XPSource;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export interface XPLogEntryRow {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  period: LeaderboardPeriod;
  schoolId: string | null;
  userId: string;
  rank: number;
  xp: number;
  level: number;
  snapshotDate: string;
  createdAt: string;
}

export interface LeaderboardEntryRow {
  id: string;
  period: string;
  school_id: string | null;
  user_id: string;
  rank: number;
  xp: number;
  level: number;
  snapshot_date: string;
  created_at: string;
}

/** Aggregated progress for a user's dynasty mode */
export interface DynastyProgress {
  userId: string;
  xp: number;
  level: number;
  tier: DynastyTier;
  achievements: UserAchievement[];
  recentXP: XPLogEntry[];
  /** XP needed to reach the next level */
  xpToNextLevel: number;
  /** Current level progress as a percentage (0-100) */
  levelProgress: number;
}

/** XP thresholds for each level (index = level number) */
export const XP_THRESHOLDS: readonly number[] = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2200,  // Level 7
  3000,  // Level 8
  4000,  // Level 9
  5200,  // Level 10
  6600,  // Level 11
  8200,  // Level 12
  10000, // Level 13
  12500, // Level 14
  15500, // Level 15
  19000, // Level 16
  23000, // Level 17
  28000, // Level 18
  34000, // Level 19
  41000, // Level 20
  50000, // Level 21 (max)
] as const;

/** Get the dynasty tier for a given level */
export function getTierForLevel(level: number): DynastyTier {
  if (level >= 18) return DynastyTier.HALL_OF_FAME;
  if (level >= 14) return DynastyTier.HEISMAN;
  if (level >= 10) return DynastyTier.ALL_AMERICAN;
  if (level >= 7) return DynastyTier.ALL_CONFERENCE;
  if (level >= 4) return DynastyTier.STARTER;
  return DynastyTier.WALK_ON;
}

/** Calculate XP remaining to reach the next level */
export function getXPToNextLevel(currentXP: number, currentLevel: number): number {
  const nextLevelIndex = currentLevel; // thresholds are 0-indexed for level 1
  if (nextLevelIndex >= XP_THRESHOLDS.length) return 0; // Max level
  return Math.max(0, XP_THRESHOLDS[nextLevelIndex]! - currentXP);
}

/** Calculate level progress as a percentage */
export function getLevelProgress(currentXP: number, currentLevel: number): number {
  const currentThresholdIndex = currentLevel - 1;
  const nextThresholdIndex = currentLevel;
  if (nextThresholdIndex >= XP_THRESHOLDS.length) return 100; // Max level

  const currentThreshold = XP_THRESHOLDS[currentThresholdIndex]!;
  const nextThreshold = XP_THRESHOLDS[nextThresholdIndex]!;
  const range = nextThreshold - currentThreshold;

  if (range <= 0) return 100;
  return Math.min(100, Math.round(((currentXP - currentThreshold) / range) * 100));
}
