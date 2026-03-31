-- ============================================================
-- CFB Social Bot System
-- Migration: 00004
-- Adds bot capabilities to profiles + activity tracking
-- ============================================================

-- 1. Add bot columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_active BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_personality JSONB;

-- Partial index for fast bot queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_bot ON profiles(is_bot) WHERE is_bot = true;
CREATE INDEX IF NOT EXISTS idx_profiles_bot_active ON profiles(bot_active) WHERE bot_active = true;

-- 2. Bot activity log
CREATE TABLE IF NOT EXISTS bot_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('POST', 'REACT', 'REPLY', 'REPOST')),
  target_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  created_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  content_preview TEXT,
  tokens_used INT DEFAULT 0,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bot_activity_bot ON bot_activity_log(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_activity_created ON bot_activity_log(created_at DESC);

-- RLS: service_role only (no user access needed)
ALTER TABLE bot_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on bot_activity_log"
  ON bot_activity_log FOR ALL TO service_role USING (true);

-- 3. Global bot toggle in admin_settings
INSERT INTO admin_settings (key, value)
VALUES ('bots_global_active', 'false')
ON CONFLICT (key) DO NOTHING;
