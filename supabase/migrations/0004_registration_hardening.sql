-- supabase/migrations/0004_registration_hardening.sql
-- MET and Teddy — Registration Hardening
-- © 2026 MET Scientia, LLC
--
-- Adds: EULA/privacy acceptance tracking, welcome-email idempotency,
-- verified (not just checked-off) parental consent, and a write-path
-- lockdown that closes gaps left open by migration 0001.
--
-- NOT applied to the live database by this change set — review and
-- run manually.

BEGIN;

-- ── Profiles: legal acceptance + registration context ────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS eula_version             TEXT,
  ADD COLUMN IF NOT EXISTS eula_accepted_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_version          TEXT,
  ADD COLUMN IF NOT EXISTS privacy_accepted_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_flow        TEXT,
  ADD COLUMN IF NOT EXISTS school_name              TEXT,
  ADD COLUMN IF NOT EXISTS pending_child_first_name TEXT,
  ADD COLUMN IF NOT EXISTS pending_child_grade      INTEGER,
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at    TIMESTAMPTZ;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_registration_flow_chk
    CHECK (registration_flow IS NULL
           OR registration_flow IN ('parent_led', 'educator_led', 'self_led')),
  ADD CONSTRAINT profiles_pending_child_grade_chk
    CHECK (pending_child_grade IS NULL
           OR pending_child_grade BETWEEN 0 AND 12);

COMMENT ON COLUMN profiles.eula_accepted_at IS
  'Server clock at the instant /api/register accepted the request. '
  'The terms step precedes account creation: the API refuses to call '
  'auth.signUp() without an explicit acceptance flag and a version '
  'that matches the server-pinned EULA_VERSION.';

COMMENT ON COLUMN profiles.pending_child_grade IS
  'The child''s grade for a parent_led registration. Deliberately NOT '
  'profiles.grade: the profiles_set_level / profiles_set_under_13 '
  'triggers below derive cert_level and is_under_13 from grade, and '
  'writing the child''s grade onto the PARENT''s row would mark the '
  'parent as under 13 and trip the COPPA gate on their own account. '
  'No child auth user exists yet (profiles.id is FK''d to '
  'auth.users(id)), so there is no separate child row to hold it.';

COMMENT ON COLUMN profiles.welcome_email_sent_at IS
  'Claim-and-send marker for the post-confirmation welcome email. '
  'Claimed with an UPDATE ... WHERE welcome_email_sent_at IS NULL, '
  'which Postgres serializes via row lock, so exactly one concurrent '
  'confirmation callback wins the claim and sends.';

-- ── Parental consent: pending at registration, verified at confirmation ──
--
-- Verification mechanism: the PARENT's own email confirmation. The
-- consent row is inserted with consent_given = false when the parent
-- registers, then flipped to true when they click their confirmation
-- link (src/lib/auth/finalizeConfirmation.ts). This reuses the
-- 'email_confirmation' value the original consent_method CHECK
-- already anticipated but the app never actually enforced.

ALTER TABLE parental_consents
  ALTER COLUMN student_id DROP NOT NULL;

ALTER TABLE parental_consents
  ADD COLUMN IF NOT EXISTS child_first_name TEXT,
  ADD COLUMN IF NOT EXISTS child_grade      INTEGER,
  ADD COLUMN IF NOT EXISTS verified_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_ip      INET,
  ADD COLUMN IF NOT EXISTS verified_via     TEXT;

ALTER TABLE parental_consents
  ADD CONSTRAINT parental_consents_subject_chk
    CHECK (student_id IS NOT NULL OR child_first_name IS NOT NULL),
  ADD CONSTRAINT parental_consents_child_grade_chk
    CHECK (child_grade IS NULL OR child_grade BETWEEN 0 AND 12),
  ADD CONSTRAINT parental_consents_verified_via_chk
    CHECK (verified_via IS NULL
           OR verified_via IN ('parent_email_confirmation', 'payment_verification',
                                'signed_form', 'educator_district')),
  -- consent_given = true is reachable ONLY through a verification event.
  -- This is the actual enforcement fix: previously the app set
  -- consent_given = true unconditionally at registration.
  ADD CONSTRAINT parental_consents_given_requires_verification_chk
    CHECK (consent_given = false
           OR (consent_date IS NOT NULL AND verified_at IS NOT NULL));

-- One live pending consent per parent before a child account exists...
CREATE UNIQUE INDEX IF NOT EXISTS parental_consents_pending_uniq
  ON parental_consents (parent_id, consent_method)
  WHERE student_id IS NULL AND consent_revoked = false;

