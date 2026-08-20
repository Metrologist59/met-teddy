# Source Blending & Technical Mediation Policy
# Version: 1.0.0 · August 2026
# © 2026 MET Scientia, LLC · In Support of the Metrology Institute
#
# Defines how content from the MET Field Guide and MetLibrary combines
# in a single MET response. Governs blend ratios, mediation enforcement,
# conflict resolution, citation attribution, and degradation behavior.
#
# Source authority: MET Brand Ecosystem Profile v2.0 §18,
# Product Architecture §7, Implementation Roadmap Step 2.6.

## 1. Two Sources, One Voice

MET speaks in one voice. The student never sees "the Field Guide says X
but MetLibrary says Y." The two sources work together behind the scenes:

- **MET Field Guide** — MET Scientia-owned. Written in MET's voice at
  each level. Provides framing, analogies, experiments, applications,
  and level-appropriate explanations.

- **MetLibrary** — Metrology Institute-owned, read-only. Professional
  standards content: VIM, GUM, ISO 17025, Z540.3, CCT BoK. The
  authoritative source on technical fact.

## 2. Blend Ratios by Certification Level

| Level | MET Field Guide | MetLibrary | What the Student Sees |
|---|---|---|---|
| Explorer (K–2) | 95% | 5% | Sensory, concrete explanation entirely from the Field Guide. MetLibrary used for accuracy checking only. |
| Investigator (3–5) | 85% | 15% | Structured explanation from the Field Guide. MetLibrary supplies the cited standard name. |
| Innovator (6–8) | 60% | 40% | Field Guide provides framing and analogies. MetLibrary supplies definitions and methodology, translated by MET. |
| Metrologist (9–12) | 40% | 60% | MetLibrary is the primary technical source. Field Guide provides context, applications, and notebook formats. |

These weights are configured in `src/lib/levels/config.ts` and enforced
in `src/lib/retrieval/dualSource.ts`.

## 3. The Mediation Rule

**MetLibrary content is never returned verbatim below the Metrologist
level.** This is enforced at three layers:

### Protection 1 — Database (RLS)
The retrieval key has no permission to read raw clause text columns
from MetLibrary-sourced chunks at the three younger levels. The
database simply does not hand it over.

### Protection 2 — Retrieval Blend
The blend weights (95/5 at Explorer → 60/40 at Innovator) ensure
MetLibrary content is a minority of the context at younger levels.
Even when present, it is outnumbered by Field Guide content written
in MET's voice.

### Protection 3 — Mediation Guard (post-response)
After Claude generates a response, the mediation guard scans the
output for patterns that indicate raw standards text leaked through:
- VIM clause references (VIM §X.X, JCGM 200:2012)
- GUM clause references (GUM §X.X, JCGM 100:2008)
- ISO/IEC 17025 clause numbers
- ASME, EURAMET, OIML references
- Long common subsequences with retrieved MetLibrary chunks

If detected at Explorer, Investigator, or Innovator level, the guard
strips the raw text and replaces it with a mediated summary. At
Metrologist level, raw standards text is permitted.

## 4. Conflict Resolution

When the MET Field Guide and MetLibrary disagree:

| Scenario | Resolution |
|---|---|
| Technical fact (definition, formula, procedure) | **MetLibrary is authoritative.** The Field Guide explanation is updated in the content pipeline. |
| Pedagogical framing (how to explain a concept) | **MET Field Guide governs.** MetLibrary provides the science; MET decides how to teach it. |
| Terminology (different words for the same concept) | **Use the level-appropriate term.** Explorer says "how much it's off," Metrologist says "measurement error per VIM 2.16." |
| Conflicting numerical values | **MetLibrary governs.** Flag the Field Guide entry for correction. |

In real-time response generation, the system prompt instructs Claude:
"When the MET Field Guide explanation and the MetLibrary source
disagree on a technical fact, defer to MetLibrary. When they offer
different pedagogical approaches, use the Field Guide's framing."

## 5. Citation Attribution

Every response distinguishes the two sources in the citation footer:

| Level | Format | Example |
|---|---|---|
| Explorer | Source name only | 📐 Source: MET Field Guide |
| Investigator | Source + standard name | 📐 Source: MET Field Guide · Based on the International Vocabulary of Metrology |
| Innovator | Source + standard + clause | 📐 Source: MET Field Guide · VIM §2.1 |
| Metrologist | Full professional citation | 📐 JCGM 200:2012 (VIM) §2.1 — Measurement |

When MetLibrary content is directly used (Metrologist level), the
citation indicates MetLibrary as the source. When the Field Guide
provides the explanation grounded in MetLibrary, the citation
indicates the Field Guide with the underlying standard referenced.

## 6. Fallback Behavior — MetLibrary Unavailable

MetLibrary is a live federation, not a guaranteed service. When it
is unreachable:

| Level | Fallback Behavior |
|---|---|
| Explorer | No impact. MetLibrary was only used for accuracy checking. |
| Investigator | No impact. The Field Guide has the content; only the cited standard name is lost. Use cached citation from the Standards Bridge. |
| Innovator | Moderate impact. Use cached MetLibrary content from the Standards Bridge `cached_clauses` table. Flag degraded state in session metadata. |
| Metrologist | Significant impact. Use cached content. Indicate to the student that live standards content is temporarily unavailable. Never fabricate. |

The `metlibraryAvailable` flag in the retrieval result tracks this.
The chat route includes it in the response metadata so the frontend
can indicate degraded state if needed.

## 7. Verbatim Leakage — Definition

A "verbatim leakage" occurs when a response to an Explorer,
Investigator, or Innovator student contains any of the following:

1. A VIM, GUM, ISO 17025, Z540.3, or EURAMET clause reference
   with a section number (e.g., "VIM §2.1", "GUM §4.2")
2. More than 15 consecutive words matching a MetLibrary chunk
3. Professional terminology that has no Field Guide equivalent
   present in the response (e.g., "Welch-Satterthwaite" at
   Explorer level without any explanation)

The mediation guard tests for conditions 1 and 2 automatically.
Condition 3 requires human review during content QA.

## 8. Enforcement

| Component | File | What it enforces |
|---|---|---|
| Blend weights | `src/lib/levels/config.ts` | Per-level retrieval split |
| Retrieval pipeline | `src/lib/retrieval/dualSource.ts` | Parallel search, weighted blend |
| Context builder | `src/lib/retrieval/context.ts` | Level-appropriate citation instructions |
| Mediation guard | `src/lib/mediation/guard.ts` | Post-response raw-text detection |
| System prompt | `src/agents/metAndTeddy/prompts.ts` | MetLibrary mediation rule in base layer |
| Test suite | `scripts/testMediation.ts` | Automated verbatim-leakage detection |
