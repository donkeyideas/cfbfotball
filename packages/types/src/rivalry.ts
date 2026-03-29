// ============================================================
// Rivalry & Challenge Types
// ============================================================

import type { ChallengeStatus } from './enums';

export interface Rivalry {
  id: string;
  school1Id: string;
  school2Id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  isFeatured: boolean;
  seasonYear: number | null;
  status: 'UPCOMING' | 'ACTIVE' | 'VOTING' | 'CLOSED';
  school1VoteCount: number;
  school2VoteCount: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RivalryRow {
  id: string;
  school_1_id: string;
  school_2_id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  is_featured: boolean;
  season_year: number | null;
  status: string;
  school_1_vote_count: number;
  school_2_vote_count: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RivalryVote {
  id: string;
  rivalryId: string;
  userId: string;
  schoolId: string;
  createdAt: string;
}

export interface RivalryVoteRow {
  id: string;
  rivalry_id: string;
  user_id: string;
  school_id: string;
  created_at: string;
}

export interface RivalryTake {
  id: string;
  rivalryId: string;
  userId: string;
  content: string;
  schoolId: string | null;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export interface RivalryTakeRow {
  id: string;
  rivalry_id: string;
  user_id: string;
  content: string;
  school_id: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengedId: string;
  postId: string | null;
  topic: string;
  status: ChallengeStatus;
  challengerArgument: string | null;
  challengedArgument: string | null;
  challengerVotes: number;
  challengedVotes: number;
  winnerId: string | null;
  xpAwarded: number;
  votingEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeRow {
  id: string;
  challenger_id: string;
  challenged_id: string;
  post_id: string | null;
  topic: string;
  status: string;
  challenger_argument: string | null;
  challenged_argument: string | null;
  challenger_votes: number;
  challenged_votes: number;
  winner_id: string | null;
  xp_awarded: number;
  voting_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChallengeVote {
  id: string;
  challengeId: string;
  userId: string;
  votedFor: string;
  createdAt: string;
}

export interface ChallengeVoteRow {
  id: string;
  challenge_id: string;
  user_id: string;
  voted_for: string;
  created_at: string;
}

export interface FactCheck {
  id: string;
  postId: string;
  requesterId: string;
  claim: string;
  verdict: 'VERIFIED' | 'FALSE' | 'UNVERIFIABLE' | 'PENDING' | null;
  evidence: string | null;
  aiAnalysis: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface FactCheckRow {
  id: string;
  post_id: string;
  requester_id: string;
  claim: string;
  verdict: string | null;
  evidence: string | null;
  ai_analysis: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export function toRivalry(row: RivalryRow): Rivalry {
  return {
    id: row.id,
    school1Id: row.school_1_id,
    school2Id: row.school_2_id,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    isFeatured: row.is_featured,
    seasonYear: row.season_year,
    status: row.status as Rivalry['status'],
    school1VoteCount: row.school_1_vote_count,
    school2VoteCount: row.school_2_vote_count,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toChallenge(row: ChallengeRow): Challenge {
  return {
    id: row.id,
    challengerId: row.challenger_id,
    challengedId: row.challenged_id,
    postId: row.post_id,
    topic: row.topic,
    status: row.status as ChallengeStatus,
    challengerArgument: row.challenger_argument,
    challengedArgument: row.challenged_argument,
    challengerVotes: row.challenger_votes,
    challengedVotes: row.challenged_votes,
    winnerId: row.winner_id,
    xpAwarded: row.xp_awarded,
    votingEndsAt: row.voting_ends_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
