# MET and Teddy — Step 4.17: MetTutor Persona Removal & Verification

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC
**Reference:** MetTutor Persona Decommissioning Plan (Step 4.13)

---

## 1. Purpose

This is the final step of the MET and Teddy Implementation Roadmap — Step 57 of 57. It executes the decommissioning plan from Step 4.13, removes the MET and Teddy persona from MetTutor, publishes MetTutor's professional-only positioning, and verifies complete removal.

After this step, MET and Teddy exists exclusively at metandteddy.com. MetTutor operates as a professional-only platform with no K–12 persona.

---

## 2. Pre-Execution Gate

All conditions must be true (from Separation Charter §7.2):

| # | Condition | Evidence | Status |
|---|---|---|---|
| 1 | MET and Teddy deployed to production | metandteddy.com live and serving | |
| 2 | Public access activated | Explorer tier accessible without invitation | |
| 3 | Parent and educator onboarding functional | Test parent + educator account created | |
| 4 | Referral path from MetTutor live | MetTutor displays referral banner | |
| 5 | MET Scientia, LLC approval received | Written approval on file | |

**Gate decision:** All 5 conditions met? → Proceed to §3.

---

## 3. Execution Checklist

Execute the 8-step removal sequence from the Decommissioning Plan (Step 4.13 §4).

### Step 1: Pre-Strip Backup
- [ ] MetTutor codebase tagged `pre-persona-strip` in git
- [ ] MetTutor database snapshot created
- [ ] Asset inventory (Step 4.13 §3) printed and confirmed

### Step 2: Deploy Referral Path
- [ ] Referral banner live on MetTutor landing page
- [ ] Referral banner displays once per session in MetTutor chat
- [ ] Referral in MetTutor footer (permanent)
- [ ] Link to metandteddy.com opens in new tab
- [ ] Link verified — metandteddy.com loads

### Step 3: Remove Prompt Layers
- [ ] MET character persona deleted from system prompt
- [ ] Teddy behavioral engine prompts deleted
- [ ] K–2 level-adaptation layer deleted
- [ ] 3–5 level-adaptation layer deleted
- [ ] 6–8 level-adaptation layer deleted
- [ ] 9–12 level-adaptation layer deleted
- [ ] Grade-band detection logic deleted
- [ ] Teddy body language injection deleted
- [ ] MET humor and encouragement rules deleted
- [ ] Source blending policy (level-gated) deleted
- [ ] Professional assistant persona activated as sole persona
- [ ] **VERIFY:** MetTutor responds as professional assistant, no MET/Teddy character

### Step 4: Remove Content Routing
- [ ] K–12 grade-band content routing removed
- [ ] Explorer/Investigator/Innovator/Metrologist level system removed
- [ ] MET Field Guide retrieval removed from RAG pipeline
- [ ] Standards Bridge module removed
- [ ] Field Mission references removed
- [ ] My Field Notebook references removed
- [ ] Badge system references removed
- [ ] **VERIFY:** MetLibrary direct access functional, no Field Guide retrieval

### Step 5: Remove UI Components
- [ ] MET character avatar/icon removed
- [ ] Teddy character avatar/icon removed
- [ ] MET and Teddy visual assets (images, animations) removed
- [ ] Level indicator badge removed from navigation
- [ ] Grade-band selector removed
- [ ] Character panel component removed
- [ ] MET-styled citation footer (📐) replaced with professional format
- [ ] Age gate / COPPA consent flow removed
- [ ] Parent/educator dashboard removed
- [ ] **VERIFY:** Visual audit — no MET or Teddy elements on any page

### Step 6: Remove Branding
- [ ] "MET Universe" removed from footer and about page
- [ ] MET and Teddy taglines removed
- [ ] Teal/amber palette replaced with professional palette
- [ ] Character animation CSS removed
- [ ] Level-specific color tokens removed
- [ ] **VERIFY:** No MET and Teddy brand elements on any surface

### Step 7: Update Positioning
- [ ] Homepage: "MetTutor — Professional Measurement Science for Practitioners"
- [ ] Description updated to professional-only positioning
- [ ] Feature list reflects professional modes only
- [ ] Footer: "MetTutor — Professional Measurement Science · Powered by MetLibrary"
- [ ] K–12 referral notice deployed
- [ ] Metadata and SEO descriptions updated
- [ ] **VERIFY:** All public-facing text reflects professional positioning

### Step 8: Post-Strip Verification
- [ ] Definition of Done (§4) — all 17 items checked
- [ ] Referral path confirmed live
- [ ] 48-hour error monitoring — no new errors introduced
- [ ] MetTutor professional responses verified (5 test queries)

---

## 4. Definition of Done

| # | Check | Status |
|---|---|---|
| 1 | No MET character persona in any prompt layer | |
| 2 | No Teddy behavioral logic in any module | |
| 3 | No K–12 level-adaptation layers | |
| 4 | No grade-band routing or detection | |
| 5 | No MET or Teddy visual assets in the UI | |
| 6 | No "MET Universe" branding on any surface | |
| 7 | No MET and Teddy taglines in any copy | |
| 8 | No teal/amber palette elements | |
| 9 | No age gate, COPPA consent, or parent dashboard | |
| 10 | No MET Field Guide retrieval in the RAG pipeline | |
| 11 | No Standards Bridge module | |
| 12 | MetLibrary direct access fully functional | |
| 13 | Professional assistant persona active and responding | |
| 14 | Professional citation format in chat messages | |
| 15 | Referral banner to metandteddy.com displayed | |
| 16 | Repositioning copy live on all surfaces | |
| 17 | No 5xx errors for 48 hours post-strip | |

