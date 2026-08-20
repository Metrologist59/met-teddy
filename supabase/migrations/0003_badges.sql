-- supabase/migrations/0003_badges.sql
-- MET and Teddy — Badge System Tables
-- © 2026 MET Scientia, LLC
--
-- Badge categories:
--   mission      — complete a Field Mission (with notebook entry)
--   domain       — complete all missions in a measurement domain
--   notebook     — notebook quality and consistency milestones
--   certification — complete all requirements for a certification level
--   special      — streaks, milestones, achievements

-- ── Badge definitions ────────────────────────────────────────────

CREATE TABLE badge_definitions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('mission', 'domain', 'notebook', 'certification', 'special')),
  cert_level      TEXT CHECK (cert_level IN ('Explorer', 'Investigator', 'Innovator', 'Metrologist')),
  domain          TEXT,                       -- for domain badges
  mission_slug    TEXT,                       -- for mission badges
  icon            TEXT NOT NULL DEFAULT '🏅',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Badge criteria ───────────────────────────────────────────────

CREATE TABLE badge_criteria (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id        UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  criterion_type  TEXT NOT NULL CHECK (criterion_type IN (
    'mission_complete',       -- complete a specific mission
    'mission_with_notebook',  -- complete mission AND have notebook entry
    'notebook_entry_count',   -- reach N notebook entries
    'notebook_reflection',    -- entries with reflections
    'domain_missions_all',    -- complete all missions in a domain
    'readings_count',         -- total measurement readings across notebook
    'streak_days',            -- consecutive days with entries
    'level_missions_all',     -- complete all missions at a certification level
    'level_badges_all',       -- earn all mission badges at a level
    'custom'                  -- custom evaluation (checked by engine)
  )),
  target_value    INTEGER NOT NULL DEFAULT 1, -- threshold to meet
  target_slug     TEXT,                       -- mission slug, domain name, etc.
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Earned badges ────────────────────────────────────────────────

CREATE TABLE earned_badges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id        UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  evidence        JSONB,                      -- links to entries, missions that triggered it
  UNIQUE (student_id, badge_id)
);

-- ── Badge progress (partial tracking) ────────────────────────────

CREATE TABLE badge_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id        UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  current_value   INTEGER NOT NULL DEFAULT 0,
  target_value    INTEGER NOT NULL,
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, badge_id)
);

-- ── RLS ──────────────────────────────────────────────────────────

ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE earned_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_progress ENABLE ROW LEVEL SECURITY;

-- Definitions and criteria: readable by all authenticated
CREATE POLICY "Badge defs readable" ON badge_definitions FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "Badge criteria readable" ON badge_criteria FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Earned badges: students see their own, parents see children's
CREATE POLICY "Students see own badges" ON earned_badges FOR SELECT
  USING (auth.uid() = student_id);
CREATE POLICY "Parents see children badges" ON earned_badges FOR SELECT
  USING (student_id IN (SELECT id FROM profiles WHERE parent_id = auth.uid()));
CREATE POLICY "Educators see student badges" ON earned_badges FOR SELECT
  USING (student_id IN (SELECT id FROM profiles WHERE educator_id = auth.uid()));

-- Progress: same pattern
CREATE POLICY "Students see own progress" ON badge_progress FOR ALL
  USING (auth.uid() = student_id);
CREATE POLICY "Parents see children progress" ON badge_progress FOR SELECT
  USING (student_id IN (SELECT id FROM profiles WHERE parent_id = auth.uid()));

-- ── Indexes ──────────────────────────────────────────────────────

CREATE INDEX idx_earned_badges_student ON earned_badges(student_id);
CREATE INDEX idx_earned_badges_badge ON earned_badges(badge_id);
CREATE INDEX idx_badge_progress_student ON badge_progress(student_id);
CREATE INDEX idx_badge_criteria_badge ON badge_criteria(badge_id);
