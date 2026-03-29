// ============================================================
// Moderation Types
// ============================================================

import type { ModerationAction, ReportReason, ReportStatus, AppealStatus } from './enums';

export interface ModerationEvent {
  id: string;
  postId: string | null;
  userId: string | null;
  eventType: 'AUTO_FLAG' | 'AUTO_REMOVE' | 'MANUAL_FLAG' | 'MANUAL_REMOVE' | 'APPEAL' | 'RESTORE' | 'USER_REPORT';
  aiScore: number | null;
  aiLabels: Record<string, number> | null;
  aiReason: string | null;
  moderatorId: string | null;
  moderatorNotes: string | null;
  actionTaken: ModerationAction | null;
  createdAt: string;
}

export interface ModerationEventRow {
  id: string;
  post_id: string | null;
  user_id: string | null;
  event_type: string;
  ai_score: number | null;
  ai_labels: Record<string, number> | null;
  ai_reason: string | null;
  moderator_id: string | null;
  moderator_notes: string | null;
  action_taken: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporterId: string;
  postId: string | null;
  reportedUserId: string | null;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface ReportRow {
  id: string;
  reporter_id: string;
  post_id: string | null;
  reported_user_id: string | null;
  reason: string;
  description: string | null;
  status: string;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Appeal {
  id: string;
  postId: string;
  userId: string;
  reason: string;
  status: AppealStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export interface AppealRow {
  id: string;
  post_id: string;
  user_id: string;
  reason: string;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
}

/** Result from AI content moderation analysis (DeepSeek) */
export interface ModerationResult {
  /** Overall risk score from 0 (safe) to 1 (severe violation) */
  score: number;
  /** Per-label confidence scores */
  labels: Record<string, number>;
  /** Human-readable explanation of the moderation decision */
  reason: string;
  /** Recommended action based on score thresholds */
  action: 'ALLOW' | 'FLAG' | 'REJECT';
}
