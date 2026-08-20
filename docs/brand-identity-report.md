# MET and Teddy — Brand Identity Report

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC
**Source:** MET Name Identities v1.0, MET Brand Ecosystem Profile v2.0

---

## 1. Naming Conformance

### 1.1 Name Usage per Name Identities v1.0 §4

| Name | Rule | Status |
|---|---|---|
| MET | All caps. First reference: "MET (Measurement Education Tutor)." | ✓ Conforms |
| MET Scientia | Two words, both capitalized | ✓ Conforms |
| MET and Teddy | "and" not "&" in body text. "&" acceptable in logos/headers only. | ✓ Conforms |
| MET Universe | Two words, both capitalized | ✓ Conforms |
| MET Field Guide | Three words, all capitalized | ✓ Conforms |
| Metrology Institute | Two words, both capitalized. No "the" in formal brand usage. | ✓ Conforms |
| MetLibrary | One word, camelCase | ✓ Conforms |

### 1.2 Prohibited Forms — Verified Absent

| Prohibited | Status |
|---|---|
| "Met" (lowercase t) | ✓ Not found in user-facing text |
| "M.E.T." with periods | ✓ Not found |
| "MET + Teddy" or "MET/Teddy" | ✓ Not found |
| "MS" or "MET Sci" | ✓ Not found |
| "MU" or "MetU" | ✓ Not found |
| "MFG" for MET Field Guide | ✓ Not found |
| "MI" or "Met Inst" for Metrology Institute | ✓ Not found |

---

## 2. Attribution Pattern Audit

### 2.1 Approved Attribution Patterns (Name Identities v1.0 §5)

| Context | Approved Pattern | Implementation Location | Status |
|---|---|---|---|
| Platform footer | MET Universe — A MET Scientia Experience | `AppShell.tsx`, `page.tsx` (landing) | ✓ |
| Educational content | © 2026 MET Scientia · MET and Teddy · In Support of the Metrology Institute | `page.tsx` (landing footer) | ✓ |
| AI chat citation | 📐 Source: MET Field Guide · [standard] via Standards Bridge | `MessageBubble.tsx`, `CitationFooter.tsx` | ✓ |
| Privacy policy | MET and Teddy · MET Universe · MET Scientia, LLC | `privacy/page.tsx` | ✓ |
| Open Badges issuer | MET Scientia, LLC | `openBadges.ts` | ✓ |
| Credential display | © 2026 MET Scientia, LLC | `CredentialDisplay.tsx` | ✓ |

### 2.2 Resolved Conflict: Platform Footer

**Name Identities v1.0 §5** specified: "MET Universe — A MET Scientia Experience · Powered by MetTutor.ai"

**Brand Ecosystem Profile v2.0 §23.3** specified: "MET Universe — A MET Scientia Experience" (MetTutor reference dropped)

**Resolution:** This application follows v2.0. The "Powered by MetTutor.ai" reference is removed from all surfaces. MET and Teddy is an independent application. Name Identities v1.0 §5 should be updated to match.

---

## 3. Taglines Audit

| Tier | Primary Tagline | Locations | Status |
|---|---|---|---|
| MET Scientia | "Where every question becomes a quest, and every quest is grounded in science." | System prompt, docs | ✓ |
| MET and Teddy | "Every measurement tells a story." | Landing page, sidebar, onboarding | ✓ |
| MET Universe | "Where measurement comes alive." | Landing page, metadata | ✓ |
| MET Field Guide | "The library that powers the guide." | Internal docs | ✓ |

---

## 4. Visual Identity Audit

### 4.1 Palette

| Token | Value | Per v2.0 §20 | Status |
|---|---|---|---|
| --met-teal-400 | #2AB8AB | Primary brand | ✓ |
| --met-teal-900 | #062C28 | Dark background | ✓ |
| --met-amber-400 | #F59E0B | Warm accent | ✓ |
| --met-amber-200 | #FCD34D | Secondary warm | ✓ |
| --met-blue-400 | #60A5FA | Reference blue | ✓ |
| --met-surface | #F8FAFA | Light background | ✓ |

### 4.2 Visual Motifs