**All 17 items verified?** → Persona removal complete.

---

## 5. Referral Path Confirmation

| Check | Status |
|---|---|
| MetTutor landing page banner links to metandteddy.com | |
| MetTutor chat banner (one per session, dismissible) links to metandteddy.com | |
| MetTutor footer referral (permanent) links to metandteddy.com | |
| metandteddy.com loads and is functional when accessed from referral | |
| Referral text reads: "Looking for measurement science for K–12 students? Visit MET and Teddy — where measurement comes alive. metandteddy.com" | |

---

## 6. Post-Removal Monitoring

| Day | Check |
|---|---|
| D+1 | Error rate stable, MetTutor professional responses verified, referral links working |
| D+3 | User feedback reviewed, no complaints about missing features |
| D+7 | Week 1 review: MetTutor usage stable, metandteddy.com referral traffic measured |
| D+14 | Confirm no residual MET/Teddy references found by users |
| D+30 | Rollback window closes — backup tag archived, strip is permanent |

---

## 7. Verification Report

### 7.1 Execution Summary

| Item | Value |
|---|---|
| Execution date | |
| Executed by | |
| Backup tag | `pre-persona-strip` |
| Removal steps completed | /8 |
| Definition of Done items passed | /17 |
| Referral path checks passed | /5 |
| Post-strip errors (48h) | |

### 7.2 MetTutor Professional Verification (5 Test Queries)

| # | Query | Professional response? | No MET/Teddy character? | MetLibrary citation? |
|---|---|---|---|---|
| 1 | "Explain Type A and Type B uncertainty" | | | |
| 2 | "ISO 17025 §6.5 traceability requirements" | | | |
| 3 | "Welch-Satterthwaite formula" | | | |
| 4 | "ASQ CCT exam preparation: calibration intervals" | | | |
| 5 | "Z540.3 false accept risk and guard banding" | | | |

### 7.3 Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| MET Scientia, LLC — Owner | | | |
| MetTutor — Product Lead | | | |

---

## 8. Roadmap Completion — All 57 Steps

### Phase 1 — Knowledge Base Foundation (11 steps) ✓

Steps 1.1–1.11: Infrastructure, MetLibrary access, schema, Tier 1 content (concepts, missions, vocabulary, character patterns, Standards Bridge), embedding pipeline, dual-source retrieval validation, Phase 1 sign-off.

### Phase 2 — AI Engine & Persona (14 steps) ✓

Steps 2.1–2.14: Base system prompt, level-adaptation layers, level detection and routing, Teddy behavioral engine, dual-source RAG, source blending and mediation policy, notebook awareness, badge awareness, content adaptation pipeline, Tier 2 content (industry, careers, stories), AI response validation, Phase 2 sign-off.

### Phase 3 — Application & Features (15 steps) ✓

Steps 3.1–3.15: Frontend architecture, character rendering, COPPA auth, onboarding, chat interface, Field Missions, Field Notebook (core + AI integration), badge engine, badge UI, badge-notebook integration, Open Badges 3.0, parent/educator dashboard, integration testing, Phase 3 sign-off.

### Phase 4 — App Development, Content Expansion & Launch (17 steps) ✓

Steps 4.1–4.17: Separation charter, MET Universe shell, production infrastructure, brand identity, distribution packaging, Tier 2 completion (industry, innovation, careers), Tier 3 pipeline and population, beta program, adaptation refinement, MetTutor decommissioning plan, content operations, pre-launch QA, production launch, MetTutor persona removal.

### Final Counts

| Metric | Count |
|---|---|
| Total roadmap steps | 57 |
| Phases completed | 4 of 4 |
| App routes | 12 |
| React components | 35 |
| AI engine modules | 18 |
| Database tables | 12 |
| Database migrations | 3 |
| Content entries | 88 |
| Content variants | 352 |
| Embedded chunks | 1,000 |
| Badge definitions | 21 |
| Automated tests | 151 |
| Documentation files | 15 |
| Seed files | 23 |
| Industry sectors covered | 10 |
| Career tracks covered | 6 (+5 industry variants) |
| Innovation stories | 14 |
| Tier 3 curated sources | 6 |

---

## 9. Final Statement

MET and Teddy is a standalone, independently operated application living in MET Universe at metandteddy.com. It serves K–12 students (ages 5–18), their parents, and their educators with AI-powered measurement science education grounded in real standards.

MetTutor is a professional-only platform serving college students and working practitioners with direct, unmediated MetLibrary access.

The two applications share no accounts, no credentials, no sessions, no data, no infrastructure, no brand identity, and no persona. They share a lineage in measurement science and, through separate arrangements with the Metrology Institute, access to MetLibrary — a shared library, not a shared product.

Every measurement tells a story. MET and Teddy is ready to help K–12 students discover theirs.

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*

*"Where every question becomes a quest, and every quest is grounded in science."*
