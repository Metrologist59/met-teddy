# MetTutor — MET and Teddy Persona Decommissioning Plan

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC
**Trigger:** Executed when all conditions in Separation Charter §7.2 are met.

---

## 1. Purpose

This plan defines the complete removal of the MET and Teddy persona from MetTutor at MET and Teddy go-live. After execution, MetTutor operates as a professional-only platform for college students and working practitioners. MET and Teddy lives exclusively in MET Universe at metandteddy.com.

MetTutor retains full, unmediated MetLibrary access throughout. This plan removes only the K–12 persona — not the professional measurement science capability.

---

## 2. Trigger Conditions (from Separation Charter §7.2)

All five must be true before executing this plan:

- [ ] MET and Teddy deployed to production at metandteddy.com
- [ ] Public access activated (Explorer tier live)
- [ ] Parent and educator onboarding functional
- [ ] Referral path from MetTutor to MET Universe live
- [ ] MET Scientia, LLC approval received

---

## 3. Asset Inventory — MET and Teddy in MetTutor

### 3.1 AI Prompt Layers

| Asset | Location | Action |
|---|---|---|
| MET character persona (base prompt) | System prompt config | **Remove** |
| Teddy behavioral engine prompts | System prompt config | **Remove** |
| K–2 level-adaptation layer | Prompt modules | **Remove** |
| 3–5 level-adaptation layer | Prompt modules | **Remove** |
| 6–8 level-adaptation layer | Prompt modules | **Remove** |
| 9–12 level-adaptation layer | Prompt modules | **Remove** |
| Grade-band detection logic | Routing module | **Remove** |
| Teddy body language injection | Response post-processor | **Remove** |
| MET humor and encouragement rules | Prompt guardrails | **Remove** |
| Source blending policy (level-gated) | Mediation module | **Remove** |
| Professional assistant persona | System prompt config | **Retain** — becomes the sole persona |

### 3.2 Content and Routing

| Asset | Location | Action |
|---|---|---|
| K–12 grade-band content routing | Router/dispatcher | **Remove** |
| Explorer/Investigator/Innovator/Metrologist level system | Level config | **Remove** |
| Field Mission references | Content links | **Remove** |
| My Field Notebook references | Feature links | **Remove** |
| Badge system references | Feature links | **Remove** |
| MET Field Guide retrieval | RAG pipeline | **Remove** — MetTutor uses MetLibrary directly |
| Standards Bridge | Bridge module | **Remove** — MetTutor accesses MetLibrary unmediated |
| MetLibrary direct access | RAG pipeline | **Retain** — unmediated professional access |

### 3.3 UI Components

| Asset | Location | Action |
|---|---|---|
| MET character avatar/icon | Chat interface | **Remove** |
| Teddy character avatar/icon | Chat interface | **Remove** |
| MET and Teddy visual assets (images, animations) | Asset directory | **Remove** |
| Level indicator badge (Explorer, etc.) | Nav/header | **Remove** |
| Grade-band selector | Onboarding/settings | **Remove** |
| Character panel component | UI components | **Remove** |
| MET-styled citation footer (📐) | Chat messages | **Replace** with professional citation format |
| "MET Universe" branding | Footer, about page | **Remove** |
| MET and Teddy taglines | Marketing copy | **Remove** |
| Age gate / COPPA consent | Auth flow | **Remove** |
| Parent/educator dashboard | Dashboard routes | **Remove** |

### 3.4 Configuration

| Asset | Location | Action |
|---|---|---|
| MET and Teddy color palette (teal/amber) | CSS/theme | **Replace** with professional palette |
| Character animation CSS | Stylesheet | **Remove** |
| Level-specific color tokens | CSS variables | **Remove** |
| Teddy prominence configuration | Config file | **Remove** |

---

## 4. Removal Sequence

Execute in this order. Each step has a verification checkpoint.

### Step 1: Pre-Strip Backup
- Create a full backup of MetTutor codebase (tag: `pre-persona-strip`)
- Snapshot the MetTutor database
- Document the current state of all assets listed in §3
- **Verify:** Backup is restorable and tested

### Step 2: Deploy Referral Path
- Add the referral banner to MetTutor (see §7)
- Test that the referral link routes to metandteddy.com
- **Verify:** Banner displays correctly, link works

### Step 3: Remove Prompt Layers
- Delete the MET character persona from the system prompt
- Delete all four level-adaptation layers
- Delete the Teddy behavioral engine prompts
- Delete grade-band detection and routing logic
- Delete the source blending/mediation policy
- Activate the professional assistant persona as the sole persona
- **Verify:** MetTutor responds as a professional assistant with no MET/Teddy character

### Step 4: Remove Content Routing
- Remove K–12 grade-band content routing
- Remove the Explorer/Investigator/Innovator/Metrologist level system
- Remove MET Field Guide retrieval from the RAG pipeline
- Remove the Standards Bridge module
- Confirm MetLibrary direct access remains functional
- **Verify:** Professional queries return MetLibrary content unmediated

