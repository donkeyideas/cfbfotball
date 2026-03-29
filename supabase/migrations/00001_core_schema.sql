-- ============================================================
-- CFB SOCIAL -- Core Database Schema
-- All 24 tables across all phases
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- PHASE 1: SCHOOLS & PROFILES
-- ============================================================

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  mascot TEXT NOT NULL,
  conference TEXT NOT NULL,
  division TEXT,
  classification TEXT NOT NULL DEFAULT 'FBS' CHECK (classification IN ('FBS','FCS','D2','D3','NAIA')),
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  tertiary_color TEXT,
  logo_url TEXT,
  stadium TEXT,
  city TEXT,
  state TEXT,
  is_fbs BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_conference ON schools(conference);
CREATE INDEX idx_schools_state ON schools(state);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  school_id UUID REFERENCES schools(id),
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER','PREMIUM','MODERATOR','EDITOR','ADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED','BANNED')),

  -- Denormalized counts
  post_count INT DEFAULT 0,
  touchdown_count INT DEFAULT 0,
  fumble_count INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,

  -- Dynasty mode
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  dynasty_tier TEXT DEFAULT 'WALK_ON' CHECK (dynasty_tier IN ('WALK_ON','STARTER','ALL_CONFERENCE','ALL_AMERICAN','HEISMAN','HALL_OF_FAME')),

  -- Predictions
  prediction_count INT DEFAULT 0,
  correct_predictions INT DEFAULT 0,
  challenge_wins INT DEFAULT 0,
  challenge_losses INT DEFAULT 0,

  -- Moderation
  ban_reason TEXT,
  banned_until TIMESTAMPTZ,
  banned_by UUID,

  terms_accepted_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_school ON profiles(school_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);

-- ============================================================
-- PHASE 2: FOLLOWS, BLOCKS, DEVICES
-- ============================================================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

CREATE TABLE user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios','android','web')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_device_tokens_user ON device_tokens(user_id);

-- ============================================================
-- PHASE 3: POSTS, REACTIONS, BOOKMARKS
-- ============================================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'STANDARD' CHECK (post_type IN (
    'STANDARD','RECEIPT','SIDELINE','PREDICTION','AGING_TAKE','CHALLENGE_RESULT'
  )),
  media_urls TEXT[] DEFAULT '{}',
  school_id UUID REFERENCES schools(id),

  -- Engagement (denormalized)
  touchdown_count INT DEFAULT 0,
  fumble_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  repost_count INT DEFAULT 0,
  bookmark_count INT DEFAULT 0,
  view_count INT DEFAULT 0,

  -- Threading
  parent_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  root_id UUID REFERENCES posts(id) ON DELETE SET NULL,

  -- Receipt-specific
  receipt_prediction TEXT,
  receipt_deadline TIMESTAMPTZ,
  receipt_verified BOOLEAN,
  receipt_verified_at TIMESTAMPTZ,

  -- Sideline-specific
  sideline_game TEXT,
  sideline_quarter TEXT,
  sideline_time TEXT,
  sideline_verified BOOLEAN DEFAULT false,

  -- Moderation
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED','FLAGGED','REMOVED','DRAFT')),
  moderation_score FLOAT,
  moderation_labels JSONB,
  moderation_reason TEXT,
  flagged_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,

  -- Metadata
  is_pinned BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_school ON posts(school_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_status ON posts(status) WHERE status = 'PUBLISHED';
CREATE INDEX idx_posts_parent ON posts(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_flagged ON posts(status, flagged_at) WHERE status = 'FLAGGED';
CREATE INDEX idx_posts_content_trgm ON posts USING gin(content gin_trgm_ops);

CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('TOUCHDOWN','FUMBLE')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);

CREATE TABLE reposts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  quote TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_reposts_post ON reposts(post_id);

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- ============================================================
-- PHASE 4: RIVALRY RING & CHALLENGES
-- ============================================================

CREATE TABLE rivalries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_1_id UUID NOT NULL REFERENCES schools(id),
  school_2_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  season_year INT,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('UPCOMING','ACTIVE','VOTING','CLOSED')),
  school_1_vote_count INT DEFAULT 0,
  school_2_vote_count INT DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rivalries_schools ON rivalries(school_1_id, school_2_id);
CREATE INDEX idx_rivalries_featured ON rivalries(is_featured) WHERE is_featured = true;

CREATE TABLE rivalry_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rivalry_id UUID NOT NULL REFERENCES rivalries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rivalry_id, user_id)
);

