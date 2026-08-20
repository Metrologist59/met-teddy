-- supabase/migrations/0001_auth_profiles.sql
-- MET and Teddy — Application Auth Tables
-- © 2026 MET Scientia, LLC
--
-- Application data in public schema (Supabase auth lives here).
-- Content data lives in field_guide/standards_bridge schemas.
-- No shared tables, credentials, or linkage with MetTutor.
--
-- COPPA compliance:
--   - Students under 13 require parental consent before account activation
--   - Data minimization: first name only for under-13, no last name
--   - Deletion rights: cascade delete removes all student data
--   - Consent records are auditable

-- ── Account types ────────────────────────────────────────────────

CREATE TYPE account_role AS ENUM ('student', 'parent', 'educator');

-- ── Profiles (linked to Supabase auth.users) ─────────────────────

CREATE TABLE profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role           account_role NOT NULL DEFAULT 'student',
  first_name     TEXT NOT NULL,
  last_name      TEXT,                    -- NULL for under-13 (data minimization)
  display_name   TEXT,                    -- what the student sees (first name only for young students)
  email          TEXT,                    -- from auth.users, denormalized for queries
  grade          INTEGER CHECK (grade BETWEEN 0 AND 12),  -- 0 = kindergarten
  grade_band     TEXT CHECK (grade_band IN ('K-2', '3-5', '6-8', '9-12')),
  cert_level     TEXT CHECK (cert_level IN ('Explorer', 'Investigator', 'Innovator', 'Metrologist')),
  override_level TEXT CHECK (override_level IS NULL OR override_level IN ('Explorer', 'Investigator', 'Innovator', 'Metrologist')),
  override_set_by UUID REFERENCES profiles(id),
  is_under_13    BOOLEAN NOT NULL DEFAULT true,
  parent_id      UUID REFERENCES profiles(id),  -- linked parent/guardian for under-13
  educator_id    UUID REFERENCES profiles(id),  -- linked educator for school accounts
  onboarded_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Parental Consent (COPPA) ─────────────────────────────────────

CREATE TABLE parental_consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_method  TEXT NOT NULL CHECK (consent_method IN (
    'email_confirmation',     -- parent clicks email link
    'payment_verification',   -- small credit card charge
    'signed_form',            -- uploaded signed form
    'educator_district'       -- school district agreement (bulk)
  )),
  consent_given   BOOLEAN NOT NULL DEFAULT false,
  consent_date    TIMESTAMPTZ,
  consent_revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_date    TIMESTAMPTZ,
  ip_address      INET,                   -- recorded at consent time
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Educator Classrooms ──────────────────────────────────────────

CREATE TABLE classrooms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  grade_band   TEXT CHECK (grade_band IN ('K-2', '3-5', '6-8', '9-12')),
  school_name  TEXT,
  district     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE classroom_students (
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (classroom_id, student_id)
);

-- ── Data Deletion Log (COPPA audit trail) ────────────────────────

CREATE TABLE deletion_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,             -- the deleted user's ID (profile already gone)
  requested_by UUID,                      -- parent or admin who requested
  reason       TEXT NOT NULL CHECK (reason IN ('parent_request', 'consent_revoked', 'account_inactive', 'admin')),
  deleted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_deleted TEXT[] NOT NULL DEFAULT '{}'  -- list of tables cleared
);

-- ── RLS Policies ─────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_log ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: users can update their own profile
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Parents can read their children's profiles
CREATE POLICY "Parents read children"
  ON profiles FOR SELECT
  USING (auth.uid() = parent_id);

-- Educators can read their students' profiles
CREATE POLICY "Educators read students"
  ON profiles FOR SELECT
  USING (auth.uid() = educator_id);

-- Parental consents: parent can read/write their own consents
CREATE POLICY "Parents manage consents"
  ON parental_consents FOR ALL
  USING (auth.uid() = parent_id);

-- Classrooms: educators manage their own
CREATE POLICY "Educators manage classrooms"
  ON classrooms FOR ALL
  USING (auth.uid() = educator_id);

-- Classroom students: educators manage membership
CREATE POLICY "Educators manage roster"
  ON classroom_students FOR ALL
  USING (
    classroom_id IN (
      SELECT id FROM classrooms WHERE educator_id = auth.uid()
    )
  );

-- ── Helper: grade to band mapping ────────────────────────────────

CREATE OR REPLACE FUNCTION grade_to_band(g INTEGER)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN g BETWEEN 0 AND 2 THEN 'K-2'
    WHEN g BETWEEN 3 AND 5 THEN '3-5'
    WHEN g BETWEEN 6 AND 8 THEN '6-8'
    WHEN g BETWEEN 9 AND 12 THEN '9-12'
    ELSE NULL
  END;
$$;

-- ── Helper: band to default cert level ───────────────────────────

CREATE OR REPLACE FUNCTION band_to_level(band TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE band
    WHEN 'K-2'  THEN 'Explorer'
    WHEN '3-5'  THEN 'Investigator'
    WHEN '6-8'  THEN 'Innovator'
    WHEN '9-12' THEN 'Metrologist'
    ELSE 'Explorer'
  END;
$$;

-- ── Trigger: auto-set grade_band and cert_level from grade ───────

CREATE OR REPLACE FUNCTION set_level_from_grade()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.grade IS NOT NULL THEN
    NEW.grade_band := grade_to_band(NEW.grade);
    IF NEW.override_level IS NOT NULL THEN
      NEW.cert_level := NEW.override_level;
    ELSE
      NEW.cert_level := band_to_level(NEW.grade_band);
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_level
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_level_from_grade();

-- ── Trigger: set is_under_13 from grade ──────────────────────────

CREATE OR REPLACE FUNCTION set_under_13()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Grades K-5 (ages 5-10) are always under 13
  -- Grades 6-7 (ages 11-12) may be under 13
  -- Grade 8+ (ages 13+) are not under 13
  IF NEW.grade IS NOT NULL AND NEW.grade <= 7 THEN
    NEW.is_under_13 := true;
  ELSIF NEW.grade IS NOT NULL AND NEW.grade >= 8 THEN
    NEW.is_under_13 := false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_under_13
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_under_13();
