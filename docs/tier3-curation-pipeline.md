# MET Field Guide — Tier 3 Curation Pipeline

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Purpose

The Tier 3 curation pipeline processes external measurement science content into the MET Field Guide. Tier 3 covers material outside MetLibrary's scope — NIST publications, NCSLI recommended practices, industry articles, and STEM education resources. MetLibrary itself is accessed through live federation, not curation.

MET never claims credit for external content. Every Tier 3 entry carries source attribution.

---

## 2. Tier 3 vs MetLibrary Scope Boundary

| Content | Source | Access Method |
|---|---|---|
| VIM definitions and vocabulary | MetLibrary | Live federation |
| GUM uncertainty evaluation methods | MetLibrary | Live federation |
| ISO/IEC 17025 requirements | MetLibrary | Live federation |
| ANSI/NCSL Z540.3 decision rules | MetLibrary | Live federation |
| NIST Technical Notes and Special Publications | **Tier 3** | **Curated into MET Field Guide** |
| NCSLI Recommended Practices (RP-1, RP-7, etc.) | **Tier 3** | **Curated into MET Field Guide** |
| Industry measurement articles and white papers | **Tier 3** | **Curated into MET Field Guide** |
| STEM education resources and lesson plans | **Tier 3** | **Curated into MET Field Guide** |
| Historical measurement narratives | **Tier 3** | **Curated into MET Field Guide** |
| Emerging technology explainers | **Tier 3** | **Curated into MET Field Guide** |

**The rule:** If the content is a normative standard or vocabulary definition maintained by a standards body and available through MetLibrary, it is accessed via federation. If it is supplementary, educational, or explanatory content from external sources, it is curated into Tier 3.

---

## 3. Source Evaluation Criteria

### 3.1 Eligible Sources

| Source Category | Examples | Priority |
|---|---|---|
| National Metrology Institutes | NIST, PTB, NPL, NRC | High |
| Professional societies | NCSLI, ASQ, IMEKO | High |
| Government agencies | EPA, FDA, DOE, NASA | Medium |
| Peer-reviewed journals | Metrologia, MAPAN, NCSLI Measure | Medium |
| Industry associations | AIAG, A2LA, SAE | Medium |
| STEM education publishers | NGSS-aligned curricula, science museums | Medium |
| Reputable science journalism | Scientific American, IEEE Spectrum | Low |

### 3.2 Source Evaluation Checklist

Before a source is approved for curation, evaluate:

| Criterion | Required? | Notes |
|---|---|---|
| Factual accuracy | Yes | Cross-reference claims against known standards |
| Author credibility | Yes | Institutional affiliation or recognized expertise |
| Publication date | Yes | Prefer within last 10 years; historical content exempt |
| Peer review or editorial oversight | Preferred | Not required for NMI publications |
| Free from commercial bias | Yes | No sponsored content, no vendor marketing |
| Accessible language | Preferred | Technical jargon acceptable if the adaptation process will simplify |
| Copyright and usage rights | Yes | Public domain, Creative Commons, or explicit permission |
| No conflict with MetLibrary content | Yes | Tier 3 supplements, never contradicts, normative standards |

### 3.3 Rejected Sources

Do not curate from:
- Wikipedia (use it to find primary sources, not as a source itself)
- Vendor marketing materials or sponsored white papers
- Self-published blogs without institutional backing
- Sources with known accuracy issues
- Paywalled content without redistribution permission
- Sources that contradict VIM, GUM, or ISO 17025 definitions

---

## 4. Curation Pipeline Stages

### Stage 1: Source Identification
- Monitor NIST publication feeds, NCSLI newsletters, IMEKO proceedings
- Track industry measurement publications quarterly
- Accept educator-submitted sources through the content portal
- Review against source evaluation checklist (§3.2)

### Stage 2: Relevance Assessment
- Does this content teach something about measurement science?
- Is it appropriate for at least one certification level?
- Does it fill a gap in the current MET Field Guide?
- Is it distinct from existing Tier 1, Tier 2, or MetLibrary content?

### Stage 3: Content Extraction
- Extract the core educational content from the source
- Remove publication-specific formatting, references to other sections, and marketing language
- Identify the key concepts, vocabulary, and measurement principles
- Note the source's original audience level

### Stage 4: Four-Level Adaptation
- Write four variants per the level adaptation rules (§5)
- Explorer: concrete, sensory, Teddy-friendly
- Investigator: procedural, comparison, "do it again"
- Innovator: analytical, uncertainty-aware, "why does it vary?"
- Metrologist: professional-grade, standards-referenced, GUM-aligned

### Stage 5: Attribution Tagging
- Add source attribution per the attribution template (§6)
- Never claim the content as MET Scientia original
- Link to the original source where possible
- Note the adaptation date

### Stage 6: Editorial Review
- Two reviewers required (one for technical accuracy, one for level-appropriateness)
- Reviewer checklist (§7)
- Resolve all review comments before proceeding