CREATE TABLE rivalry_takes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rivalry_id UUID NOT NULL REFERENCES rivalries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenged_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACTIVE','VOTING','COMPLETED','DECLINED','EXPIRED')),
  challenger_argument TEXT,
  challenged_argument TEXT,
  challenger_votes INT DEFAULT 0,
  challenged_votes INT DEFAULT 0,
  winner_id UUID REFERENCES profiles(id),
  xp_awarded INT DEFAULT 0,
  voting_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX idx_challenges_challenged ON challenges(challenged_id);
CREATE INDEX idx_challenges_status ON challenges(status);

CREATE TABLE challenge_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voted_for UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE fact_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  verdict TEXT CHECK (verdict IN ('VERIFIED','FALSE','UNVERIFIABLE','PENDING')),
  evidence TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_fact_checks_post ON fact_checks(post_id);

-- ============================================================
-- PHASE 5: TRANSFER PORTAL & PREDICTIONS
-- ============================================================

CREATE TABLE portal_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  previous_school_id UUID REFERENCES schools(id),
  previous_school_name TEXT,
  star_rating INT DEFAULT 3 CHECK (star_rating BETWEEN 1 AND 5),
  height TEXT,
  weight TEXT,
  class_year TEXT CHECK (class_year IN ('FR','SO','JR','SR','GR')),
  stats JSONB,
  status TEXT DEFAULT 'IN_PORTAL' CHECK (status IN ('IN_PORTAL','COMMITTED','WITHDRAWN')),
  committed_school_id UUID REFERENCES schools(id),
  committed_at TIMESTAMPTZ,
  entered_portal_at TIMESTAMPTZ DEFAULT now(),
  portal_window TEXT CHECK (portal_window IN ('SPRING','WINTER')),
  season_year INT,
  total_claims INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portal_status ON portal_players(status);
CREATE INDEX idx_portal_position ON portal_players(position);
CREATE INDEX idx_portal_stars ON portal_players(star_rating DESC);
CREATE INDEX idx_portal_featured ON portal_players(is_featured) WHERE is_featured = true;

CREATE TABLE roster_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES portal_players(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id),
  confidence INT DEFAULT 50 CHECK (confidence BETWEEN 1 AND 100),
  reasoning TEXT,
  is_correct BOOLEAN,
  xp_awarded INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, user_id)
);

CREATE INDEX idx_claims_player ON roster_claims(player_id);
CREATE INDEX idx_claims_user ON roster_claims(user_id);

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  prediction_text TEXT NOT NULL,
  category TEXT CHECK (category IN ('GAME_OUTCOME','SEASON_RECORD','PLAYER_PERFORMANCE','RECRUITING','AWARD','CUSTOM')),
  target_date TIMESTAMPTZ,
  result TEXT CHECK (result IN ('PENDING','CORRECT','INCORRECT','PUSH','EXPIRED')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  xp_awarded INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_result ON predictions(result);

CREATE TABLE aging_takes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  revisit_date DATE NOT NULL,
  is_surfaced BOOLEAN DEFAULT false,
  surfaced_at TIMESTAMPTZ,
  community_verdict TEXT CHECK (community_verdict IN ('AGED_WELL','AGED_POORLY','PENDING')),
  aged_well_votes INT DEFAULT 0,
  aged_poorly_votes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_aging_revisit ON aging_takes(revisit_date) WHERE is_surfaced = false;

-- ============================================================
-- PHASE 6: AI MODERATION
-- ============================================================

CREATE TABLE moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('AUTO_FLAG','AUTO_REMOVE','MANUAL_FLAG','MANUAL_REMOVE','APPEAL','RESTORE','USER_REPORT')),
  ai_score FLOAT,
  ai_labels JSONB,
  ai_reason TEXT,
  moderator_id UUID REFERENCES profiles(id),
  moderator_notes TEXT,
  action_taken TEXT CHECK (action_taken IN ('FLAG','REMOVE','RESTORE','WARN','SUSPEND','BAN','DISMISS')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mod_events_post ON moderation_events(post_id);
CREATE INDEX idx_mod_events_user ON moderation_events(user_id);
CREATE INDEX idx_mod_events_type ON moderation_events(event_type);
CREATE INDEX idx_mod_events_created ON moderation_events(created_at DESC);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL CHECK (reason IN ('SPAM','HARASSMENT','HATE_SPEECH','OFF_TOPIC','POLITICS','MISINFORMATION','OTHER')),
  description TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','REVIEWING','ACTIONED','DISMISSED')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reports_status ON reports(status) WHERE status = 'PENDING';
CREATE INDEX idx_reports_post ON reports(post_id);

CREATE TABLE appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','DENIED')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_appeals_status ON appeals(status) WHERE status = 'PENDING';

-- ============================================================
-- PHASE 7: DYNASTY MODE (GAMIFICATION)
-- ============================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('SOCIAL','PREDICTION','RIVALRY','RECRUITING','ENGAGEMENT','MILESTONE')),
  xp_reward INT DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