| Motif | Location | Status |
|---|---|---|
| Ruler-tick divider | Landing page, credential display | ✓ |
| Grid-line background | Landing page (4% opacity) | ✓ |
| Teal citation footer | Chat messages, mission steps, notebook feedback | ✓ |

---

## 5. Copyright & Ownership Notices

### 5.1 Usage Register

| Surface | Notice | Form |
|---|---|---|
| Landing page footer | © 2026 MET Scientia, LLC | Formal (with entity suffix) |
| AppShell footer | © 2026 MET Scientia, LLC | Formal |
| Privacy policy | MET Scientia, LLC | Formal |
| Independence attestation | MET Scientia, LLC | Formal |
| Separation charter | © 2026 MET Scientia, LLC | Formal |
| Source code headers | © 2026 MET Scientia, LLC | Formal |
| Open Badges issuer | MET Scientia, LLC | Formal |
| Educational content attribution | © 2026 MET Scientia | Brand-facing (no suffix) |
| Chat citation footer | MET Universe · Metrology Institute | Brand-facing |

### 5.2 Legal Entity Split (per Roadmap Open Item #3)

- **"MET Scientia, LLC"** — ownership, copyright, credential issuer, legal documents, privacy policy
- **"MET Scientia"** — brand-facing attribution, educational content, taglines, email signatures

---

## 6. Trademark & Copyright Usage Register

| Asset | Owner | Type | Registration |
|---|---|---|---|
| MET (Measurement Education Tutor) | MET Scientia, LLC | Character name | Pending |
| Teddy | MET Scientia, LLC | Character name | Pending |
| MET and Teddy | MET Scientia, LLC | Product name | Pending |
| MET Universe | MET Scientia, LLC | Platform name | Pending |
| MET Field Guide | MET Scientia, LLC | Knowledge base name | Pending |
| MET Scientia | MET Scientia, LLC | Company name | Registered (LLC) |
| "Every measurement tells a story" | MET Scientia, LLC | Tagline | Pending |
| "Where measurement comes alive" | MET Scientia, LLC | Tagline | Pending |
| "Where every question becomes a quest..." | MET Scientia, LLC | Tagline | Pending |
| MET character visual assets | MET Scientia, LLC | Artwork | © 2026 (when created) |
| Teddy character visual assets | MET Scientia, LLC | Artwork | © 2026 (when created) |
| MET and Teddy application code | MET Scientia, LLC | Software | © 2026 |
| MET Field Guide content | MET Scientia, LLC | Educational content | © 2026 |
| Standards Bridge | MET Scientia, LLC | Software | © 2026 |
| Open Badges 3.0 credentials | MET Scientia, LLC (issuer) | Digital credentials | Per issuance |

---

## 7. Surfaces Audited

| Surface | Brand Elements Checked | Status |
|---|---|---|
| Landing page (`/`) | Logo, tagline, palette, motifs, footer, copyright | ✓ |
| Chat (`/chat`) | Character panel, citation footer, level badge | ✓ |
| Missions (`/missions`) | Safety banner, mission cards, domain badges | ✓ |
| Notebook (`/notebook`) | Entry form, MET feedback, quality score | ✓ |
| Badges (`/badges`) | Gallery, celebration, credential display | ✓ |
| Dashboard (`/dashboard`) | Progress cards, level override | ✓ |
| Onboarding (`/onboarding`) | Level reveal, taglines, CharacterPanel | ✓ |
| Register (`/register`) | Age gate, consent form, MET Universe branding | ✓ |
| Login (`/login`) | MET Universe branding, tagline | ✓ |
| Privacy (`/privacy`) | Full policy, MET Scientia LLC ownership | ✓ |
| Open Badges credential | Issuer, achievement, MET Scientia LLC | ✓ |
| Sidebar navigation | All nav items, level indicator, tagline | ✓ |
| Error boundary | MET caution pose, MET Universe footer | ✓ |
| Health endpoint | Version, no brand leakage | ✓ |

---

## 8. Automated Verification

Run the brand audit: `npx tsx tests/brand-audit.ts`

This script checks every `.ts`, `.tsx`, and `.css` file for naming violations, prohibited forms, footer conflicts, and copyright format issues.

---

*MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
