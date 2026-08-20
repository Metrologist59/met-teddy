# MET and Teddy — Phase 3 Test Matrix
# © 2026 MET Scientia, LLC
# Version: 1.0.0 · August 2026

## How to Use

Run automated tests first, then work through manual checks.
Mark each item: ✓ pass, ✗ fail, ○ not tested, — not applicable.

---

## A. Automated Tests

| Test | Command | Status |
|---|---|---|
| Smoke test (file structure) | `npx tsx tests/smoke.ts` | |
| Integration tests (cross-system) | `npx tsx tests/integration.ts` | |
| AI response validation | `npx tsx scripts/testAIResponses.ts` | |
| Mediation guard | `npx tsx scripts/testMediation.ts` | |

---

## B. COPPA Compliance Checklist

| # | Requirement | Status | Notes |
|---|---|---|---|
| B1 | Age gate at registration routes under-13 to parent flow | | |
| B2 | Parental consent form displayed before under-13 activation | | |
| B3 | Consent form explains data collected and purpose | | |
| B4 | Consent form explains parental rights (review, revoke, delete) | | |
| B5 | Under-13 profiles store first name only (no last name) | | |
| B6 | No photos, location, or contact info collected from children | | |
| B7 | No social features or student-to-student messaging | | |
| B8 | No advertising displayed | | |
| B9 | No data sold to third parties | | |
| B10 | Parent can review all child data from dashboard | | |
| B11 | Parent can revoke consent (deactivates account) | | |
| B12 | Consent records are timestamped and auditable | | |
| B13 | Privacy policy accessible from registration and footer | | |
| B14 | Educator/school accounts handled via district agreement | | |
| B15 | Deletion log records all data removal | | |

---

## C. Accessibility (WCAG 2.1 AA)

| # | Criterion | Status | Notes |
|---|---|---|---|
| C1 | Color contrast ≥ 4.5:1 for normal text | | Check teal on white |
| C2 | Color contrast ≥ 3:1 for large text and UI elements | | |
| C3 | All interactive elements keyboard-accessible | | Tab through all pages |
| C4 | Focus indicator visible (2px teal outline) | | |
| C5 | All images have alt text | | Character avatars |
| C6 | Form inputs have labels | | Registration, notebook |
| C7 | Error messages announced to screen readers | | |
| C8 | No content conveyed by color alone | | Badge states |
| C9 | Reduced motion respected (@media prefers-reduced-motion) | | |
| C10 | Page titles descriptive and unique | | Each route |
| C11 | Heading hierarchy logical (h1 → h2 → h3) | | |
| C12 | Touch targets ≥ 44×44px on mobile | | Buttons, badges |
| C13 | Text resizable to 200% without loss | | |
| C14 | Animations respect prefers-reduced-motion | | Teddy animations |

---

## D. Cross-Device Testing

| # | Device / Viewport | Pages to Test | Status |
|---|---|---|---|
| D1 | iPhone SE (375px) | Landing, chat, missions, notebook, badges | |
| D2 | iPhone 14 (390px) | Landing, chat, onboarding | |
| D3 | iPad (768px) | All pages — sidebar behavior | |
| D4 | iPad landscape (1024px) | Dashboard, classroom view | |
| D5 | Desktop 1280px | All pages — full layout | |
| D6 | Desktop 1920px | Max-width containment | |
| D7 | Chrome | Full test pass | |
| D8 | Safari | Full test pass | |
| D9 | Firefox | Full test pass | |
| D10 | Edge | Full test pass | |

---

## E. Feature Integration (Manual)

### E1. Onboarding Flow
| # | Check | Status |
|---|---|---|
| E1.1 | /onboarding?band=K-2&name=Sophia → Explorer reveal | |
| E1.2 | /onboarding?band=3-5&name=Marcus → Investigator reveal | |
| E1.3 | /onboarding?band=6-8&name=Aisha → Innovator reveal | |
| E1.4 | /onboarding?band=9-12&name=James → Metrologist reveal | |
| E1.5 | Level reveal → Notebook setup → First mission flow complete | |
| E1.6 | "Explore First" routes to /chat | |
| E1.7 | "Start Mission" routes to /missions | |

### E2. Chat Interface
| # | Check | Status |
|---|---|---|
| E2.1 | Empty state shows welcome with CharacterPanel | |
| E2.2 | Student message appears right-aligned in teal | |
| E2.3 | MET response has avatar and citation footer | |
| E2.4 | Loading dots appear while waiting | |
| E2.5 | Enter-to-send works | |
| E2.6 | Shift+Enter creates new line | |

### E3. Field Missions
| # | Check | Status |
|---|---|---|
| E3.1 | Catalog shows all missions for level | |
| E3.2 | Domain filter works | |
| E3.3 | Clicking mission opens detail view | |
| E3.4 | Safety banner shows correct band statement | |
| E3.5 | Materials checklist — all must be checked to start | |
| E3.6 | Steps progress one at a time | |
| E3.7 | Completion shows Teddy celebration | |
| E3.8 | "Open Notebook" button works | |

### E4. Field Notebook
| # | Check | Status |
|---|---|---|
| E4.1 | Empty state with "Create First Entry" button | |
| E4.2 | Entry form renders level-appropriate template | |
| E4.3 | Multiple measurement readings can be added | |
| E4.4 | Reflection step shows after data entry | |
| E4.5 | Saved entry appears in list | |
| E4.6 | Entry detail shows measurements and stats | |

### E5. Badges
| # | Check | Status |
|---|---|---|
| E5.1 | Gallery shows all badges for level | |
| E5.2 | Category tabs filter correctly | |
| E5.3 | Certification milestone card displays | |
| E5.4 | Clicking badge shows celebration preview | |
| E5.5 | Earned badges show glow and date | |
| E5.6 | In-progress badges show percentage | |

### E6. Dashboard
| # | Check | Status |
|---|---|---|
| E6.1 | Parent view shows child progress | |
| E6.2 | Recent activity feed displays | |
| E6.3 | Level override opens and functions | |
| E6.4 | Override limited to ±1 from default | |

### E7. Navigation
| # | Check | Status |
|---|---|---|
| E7.1 | All sidebar links navigate correctly | |
| E7.2 | Mobile hamburger opens overlay sidebar | |
| E7.3 | Level indicator shows in nav bar | |
| E7.4 | Footer shows MET Scientia copyright | |

---

## F. Independence Verification

| # | Check | Status |
|---|---|---|
| F1 | No MetTutor imports in met-teddy-app codebase | |
| F2 | No MetTutor Supabase project references in code | |
| F3 | No shared API keys or credentials | |
| F4 | Independence attestation document present | |
| F5 | Privacy policy states separation from MetTutor | |

---

## Sign-Off

| Role | Name | Date | Decision |
|---|---|---|---|
| Developer | | | |
| Reviewer | | | |
