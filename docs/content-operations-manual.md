# MET Field Guide — Content Operations Manual

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Purpose

This manual defines the ongoing content operations for the MET Field Guide — the knowledge base that powers MET and Teddy. It covers update cadences for all three content tiers, the editorial calendar, the curation schedule, pipeline SLAs, quality review procedures, Standards Bridge reconciliation, monitoring, and team roles.

---

## 2. Content Architecture Summary

| Tier | What It Contains | Source | Update Driver |
|---|---|---|---|
| Tier 1 | Core measurement concepts, Field Missions, vocabulary, character patterns | MET Scientia original content | Standards revisions, pedagogy improvements |
| Tier 2 | Industry applications, career pathways, innovation stories | MET Scientia original content | New industries, emerging tech, career market changes |
| Tier 3 | NIST publications, NCSLI practices, industry articles, STEM resources | Curated external content | New publications, curriculum changes |
| Standards Bridge | Mappings from MET Field Guide concepts to MetLibrary standards | MET Scientia maintained | MetLibrary content revisions |
| MetLibrary | Professional standards content (VIM, GUM, ISO 17025, etc.) | Metrology Institute (federated) | Metrology Institute revision schedule |

---

## 3. Update Cadences

### 3.1 Tier 1 — Core Content

| Trigger | Action | Cadence |
|---|---|---|
| Standards revision (VIM, GUM, ISO 17025) | Review all affected concepts, update all four level variants, re-embed | Within 90 days of publication |
| Pedagogy improvement (beta feedback, educator input) | Revise affected level variants | Quarterly review cycle |
| New Field Mission | Author, review, adapt × 4 levels, embed | As developed |
| Vocabulary addition | Add term, adapt × 4 levels, embed | As needed |

### 3.2 Tier 2 — Applications Content

| Content Type | Update Cadence | Volume Target |
|---|---|---|
| Industry applications | Quarterly — add 2–3 new narratives or update existing | 8–12 new entries/year |
| Career pathways | Annually — review all profiles against current job market | Update cycle each August |
| Innovation stories | Quarterly — add 1–2 stories tracking emerging measurement tech | 4–8 new entries/year |
| Measurement Matters (case studies) | As events occur — new measurement stories in the news | 4–6 new entries/year |

### 3.3 Tier 3 — Curated Content

| Source Category | Monitoring Frequency | Curation Target |
|---|---|---|
| NIST publications | Monthly (NIST publication feed) | 4–6 entries/quarter |
| NCSLI recommended practices | Quarterly (NCSLI newsletter) | 2–3 entries/quarter |
| Industry articles | Monthly (journal alerts) | 3–4 entries/quarter |
| STEM education resources | Quarterly (NGSS updates, curriculum reviews) | 2–3 entries/quarter |

---

## 4. Editorial Calendar

### 4.1 Annual Cycle

| Month | Focus | Deliverables |
|---|---|---|
| January | Annual content audit — review all Tier 1 for accuracy | Audit report, revision list |
| February | Tier 1 revisions from audit | Updated concepts, re-embedded |
| March | Tier 2 industry expansion — Q1 batch | 2–3 new industry entries |
| April | Tier 3 curation — Q1 batch | 10–15 new curated entries |
| May | World Metrology Day content (May 20) | Special content, social media, newsletter |
| June | Career pathway annual review | Updated career profiles |
| July | Tier 2 innovation stories — mid-year batch | 2–3 new innovation entries |
| August | Back-to-school content — educator resources | NGSS alignment update, mission refreshes |
| September | Tier 3 curation — Q3 batch | 10–15 new curated entries |
| October | Tier 2 industry expansion — Q3 batch | 2–3 new industry entries |
| November | Standards Bridge reconciliation (annual) | Full bridge validation |
| December | Year-end content metrics report | Dashboard review, next-year planning |

### 4.2 Weekly Rhythm

| Day | Activity |
|---|---|
| Monday | Content pipeline review — what's in draft, review, or ready to publish |
| Wednesday | Editorial review session — review 2–3 entries |
| Friday | Publish approved content — import + embed |

---

## 5. Pipeline SLAs

| Stage | SLA | Escalation |
|---|---|---|
| Source identification to relevance assessment | 3 business days | Content lead |
| Content extraction and adaptation | 5 business days | Content lead |
| Technical review (Reviewer 1) | 3 business days | Content lead |
| Level-appropriateness review (Reviewer 2) | 3 business days | Content lead |
| Review comment resolution | 2 business days | Author |
| Import and embedding | 1 business day | Technical lead |
| End-to-end (source to published) | 14 business days | Content lead |

### 5.1 Expedited Pipeline

For urgent content (standards revision, safety-critical correction):

| Stage | SLA |
|---|---|
| End-to-end | 3 business days |
| Reviews | Same-day |
| Import and embedding | Same-day |

---

## 6. Quality Review Procedures

### 6.1 Two-Reviewer Model

Every content entry requires two independent reviews before publication:

**Reviewer 1 — Technical Accuracy:**
- Facts consistent with current standards
- No contradiction with VIM, GUM, or ISO 17025
- Units correct, numerical examples accurate
- Source attribution complete
- Standards references current (not superseded)