CREATE TABLE xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source TEXT NOT NULL CHECK (source IN (
    'POST_CREATED','TOUCHDOWN_RECEIVED','CHALLENGE_WON','PREDICTION_CORRECT',
    'PORTAL_CLAIM_CORRECT','RIVALRY_PARTICIPATION','FACT_CHECK','ACHIEVEMENT_UNLOCKED',
    'DAILY_LOGIN','STREAK_BONUS','RECEIPT_VERIFIED','AGING_TAKE_CORRECT'
  )),
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_xp_log_user ON xp_log(user_id);
CREATE INDEX idx_xp_log_created ON xp_log(created_at DESC);

CREATE TABLE leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL CHECK (period IN ('DAILY','WEEKLY','MONTHLY','SEASON','ALL_TIME')),
  school_id UUID REFERENCES schools(id),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rank INT NOT NULL,
  xp INT NOT NULL,
  level INT NOT NULL,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leaderboard_period ON leaderboard_snapshots(period, snapshot_date DESC);
CREATE INDEX idx_leaderboard_school ON leaderboard_snapshots(school_id, period);

-- ============================================================
-- PHASE 8: ADMIN ANALYTICS
-- ============================================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  dau INT DEFAULT 0,
  mau INT DEFAULT 0,
  new_users INT DEFAULT 0,
  total_posts INT DEFAULT 0,
  total_reactions INT DEFAULT 0,
  total_challenges INT DEFAULT 0,
  total_rivalries INT DEFAULT 0,
  moderation_flags INT DEFAULT 0,
  moderation_auto_removes INT DEFAULT 0,
  avg_session_duration_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);

CREATE TABLE api_performance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INT NOT NULL,
  response_time_ms INT NOT NULL,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_api_perf_endpoint ON api_performance_log(endpoint);
CREATE INDEX idx_api_perf_created ON api_performance_log(created_at);

CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('DAILY','WEEKLY','MONTHLY')),
  recipients TEXT[] DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PHASE 9: NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN (
    'FOLLOW','TOUCHDOWN','FUMBLE','REPLY','REPOST','MENTION',
    'CHALLENGE_RECEIVED','CHALLENGE_RESULT','PREDICTION_RESULT',
    'RIVALRY_FEATURED','PORTAL_COMMIT','ACHIEVEMENT_UNLOCKED',
    'MODERATION_WARNING','MODERATION_APPEAL_RESULT','LEVEL_UP',
    'AGING_TAKE_SURFACED','RECEIPT_VERIFIED','SYSTEM'
  )),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT false,
  follow_notifications BOOLEAN DEFAULT true,
  reaction_notifications BOOLEAN DEFAULT true,
  reply_notifications BOOLEAN DEFAULT true,
  challenge_notifications BOOLEAN DEFAULT true,
  rivalry_notifications BOOLEAN DEFAULT true,
  moderation_notifications BOOLEAN DEFAULT true,
  marketing_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Schools: public read
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schools are publicly readable" ON schools FOR SELECT USING (true);
CREATE POLICY "Admins can manage schools" ON schools FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
);

-- Profiles: public read, self-update
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
);

-- Posts: published visible, authors manage own
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are readable" ON posts FOR SELECT USING (
  status = 'PUBLISHED' OR author_id = auth.uid()
);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (
  auth.uid() = author_id
);
CREATE POLICY "Authors can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON posts FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','MODERATOR')
);

-- Reactions
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reactions are readable" ON reactions FOR SELECT USING (true);
CREATE POLICY "Users can add reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are readable" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = recipient_id);

-- Reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can read reports" ON reports FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','MODERATOR')
);
CREATE POLICY "Admins can update reports" ON reports FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','MODERATOR')
);

-- Appeals
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create own appeals" ON appeals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own appeals" ON appeals FOR SELECT USING (
  auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','MODERATOR')
);

-- Rivalries: public read
ALTER TABLE rivalries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rivalries are readable" ON rivalries FOR SELECT USING (true);
CREATE POLICY "Admins can manage rivalries" ON rivalries FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','EDITOR')
);

