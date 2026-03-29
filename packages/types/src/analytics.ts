// ============================================================
// Analytics Types
// ============================================================

export interface AnalyticsEvent {
  id: string;
  userId: string | null;
  eventType: string;
  metadata: Record<string, unknown> | null;
  sessionId: string | null;
  createdAt: string;
}

export interface AnalyticsEventRow {
  id: string;
  user_id: string | null;
  event_type: string;
  metadata: Record<string, unknown> | null;
  session_id: string | null;
  created_at: string;
}

export interface DailyStats {
  id: string;
  date: string;
  dau: number;
  mau: number;
  newUsers: number;
  totalPosts: number;
  totalReactions: number;
  totalChallenges: number;
  totalRivalries: number;
  moderationFlags: number;
  moderationAutoRemoves: number;
  avgSessionDurationSeconds: number;
  createdAt: string;
}

export interface DailyStatsRow {
  id: string;
  date: string;
  dau: number;
  mau: number;
  new_users: number;
  total_posts: number;
  total_reactions: number;
  total_challenges: number;
  total_rivalries: number;
  moderation_flags: number;
  moderation_auto_removes: number;
  avg_session_duration_seconds: number;
  created_at: string;
}

export interface APIPerformanceLog {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  error: string | null;
  createdAt: string;
}

export interface APIPerformanceLogRow {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  error: string | null;
  created_at: string;
}

/** Aggregated dashboard overview for admin panel */
export interface DashboardOverview {
  today: DailyStats | null;
  yesterday: DailyStats | null;
  weeklyGrowth: {
    users: number;
    posts: number;
    reactions: number;
  };
  moderationQueue: {
    pendingReports: number;
    pendingAppeals: number;
    flaggedPosts: number;
  };
  topEndpoints: Array<{
    endpoint: string;
    avgResponseTime: number;
    requestCount: number;
    errorRate: number;
  }>;
}
