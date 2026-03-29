-- ============================================================
-- Add classification column to support all college football divisions
-- FBS, FCS, D2, D3, NAIA
-- ============================================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'FBS'
  CHECK (classification IN ('FBS', 'FCS', 'D2', 'D3', 'NAIA'));

CREATE INDEX IF NOT EXISTS idx_schools_classification ON schools(classification);

-- Update is_fbs to be derived from classification for existing data
-- (is_fbs remains for quick queries but classification is the source of truth)