**Reviewer 2 — Level Appropriateness:**
- Vocabulary matches level ceiling
- Sentence complexity appropriate for age range
- Examples relatable for the grade band
- Each level variant stands alone
- Mediation guard would pass (Explorer–Innovator)

### 6.2 Review Outcomes

| Outcome | Action |
|---|---|
| Both reviewers approve | Proceed to import |
| One reviewer requests changes | Author revises, re-submit to requesting reviewer |
| Both reviewers request changes | Author revises, re-submit to both |
| Technical accuracy concern | Escalate to content lead — do not publish until resolved |

### 6.3 Reviewer Pool

Maintain a minimum of 3 qualified reviewers:
- At least 1 with metrology/calibration professional background (technical review)
- At least 1 with K–12 education background (level review)
- Cross-training so each reviewer can cover both roles if needed

---

## 7. Standards Bridge Reconciliation

### 7.1 What It Is

The Standards Bridge maps MET Field Guide concepts to MetLibrary standards content. When MetLibrary content is revised (standards updated, new editions published), the bridge mappings must be re-validated to ensure they still resolve correctly.

### 7.2 Reconciliation Process

```
MetLibrary revision notification received
  → Identify affected Standards Bridge entries
  → For each affected entry:
    → Verify the cited clause still exists and says what we mapped
    → Verify the adaptation at each level still accurately reflects the source
    → Update citations if clause numbers changed
    → Update adaptations if substance changed
  → Re-run bridge validation: npx tsx scripts/validateBridge.ts
  → Re-embed affected chunks
  → Document changes in reconciliation log
```

### 7.3 Reconciliation Cadence

| Trigger | Action |
|---|---|
| MetLibrary revision notification | Reconcile affected entries within 30 days |
| Annual reconciliation (November) | Full bridge validation regardless of notifications |
| New Standards Bridge entry added | Validate immediately as part of the authoring process |

### 7.4 Reconciliation Log

| Date | Standard Revised | Entries Affected | Changes Made | Validated By |
|---|---|---|---|---|
| | | | | |

---

## 8. Content Health Monitoring

### 8.1 Dashboard Metrics

Track monthly:

| Metric | Target | Source |
|---|---|---|
| Total entries (Tier 1 + 2 + 3) | Growing quarterly | Database count |
| Total embedded chunks | Matches entry count × variants | Database count |
| Entries per level (balance check) | Within 20% across all four levels | Database query |
| Content freshness (avg age of entries) | < 18 months average | Created/updated timestamps |
| Stale entries (> 24 months without update) | < 10% of total | Updated timestamp |
| Standards Bridge entries | Growing with content | Database count |
| Bridge validation pass rate | 100% | validateBridge.ts |
| Import pipeline errors (last 30 days) | 0 | Import logs |
| Embedding failures (last 30 days) | 0 | Embed logs |
| Retrieval relevance (sampled queries) | ≥ 0.7 cosine similarity | Quarterly test queries |

### 8.2 Quarterly Health Check

Run every quarter:

1. `npx tsx scripts/importContent.ts` — verify all seed files import cleanly
2. `npx tsx scripts/embedContent.ts` — verify all chunks embedded
3. `npx tsx scripts/validateBridge.ts` — verify all bridge entries resolve
4. `npx tsx scripts/testQueries.ts` — verify retrieval relevance at each level
5. Review the dashboard metrics
6. Produce a one-page content health report

---

## 9. Team Roles

| Role | Responsibilities | Headcount |
|---|---|---|
| Content Lead | Editorial calendar, pipeline management, quality oversight, metrics reporting | 1 |
| Content Author | Tier 1/2 authoring, four-level adaptation, Standards Bridge entries | 1–2 |
| Content Curator | Tier 3 source identification, extraction, adaptation | 1 |
| Technical Reviewer | Accuracy review per §6.1 | 1 (can be part-time or shared) |
| Level Reviewer | Age-appropriateness review per §6.1 | 1 (can be part-time or shared) |
| Technical Lead | Import/embed pipeline, retrieval health, bridge validation | 1 (shared with engineering) |

### 9.1 Minimum Viable Team

For initial operations post-launch:

- 1 person covering Content Lead + Author + Curator
- 1 person covering Technical Reviewer (part-time, from metrology background)
- 1 person covering Level Reviewer (part-time, from education background)
- Technical Lead shared with engineering team

---

## 10. Content Governance

### 10.1 Content Ownership

All MET Field Guide content (Tier 1, 2, 3) is owned by MET Scientia, LLC. Tier 3 content carries source attribution but the adaptation is original work.

### 10.2 Content Removal

Content may be removed if:
- A factual error is discovered that cannot be corrected
- A source revokes permission (Tier 3)
- A standard is withdrawn without replacement
- Content is superseded by a better entry

Removal process: mark entry as inactive in database, remove from embedding index, document in the removal log.

### 10.3 Version Control

All seed files are version-controlled in the MET-FieldGuide git repository. Every content change is a git commit with a descriptive message. The repository is the source of truth — the database can be rebuilt from seed files at any time.

---

*MET Field Guide · MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