### Stage 7: Embedding & Indexing
- Format as MET Field Guide seed JSON (matching the import schema)
- Run through the import pipeline: `npx tsx scripts/importContent.ts`
- Embed: `npx tsx scripts/embedContent.ts`
- Verify retrieval with test queries

### Stage 8: Validation
- Test retrieval at each level with a relevant query
- Verify citation footer includes source attribution
- Confirm mediation guard passes for sub-Metrologist levels
- Sign off entry

---

## 5. Level Adaptation Rules for Tier 3

| Level | Vocabulary Ceiling | Structure | Depth | Max Length |
|---|---|---|---|---|
| Explorer | Common words, no jargon | 2–3 paragraphs, conversational | What does it do? | 150 words |
| Investigator | Introduce technical terms with definitions | 3–4 paragraphs, structured | How does it work? | 250 words |
| Innovator | Technical terms used directly | 4–5 paragraphs, analytical | Why does it matter? | 400 words |
| Metrologist | Professional vocabulary assumed | 4–6 paragraphs, reference-grade | How is it quantified? | 500 words |

**Adaptation principles:**
- Each level must be independently readable — don't reference other levels
- Explorer: if a 7-year-old can't understand it, simplify further
- Investigator: if a 10-year-old can't follow the procedure, add a step
- Innovator: if a 13-year-old can't explain why measurements vary, add context
- Metrologist: if a calibration technician trainee can't use it, add detail

---

## 6. Attribution Template

Every Tier 3 entry includes a source attribution block:

```json
{
  "sourceAttribution": {
    "originalTitle": "NIST Technical Note 1297: Guidelines for Evaluating and Expressing the Uncertainty of NIST Measurement Results",
    "originalAuthor": "Barry N. Taylor, Chris E. Kuyatt",
    "originalPublisher": "National Institute of Standards and Technology",
    "originalDate": "1994",
    "originalUrl": "https://www.nist.gov/pml/nist-technical-note-1297",
    "license": "Public Domain (U.S. Government Work)",
    "adaptedBy": "MET Scientia, LLC",
    "adaptedDate": "2026-08",
    "adaptationNote": "Adapted across four K–12 certification levels for the MET Field Guide. Original content summarized and simplified; not a reproduction."
  }
}
```

**The citation footer in chat reads:**
> 📐 Source: MET Field Guide · Adapted from NIST TN 1297 (Taylor & Kuyatt, 1994)

---

## 7. Reviewer Checklist

### Technical Review (Reviewer 1)

| Check | Status |
|---|---|
| Facts are accurate and consistent with current standards | |
| No contradiction with VIM, GUM, or ISO 17025 definitions | |
| Units are correct and consistently presented | |
| Numerical examples are accurate | |
| Standards references are current (not superseded) | |
| Source attribution is complete and correct | |
| Content does not reproduce copyrighted text verbatim | |

### Level-Appropriateness Review (Reviewer 2)

| Check | Explorer | Investigator | Innovator | Metrologist |
|---|---|---|---|---|
| Vocabulary matches level ceiling | | | | |
| Sentence complexity appropriate | | | | |
| Examples are relatable for the age range | | | | |
| No jargon without definition (below Metrologist) | | | | |
| Length within guidelines | | | | |
| Could stand alone without other levels | | | | |
| Mediation guard would pass | | | | |

---

## 8. Quality Metrics

Track quarterly:

| Metric | Target |
|---|---|
| Entries curated per quarter | 15–25 |
| Average time from source to published entry | ≤ 14 days |
| Technical review pass rate (first submission) | ≥ 80% |
| Level-appropriateness pass rate (first submission) | ≥ 75% |
| Retrieval relevance score (test queries) | ≥ 0.7 cosine similarity |
| Mediation guard pass rate | 100% for Explorer–Innovator |

---

## 9. Seed File Format

Tier 3 entries use the same import schema as Tier 1 and Tier 2:

```json
[
  {
    "slug": "nist-tn-1297-uncertainty-guidelines",
    "title": "Understanding Measurement Uncertainty (from NIST TN 1297)",
    "contentTier": "tier_3",
    "domain": "general",
    "narrativeType": "case_study",
    "standardsBridgeRefs": [],
    "industrySector": "general",
    "inspirationFlag": false,
    "careerRelevance": "metrologist",
    "sourceAttribution": { ... },
    "levelVariants": [
      {
        "gradeBand": "K-2",
        "certLevel": "Explorer",
        "ageRange": "ages 5–8",
        "technicalDepth": "conceptual",
        "sourceKb": "met_field_guide",
        "body": "...",
        "summary": "...",
        "keyVocabulary": [...]
      },
      ...
    ]
  }
]
```

File naming: `tier3_<source-category>_batch<N>.json`

Examples: `tier3_nist_batch1.json`, `tier3_ncsli_batch1.json`, `tier3_industry_batch1.json`

---

*MET Field Guide · MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