-- Rivalry votes
ALTER TABLE rivalry_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes are readable" ON rivalry_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON rivalry_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges are readable" ON challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Participants can update challenges" ON challenges FOR UPDATE USING (
  auth.uid() IN (challenger_id, challenged_id)
);

-- Portal players: public read
ALTER TABLE portal_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portal players are readable" ON portal_players FOR SELECT USING (true);
CREATE POLICY "Admins can manage portal players" ON portal_players FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','EDITOR')
);

-- Roster claims
ALTER TABLE roster_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Claims are readable" ON roster_claims FOR SELECT USING (true);
CREATE POLICY "Users can make claims" ON roster_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Predictions
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Predictions are readable" ON predictions FOR SELECT USING (true);
CREATE POLICY "Users can create predictions" ON predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements: public read
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are readable" ON achievements FOR SELECT USING (true);

-- User achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User achievements are readable" ON user_achievements FOR SELECT USING (true);

-- XP log: users see own
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own xp log" ON xp_log FOR SELECT USING (auth.uid() = user_id);

-- Moderation events: admin only
ALTER TABLE moderation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read moderation events" ON moderation_events FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('ADMIN','MODERATOR')
);

-- Analytics: admin only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read analytics" ON analytics_events FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
);

ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read daily stats" ON daily_stats FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::TEXT, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: Update denormalized counts on reactions
-- ============================================================

CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update post counts
    IF NEW.reaction_type = 'TOUCHDOWN' THEN
      UPDATE posts SET touchdown_count = touchdown_count + 1 WHERE id = NEW.post_id;
      UPDATE profiles SET touchdown_count = touchdown_count + 1
        WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
    ELSIF NEW.reaction_type = 'FUMBLE' THEN
      UPDATE posts SET fumble_count = fumble_count + 1 WHERE id = NEW.post_id;
      UPDATE profiles SET fumble_count = fumble_count + 1
        WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'TOUCHDOWN' THEN
      UPDATE posts SET touchdown_count = GREATEST(0, touchdown_count - 1) WHERE id = OLD.post_id;
      UPDATE profiles SET touchdown_count = GREATEST(0, touchdown_count - 1)
        WHERE id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
    ELSIF OLD.reaction_type = 'FUMBLE' THEN
      UPDATE posts SET fumble_count = GREATEST(0, fumble_count - 1) WHERE id = OLD.post_id;
      UPDATE profiles SET fumble_count = GREATEST(0, fumble_count - 1)
        WHERE id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
    END IF;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reaction_change
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW EXECUTE FUNCTION update_reaction_counts();

-- ============================================================
-- TRIGGER: Update follow counts
-- ============================================================

CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    UPDATE profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- ============================================================
-- TRIGGER: Update post count on profiles
-- ============================================================

CREATE OR REPLACE FUNCTION update_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET post_count = GREATEST(0, post_count - 1) WHERE id = OLD.author_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_change
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_post_count();

-- ============================================================
-- FUNCTION: Award XP and level up
-- ============================================================

CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INT,
  p_source TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  new_xp INT;
  new_level INT;
  new_tier TEXT;
  xp_thresholds INT[] := ARRAY[0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6600, 8200, 10000, 12500, 15500, 19000, 23000, 28000, 34000, 41000, 50000];
BEGIN
  -- Log XP
  INSERT INTO xp_log (user_id, amount, source, reference_id, description)
  VALUES (p_user_id, p_amount, p_source, p_reference_id, p_description);

  -- Update profile XP
  UPDATE profiles SET xp = xp + p_amount WHERE id = p_user_id RETURNING xp INTO new_xp;

  -- Calculate new level
  new_level := 1;
  FOR i IN 1..ARRAY_LENGTH(xp_thresholds, 1) LOOP
    IF new_xp >= xp_thresholds[i] THEN
      new_level := i;
    END IF;
  END LOOP;

  -- Calculate tier
  new_tier := CASE
    WHEN new_level >= 18 THEN 'HALL_OF_FAME'
    WHEN new_level >= 14 THEN 'HEISMAN'
    WHEN new_level >= 10 THEN 'ALL_AMERICAN'
    WHEN new_level >= 7 THEN 'ALL_CONFERENCE'
    WHEN new_level >= 4 THEN 'STARTER'
    ELSE 'WALK_ON'
  END;

  -- Update level and tier
  UPDATE profiles SET level = new_level, dynasty_tier = new_tier WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('reports-evidence', 'reports-evidence', false);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Post media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

CREATE POLICY "Users can upload post media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-media' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Report evidence: admin read only"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reports-evidence' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('ADMIN','MODERATOR'));
