-- supabase/migrations/0002_notebook.sql
-- MET and Teddy — Field Notebook Tables
-- © 2026 MET Scientia, LLC
--
-- Notebook entries are student work product, visible to
-- the linked parent or educator by design.

-- ── Notebook entries ─────────────────────────────────────────────

CREATE TABLE notebook_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_slug    TEXT,                       -- linked Field Mission (nullable for free entries)
  cert_level      TEXT NOT NULL CHECK (cert_level IN ('Explorer', 'Investigator', 'Innovator', 'Metrologist')),
  grade_band      TEXT NOT NULL CHECK (grade_band IN ('K-2', '3-5', '6-8', '9-12')),
  domain          TEXT,                       -- measurement domain
  title           TEXT NOT NULL,
  what_measured   TEXT NOT NULL,              -- the object or quantity measured
  instrument      TEXT,                       -- what tool was used
  unit            TEXT,                       -- unit of measurement
  entry_type      TEXT NOT NULL DEFAULT 'mission' CHECK (entry_type IN ('mission', 'free', 'practice')),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'complete', 'reviewed')),
  reviewed_by     TEXT,                       -- 'met' or 'parent' or 'educator'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Measurements (individual readings within an entry) ───────────

CREATE TABLE notebook_measurements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id        UUID NOT NULL REFERENCES notebook_entries(id) ON DELETE CASCADE,
  trial_number    INTEGER NOT NULL DEFAULT 1,
  value           NUMERIC NOT NULL,
  unit            TEXT NOT NULL,
  notes           TEXT,                       -- student observation for this trial
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Student reflections (per entry) ──────────────────────────────

CREATE TABLE notebook_reflections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id        UUID NOT NULL REFERENCES notebook_entries(id) ON DELETE CASCADE,
  prompt          TEXT NOT NULL,              -- the question asked
  response        TEXT NOT NULL,              -- student's answer
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Innovator/Metrologist: uncertainty worksheet ─────────────────

CREATE TABLE notebook_uncertainty (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id        UUID NOT NULL REFERENCES notebook_entries(id) ON DELETE CASCADE,
  component_name  TEXT NOT NULL,              -- e.g. "repeatability", "resolution"
  eval_type       TEXT CHECK (eval_type IN ('A', 'B')),
  value           NUMERIC,
  unit            TEXT,
  dof             INTEGER,                    -- degrees of freedom (Metrologist)
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Entry templates ──────────────────────────────────────────────

CREATE TABLE notebook_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_level      TEXT NOT NULL CHECK (cert_level IN ('Explorer', 'Investigator', 'Innovator', 'Metrologist')),
  template_name   TEXT NOT NULL,
  domain          TEXT,
  fields          JSONB NOT NULL,             -- template field definitions
  reflection_prompts TEXT[] DEFAULT '{}',     -- prompts to show after data entry
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────────

ALTER TABLE notebook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_uncertainty ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_templates ENABLE ROW LEVEL SECURITY;

-- Students own their entries
CREATE POLICY "Students manage own entries"
  ON notebook_entries FOR ALL
  USING (auth.uid() = student_id);

-- Parents see their children's entries
CREATE POLICY "Parents read children entries"
  ON notebook_entries FOR SELECT
  USING (
    student_id IN (SELECT id FROM profiles WHERE parent_id = auth.uid())
  );

-- Educators see their students' entries
CREATE POLICY "Educators read student entries"
  ON notebook_entries FOR SELECT
  USING (
    student_id IN (SELECT id FROM profiles WHERE educator_id = auth.uid())
  );

-- Measurements: same access as parent entry
CREATE POLICY "Students manage own measurements"
  ON notebook_measurements FOR ALL
  USING (
    entry_id IN (SELECT id FROM notebook_entries WHERE student_id = auth.uid())
  );

CREATE POLICY "Parents read children measurements"
  ON notebook_measurements FOR SELECT
  USING (
    entry_id IN (
      SELECT id FROM notebook_entries WHERE student_id IN (
        SELECT id FROM profiles WHERE parent_id = auth.uid()
      )
    )
  );

-- Reflections: same pattern
CREATE POLICY "Students manage own reflections"
  ON notebook_reflections FOR ALL
  USING (
    entry_id IN (SELECT id FROM notebook_entries WHERE student_id = auth.uid())
  );

-- Uncertainty: same pattern
CREATE POLICY "Students manage own uncertainty"
  ON notebook_uncertainty FOR ALL
  USING (
    entry_id IN (SELECT id FROM notebook_entries WHERE student_id = auth.uid())
  );

-- Templates: readable by all authenticated users
CREATE POLICY "Templates readable by all"
  ON notebook_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ── Indexes ──────────────────────────────────────────────────────

CREATE INDEX idx_notebook_student ON notebook_entries(student_id);
CREATE INDEX idx_notebook_mission ON notebook_entries(mission_slug);
CREATE INDEX idx_notebook_level ON notebook_entries(cert_level);
CREATE INDEX idx_measurements_entry ON notebook_measurements(entry_id);

-- ── Updated_at trigger ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_notebook_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER notebook_entries_updated
  BEFORE UPDATE ON notebook_entries
  FOR EACH ROW EXECUTE FUNCTION update_notebook_timestamp();
