-- ============================================================
-- Bot Engine V2 - Schema additions for rivalry threads,
-- round-robin selection, and admin-tunable settings
-- ============================================================

-- Round-robin selection tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_last_selected_at TIMESTAMPTZ;

-- Admin-tunable bot settings (no code deploys to adjust)
INSERT INTO admin_settings (key, value) VALUES
  ('bot_min_post_interval_seconds', '900'),
  ('bot_max_posts_per_day', '5'),
  ('bot_engagement_probability', '0.6'),
  ('bot_rivalry_interval_hours', '3'),
  ('bot_cross_engagement_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Rivalry thread tracking
CREATE TABLE IF NOT EXISTS bot_rivalry_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id TEXT NOT NULL,
  school_a_id UUID REFERENCES schools(id),
  school_b_id UUID REFERENCES schools(id),
  bot_a_id UUID REFERENCES profiles(id),
  bot_b_id UUID REFERENCES profiles(id),
  phase_completed INT DEFAULT 0,
  root_post_id UUID REFERENCES posts(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  next_phase_at TIMESTAMPTZ
);

-- Index for quick lookup of active threads
CREATE INDEX IF NOT EXISTS idx_rivalry_threads_status
  ON bot_rivalry_threads (status)
  WHERE status = 'active';

-- Index for round-robin bot selection
CREATE INDEX IF NOT EXISTS idx_profiles_bot_last_selected
  ON profiles (bot_last_selected_at NULLS FIRST)
  WHERE is_bot = true AND bot_active = true;

-- RLS for bot_rivalry_threads (admin-only write, public read)
ALTER TABLE bot_rivalry_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rivalry threads"
  ON bot_rivalry_threads FOR SELECT
  USING (true);

CREATE POLICY "Service role manages rivalry threads"
  ON bot_rivalry_threads FOR ALL
  USING (auth.role() = 'service_role');
