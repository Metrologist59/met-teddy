# Content Adaptation Pipeline
# Version: 1.0.0 · August 2026
# © 2026 MET Scientia, LLC · In Support of the Metrology Institute
#
# Defines how technical content from MetLibrary is adapted into the MET
# Field Guide at four certification levels. This is the production
# content operations process — not a one-time build activity.
#
# Source: Implementation Roadmap Step 2.9

## 1. Purpose

The MET Field Guide needs two kinds of content:

- **Pre-adapted** — high-frequency concepts written at all four levels,
  reviewed, embedded, and indexed. These serve the majority of student
  queries with low latency and high quality.

- **Runtime-federated** — long-tail technical queries resolved live
  against MetLibrary via the Standards Bridge. These cover the breadth
  of the standards corpus without requiring every clause to be
  pre-adapted.

The content adaptation pipeline handles the first kind. It is the
structured process that turns a MetLibrary concept into four
grade-band-appropriate MET Field Guide entries.

## 2. Pipeline Stages

```
MetLibrary Concept
  → Identify (high-frequency or gap analysis)
  → Extract (pull formal definition and context from MetLibrary)
  → Adapt (write four level variants)
  → Review (metrologist + educator)
  → Package (JSON seed file with full metadata)
  → Validate (npm run validate:content)
  → Import (npm run import)
  → Embed (npm run embed)
  → Bind (Standards Bridge entry with 4 band adaptations)
  → Verify (retrieval test at all 4 levels)
```

## 3. Stage Details

### 3.1 Identify

Sources for new content:
- **Query logs** — questions students ask that return low-relevance
  results indicate a gap in pre-adapted content.
- **Standards Bridge gaps** — concepts referenced in the bridge with
  no corresponding Field Guide entry.
- **Curriculum alignment** — NGSS or state standards that require
  measurement concepts not yet covered.
- **Tier 2/3 expansion** — industry applications, career pathways,
  and case studies that need foundational concept support.

Decision criteria: pre-adapt vs. runtime-federate:

| Pre-adapt when... | Runtime-federate when... |
|---|---|
| The concept is asked about frequently (>5 queries/week) | The concept is niche or advanced (rare queries) |
| The concept requires significant pedagogical framing | The formal definition is sufficient at the student's level |
| The concept spans multiple domains or missions | The concept is domain-specific with narrow application |
| A Tier 1 concept — every student encounters it | A Tier 3 concept — only advanced students encounter it |

### 3.2 Extract

Pull from MetLibrary:
- Formal definition (VIM, GUM, ISO 17025, Z540.3, or CCT BoK)
- Related clauses and cross-references
- The standards context (what problem the clause solves)
- Any existing MetTutor explanations (for migration, not copying)

**Never copy MetLibrary text into the Field Guide.** The Field Guide
contains MET Scientia-authored content. MetLibrary text is the source
of truth MET explains FROM, not content MET copies INTO the database.

### 3.3 Adapt

Write four level variants following the Phase 1 content patterns:

| Level | Tone | Technical Depth | Length |
|---|---|---|---|
| Explorer (K–2) | Sensory, concrete, Teddy-centered | Conceptual | 120–170 words |
| Investigator (3–5) | Structured, step-by-step | Procedural | 190–230 words |
| Innovator (6–8) | Definitional, quantitative | Analytical | 220–280 words |
| Metrologist (9–12) | Professional, standards-referenced | GUM/VIM-level | 240–300 words |

Each variant must include:
- `body` — the main explanation
- `summary` — 1–2 sentence distillation
- `keyVocabulary` — terms used at this level (4–12 terms)
- Correct `gradeBand`, `certLevel`, `technicalDepth`, `sourceKb`

Use the scaffolding tool to generate the JSON template:
```
cd C:\Projects\MET-FieldGuide
npx tsx scripts/scaffoldConcept.ts --slug thermal-emf --domain electrical --title "Thermal EMF"
```

### 3.4 Review

**Two reviewers required:**

