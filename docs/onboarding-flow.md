# MET and Teddy — Onboarding Flow Specification
# Version: 1.0.0 · August 2026
# © 2026 MET Scientia, LLC
#
# Phase 2 deliverable. Phase 3 (Step 3.4) builds the UI from this spec.

## Overview

Onboarding determines the student's certification level and creates
their account. The flow differs by age: Explorer and Investigator
accounts (under 13) require parent/educator-led onboarding per COPPA.

## Flow Variants

### Variant A — Parent-Led (Explorer & Investigator, ages 5–10)

1. PARENT enters their own email and creates a parent account.
2. PARENT provides the child's first name (no last name required for
   COPPA compliance) and grade (K through 5).
3. SYSTEM maps grade to band → band to certification level:
   - Grades K–2 → Explorer
   - Grades 3–5 → Investigator
4. PARENT may override the level ±1 from the dashboard at any time
   (gifted programs, intervention settings, mixed-grade classrooms).
5. PARENT gives verifiable parental consent (COPPA mechanism — Phase 3
   defines the specific method: email confirmation, payment card, etc.).
6. SYSTEM creates the student account linked to the parent account.
7. MET delivers the level-appropriate welcome:
   - Explorer: Teddy-centered, visual, sensory. "Teddy found a
     ruler! Want to measure him?"
   - Investigator: MET sets up the first task. "Here's your Field
     Notebook — let's start with a measurement."
8. SYSTEM creates the student's My Field Notebook.
9. SYSTEM recommends the first Field Mission for the assigned level.

### Variant B — Educator-Led (any level, school deployment)

1. EDUCATOR creates an educator account through school district
   agreement (COPPA handled by the district agreement, not individual
   parental consent).
2. EDUCATOR adds students by first name and grade.
3. SYSTEM maps grades to levels (same as Variant A).
4. EDUCATOR may override any student's level from the dashboard.
5. Students log in with educator-provisioned credentials.
6. MET welcome and first mission recommendation (same as Variant A).

### Variant C — Self-Led (Innovator & Metrologist, ages 11–18)

1. STUDENT enters email and creates an account.
   - Ages 11–12: may still require parental consent depending on
     jurisdiction. The system applies COPPA when the student
     indicates an age under 13.
2. STUDENT selects their grade (6 through 12).
3. SYSTEM maps grade to band → certification level:
   - Grades 6–8 → Innovator
   - Grades 9–12 → Metrologist
4. MET delivers the level-appropriate welcome:
   - Innovator: MET as instructor, Teddy selective. "Welcome to
     measurement science at the next level. Let's talk about
     uncertainty."
   - Metrologist: MET as primary voice, Teddy minimal. "You're
     training as a metrologist. Let's start with how calibration
     connects to traceability."
5. SYSTEM creates My Field Notebook and recommends first mission.

## Level Assignment Rules

| Rule | Implementation |
|---|---|
| Default mapping | Grade → band → level (automatic) |
| Override | Parent/educator sets from dashboard (any level) |
| Flex | Student earns by demonstrated competency (±1 from default) |
| Advancement | Requires completed Field Missions with notebook entries |
| Language | Never "behind" or "below grade level" — always "where the adventure is" |
| Multi-level | Siblings see the same mission at their own depth |

## Level Transition Rules

| Scenario | Behavior |
|---|---|
| Student asks a question above their level | MET answers at the student's current level but notes the concept exists at a deeper level. "That's a great question — there's more to explore here as you advance." Does NOT load the higher-level adaptation layer. |
| Student consistently demonstrates above-level understanding | MET does NOT auto-promote. Flags to parent/educator dashboard: "Your student may be ready for the next level." Override remains manual. |
| Parent/educator raises the level | Takes effect on the next session. MET acknowledges naturally: "New adventures ahead!" Does NOT comment on the change being a promotion. |
| Parent/educator lowers the level | Takes effect on the next session. MET does NOT acknowledge the change at all — no comment, no explanation. The student simply sees content at their new level. |
| Student returns after a break | Level persists. MET references where they left off: "Last time we measured..." |

## Session-Level Routing

The routing system (src/lib/levels/routing.ts) produces a SessionConfig
that drives every downstream decision:

```
StudentProfile → detectLevel() → routeSession() → SessionConfig
```

SessionConfig includes:
- certLevel, gradeBand (which adaptation layer and retrieval filter)
- teddyProminence, metProminence (character behavior)
- retrievalBlend (MET Field Guide vs MetLibrary weight)
- citationFormat (footer_only → full_professional)
- safetyLevel (adult_copilot → lab_supervision)

The chat endpoint calls routeSession() once per request. The
SessionConfig flows into:
- graph.ts → selects the level-adaptation prompt layer
- dualSource.ts → sets retrieval blend weights
- context.ts → sets citation format in the context builder

## Data Model (Phase 3)

The student profile for level detection lives in the application
database (NOT the MET Field Guide database — that is content only):

```
students:
  id, parent_id, first_name, grade, grade_band, cert_level,
  override_level, override_set_by, flex_level, flex_earned_at,
  onboarded_at, last_session_at
```

Phase 2 uses the API-provided gradeBand and optional overrides.
Phase 3 persists this in the database with full account management.
