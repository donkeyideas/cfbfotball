# CFB Social — Admin Dashboard Expansion Scope

## From: Optic Rank (RankPulse AI) Admin Dashboard → To: CFB Social Admin Dashboard

This document provides a complete, detailed implementation guide for expanding the CFB Social admin dashboard (`apps/admin`) to match the feature set of the Optic Rank admin dashboard. Each section maps an Optic Rank feature to its CFB Social equivalent, including database schema, server actions, UI components, and third-party integrations.

---

## Table of Contents

1. [Current State of CFB Social Admin](#1-current-state)
2. [Admin Overview (Enhanced)](#2-admin-overview)
3. [User Management (Enhanced)](#3-user-management)
4. [Search & AI Analytics (New)](#4-search--ai-analytics)
5. [API Management (New)](#5-api-management)
6. [System Health (Enhanced)](#6-system-health)
7. [Platform Analytics (New)](#7-platform-analytics)
8. [Data Intelligence (New)](#8-data-intelligence)
9. [AI Intelligence (New)](#9-ai-intelligence)
10. [Social Posts (New)](#10-social-posts)
11. [Email Templates (New)](#11-email-templates)
12. [Notifications (Enhanced)](#12-notifications)
13. [Contact Submissions (New)](#13-contact-submissions)
14. [Database Migrations](#14-database-migrations)
15. [Environment Variables & API Keys](#15-environment-variables)
16. [Sidebar Navigation Update](#16-sidebar-navigation)
17. [Shared Utilities & Helpers](#17-shared-utilities)
18. [Implementation Order](#18-implementation-order)

---

## 1. Current State

### What CFB Social Admin Already Has (10 pages)

| Page | Path | Status |
|------|------|--------|
| Overview | `/` | Basic — 4 stat cards, 7-day activity chart |
| Users | `/users` | Basic — table with search, role/status badges |
| User Detail | `/users/[id]` | Basic — individual user view |
| Moderation | `/moderation` | Working — AI-flagged posts queue |
| Reports | `/reports` | Working — user report submissions |
| Schools | `/schools` | Working — school analytics |
| Portal | `/portal` | Basic — transfer portal overview |
| Engagement | `/engagement` | Basic — post/reaction metrics |
| Content | `/content` | Basic — content management |
| System | `/system` | Basic — DB latency, service status |
| Settings | `/settings` | Basic — admin config |

### Tech Stack (already in place)
- **Framework:** Next.js 15, React 19, TypeScript
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Styling:** Tailwind CSS 4, dark admin theme
- **Charts:** Recharts
- **Data fetching:** SWR (client), direct Supabase queries (server)
- **Monorepo:** Turbo + pnpm workspaces
- **Admin app:** `apps/admin` on port 4201
- **Shared packages:** `@cfb-social/api`, `@cfb-social/types`, `@cfb-social/moderation`
- **AI Moderation:** DeepSeek (content classification, 8 categories)
- **Auth:** Supabase Auth (Email, Google, Apple, Twitter OAuth)

### Existing Database Tables (24 tables)
profiles, schools, follows, user_blocks, device_tokens, posts, reactions, reposts, bookmarks, rivalries, rivalry_votes, rivalry_takes, challenges, challenge_votes, fact_checks, portal_players, roster_claims, predictions, aging_takes, moderation_events, reports, appeals, achievements, user_achievements, xp_log, leaderboard_snapshots, analytics_events, daily_stats, api_performance_log, scheduled_reports, notifications, notification_preferences

### Existing Admin Auth
- Admin login at `/login`
- Role check: `profiles.role` must be `ADMIN` or `MODERATOR`
- Service role client bypasses RLS for admin operations
- Client factories: browser, server, service (in `@cfb-social/api`)

---

## 2. Admin Overview (Enhanced)

### What Optic Rank Has
8 stat cards, API calls chart, monthly revenue chart, revenue by plan, plan distribution, platform metrics strip, recent signups table, system events feed, quick actions.

### What CFB Social Should Build

**Keep existing:** 4 stat cards (Total Users, Published Posts, Total Reactions, Flagged Posts) + 7-day activity chart.

**Add these new sections:**

#### A. Enhanced Stats Row (8 cards instead of 4)
```
Row 1: Total Users | Active Users (7d) | Published Posts | Total Reactions
Row 2: Flagged Posts | Pending Reports | Active Challenges | Active Rivalries
```

#### B. Platform Metrics Strip (below stats)
```
Keywords in Predictions | Portal Players Tracked | Active Achievements |
Daily XP Awarded | Schools with Active Users | Moderation Auto-Removes (30d)
```

#### C. Engagement Chart (new)
- 30-day area chart showing daily: posts, reactions (touchdowns + fumbles), new users
- Use Recharts `AreaChart` with three series

#### D. Recent Signups Table (new)
- Last 10 signups: Username, School, Role, Dynasty Tier, Joined Date
- Query: `profiles` ordered by `created_at DESC LIMIT 10`, join with `schools`

#### E. System Events Feed (new)
- Last 10 moderation events from `moderation_events` table
- Show: event_type badge, post excerpt, moderator name, timestamp
- Color-coded: AUTO_FLAG (yellow), AUTO_REMOVE (red), MANUAL_REMOVE (red), RESTORE (green)

#### F. Quick Actions Grid
Links to: Users, Moderation, Reports, Schools, System Health, Analytics

### Server Action File
**Create:** `apps/admin/lib/actions/overview.ts`

```typescript
export async function getEnhancedOverviewStats() {
  // Uses service client (bypasses RLS)
  const supabase = createServiceClient()

  // Total users
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  // Active users (7d) — users who created posts or reactions in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: activePosters } = await supabase.from('posts').select('author_id').gte('created_at', sevenDaysAgo)
  const { data: activeReactors } = await supabase.from('reactions').select('user_id').gte('created_at', sevenDaysAgo)
  const activeUserIds = new Set([
    ...(activePosters?.map(p => p.author_id) ?? []),
    ...(activeReactors?.map(r => r.user_id) ?? [])
  ])

  // Published posts
  const { count: publishedPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED')

  // Total reactions
  const { count: totalReactions } = await supabase.from('reactions').select('*', { count: 'exact', head: true })

  // Flagged posts
  const { count: flaggedPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'FLAGGED')

  // Pending reports
  const { count: pendingReports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'PENDING')

  // Active challenges
  const { count: activeChallenges } = await supabase.from('challenges').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE')

  // Active rivalries
  const { count: activeRivalries } = await supabase.from('rivalries').select('*', { count: 'exact', head: true }).in('status', ['ACTIVE', 'VOTING'])

  return { totalUsers, activeUsers: activeUserIds.size, publishedPosts, totalReactions, flaggedPosts, pendingReports, activeChallenges, activeRivalries }
}

export async function getPlatformMetrics() {
  // Predictions count, portal players, achievements, daily XP, schools with users, auto-removes
}

export async function getEngagementChart(days: number = 30) {
  // Group posts and reactions by day for last N days
  // Return: { date, posts, touchdowns, fumbles, newUsers }[]
}

export async function getRecentSignups(limit: number = 10) {
  // profiles + schools join, ordered by created_at DESC
}

export async function getRecentModerationEvents(limit: number = 10) {
  // moderation_events + profiles join for moderator name
}
```

### UI Component
**File:** `apps/admin/app/(dashboard)/page.tsx` (server component, fetches data)
**File:** `apps/admin/components/dashboard/enhanced-overview.tsx` (client component)

Use existing admin styling patterns:
- `.admin-card` for stat cards
- `.admin-table` for tables
- Recharts `AreaChart` with `--admin-accent` color (#6366f1)
- Dark theme via CSS variables

---

## 3. User Management (Enhanced)

### What Optic Rank Has
Searchable user table with expandable detail modals showing: profile info, auth info (provider), organization details, usage metrics, recent activity (audit log), billing events, last sign-in. Actions: delete user, toggle comp account.

### What CFB Social Should Build

**Keep existing:** User table with search, role/status badges, dynasty tier, XP/level.

**Add these new features:**

#### A. Enhanced User Detail Modal (expandable row or slide-over panel)

When clicking a user row, show a detail panel with tabs:

**Tab 1: Profile**
- Avatar, display name, username, bio
- School (name + logo), conference
- Role badge, Status badge, Dynasty Tier badge
- XP, Level, Post Count, Follower/Following Count
- Joined date, last active date

**Tab 2: Activity**
- Last 20 posts by user (title/excerpt, type badge, status, date)
- Last 10 reactions given
- Last 10 challenges participated in
- Predictions accuracy stats

**Tab 3: Moderation History**
- All `moderation_events` where user's posts were involved
- All `reports` filed against this user's posts
- All `appeals` from this user
- Ban history (ban_reason, banned_until, banned_by)

**Tab 4: Dynasty Stats**
- XP breakdown by source (from `xp_log`)
- Achievements unlocked (from `user_achievements`)
- Leaderboard position

#### B. Admin Actions Dropdown (per user)

```
Actions:
├── View Profile (opens web app profile)
├── Edit Role → submenu: USER | MODERATOR | EDITOR | ADMIN
├── ─── separator ───
├── Warn User (creates moderation_event + notification)
├── Suspend User (set status=SUSPENDED, set banned_until)
├── Ban User (set status=BANNED, set ban_reason)
├── Restore User (set status=ACTIVE, clear ban fields)
├── ─── separator ───
├── Reset XP (set xp=0, level=1)
├── Award XP (modal: amount + reason)
├── ─── separator ───
└── Delete User (confirmation dialog, deletes auth + profile)
```

#### C. Bulk Actions
- Select multiple users with checkboxes
- Bulk suspend, bulk ban, bulk role change

#### D. Filters
- Filter by: Role, Status, School, Conference, Dynasty Tier, Date Range
- Sort by: Username, XP, Level, Post Count, Join Date

### Server Actions
**File:** `apps/admin/lib/actions/users.ts`

```typescript
export async function getAllUsers(params: {
  search?: string
  role?: string
  status?: string
  school_id?: string
  limit?: number
  offset?: number
}) {
  // Service client query with filters, joins profiles + schools
}

export async function getUserDetail(userId: string) {
  // Fetch: profile + school + recent posts + moderation_events + reports +
  // appeals + xp_log + achievements + predictions stats
}

export async function updateUserRole(userId: string, role: 'USER' | 'MODERATOR' | 'EDITOR' | 'ADMIN') {
  // Update profiles.role
}

export async function suspendUser(userId: string, until: string, reason: string) {
  // Update profiles: status=SUSPENDED, banned_until, ban_reason, banned_by=adminId
  // Create moderation_event
  // Send notification to user
}

export async function banUser(userId: string, reason: string) {
  // Update profiles: status=BANNED, ban_reason, banned_by=adminId
  // Create moderation_event
}

export async function restoreUser(userId: string) {
  // Update profiles: status=ACTIVE, clear ban fields
  // Create moderation_event
}

export async function awardUserXP(userId: string, amount: number, reason: string) {
  // Call award_xp() database function
  // Create xp_log entry
}

export async function deleteUser(userId: string) {
  // Delete from auth.users (cascades to profiles)
  // Service client: supabase.auth.admin.deleteUser(userId)
}
```

### Database Changes
No new tables needed — uses existing `profiles`, `moderation_events`, `reports`, `appeals`, `xp_log`, `user_achievements`.

Add column if missing:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
```

Update `last_active_at` via a trigger or middleware on any user action.

---

## 4. Search & AI Analytics (New)

### What Optic Rank Has
10-tab analysis page (Overview, Pages, Technical, Content, Traffic, GEO, Search Console, AEO, CRO, Recommendations) — heavily SEO-focused with GA4 + GSC integration.

### How This Applies to CFB Social

CFB Social doesn't have SEO site audits, but it DOES have AI moderation (DeepSeek) and search functionality. This page should focus on **AI Moderation Analytics** and **Content Search/Discovery Analytics**.

#### Rename: "Search & AI" → "AI & Content Analytics"

### Tabs to Build:

#### Tab 1: Moderation Overview
- **Total posts moderated** (count of posts with moderation_score > 0)
- **Auto-flagged** (moderation_score 0.4–0.7)
- **Auto-removed** (moderation_score ≥ 0.7)
- **Manually reviewed** (moderation_events with MANUAL_FLAG or MANUAL_REMOVE)
- **False positive rate** (restored posts / total flagged)
- **Moderation score distribution** — histogram chart showing how scores distribute
- **Daily moderation volume** — 30-day line chart

#### Tab 2: Category Breakdown
- For each of the 8 moderation categories (college_football, off_topic_sports, politics, toxicity, hate_speech, spam, harassment, misinformation):
  - Count of posts flagged for this category
  - Average score for this category
  - Trend over time (30-day sparkline)
- **Pie chart** showing category distribution of flagged content
- **Heatmap** showing which categories co-occur

#### Tab 3: AI Provider Performance
- **DeepSeek stats:** Total calls, avg response time, success rate, error rate
- **Cost tracking** (if DeepSeek charges per token)
- **Response time trend** — 30-day line chart
- **Error log** — last 10 failed moderation calls

#### Tab 4: Content Discovery
- **Top searched terms** (if search is tracked in analytics_events)
- **Most viewed posts** (from view_count on posts)
- **Most engaged content** (highest touchdown_count)
- **Content type distribution** — pie chart of post_type (STANDARD, RECEIPT, SIDELINE, etc.)
- **School-based content volume** — which schools generate most content

#### Tab 5: Recommendations
- AI-generated recommendations for improving moderation thresholds
- Suggested threshold adjustments based on false positive/negative rates
- Content policy suggestions

### New Database Table

```sql
CREATE TABLE ai_moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id),
  provider TEXT NOT NULL DEFAULT 'deepseek',
  prompt_text TEXT,
  response_text TEXT,
  moderation_score FLOAT,
  category_scores JSONB, -- { college_football: 0.9, toxicity: 0.1, ... }
  action_taken TEXT, -- ALLOW, FLAG, REJECT
  tokens_used INT,
  cost FLOAT DEFAULT 0,
  response_time_ms INT,
  error_message TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_moderation_log_created ON ai_moderation_log(created_at DESC);
CREATE INDEX idx_ai_moderation_log_provider ON ai_moderation_log(provider);
CREATE INDEX idx_ai_moderation_log_action ON ai_moderation_log(action_taken);
```

### Integration Point
Modify `apps/web/app/api/moderate/route.ts` to log every moderation call:
```typescript
// After DeepSeek returns results, log to ai_moderation_log
await supabase.from('ai_moderation_log').insert({
  post_id: postId,
  user_id: authorId,
  provider: 'deepseek',
  prompt_text: prompt,
  response_text: JSON.stringify(result),
  moderation_score: riskScore,
  category_scores: categoryScores,
  action_taken: action, // ALLOW | FLAG | REJECT
  tokens_used: usage?.total_tokens,
  cost: calculateCost(usage),
  response_time_ms: endTime - startTime,
  success: true
})
```

### Server Actions
**File:** `apps/admin/lib/actions/ai-analytics.ts`

```typescript
export async function getModerationOverview() {
  // Counts from ai_moderation_log grouped by action_taken
  // False positive rate = restored count / flagged count
}

export async function getCategoryBreakdown() {
  // Aggregate category_scores from ai_moderation_log
  // Group by category, calculate averages and counts
}

export async function getAIProviderPerformance() {
  // From ai_moderation_log: avg response_time_ms, success rate, error count
}

export async function getContentDiscoveryStats() {
  // Top posts by view_count, touchdown_count
  // Post type distribution
  // School content volume
}

export async function getModerationTrend(days: number = 30) {
  // Daily counts from ai_moderation_log grouped by date
}
```

### API Needed
- **DeepSeek API** (already integrated for moderation)
- No additional APIs needed for this page

---

## 5. API Management (New)

### What Optic Rank Has
3 tabs: API Configurations (manage provider API keys), Usage Analytics (calls/cost/success by provider), API Call Logs (last 50 calls with details).

### How This Applies to CFB Social

CFB Social uses external APIs:
- **DeepSeek** — AI content moderation
- **Supabase** — Database, Auth, Storage, Realtime
- **ESPN** — Article proxy (`/api/espn-article`)
- **Future:** Any sports data APIs (scores, schedules, recruiting data)

### Tabs to Build:

#### Tab 1: API Configurations
- **Table of configured APIs:**
  | Provider | Display Name | API Key (masked) | Status | Last Tested |
  |----------|-------------|-------------------|--------|-------------|
  | DeepSeek | Content Moderation | sk-****abc | Active | 2 hours ago |
  | ESPN | Article Proxy | (no key) | Active | — |
  | Supabase | Database/Auth | ****xyz | Active | — |

- **Actions per row:**
  - Toggle enable/disable
  - Test connection (sends a test request)
  - Edit API key
  - View docs link

- **Add New Provider** button → modal form

#### Tab 2: Usage Analytics
- **Stats cards:** Total API Calls (30d), Total Cost, Success Rate, Avg Response Time
- **By Provider table:**
  | Provider | Calls | Cost | Errors | Avg Response Time | Success % |
- **Daily cost chart** (30-day bar chart)
- **Cost distribution pie chart** by provider

#### Tab 3: API Call Logs
- **Recent calls table** (last 100):
  | Provider | Endpoint | Method | Status | Response Time | Tokens | Cost | Time |
- **Filterable** by provider, status (success/fail), date range
- **Expandable rows** showing request/response details (for debugging)

### New Database Table

```sql
CREATE TABLE api_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,           -- 'deepseek', 'espn', 'supabase', etc.
  endpoint TEXT,                    -- '/v1/chat/completions', '/espn-article', etc.
  method TEXT DEFAULT 'POST',       -- GET, POST, PUT, DELETE
  status_code INT,                  -- 200, 400, 500, etc.
  response_time_ms INT,
  tokens_used INT,
  cost FLOAT DEFAULT 0,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  request_metadata JSONB,          -- { user_id, post_id, etc. }
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_api_call_log_created ON api_call_log(created_at DESC);
CREATE INDEX idx_api_call_log_provider ON api_call_log(provider);

CREATE TABLE platform_api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  api_key_encrypted TEXT,           -- Store encrypted, never expose full key
  base_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_tested_at TIMESTAMPTZ,
  last_test_success BOOLEAN,
  config JSONB DEFAULT '{}',        -- Provider-specific config
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Integration Points
Wrap all external API calls with logging:
```typescript
// packages/api/src/utils/api-logger.ts
export async function logAPICall(params: {
  provider: string
  endpoint: string
  method: string
  statusCode: number
  responseTimeMs: number
  tokensUsed?: number
  cost?: number
  success: boolean
  errorMessage?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = createServiceClient()
  await supabase.from('api_call_log').insert(params)
}
```

Instrument:
1. `apps/web/app/api/moderate/route.ts` — log DeepSeek calls
2. `apps/web/app/api/espn-article/route.ts` — log ESPN proxy calls
3. Any future API integrations

### Server Actions
**File:** `apps/admin/lib/actions/api-management.ts`

```typescript
export async function getAPIConfigs()
export async function saveAPIConfig(provider: string, config: Partial<APIConfig>)
export async function toggleAPIConfig(provider: string, isActive: boolean)
export async function testAPIConnection(provider: string): Promise<{ success: boolean; latency: number; error?: string }>
export async function getAPIUsageStats(days: number = 30)
export async function getAPICallLog(limit: number = 100, filters?: { provider?: string; success?: boolean })
export async function getAPICostTrend(days: number = 30)
```

### API Keys Needed
- **DeepSeek API Key** (already have: `DEEPSEEK_API_KEY`)
- No additional API keys required for this page itself

---

## 6. System Health (Enhanced)

### What Optic Rank Has
2 tabs: Job Queue Status (pending/processing/failed/completed counts, manual cron triggers, recent jobs, error details), Job Details & Logs.

### What CFB Social Should Build

CFB Social doesn't have a job queue yet, but it has `api_performance_log` and should add background job support.

#### Tab 1: Service Status
- **Health check cards** (existing, enhance):
  | Service | Status | Latency | Last Check |
  |---------|--------|---------|------------|
  | Database (Supabase) | Healthy | 12ms | Just now |
  | Auth Service | Healthy | 45ms | Just now |
  | Storage | Healthy | 89ms | Just now |
  | Realtime | Healthy | 23ms | Just now |
  | DeepSeek API | Healthy | 340ms | 5 min ago |
  | ESPN Proxy | Healthy | — | — |

- **"Run Health Check" button** — pings all services and updates status
- Each check: simple query/request to verify connectivity

#### Tab 2: Database Metrics
- **Table row counts** (existing, enhance):
  | Table | Rows | Size | Last Insert |
  |-------|------|------|-------------|
  | profiles | 1,234 | 2.1 MB | 3 min ago |
  | posts | 45,678 | 120 MB | Just now |
  | reactions | 234,567 | 45 MB | Just now |
  | ... | ... | ... | ... |

- **Database size** total
- **Connection pool** status (active/idle)
- **Slow queries** (if Supabase exposes this)

#### Tab 3: API Performance
- **From `api_performance_log` table** (already exists in schema)
- **Endpoint latency chart** — top 10 slowest endpoints (bar chart)
- **Error rate by endpoint** — which endpoints fail most
- **Response time percentiles** — p50, p95, p99

#### Tab 4: Background Jobs (New)
- **Job queue dashboard** (add job_queue table):
  | Job Type | Status | Priority | Attempts | Created | Error |
  |----------|--------|----------|----------|---------|-------|
  | moderation_batch | completed | 1 | 1 | 2h ago | — |
  | leaderboard_snapshot | processing | 2 | 1 | 5m ago | — |
  | daily_stats | pending | 3 | 0 | — | — |

- **Manual triggers:**
  - "Run Leaderboard Snapshot" — triggers daily/weekly/monthly snapshot
  - "Run Daily Stats" — aggregates today's stats
  - "Clear Old Jobs" — removes completed jobs older than 30 days

### New Database Table

```sql
CREATE TABLE job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,          -- 'leaderboard_snapshot', 'daily_stats', 'moderation_batch', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  priority INT DEFAULT 5,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  payload JSONB DEFAULT '{}',
  result JSONB,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_job_queue_status ON job_queue(status);
CREATE INDEX idx_job_queue_type ON job_queue(job_type);
```

### Server Actions
**File:** `apps/admin/lib/actions/system-health.ts`

```typescript
export async function runHealthCheck(): Promise<ServiceStatus[]> {
  const results: ServiceStatus[] = []

  // 1. Database ping
  const dbStart = Date.now()
  const { error: dbError } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
  results.push({ service: 'Database', healthy: !dbError, latency: Date.now() - dbStart })

  // 2. Auth service
  const authStart = Date.now()
  const { error: authError } = await supabase.auth.getSession()
  results.push({ service: 'Auth', healthy: !authError, latency: Date.now() - authStart })

  // 3. Storage
  const storageStart = Date.now()
  const { error: storageError } = await supabase.storage.listBuckets()
  results.push({ service: 'Storage', healthy: !storageError, latency: Date.now() - storageStart })

  // 4. DeepSeek
  const dsStart = Date.now()
  try {
    const res = await fetch('https://api.deepseek.com/v1/models', {
      headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }
    })
    results.push({ service: 'DeepSeek', healthy: res.ok, latency: Date.now() - dsStart })
  } catch {
    results.push({ service: 'DeepSeek', healthy: false, latency: Date.now() - dsStart })
  }

  return results
}

export async function getTableStats(): Promise<TableStat[]> {
  // Query pg_stat_user_tables for row counts and sizes
  // Or count each table individually
}

export async function getAPIPerformanceMetrics() {
  // From api_performance_log: group by endpoint, calc p50/p95/p99
}

export async function getJobQueue(status?: string) {
  // From job_queue: list jobs with filters
}

export async function triggerJob(jobType: string) {
  // Insert into job_queue with status=pending
  // Optionally call the actual function directly
}

export async function clearOldJobs(olderThanDays: number = 30) {
  // Delete completed/failed jobs older than N days
}
```

---

## 7. Platform Analytics (New)

### What Optic Rank Has
Investor-ready metrics: revenue metrics, growth time series, revenue analytics, API usage, plan distribution, platform metrics. Multiple charts showing monthly cohort data.

### How This Applies to CFB Social

CFB Social doesn't have billing/revenue (yet), but has rich engagement data. This page shows platform-wide analytics for growth and engagement.

### Sections to Build:

#### A. Key Metrics Cards (top row)
```
Total Users | DAU (Today) | MAU (30d) | Posts Today |
Reactions Today | Challenges Active | Avg Session Duration | New Users (7d)
```

#### B. Growth Time Series (charts, 6-month view)
Each chart: monthly new count + cumulative total (dual-axis)
1. **User Growth** — monthly new signups + cumulative users
2. **Post Growth** — monthly posts created + cumulative posts
3. **Reaction Growth** — monthly reactions + cumulative reactions
4. **Challenge Growth** — monthly challenges + cumulative
5. **Prediction Growth** — monthly predictions + cumulative
6. **School Adoption** — monthly schools with new users

#### C. Engagement Metrics
- **Posts per user** (avg)
- **Reactions per post** (avg touchdowns, avg fumbles)
- **Reply rate** (posts with replies / total posts)
- **Repost rate**
- **Bookmark rate**
- **Challenge completion rate** (completed / total)
- **Prediction accuracy** (correct / total resolved)

#### D. Content Breakdown
- **Post type distribution** pie chart: STANDARD, RECEIPT, SIDELINE, PREDICTION, AGING_TAKE, CHALLENGE_RESULT
- **Top 10 schools by posts** — bar chart
- **Top 10 schools by engagement** (touchdowns per post)
- **Conference distribution** — posts by conference

#### E. Dynasty Analytics
- **Dynasty tier distribution** — how many users at each tier
- **XP distribution** — histogram
- **Level distribution** — histogram
- **Top achievement unlocks** — most common achievements
- **XP source breakdown** — pie chart of XP by source (posts, reactions, challenges, etc.)

#### F. Retention & Cohort (if daily_stats populated)
- **DAU/MAU ratio** (stickiness metric)
- **7-day retention** — users active in week 2 / users who signed up in week 1
- **Daily active chart** (30-day line)

### Data Sources
All from existing tables — no new tables needed:
- `profiles` — user counts, XP, levels, tiers
- `posts` — post counts by type, date, school
- `reactions` — reaction counts
- `challenges` — challenge metrics
- `predictions` — prediction accuracy
- `xp_log` — XP sources
- `user_achievements` — achievement stats
- `daily_stats` — DAU, MAU (if populated)
- `leaderboard_snapshots` — historical rankings
- `analytics_events` — session data

### Server Actions
**File:** `apps/admin/lib/actions/analytics.ts`

```typescript
export async function getKeyMetrics()
export async function getGrowthTimeSeries(months: number = 6)
export async function getEngagementMetrics()
export async function getContentBreakdown()
export async function getDynastyAnalytics()
export async function getRetentionMetrics()
export async function getSchoolAnalytics()
export async function getConferenceAnalytics()
```

### Charts
Use Recharts (already a dependency):
- `AreaChart` for growth trends
- `BarChart` for comparisons (schools, conferences)
- `PieChart` for distributions (post types, XP sources)
- `ComposedChart` for dual-axis (new + cumulative)

---

## 8. Data Intelligence (New)

### What Optic Rank Has
AI-powered platform analysis: Health Score (0-100), Key Metrics Strip (8 cards), Insights Feed grouped by category, Recommendations. Uses AI to analyze ALL platform data and generate actionable insights.

### How This Applies to CFB Social

Same concept — AI acts as a data scientist analyzing the CFB Social platform. Instead of SEO/revenue insights, it analyzes engagement, moderation, community health, content quality.

### Components to Build:

#### A. Platform Health Score (Hero)
- Single score 0-100 with 5 sub-categories:
  - **Community Health** (toxicity levels, ban rates, report resolution)
  - **Engagement Quality** (reactions/post, reply depth, challenge participation)
  - **Content Diversity** (post type mix, school representation)
  - **Growth Trajectory** (user growth rate, retention)
  - **Moderation Efficiency** (response time, false positive rate)

#### B. Key Metrics Strip (8 cards)
```
Total Users | Posts (30d) | Avg Touchdowns/Post | Moderation Flags (30d) |
Active Schools | Challenge Completion Rate | Prediction Accuracy | XP Awarded (30d)
```

#### C. Insights Feed
- **AI-generated insights** grouped by category:
  - `community` — Toxicity trends, user behavior patterns
  - `engagement` — Which features drive the most engagement
  - `content` — Content quality trends, viral patterns
  - `growth` — User acquisition, retention, churn signals
  - `moderation` — Moderation effectiveness, threshold tuning
  - `features` — Feature adoption rates, underused features

- Each insight shows:
  - Severity badge (critical/warning/info/positive)
  - Title + description
  - Recommendations (actionable steps)
  - Confidence level (0-100%)

#### D. "Generate Insights" Button
- Aggregates ALL platform data
- Sends mega-prompt to DeepSeek (or other AI provider)
- Stores structured insights in `platform_insights` table
- Insights expire after 7 days

### New Database Table

```sql
CREATE TABLE platform_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL,       -- 'health_score', 'anomaly', 'trend', 'recommendation', 'prediction', 'summary'
  category TEXT NOT NULL,           -- 'community', 'engagement', 'content', 'growth', 'moderation', 'features'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info', -- 'critical', 'warning', 'info', 'positive'
  confidence INT DEFAULT 50,        -- 0-100
  recommendations JSONB DEFAULT '[]',
  data JSONB DEFAULT '{}',          -- Supporting data/metrics
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_platform_insights_category ON platform_insights(category);
CREATE INDEX idx_platform_insights_type ON platform_insights(insight_type);
CREATE INDEX idx_platform_insights_expires ON platform_insights(expires_at);
```

### Server Action
**File:** `apps/admin/lib/actions/data-intelligence.ts`

```typescript
export async function generatePlatformInsights() {
  const supabase = createServiceClient()

  // 1. Aggregate ALL platform data
  const [
    userStats,
    postStats,
    moderationStats,
    engagementStats,
    dynastyStats,
    challengeStats,
    predictionStats,
    schoolStats
  ] = await Promise.all([
    getUserAggregates(),
    getPostAggregates(),
    getModerationAggregates(),
    getEngagementAggregates(),
    getDynastyAggregates(),
    getChallengeAggregates(),
    getPredictionAggregates(),
    getSchoolAggregates()
  ])

  // 2. Build mega-prompt for AI analysis
  const prompt = buildIntelligencePrompt({
    userStats, postStats, moderationStats, engagementStats,
    dynastyStats, challengeStats, predictionStats, schoolStats
  })

  // 3. Send to AI (DeepSeek or fallback)
  const response = await callAI(prompt, { jsonMode: true })

  // 4. Parse structured response
  const insights = parseInsights(response)

  // 5. Clear old insights and store new ones
  await supabase.from('platform_insights').delete().lt('expires_at', new Date().toISOString())
  await supabase.from('platform_insights').insert(insights.map(i => ({
    ...i,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  })))

  return insights
}

export async function getPlatformInsights() {
  // Fetch non-expired insights, grouped by category
}
```

### AI Prompt Structure
The prompt should include:
- Platform context (CFB Social = college football social platform)
- All aggregated metrics
- Request for structured JSON output with: health_score, insights array (each with type, category, title, description, severity, confidence, recommendations)
- Domain-specific knowledge: college football seasons, rivalry patterns, transfer portal cycles

### API Needed
- **DeepSeek API** (already have) — primary AI provider
- Optional fallbacks: OpenAI, Anthropic, Gemini (if you want provider redundancy like Optic Rank)

---

## 9. AI Intelligence (New)

### What Optic Rank Has
4 tabs: Knowledge Base (searchable table of all AI interactions), Usage Analytics (by feature), Provider Performance (by provider), Cost Optimization (30-day cost trend).

### How This Applies to CFB Social

CFB Social already uses DeepSeek for moderation. This page tracks ALL AI interactions across the platform as a knowledge base.

### Tabs to Build:

#### Tab 1: Knowledge Base
- **Searchable table** of all AI interactions
- **Columns:** Feature, Sub-type, Provider, Prompt (truncated, expandable), Response (truncated, expandable), Tokens, Cost, Response Time, Success, Date
- **Search:** Filter by feature name, provider, success/fail
- **Expandable rows:** Click to see full prompt and response text
- **Pagination:** 25 per page with prev/next

#### Tab 2: Usage Analytics
- **Feature usage ranking** — which features use AI most
- **Call volume chart** — daily AI calls (30-day area chart)
- **Token usage chart** — daily tokens consumed
- **Feature breakdown table:**
  | Feature | Calls | Tokens | Cost | Avg Response Time | Success % |
  |---------|-------|--------|------|-------------------|-----------|
  | content_moderation | 5,432 | 2.1M | $12.34 | 340ms | 99.2% |
  | fact_check | 123 | 45K | $0.89 | 520ms | 97.5% |

#### Tab 3: Provider Performance
- **Provider comparison table:**
  | Provider | Calls | Cost | Avg Latency | Success % | Error Count | Tokens |
  |----------|-------|------|-------------|-----------|-------------|--------|
  | DeepSeek | 5,555 | $13.23 | 350ms | 99.1% | 50 | 2.15M |
- **Cost distribution pie chart** by provider
- **Latency comparison bar chart**
- **Error trend** per provider (30-day line chart)

#### Tab 4: Cost Optimization
- **30-day cost trend** — daily cost line chart
- **Cost per feature** — which features are most expensive
- **Optimization recommendations:**
  - "Switch X feature to a cheaper model"
  - "Cache repeated prompts for Y feature"
  - "Batch Z operations to reduce API calls"
- **Token efficiency** — tokens per successful result

### New Database Table

```sql
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL,            -- 'content_moderation', 'fact_check', 'platform_insights', etc.
  sub_type TEXT,                    -- More specific category
  provider TEXT NOT NULL,           -- 'deepseek', 'openai', 'anthropic', etc.
  model TEXT,                       -- 'deepseek-chat', 'gpt-4', etc.
  prompt_text TEXT,                 -- Full prompt sent
  response_text TEXT,               -- Full response received
  tokens_used INT DEFAULT 0,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  cost FLOAT DEFAULT 0,
  response_time_ms INT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',      -- { user_id, post_id, etc. }
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_interactions_feature ON ai_interactions(feature);
CREATE INDEX idx_ai_interactions_provider ON ai_interactions(provider);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at DESC);
CREATE INDEX idx_ai_interactions_success ON ai_interactions(success);
```

> **Note:** This is separate from `ai_moderation_log` (Section 4). `ai_interactions` tracks ALL AI usage platform-wide, while `ai_moderation_log` is specific to content moderation with category scores. You could merge them into one table, but keeping them separate allows specialized queries on moderation categories without scanning all AI interactions.

### Integration Point
Create a utility function that wraps ALL AI calls:

```typescript
// packages/api/src/utils/ai-logger.ts
export async function logAIInteraction(params: {
  feature: string
  subType?: string
  provider: string
  model?: string
  promptText: string
  responseText: string
  tokensUsed: number
  promptTokens?: number
  completionTokens?: number
  cost: number
  responseTimeMs: number
  success: boolean
  errorMessage?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = createServiceClient()
  await supabase.from('ai_interactions').insert({
    feature: params.feature,
    sub_type: params.subType,
    provider: params.provider,
    model: params.model,
    prompt_text: params.promptText,
    response_text: params.responseText,
    tokens_used: params.tokensUsed,
    prompt_tokens: params.promptTokens,
    completion_tokens: params.completionTokens,
    cost: params.cost,
    response_time_ms: params.responseTimeMs,
    success: params.success,
    error_message: params.errorMessage,
    metadata: params.metadata
  })
}
```

Instrument in:
1. `apps/web/app/api/moderate/route.ts` — feature: 'content_moderation'
2. `apps/admin/lib/actions/data-intelligence.ts` — feature: 'platform_insights'
3. Any future AI features (fact checking, content generation, etc.)

### Server Actions
**File:** `apps/admin/lib/actions/ai-intelligence.ts`

```typescript
export async function getAIInteractions(params: {
  search?: string
  feature?: string
  provider?: string
  success?: boolean
  limit?: number
  offset?: number
})

export async function getAIUsageByFeature()
export async function getAIProviderPerformance()
export async function getAICostTrend(days: number = 30)
export async function getAICostByFeature()
```

---

## 10. Social Posts (New)

### What Optic Rank Has
2 tabs: Generator (AI-generated social media posts with platform selection, tone, topic), Queue (post status management with scheduling).

### How This Applies to CFB Social

This is for the **CFB Social BRAND's** social media presence — the platform's own Twitter, Instagram, TikTok, etc. Not user posts within the app.

### Tabs to Build:

#### Tab 1: Content Generator
- **Form:**
  - Topic (optional, e.g., "transfer portal updates", "rivalry week")
  - Tone: Hype, Informational, Funny, Hot Take, Game Day
  - Platform: Twitter/X, Instagram, TikTok, Facebook
  - Count: 1-10 posts to generate
- **Generate button** → calls AI to create platform-specific content
- **Results:** Cards showing generated posts with:
  - Character count (color-coded: green if under limit, red if over)
  - Platform icon
  - Copy button
  - "Schedule" button → adds to queue
  - "Publish Now" button → posts immediately (if credentials configured)

#### Tab 2: Post Queue
- **Status tabs:** All | Drafts | Scheduled | Published | Failed
- **Table:**
  | Platform | Content | Status | Scheduled | Published | Actions |
- **Actions:** Edit, Delete, Publish Now, Reschedule
- **Bulk actions:** Approve selected, Delete selected

#### Tab 3: Platform Credentials
- **Credential forms for each platform:**
  - Twitter/X: API Key, API Secret, Access Token, Access Token Secret
  - Instagram: Access Token (via Facebook Graph API)
  - TikTok: Access Token
  - Facebook: Page Access Token, Page ID
- **Test Connection** button per platform
- **Status indicators:** Connected (green) / Not Configured (gray) / Error (red)

### New Database Tables

```sql
CREATE TABLE social_media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,           -- 'twitter', 'instagram', 'tiktok', 'facebook'
  content TEXT NOT NULL,
  media_urls TEXT[],                -- Array of media URLs (images, videos)
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed', 'cancelled'
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  external_post_id TEXT,            -- ID from the platform after publishing
  external_post_url TEXT,           -- URL to the published post
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_media_posts_scheduled ON social_media_posts(scheduled_at);

CREATE TABLE social_media_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT UNIQUE NOT NULL,
  credentials_encrypted JSONB NOT NULL, -- Encrypted OAuth tokens
  is_connected BOOLEAN DEFAULT false,
  last_tested_at TIMESTAMPTZ,
  last_test_success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Server Actions
**File:** `apps/admin/lib/actions/social-posts.ts`

```typescript
export async function generateSocialPosts(params: {
  topic?: string
  tone: string
  platform: string
  count: number
}): Promise<GeneratedPost[]> {
  // Build prompt with CFB-specific context
  // Include character limits per platform (Twitter: 280, Instagram: 2200, etc.)
  // Call DeepSeek or another AI provider
  // Log to ai_interactions
  // Return generated posts
}

export async function createSocialPost(post: NewSocialPost)
export async function updateSocialPost(id: string, updates: Partial<SocialPost>)
export async function deleteSocialPost(id: string)
export async function publishSocialPost(id: string) {
  // Fetch credentials for platform
  // Call platform API to publish
  // Update status to 'published' with external_post_id
  // Log to api_call_log
}
export async function getSocialPosts(filters?: { status?: string; platform?: string })
export async function getSocialCredentials()
export async function saveSocialCredentials(platform: string, credentials: Record<string, string>)
export async function testSocialConnection(platform: string)
```

### APIs Needed
- **Twitter/X API v2** — For posting tweets
  - Endpoint: `POST https://api.twitter.com/2/tweets`
  - Auth: OAuth 1.0a (API Key + Access Token)
  - Get keys at: https://developer.twitter.com/en/portal/dashboard
  - Free tier: 1,500 tweets/month

- **Instagram Graph API** (via Facebook)
  - Endpoint: `POST https://graph.facebook.com/v18.0/{ig-user-id}/media`
  - Auth: Facebook Page Access Token with `instagram_content_publish` permission
  - Requires Facebook Business account linked to Instagram
  - Get keys at: https://developers.facebook.com/

- **TikTok Content Posting API**
  - Endpoint: `POST https://open.tiktokapis.com/v2/post/publish/`
  - Auth: OAuth 2.0 Access Token
  - Requires TikTok Developer account
  - Get keys at: https://developers.tiktok.com/

- **Facebook Graph API**
  - Endpoint: `POST https://graph.facebook.com/v18.0/{page-id}/feed`
  - Auth: Page Access Token with `pages_manage_posts` permission
  - Get keys at: https://developers.facebook.com/

- **DeepSeek API** (already have) — For content generation

---

## 11. Email Templates (New)

### What Optic Rank Has
11 email templates across 4 categories (Transactional, Lifecycle, Notifications, Authentication) with WYSIWYG editor, preview, and test send.

### How This Applies to CFB Social

CFB Social should have email templates for user communication.

### Templates to Create:

**Transactional (3):**
1. **Welcome Email** — Sent on signup (welcome to CFB Social, pick your school, explore features)
2. **Contact Confirmation** — When someone submits a contact form
3. **Report Received** — Confirmation when a user reports content

**Lifecycle (3):**
4. **Weekly Digest** — Top posts, rivalries, predictions from the week
5. **Inactive User Re-engagement** — "You've been away! Here's what you missed"
6. **Achievement Unlocked** — Congratulations on earning an achievement

**Notifications (3):**
7. **Challenge Received** — Someone challenged you
8. **Prediction Result** — Your prediction was verified
9. **Moderation Action** — Your post was flagged/removed

**Authentication (4):**
10. **Email Confirmation** — Verify your email address
11. **Password Reset** — Reset your password
12. **Magic Link** — Passwordless login
13. **Email Change Confirmation** — Confirm new email

### New Database Table

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,        -- 'welcome', 'password_reset', etc.
  name TEXT NOT NULL,               -- 'Welcome Email'
  category TEXT NOT NULL,           -- 'transactional', 'lifecycle', 'notification', 'authentication'
  subject TEXT NOT NULL,            -- Email subject line (supports {{variables}})
  body_html TEXT NOT NULL,          -- HTML email body (supports {{variables}})
  body_text TEXT,                   -- Plain text fallback
  variables TEXT[],                 -- Available variables: ['username', 'school_name', 'app_url']
  is_active BOOLEAN DEFAULT true,
  trigger_description TEXT,         -- When this email is sent
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with defaults
INSERT INTO email_templates (slug, name, category, subject, body_html, variables, trigger_description) VALUES
('welcome', 'Welcome Email', 'transactional', 'Welcome to CFB Social, {{username}}!', '...', ARRAY['username', 'school_name', 'app_url'], 'Sent when a new user signs up'),
('password_reset', 'Password Reset', 'authentication', 'Reset your password', '...', ARRAY['username', 'reset_link'], 'Sent when user requests password reset'),
-- ... more templates
;
```

### Features:
- **Template Editor:** Textarea with HTML support (or integrate a simple rich text editor like TipTap)
- **Variable Support:** `{{username}}`, `{{school_name}}`, `{{app_url}}`, etc. — highlighted in editor
- **Live Preview:** Render HTML preview with sample data
- **Test Send:** Send test email to admin's email address
- **Revert to Default:** Reset template to original content

### Server Actions
**File:** `apps/admin/lib/actions/email-templates.ts`

```typescript
export async function getEmailTemplates(category?: string)
export async function getEmailTemplate(slug: string)
export async function updateEmailTemplate(slug: string, updates: { subject?: string; body_html?: string; body_text?: string })
export async function sendTestEmail(slug: string, recipientEmail: string)
export async function resetEmailTemplate(slug: string) // Revert to default
```

### Email Sending Integration
You'll need an email service provider. Options:

- **Resend** (recommended for Next.js)
  - `npm install resend`
  - Free tier: 3,000 emails/month
  - API: `POST https://api.resend.com/emails`
  - Get key at: https://resend.com/

- **Supabase Auth Emails** (for auth-related emails)
  - Already handles: email confirmation, password reset, magic link
  - Custom SMTP can be configured in Supabase dashboard

- **SendGrid** (alternative)
  - `npm install @sendgrid/mail`
  - Free tier: 100 emails/day

### Email Utility
```typescript
// packages/api/src/utils/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(params: {
  to: string
  templateSlug: string
  variables: Record<string, string>
}) {
  const supabase = createServiceClient()
  const { data: template } = await supabase
    .from('email_templates')
    .select('*')
    .eq('slug', params.templateSlug)
    .single()

  if (!template || !template.is_active) return

  // Replace variables
  let subject = template.subject
  let html = template.body_html
  for (const [key, value] of Object.entries(params.variables)) {
    subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value)
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }

  await resend.emails.send({
    from: 'CFB Social <noreply@cfbsocial.com>',
    to: params.to,
    subject,
    html
  })
}
```

### API Needed
- **Resend API Key** — `RESEND_API_KEY`
  - Sign up: https://resend.com/
  - Free: 3,000 emails/month, 100/day
  - Or use **SendGrid**, **Postmark**, **AWS SES** as alternatives

---

## 12. Notifications (Enhanced)

### What Optic Rank Has
Unified activity feed combining: signups, billing events, audit log, contact submissions. Grouped by date with type badges. Contact modal with status management.

### What CFB Social Should Build

CFB Social already has a `notifications` table for user notifications. The admin notifications page is a **unified admin activity feed** — different from user notifications.

### Components:

#### A. Admin Activity Feed
A unified chronological feed combining:

1. **New Signups** (green badge)
   - "John joined CFB Social and selected Alabama"
   - Source: `profiles` table, ordered by `created_at`

2. **Moderation Events** (red/yellow badge)
   - "Post by @user was auto-flagged for toxicity (score: 0.72)"
   - "Moderator @admin removed post by @user"
   - Source: `moderation_events` table

3. **Reports** (orange badge)
   - "New report: @reporter reported @user's post for harassment"
   - Source: `reports` table

4. **Appeals** (blue badge)
   - "New appeal: @user appealed removal of post #1234"
   - Source: `appeals` table

5. **Challenges** (purple badge)
   - "New challenge: @user1 challenged @user2 about SEC dominance"
   - Source: `challenges` table, status changes

6. **System Events** (gray badge)
   - "Daily stats computed: 45 posts, 230 reactions, 12 new users"
   - "DeepSeek API error rate exceeded 5%"
   - Source: `job_queue` or manual system events

7. **Contact Submissions** (gold badge)
   - "New contact: John Doe submitted 'Partnership Inquiry'"
   - Source: `contact_submissions` table (new, see Section 13)

#### B. Filtering
- Filter by type: All | Signups | Moderation | Reports | Appeals | Challenges | System | Contacts
- Date range picker

#### C. Contact Detail Modal
When clicking a contact submission notification:
- Show full message
- Status buttons: New → Read → Replied
- Reply action (opens email client or sends email)

### New Database Table

```sql
CREATE TABLE admin_activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,         -- 'signup', 'moderation', 'report', 'appeal', 'challenge', 'system', 'contact'
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'info',     -- 'info', 'warning', 'critical', 'success'
  reference_type TEXT,              -- 'profile', 'post', 'report', 'appeal', 'challenge', 'contact'
  reference_id UUID,               -- ID of the referenced entity
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_admin_activity_feed_type ON admin_activity_feed(event_type);
CREATE INDEX idx_admin_activity_feed_created ON admin_activity_feed(created_at DESC);
CREATE INDEX idx_admin_activity_feed_read ON admin_activity_feed(is_read);
```

> **Alternative approach:** Instead of a separate table, you can query multiple tables and merge results in the server action (like Optic Rank does). This avoids write overhead but makes pagination harder.

### Server Actions
**File:** `apps/admin/lib/actions/admin-notifications.ts`

```typescript
export async function getAdminActivityFeed(params: {
  type?: string
  limit?: number
  offset?: number
}): Promise<ActivityFeedItem[]> {
  const supabase = createServiceClient()
  const limit = params.limit ?? 30

  // Option A: Query from admin_activity_feed table (if using dedicated table)
  // Option B: Merge from multiple tables (like Optic Rank)

  const [signups, moderationEvents, reports, appeals, contacts] = await Promise.all([
    supabase.from('profiles').select('id, username, display_name, school_id, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('moderation_events').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('appeals').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  // Merge, sort by date, paginate
  const feed = [
    ...formatSignups(signups.data),
    ...formatModerationEvents(moderationEvents.data),
    ...formatReports(reports.data),
    ...formatAppeals(appeals.data),
    ...formatContacts(contacts.data),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return feed.slice(0, limit)
}

export async function getUnreadAdminNotificationCount()
export async function markAdminNotificationRead(id: string)
```

### Sidebar Badge
Show unread count on the "Notifications" nav item in the admin sidebar:
```typescript
// In admin layout, fetch unread count
const unreadCount = await getUnreadAdminNotificationCount()
// Render badge: <span className="badge">{unreadCount}</span>
```

---

## 13. Contact Submissions (New)

### What Optic Rank Has
Contact submissions table with: Name, Email, Subject, Status (new/read/replied), expandable message, status management buttons, pagination.

### What CFB Social Should Build

A contact form on the public website + admin page to manage submissions.

### A. Public Contact Form (Web App)
**File:** `apps/web/app/(main)/contact/page.tsx`

Form fields:
- Name (required)
- Email (required)
- Subject (required, dropdown: General, Bug Report, Feature Request, Partnership, Press, Other)
- Message (required, textarea)
- School (optional, for context)

### B. Admin Contacts Page
**File:** `apps/admin/app/(dashboard)/contacts/page.tsx`

**Table:**
| Name | Email | Subject | Status | Date | Actions |
|------|-------|---------|--------|------|---------|
| John | j@x.com | Bug Report | 🔵 New | Mar 28 | View |

**Expandable Row / Modal:**
- Full message text
- User's school (if provided)
- Status buttons: Mark as Read | Mark as Replied | Mark as New
- "Reply via Email" button (opens mailto: link or sends email via Resend)

**Filters:**
- Status: All | New | Read | Replied
- Subject category
- Date range

**Stats:**
- Total submissions, unread count, avg response time

### New Database Table

```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'general',  -- 'general', 'bug_report', 'feature_request', 'partnership', 'press', 'other'
  message TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'read', 'replied'
  admin_notes TEXT,                 -- Internal notes
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
```

### Server Actions
**File:** `apps/admin/lib/actions/contacts.ts`

```typescript
// Public action (web app)
export async function submitContactForm(params: {
  name: string
  email: string
  subject: string
  category: string
  message: string
  schoolId?: string
}) {
  const supabase = createServiceClient()
  await supabase.from('contact_submissions').insert(params)
  // Send confirmation email to user
  await sendEmail({ to: params.email, templateSlug: 'contact_confirmation', variables: { name: params.name } })
}

// Admin actions
export async function getContacts(params: { status?: string; limit?: number; offset?: number })
export async function getContactById(id: string)
export async function updateContactStatus(id: string, status: 'new' | 'read' | 'replied')
export async function addContactNote(id: string, note: string)
export async function getUnreadContactCount(): Promise<number> {
  const { count } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new')
  return count ?? 0
}
```

### API Route (Web App)
**File:** `apps/web/app/api/contact/route.ts`

```typescript
export async function POST(request: Request) {
  const body = await request.json()
  // Validate with Zod
  // Rate limit (by IP or email)
  // Insert into contact_submissions
  // Send confirmation email
  // Optionally: add to admin_activity_feed
  return NextResponse.json({ success: true })
}
```

---

## 14. Database Migrations

### Migration File
**Create:** `supabase/migrations/00003_admin_dashboard_expansion.sql`

```sql
-- ============================================
-- CFB Social Admin Dashboard Expansion
-- Migration: 00003
-- ============================================

-- 1. AI Moderation Log (Search & AI Analytics)
CREATE TABLE IF NOT EXISTS ai_moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id),
  provider TEXT NOT NULL DEFAULT 'deepseek',
  prompt_text TEXT,
  response_text TEXT,
  moderation_score FLOAT,
  category_scores JSONB,
  action_taken TEXT,
  tokens_used INT,
  cost FLOAT DEFAULT 0,
  response_time_ms INT,
  error_message TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ai_moderation_log_created ON ai_moderation_log(created_at DESC);
CREATE INDEX idx_ai_moderation_log_provider ON ai_moderation_log(provider);
CREATE INDEX idx_ai_moderation_log_action ON ai_moderation_log(action_taken);

-- 2. API Call Log (API Management)
CREATE TABLE IF NOT EXISTS api_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  endpoint TEXT,
  method TEXT DEFAULT 'POST',
  status_code INT,
  response_time_ms INT,
  tokens_used INT,
  cost FLOAT DEFAULT 0,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  request_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_api_call_log_created ON api_call_log(created_at DESC);
CREATE INDEX idx_api_call_log_provider ON api_call_log(provider);

-- 3. Platform API Configs (API Management)
CREATE TABLE IF NOT EXISTS platform_api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  api_key_encrypted TEXT,
  base_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_tested_at TIMESTAMPTZ,
  last_test_success BOOLEAN,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Job Queue (System Health)
CREATE TABLE IF NOT EXISTS job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INT DEFAULT 5,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  payload JSONB DEFAULT '{}',
  result JSONB,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_job_queue_status ON job_queue(status);
CREATE INDEX idx_job_queue_type ON job_queue(job_type);

-- 5. Platform Insights (Data Intelligence)
CREATE TABLE IF NOT EXISTS platform_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  confidence INT DEFAULT 50,
  recommendations JSONB DEFAULT '[]',
  data JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_platform_insights_category ON platform_insights(category);
CREATE INDEX idx_platform_insights_type ON platform_insights(insight_type);
CREATE INDEX idx_platform_insights_expires ON platform_insights(expires_at);

-- 6. AI Interactions (AI Intelligence)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL,
  sub_type TEXT,
  provider TEXT NOT NULL,
  model TEXT,
  prompt_text TEXT,
  response_text TEXT,
  tokens_used INT DEFAULT 0,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  cost FLOAT DEFAULT 0,
  response_time_ms INT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ai_interactions_feature ON ai_interactions(feature);
CREATE INDEX idx_ai_interactions_provider ON ai_interactions(provider);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at DESC);
CREATE INDEX idx_ai_interactions_success ON ai_interactions(success);

-- 7. Social Media Posts (Social Posts)
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  external_post_id TEXT,
  external_post_url TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_media_posts_scheduled ON social_media_posts(scheduled_at);

-- 8. Social Media Credentials (Social Posts)
CREATE TABLE IF NOT EXISTS social_media_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT UNIQUE NOT NULL,
  credentials_encrypted JSONB NOT NULL,
  is_connected BOOLEAN DEFAULT false,
  last_tested_at TIMESTAMPTZ,
  last_test_success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Email Templates (Email Templates)
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables TEXT[],
  is_active BOOLEAN DEFAULT true,
  trigger_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Contact Submissions (Contacts)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  message TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- 11. Admin Activity Feed (Notifications)
CREATE TABLE IF NOT EXISTS admin_activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'info',
  reference_type TEXT,
  reference_id UUID,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_admin_activity_feed_type ON admin_activity_feed(event_type);
CREATE INDEX idx_admin_activity_feed_created ON admin_activity_feed(created_at DESC);
CREATE INDEX idx_admin_activity_feed_read ON admin_activity_feed(is_read);

-- 12. Add last_active_at to profiles (User Management)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- ============================================
-- RLS Policies (Admin-only access for new tables)
-- ============================================

-- All new tables: admin-only read/write
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'ai_moderation_log', 'api_call_log', 'platform_api_configs', 'job_queue',
    'platform_insights', 'ai_interactions', 'social_media_posts', 'social_media_credentials',
    'email_templates', 'admin_activity_feed'
  ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format(
      'CREATE POLICY "Admin full access on %I" ON %I FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN (''ADMIN'', ''MODERATOR''))
      )',
      tbl, tbl
    );
    -- Service role bypass (for server actions)
    EXECUTE format(
      'CREATE POLICY "Service role access on %I" ON %I FOR ALL TO service_role USING (true)',
      tbl, tbl
    );
  END LOOP;
END $$;

-- Contact submissions: public insert (anyone can submit), admin read/update
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT TO anon, authenticated USING (true);
CREATE POLICY "Admin read contacts" ON contact_submissions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'MODERATOR'))
);
CREATE POLICY "Admin update contacts" ON contact_submissions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'MODERATOR'))
);
CREATE POLICY "Service role contacts" ON contact_submissions FOR ALL TO service_role USING (true);

-- ============================================
-- Seed Email Templates
-- ============================================
INSERT INTO email_templates (slug, name, category, subject, body_html, variables, trigger_description) VALUES
('welcome', 'Welcome Email', 'transactional', 'Welcome to CFB Social, {{username}}!', '<h1>Welcome, {{username}}!</h1><p>You''ve joined the largest college football community. Pick your school and start posting!</p><p><a href="{{app_url}}/settings/profile">Complete Your Profile</a></p>', ARRAY['username', 'school_name', 'app_url'], 'Sent when a new user signs up'),
('contact_confirmation', 'Contact Confirmation', 'transactional', 'We received your message', '<h1>Thanks for reaching out, {{name}}!</h1><p>We''ve received your message about "{{subject}}" and will get back to you soon.</p>', ARRAY['name', 'subject'], 'Sent when someone submits the contact form'),
('report_received', 'Report Received', 'transactional', 'Your report has been received', '<h1>Report Received</h1><p>Hi {{username}}, we''ve received your report and our moderation team will review it shortly.</p>', ARRAY['username'], 'Sent when a user reports content'),
('weekly_digest', 'Weekly Digest', 'lifecycle', 'Your Weekly CFB Roundup 🏈', '<h1>This Week in CFB Social</h1><p>{{digest_content}}</p>', ARRAY['username', 'digest_content', 'top_posts'], 'Sent weekly to active users'),
('inactive_reengagement', 'Come Back!', 'lifecycle', 'We miss you on CFB Social, {{username}}!', '<h1>Come back, {{username}}!</h1><p>Here''s what you missed: {{missed_highlights}}</p>', ARRAY['username', 'missed_highlights'], 'Sent to users inactive for 14+ days'),
('achievement_unlocked', 'Achievement Unlocked!', 'lifecycle', '🏆 You unlocked: {{achievement_name}}!', '<h1>Achievement Unlocked!</h1><p>Congrats {{username}}, you earned "{{achievement_name}}" (+{{xp_reward}} XP)!</p>', ARRAY['username', 'achievement_name', 'xp_reward'], 'Sent when user earns an achievement'),
('challenge_received', 'Challenge Received', 'notification', '⚔️ {{challenger}} challenged you!', '<h1>You''ve Been Challenged!</h1><p>{{challenger}} wants to debate: "{{challenge_topic}}"</p><p><a href="{{app_url}}/rivalry/challenge/{{challenge_id}}">Accept or Decline</a></p>', ARRAY['username', 'challenger', 'challenge_topic', 'challenge_id', 'app_url'], 'Sent when someone receives a challenge'),
('prediction_result', 'Prediction Verified', 'notification', 'Your prediction was {{result}}!', '<h1>Prediction Result</h1><p>{{username}}, your prediction "{{prediction_text}}" was {{result}}! {{xp_message}}</p>', ARRAY['username', 'prediction_text', 'result', 'xp_message'], 'Sent when a prediction is verified'),
('moderation_action', 'Content Review', 'notification', 'A post was reviewed by our team', '<h1>Content Review Notice</h1><p>Hi {{username}}, your post was reviewed and {{action_taken}}. Reason: {{reason}}</p><p>You can <a href="{{app_url}}/settings">appeal this decision</a>.</p>', ARRAY['username', 'action_taken', 'reason', 'app_url'], 'Sent when a moderation action is taken on user content'),
('email_confirmation', 'Email Confirmation', 'authentication', 'Confirm your email address', '<h1>Confirm Your Email</h1><p>Click the link below to verify your email:</p><p><a href="{{confirmation_link}}">Confirm Email</a></p>', ARRAY['username', 'confirmation_link'], 'Sent on signup for email verification'),
('password_reset', 'Password Reset', 'authentication', 'Reset your CFB Social password', '<h1>Password Reset</h1><p>Click below to reset your password:</p><p><a href="{{reset_link}}">Reset Password</a></p><p>If you didn''t request this, ignore this email.</p>', ARRAY['username', 'reset_link'], 'Sent when user requests a password reset'),
('magic_link', 'Magic Link Login', 'authentication', 'Your CFB Social login link', '<h1>Login to CFB Social</h1><p>Click below to sign in:</p><p><a href="{{magic_link}}">Sign In</a></p><p>This link expires in 10 minutes.</p>', ARRAY['magic_link'], 'Sent for passwordless login'),
('email_change', 'Email Change Confirmation', 'authentication', 'Confirm your new email', '<h1>Email Change</h1><p>Click below to confirm your new email address:</p><p><a href="{{confirmation_link}}">Confirm New Email</a></p>', ARRAY['username', 'confirmation_link'], 'Sent when user changes their email address')
ON CONFLICT (slug) DO NOTHING;
```

---

## 15. Environment Variables & API Keys

### Required New Variables

Add to `apps/admin/.env.local` and `apps/web/.env.local`:

```bash
# ─── AI Provider (already have) ───
DEEPSEEK_API_KEY=your-deepseek-api-key

# ─── Email Service (NEW - pick one) ───
RESEND_API_KEY=re_xxxxxxxxxxxx          # Get from https://resend.com/
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxx        # Get from https://sendgrid.com/

# ─── Social Media Publishing (NEW - optional, for Social Posts feature) ───
# Twitter/X
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
# Get from: https://developer.twitter.com/en/portal/dashboard

# Instagram (via Facebook Graph API)
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
# Get from: https://developers.facebook.com/

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_PAGE_ID=
# Get from: https://developers.facebook.com/

# TikTok
TIKTOK_ACCESS_TOKEN=
# Get from: https://developers.tiktok.com/

# ─── Optional: Additional AI Providers (for redundancy) ───
OPENAI_API_KEY=                         # Fallback AI provider
ANTHROPIC_API_KEY=                      # Fallback AI provider
```

### Priority of API Setup
1. **DeepSeek** — Already have, no action needed
2. **Resend** — Sign up, get API key, set domain (5 minutes)
3. **Social media APIs** — Optional, can be added later. Each requires developer account approval.

---

## 16. Sidebar Navigation Update

### Current Admin Sidebar (10 items)
```
Overview, Users, Moderation, Reports, Schools, Portal, Engagement, Content, System, Settings
```

### New Admin Sidebar (17 items, grouped)

```
─── PLATFORM ───
  📊 Overview
  👥 Users
  🏫 Schools

─── MODERATION ───
  🚩 Moderation
  📋 Reports

─── CONTENT ───
  📝 Content
  🏈 Portal
  📈 Engagement

─── INTELLIGENCE ───
  🤖 AI & Content Analytics    (new — Search & AI)
  🧠 AI Intelligence           (new)
  📊 Platform Analytics         (new)
  💡 Data Intelligence          (new)

─── OPERATIONS ───
  🔌 API Management            (new)
  🖥️ System Health             (enhanced)
  🔔 Notifications             (new — with badge)
  📧 Email Templates           (new)
  📱 Social Posts              (new)
  ✉️ Contacts                  (new — with badge)

─── bottom ───
  ⚙️ Settings
  ← Back to Dashboard
  🌙 Theme Toggle
```

### Implementation
**File:** `apps/admin/components/layout/sidebar.tsx`

Add the new navigation items:
```typescript
const navItems = [
  { label: 'PLATFORM', type: 'header' },
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Schools', href: '/schools', icon: GraduationCap },

  { label: 'MODERATION', type: 'header' },
  { label: 'Moderation', href: '/moderation', icon: Shield },
  { label: 'Reports', href: '/reports', icon: Flag },

  { label: 'CONTENT', type: 'header' },
  { label: 'Content', href: '/content', icon: FileText },
  { label: 'Portal', href: '/portal', icon: ArrowRightLeft },
  { label: 'Engagement', href: '/engagement', icon: TrendingUp },

  { label: 'INTELLIGENCE', type: 'header' },
  { label: 'AI & Content', href: '/ai-analytics', icon: Brain },
  { label: 'AI Intelligence', href: '/ai-intelligence', icon: Sparkles },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Data Intelligence', href: '/data-intelligence', icon: Lightbulb },

  { label: 'OPERATIONS', type: 'header' },
  { label: 'API Management', href: '/api', icon: Plug },
  { label: 'System Health', href: '/system', icon: Activity },
  { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
  { label: 'Email Templates', href: '/email-templates', icon: Mail },
  { label: 'Social Posts', href: '/social-posts', icon: Share2 },
  { label: 'Contacts', href: '/contacts', icon: MessageSquare, badge: unreadContacts },

  { label: 'Settings', href: '/settings', icon: Settings },
]
```

---

## 17. Shared Utilities & Helpers

### Formatting Helpers
**File:** `apps/admin/lib/utils/formatters.ts`

```typescript
// Compact number: 1234 → "1.2K", 1234567 → "1.2M"
export function formatCompact(num: number): string

// Currency: 29 → "$29", 29.5 → "$29.50"
export function formatDollars(amount: number): string

// Time ago: "Just now", "5m ago", "2h ago", "3d ago", "Mar 28"
export function timeAgo(date: string | Date): string

// Percentage: 0.1234 → "12.3%"
export function formatPercent(value: number, decimals?: number): string

// Duration: 1234 → "1.2s", 45 → "45ms"
export function formatDuration(ms: number): string

// Truncate: "Long text here..."
export function truncate(text: string, maxLength: number): string
```

### Shared Components
**File:** `apps/admin/components/shared/`

```
shared/
├── stat-card.tsx          # Reusable stats card (value, label, icon, trend)
├── data-table.tsx         # Reusable table with sorting, search, pagination
├── status-badge.tsx       # Color-coded badge (success, warning, danger, info, muted)
├── chart-wrapper.tsx      # Consistent chart styling wrapper
├── empty-state.tsx        # "No data" placeholder
├── loading-skeleton.tsx   # Loading state skeleton
├── confirm-dialog.tsx     # Confirmation modal
├── detail-modal.tsx       # Expandable detail overlay
└── tab-nav.tsx            # Tab navigation component
```

### Chart Theme
```typescript
// apps/admin/lib/utils/chart-theme.ts
export const CHART_COLORS = {
  primary: '#6366f1',    // Indigo (admin accent)
  success: '#22c55e',    // Green
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
  info: '#3b82f6',       // Blue
  muted: '#6b7280',      // Gray
}

export const CHART_CONFIG = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: 12,
  axisColor: '#4b5563',
  gridColor: '#374151',
}
```

---

## 18. Implementation Order

### Phase 1: Foundation (Week 1)
1. **Database migration** — Run `00003_admin_dashboard_expansion.sql`
2. **Shared utilities** — Create formatters, shared components
3. **Sidebar navigation** — Update with all new nav items
4. **Enhanced Overview** — Add new stats, charts, feeds

### Phase 2: Core Intelligence (Week 2)
5. **User Management Enhanced** — Detail modal, admin actions, filters
6. **Platform Analytics** — Growth charts, engagement metrics, dynasty analytics
7. **System Health Enhanced** — Health checks, DB metrics, job queue

### Phase 3: AI Features (Week 3)
8. **AI & Content Analytics** — Moderation analytics, category breakdown
9. **AI Intelligence** — Knowledge base, usage analytics, provider performance
10. **Data Intelligence** — AI-powered platform insights

### Phase 4: Operations (Week 4)
11. **API Management** — API configs, usage analytics, call logs
12. **Notifications** — Unified admin activity feed
13. **Contact Submissions** — Contact form + admin management

### Phase 5: Communication (Week 5)
14. **Email Templates** — Template editor, preview, test send, Resend integration
15. **Social Posts** — Content generator, post queue, platform credentials

### Phase 6: Polish (Week 6)
16. **Integration testing** — Verify all logging (AI, API calls)
17. **Performance optimization** — Pagination, caching where needed
18. **Error handling** — Graceful fallbacks on all pages

---

## File Structure Summary (New Files to Create)

```
apps/admin/
├── app/(dashboard)/
│   ├── page.tsx                           # Enhanced (modify existing)
│   ├── users/page.tsx                     # Enhanced (modify existing)
│   ├── system/page.tsx                    # Enhanced (modify existing)
│   ├── ai-analytics/
│   │   └── page.tsx                       # NEW
│   ├── ai-intelligence/
│   │   └── page.tsx                       # NEW
│   ├── analytics/
│   │   └── page.tsx                       # NEW
│   ├── data-intelligence/
│   │   └── page.tsx                       # NEW
│   ├── api/
│   │   └── page.tsx                       # NEW
│   ├── notifications/
│   │   └── page.tsx                       # NEW
│   ├── email-templates/
│   │   └── page.tsx                       # NEW
│   ├── social-posts/
│   │   └── page.tsx                       # NEW
│   └── contacts/
│       └── page.tsx                       # NEW
├── components/
│   ├── shared/
│   │   ├── stat-card.tsx                  # NEW
│   │   ├── data-table.tsx                 # NEW
│   │   ├── status-badge.tsx               # NEW
│   │   ├── chart-wrapper.tsx              # NEW
│   │   ├── empty-state.tsx                # NEW
│   │   ├── loading-skeleton.tsx           # NEW
│   │   ├── confirm-dialog.tsx             # NEW
│   │   ├── detail-modal.tsx               # NEW
│   │   └── tab-nav.tsx                    # NEW
│   ├── dashboard/
│   │   └── enhanced-overview.tsx          # NEW (or modify existing)
│   ├── users/
│   │   └── user-detail-modal.tsx          # NEW
│   ├── ai-analytics/
│   │   └── ai-analytics-client.tsx        # NEW
│   ├── ai-intelligence/
│   │   └── ai-intelligence-client.tsx     # NEW
│   ├── analytics/
│   │   └── analytics-client.tsx           # NEW
│   ├── data-intelligence/
│   │   └── data-intelligence-client.tsx   # NEW
│   ├── api/
│   │   └── api-client.tsx                 # NEW
│   ├── notifications/
│   │   └── notifications-client.tsx       # NEW
│   ├── email-templates/
│   │   └── email-templates-client.tsx     # NEW
│   ├── social-posts/
│   │   └── social-posts-client.tsx        # NEW
│   └── contacts/
│       └── contacts-client.tsx            # NEW
└── lib/
    ├── actions/
    │   ├── overview.ts                    # NEW
    │   ├── users.ts                       # NEW (or enhance existing)
    │   ├── ai-analytics.ts                # NEW
    │   ├── ai-intelligence.ts             # NEW
    │   ├── analytics.ts                   # NEW
    │   ├── data-intelligence.ts           # NEW
    │   ├── api-management.ts              # NEW
    │   ├── system-health.ts               # NEW (or enhance existing)
    │   ├── admin-notifications.ts         # NEW
    │   ├── email-templates.ts             # NEW
    │   ├── social-posts.ts                # NEW
    │   └── contacts.ts                    # NEW
    └── utils/
        ├── formatters.ts                  # NEW
        ├── chart-theme.ts                 # NEW
        └── ai-logger.ts                   # NEW

apps/web/
├── app/(main)/contact/
│   └── page.tsx                           # NEW (public contact form)
└── app/api/contact/
    └── route.ts                           # NEW (contact form API)

packages/api/src/utils/
├── api-logger.ts                          # NEW (API call logging utility)
├── ai-logger.ts                           # NEW (AI interaction logging utility)
└── email.ts                               # NEW (email sending utility)

supabase/migrations/
└── 00003_admin_dashboard_expansion.sql    # NEW (11 new tables)
```

---

## Summary of Required APIs

| API | Purpose | Priority | Cost |
|-----|---------|----------|------|
| **DeepSeek** | AI moderation + content generation + platform insights | Already have | ~$0.14/M input tokens |
| **Resend** | Email sending (templates, notifications) | High | Free: 3K/mo |
| **Twitter/X API** | Social post publishing | Medium | Free: 1.5K tweets/mo |
| **Instagram Graph API** | Social post publishing | Medium | Free |
| **Facebook Graph API** | Social post publishing | Low | Free |
| **TikTok Content API** | Social post publishing | Low | Free |
| **OpenAI** (optional) | AI fallback provider | Low | ~$2.50/M input tokens |

---

## Key Architectural Decisions

1. **Server Components + Client Components pattern** — Page files are server components that fetch data, pass to "use client" components for interactivity
2. **Service client for admin ops** — All admin queries use `createServiceClient()` which bypasses RLS
3. **No new shared UI library** — Build components directly in `apps/admin/components/shared/` (same pattern as existing codebase)
4. **Recharts for all charts** — Already a dependency, consistent with existing admin charts
5. **Tailwind CSS dark theme** — Use existing admin CSS variables and dark theme classes
6. **Supabase RLS** — All new tables get admin-only policies + service_role bypass
7. **AI logging everywhere** — Every AI call gets logged to `ai_interactions` for the knowledge base
8. **API logging everywhere** — Every external API call gets logged to `api_call_log`