### Step 5: Remove UI Components
- Remove MET and Teddy character avatars and visual assets
- Remove the character panel component
- Remove the level indicator from navigation
- Remove the grade-band selector
- Remove age gate and COPPA consent flow
- Remove parent/educator dashboard routes
- Replace the MET-styled citation footer with a professional format
- **Verify:** No MET or Teddy visual elements remain in any view

### Step 6: Remove Branding
- Remove "MET Universe" from footer and about page
- Remove MET and Teddy taglines
- Replace teal/amber palette with professional palette
- Remove character animation CSS
- **Verify:** Visual audit shows no MET and Teddy brand elements

### Step 7: Update Positioning
- Deploy MetTutor repositioning copy (see §6)
- Update metadata, descriptions, and marketing copy
- **Verify:** All public-facing text reflects professional positioning

### Step 8: Post-Strip Verification
- Run the definition-of-done checklist (§5)
- Confirm referral path is live
- Monitor for errors for 48 hours
- **Verify:** All checks pass

---

## 5. Definition of Done

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

---

## 6. MetTutor Repositioning Copy

### 6.1 Homepage Headline
> **MetTutor** — Professional Measurement Science for Practitioners

### 6.2 Description
> MetTutor is the AI-powered measurement science platform for college students and working professionals. Standards-fluent answers grounded in MetLibrary — the professional standards library maintained by the Metrology Institute. Built for calibration technicians, metrology engineers, quality managers, and laboratory directors.

### 6.3 Feature List
> - Direct, unmediated access to MetLibrary standards content
> - ASQ CCT exam preparation alignment
> - Concept explanations at the professional level
> - Problem-solving with standards references
> - Document analysis and interpretation
> - No character personas — direct professional answers

### 6.4 Footer
> MetTutor — Professional Measurement Science · Powered by MetLibrary

### 6.5 K–12 Referral Notice
> Looking for measurement science for K–12 students? Visit **MET and Teddy** — where measurement comes alive. [metandteddy.com](https://metandteddy.com)

---

## 7. Referral Path Specification

### 7.1 Banner Location
- Displayed at the top of MetTutor's landing page
- Displayed once per session in the chat interface (dismissible)
- Included in the MetTutor footer

### 7.2 Banner Content
> 🎓 **For K–12 students:** MET and Teddy is now live! Your Measurement Education Tutor and his trusty companion Teddy are waiting at [metandteddy.com](https://metandteddy.com). Every measurement tells a story.

### 7.3 Banner Behavior
- Dismissible (stores preference in localStorage)
- Links open metandteddy.com in a new tab
- Banner remains in footer permanently (not dismissible there)

---

## 8. User Communications

### 8.1 Email to MetTutor Users (Pre-Strip)

> **Subject:** MET and Teddy has a new home — MetTutor is going professional-only
>
> Hi [Name],
>
> We're writing to let you know about an exciting change. **MET and Teddy** — the K–12 measurement science experience — now has its own dedicated home at **metandteddy.com**.
>
> **What's changing:** MetTutor is becoming a professional-only platform, focused entirely on college students and working practitioners. The MET and Teddy character experience, grade-band content, Field Missions, and badge system are moving to their new home in MET Universe.
>
> **What stays the same:** MetTutor retains full access to MetLibrary, the professional standards library. All your professional content, exam prep tools, and document analysis features remain exactly as they are.
>
> **If you have K–12 students:** Visit [metandteddy.com](https://metandteddy.com) to create a free account. MET and Teddy is better than ever in its new home — purpose-built for K–12 with COPPA-compliant accounts, parent dashboards, and age-appropriate content.
>
> Thank you for being part of our measurement science community.
>
> — MET Scientia

### 8.2 In-App Notice (Post-Strip, 30 Days)

> MetTutor is now focused on professional measurement science. Looking for the K–12 experience? MET and Teddy has moved to [metandteddy.com](https://metandteddy.com).

---

## 9. Rollback Procedure

If issues are discovered within 30 days of the strip:

1. Restore from `pre-persona-strip` git tag
2. Restore database from pre-strip snapshot
3. Redeploy MetTutor with the MET and Teddy persona intact
4. Notify users that the K–12 experience is temporarily available in both locations
5. Investigate and resolve the issue
6. Re-execute the strip when resolved

**After 30 days:** The backup tag is archived and the strip is permanent. Rollback after 30 days requires rebuilding from the separation charter.

---

## 10. Timeline

| Day | Action |
|---|---|
| D-7 | Send pre-strip email to MetTutor users |
| D-3 | Deploy referral banner to MetTutor |
| D-0 | Execute removal sequence (Steps 1–8) |
| D+1 | Monitor for errors, review user feedback |
| D+2 | Verify definition of done |
| D+7 | Review first week metrics |
| D+30 | Confirm permanent strip, archive backup |

---

## 11. Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| MET Scientia, LLC — Owner | | | |
| MetTutor — Product Lead | | | |
| MET and Teddy — Product Lead | | | |

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