-- ...and one live consent per (student, parent, method) once one does.
CREATE UNIQUE INDEX IF NOT EXISTS parental_consents_student_uniq
  ON parental_consents (student_id, parent_id, consent_method)
  WHERE student_id IS NOT NULL AND consent_revoked = false;

CREATE INDEX IF NOT EXISTS parental_consents_parent_live_idx
  ON parental_consents (parent_id)
  WHERE consent_revoked = false;

-- ── Write-path lockdown ───────────────────────────────────────────
--
-- Why there is deliberately NO INSERT policy added on profiles:
--
-- Every profile row is created by /api/register (and self-healed by
-- finalizeConfirmation) using the service-role client, which bypasses
-- RLS entirely. At insert time the registering user has no session at
-- all, because email confirmation is mandatory before any session
-- exists — so an `auth.uid() = id` INSERT policy could never fire on
-- the real path. Worse, if it ever did fire, it would let a
-- self-registering user choose their own role, parent_id,
-- override_level, and eula_accepted_at.
--
-- REVOKE, rather than simply leaving INSERT ungranted, turns today's
-- failure mode (a request that silently inserts zero rows under RLS,
-- with no error surfaced to explain why registration "succeeded" but
-- no profile exists) into an explicit, loud 42501 permission denied —
-- which is far easier to diagnose if anything ever tries to write to
-- these tables outside the service-role path.

REVOKE INSERT, DELETE ON profiles          FROM anon, authenticated;
REVOKE INSERT, DELETE ON parental_consents FROM anon, authenticated;

-- The inherited "Parents manage consents" FOR ALL policy had no
-- explicit WITH CHECK, so Postgres derived one from USING —
-- (auth.uid() = parent_id) — which let an authenticated parent POST a
-- row with consent_given = true directly to PostgREST, forging their
-- own COPPA consent. Split into read + revoke-only.

DROP POLICY IF EXISTS "Parents manage consents" ON parental_consents;

CREATE POLICY "Parents read own consents"
  ON parental_consents FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Students read own consents"
  ON parental_consents FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Parents revoke own consents"
  ON parental_consents FOR UPDATE
  USING      (auth.uid() = parent_id AND consent_revoked = false)
  WITH CHECK (auth.uid() = parent_id AND consent_revoked = true);

-- ── Freeze privileged profile columns against self-service UPDATE ─
--
-- "Users update own profile" (migration 0001) is
-- FOR UPDATE USING (auth.uid() = id) with no WITH CHECK and no column
-- list, so any authenticated user can PATCH their own row and set
-- role = 'educator', is_under_13 = false, or (after this migration)
-- eula_accepted_at / welcome_email_sent_at directly. This change set
-- makes several of those columns load-bearing for authorization
-- (COPPA gating, email-sent idempotency), so freeze them for every
-- caller except service_role.

CREATE OR REPLACE FUNCTION profiles_guard_privileged_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  claims_role TEXT := COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    ''
  );
BEGIN
  IF claims_role = 'service_role'
     OR current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW.id                      := OLD.id;
  NEW.role                    := OLD.role;
  NEW.email                   := OLD.email;
  NEW.grade                   := OLD.grade;
  NEW.is_under_13             := OLD.is_under_13;
  NEW.parent_id               := OLD.parent_id;
  NEW.educator_id             := OLD.educator_id;
  NEW.override_level          := OLD.override_level;
  NEW.override_set_by         := OLD.override_set_by;
  NEW.registration_flow       := OLD.registration_flow;
  NEW.eula_version            := OLD.eula_version;
  NEW.eula_accepted_at        := OLD.eula_accepted_at;
  NEW.privacy_version         := OLD.privacy_version;
  NEW.privacy_accepted_at     := OLD.privacy_accepted_at;
  NEW.pending_child_first_name := OLD.pending_child_first_name;
  NEW.pending_child_grade     := OLD.pending_child_grade;
  NEW.welcome_email_sent_at   := OLD.welcome_email_sent_at;
  NEW.created_at              := OLD.created_at;
  RETURN NEW;
END;
$$;

-- Postgres fires BEFORE ROW triggers in name order. "profiles_guard_*"
-- sorts before "profiles_set_level" and "profiles_set_under_13"
-- (migration 0001), so the freeze runs first and the derivation
-- triggers then operate on the restored (unchanged) grade.
DROP TRIGGER IF EXISTS profiles_guard_privileged ON profiles;
CREATE TRIGGER profiles_guard_privileged
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION profiles_guard_privileged_columns();

COMMIT;
