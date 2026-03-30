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
    EXECUTE format(
      'CREATE POLICY "Service role access on %I" ON %I FOR ALL TO service_role USING (true)',
      tbl, tbl
    );
  END LOOP;
END $$;

-- Contact submissions: public insert (anyone can submit), admin read/update
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
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
('weekly_digest', 'Weekly Digest', 'lifecycle', 'Your Weekly CFB Roundup', '<h1>This Week in CFB Social</h1><p>{{digest_content}}</p>', ARRAY['username', 'digest_content', 'top_posts'], 'Sent weekly to active users'),
('inactive_reengagement', 'Come Back!', 'lifecycle', 'We miss you on CFB Social, {{username}}!', '<h1>Come back, {{username}}!</h1><p>Here''s what you missed: {{missed_highlights}}</p>', ARRAY['username', 'missed_highlights'], 'Sent to users inactive for 14+ days'),
('achievement_unlocked', 'Achievement Unlocked!', 'lifecycle', 'You unlocked: {{achievement_name}}!', '<h1>Achievement Unlocked!</h1><p>Congrats {{username}}, you earned "{{achievement_name}}" (+{{xp_reward}} XP)!</p>', ARRAY['username', 'achievement_name', 'xp_reward'], 'Sent when user earns an achievement'),
('challenge_received', 'Challenge Received', 'notification', '{{challenger}} challenged you!', '<h1>You''ve Been Challenged!</h1><p>{{challenger}} wants to debate: "{{challenge_topic}}"</p><p><a href="{{app_url}}/rivalry/challenge/{{challenge_id}}">Accept or Decline</a></p>', ARRAY['username', 'challenger', 'challenge_topic', 'challenge_id', 'app_url'], 'Sent when someone receives a challenge'),
('prediction_result', 'Prediction Verified', 'notification', 'Your prediction was {{result}}!', '<h1>Prediction Result</h1><p>{{username}}, your prediction "{{prediction_text}}" was {{result}}! {{xp_message}}</p>', ARRAY['username', 'prediction_text', 'result', 'xp_message'], 'Sent when a prediction is verified'),
('moderation_action', 'Content Review', 'notification', 'A post was reviewed by our team', '<h1>Content Review Notice</h1><p>Hi {{username}}, your post was reviewed and {{action_taken}}. Reason: {{reason}}</p><p>You can <a href="{{app_url}}/settings">appeal this decision</a>.</p>', ARRAY['username', 'action_taken', 'reason', 'app_url'], 'Sent when a moderation action is taken on user content'),
('email_confirmation', 'Email Confirmation', 'authentication', 'Confirm your email address', '<h1>Confirm Your Email</h1><p>Click the link below to verify your email:</p><p><a href="{{confirmation_link}}">Confirm Email</a></p>', ARRAY['username', 'confirmation_link'], 'Sent on signup for email verification'),
('password_reset', 'Password Reset', 'authentication', 'Reset your CFB Social password', '<h1>Password Reset</h1><p>Click below to reset your password:</p><p><a href="{{reset_link}}">Reset Password</a></p><p>If you didn''t request this, ignore this email.</p>', ARRAY['username', 'reset_link'], 'Sent when user requests a password reset'),
('magic_link', 'Magic Link Login', 'authentication', 'Your CFB Social login link', '<h1>Login to CFB Social</h1><p>Click below to sign in:</p><p><a href="{{magic_link}}">Sign In</a></p><p>This link expires in 10 minutes.</p>', ARRAY['magic_link'], 'Sent for passwordless login'),
('email_change', 'Email Change Confirmation', 'authentication', 'Confirm your new email', '<h1>Email Change</h1><p>Click below to confirm your new email address:</p><p><a href="{{confirmation_link}}">Confirm New Email</a></p>', ARRAY['username', 'confirmation_link'], 'Sent when user changes their email address')
ON CONFLICT (slug) DO NOTHING;