| Reviewer | Checks | Qualified By |
|---|---|---|
| Metrologist | Scientific accuracy, correct standards references, VIM/GUM alignment, terminology consistency | Working metrologist or ASQ CCT holder |
| Educator | Age-appropriateness, vocabulary level, Teddy usage, clarity for the target grade band | K–12 educator or curriculum specialist |

**Quality gates (all must pass):**

1. Every factual claim traces to a source in MetLibrary or a published standard.
2. No VIM/GUM/ISO clause text appears verbatim in Explorer or Investigator variants.
3. Metrologist variant cites the formal VIM/GUM definition accurately.
4. Explorer variant is readable by a second-grader (no jargon without immediate definition).
5. All four variants are scientifically consistent — they say the same true thing at different depths.
6. The concept connects to at least one existing Field Mission or vocabulary term.
7. Metadata passes `npm run validate:content` with zero errors.

**Review record format:**

```
Concept: [slug]
Reviewed by: [name] ([role: metrologist/educator])
Date: [YYYY-MM-DD]
Result: [PASS / REVISE]
Notes: [specific feedback per variant if REVISE]
```

### 3.5 Package

The seed file follows the Phase 1 JSON schema. Use `scaffoldConcept.ts`
to generate the template, fill in the content, and save to
`C:\Projects\MET-FieldGuide\seed\`.

Required metadata fields:
- `slug` — unique kebab-case identifier
- `title` — display name
- `contentTier` — tier_1, tier_2, or tier_3
- `domain` — one of the 9 measurement domains
- `narrativeType` — concept, experiment, case_study, career_profile, etc.
- `standardsBridgeRefs` — array of bridge entry IDs

### 3.6 Validate, Import, Embed

```
cd C:\Projects\MET-FieldGuide
npm run validate:content    # metadata checks
npm run bridge:validate     # bridge completeness
npm run import              # insert into database + chunk
npm run embed               # generate embeddings
```

All four commands must complete with zero errors.

### 3.7 Bind

Create or update the Standards Bridge entry:
- `bridge_entries` row with source_standard, source_clause, citation_text
- 4 `band_adaptations` rows (one per grade band)

If the bridge entry already exists (from Phase 1), verify the
`conceptSlugs` array in the seed file references it correctly.

### 3.8 Verify

Run the retrieval test at all 4 levels to confirm the new content
surfaces correctly:

```
npm run test:queries
```

If the new concept does not appear in the top 5 results for a
relevant query at the expected level, investigate the embedding
quality and chunk labels.

## 4. Ongoing Operations

### Content cadence

| Tier | Frequency | Volume |
|---|---|---|
| Tier 1 (concepts, missions, vocab) | As gaps are identified | 2–5 new concepts per month |
| Tier 2 (applications, careers, cases) | Quarterly batches | 10–20 entries per quarter |
| Tier 3 (curated external) | Ongoing curation | As discovered |

### Versioning

Content versions follow the database `review_status` field:
- `draft` — authored, not yet reviewed
- `in_review` — submitted for review
- `published` — reviewed and approved, visible to students
- `archived` — superseded by a newer version

### Retirement

When a standard is revised (e.g., VIM 4th edition), affected content
must be reviewed and updated. The Standards Bridge `resolution_status`
field tracks this: `resolved` → `stale` when the source changes,
triggering a content review.

## 5. Tools Reference

| Tool | Location | Purpose |
|---|---|---|
| `scaffoldConcept.ts` | `MET-FieldGuide/scripts/` | Generate blank seed JSON template |
| `validateContent.ts` | `MET-FieldGuide/scripts/` | Validate metadata compliance |
| `validateBridge.ts` | `MET-FieldGuide/scripts/` | Validate bridge completeness |
| `importContent.ts` | `MET-FieldGuide/scripts/` | Import seed files into database |
| `embedContent.ts` | `MET-FieldGuide/scripts/` | Generate and store embeddings |
| `testQueries.ts` | `MET-FieldGuide/scripts/` | Verify retrieval quality |
