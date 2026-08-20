# MET and Teddy — Level-Adaptation Refinement Playbook

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Purpose

This playbook guides the refinement of level-adaptation parameters based on beta testing data. Every tunable parameter is listed with its location, baseline value, how to diagnose a problem, and how to fix it.

---

## 2. Refinement Workflow

```
Beta data collected
  → Run: npx tsx scripts/analyzeBeta.ts beta-data.json
  → Review per-level metrics and recommendations
  → Update parameters in tuning.ts (REFINED profiles)
  → Set ACTIVE_PROFILE = "refined"
  → Re-run AI response validation: npx tsx scripts/testAIResponses.ts
  → Compare before-and-after metrics
  → Deploy refined configuration
```

---

## 3. Tunable Parameters

### 3.1 Blend Ratios

**What:** Proportion of MET Field Guide vs MetLibrary content in retrieval results.

**Where:** `src/lib/levels/tuning.ts` → `BLEND_REFINED`

| Level | Baseline | Tune If... |
|---|---|---|
| Explorer | 95/5 | Students ask standards questions and get no grounded answer |
| Investigator | 85/15 | Content feels too informal or too technical |
| Innovator | 60/40 | Students confused by standards references, or not getting enough |
| Metrologist | 40/60 | Responses lack professional depth, or too much jargon |

**How to adjust:** Change `fieldGuideWeight` and `metLibraryWeight` (must sum to 1.0). Adjust `maxMetLibraryChunks` if responses include too many or too few standards references.

### 3.2 Response Length

**What:** Target word count per response.

**Where:** `src/lib/levels/tuning.ts` → `RESPONSE_REFINED`

| Level | Baseline | Tune If... |
|---|---|---|
| Explorer | 150 words | Responses too long for attention span, or too short to explain |
| Investigator | 250 words | Students lose interest before the end |
| Innovator | 400 words | Not enough depth, or too much for a single response |
| Metrologist | 500 words | Professional users want more or less detail |

**How to adjust:** Change `maxResponseWords`. Also update the level-adaptation prompt in `src/agents/metAndTeddy/prompts.ts` to match.

### 3.3 Vocabulary Ceiling

**What:** How technical the language can be.

**Where:** `src/lib/levels/tuning.ts` → `RESPONSE_REFINED` + `src/agents/metAndTeddy/prompts.ts`

| Level | Baseline | Tune If... |
|---|---|---|
| Explorer | common | Students confused by any word, or bored by simplicity |
| Investigator | introduce_terms | Terms introduced without definition, or too many definitions slow the response |
| Innovator | technical | Students don't understand technical terms, or terms are under-explained |
| Metrologist | professional | Too casual for professional preparation, or inaccessible to grade 9 |

**How to adjust:** Change `vocabularyCeiling` in tuning.ts AND update the vocabulary guidance in the level-adaptation prompt.

### 3.4 Teddy Prominence

**What:** How often Teddy appears and what he does.

**Where:** `src/lib/levels/tuning.ts` → `TEDDY_REFINED` + `src/components/characters/types.ts` → `PROMINENCE_BY_LEVEL`

| Level | Baseline Rate | Tune If... |
|---|---|---|
| Explorer | 90% | Students love/hate Teddy (adjust up/down) |
| Investigator | 70% | Teddy feels forced or missing |
| Innovator | 30% | Students still want Teddy, or find him distracting |
| Metrologist | 10% | Students want zero Teddy, or occasional Teddy is welcomed |

**How to adjust:** Change `appearanceRate` in tuning.ts AND `teddyScale`/`teddyPosition` in `PROMINENCE_BY_LEVEL`.

### 3.5 Humor Density

**What:** How often MET uses humor, puns, or playful language.

**Where:** `src/lib/levels/tuning.ts` → `RESPONSE_REFINED`

| Level | Baseline | Tune If... |
|---|---|---|
| Explorer | 0.7 | Too silly or not fun enough |
| Investigator | 0.5 | Humor feels forced at this age |
| Innovator | 0.3 | Students want more personality, or find it immature |
| Metrologist | 0.1 | Any humor is unwelcome, or dry wit is appreciated |

**How to adjust:** Change `humorDensity`. Also update the humor guidance in the level-adaptation prompt.

### 3.6 Citation Format

**What:** How much standards citation detail appears.

**Where:** `src/lib/levels/tuning.ts` → `CITATION_REFINED`

| Level | Baseline | Tune If... |
|---|---|---|
| Explorer | Footer only, no standard name | Students/parents confused by the footer |
| Investigator | Footer with standard name | Standard name is confusing or helpful |
| Innovator | Expandable clause view | Students don't click it, or find it valuable |
| Metrologist | Full detailed clause view | Not enough detail, or too much clutter |

**How to adjust:** Change `CitationConfig` fields in tuning.ts AND the citation format instructions in `src/lib/retrieval/context.ts`.

---

## 4. Before-and-After Comparison

After applying refinements:

1. Run: `npx tsx scripts/testAIResponses.ts` — must still pass all 11 tests
2. Run: `npx tsx tests/integration.ts` — must still pass all 63 tests
3. Compare the analysis report metrics between baseline and refined
4. Document changes in the table below

| Parameter | Level | Baseline | Refined | Reason |
|---|---|---|---|---|
| | | | | |

---

## 5. Rollback

If refined parameters produce worse results:

1. Set `ACTIVE_PROFILE = "baseline"` in `src/lib/levels/tuning.ts`
2. Restart the application
3. All parameters revert to pre-beta values immediately

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
