# MET Universe — Navigation Architecture & Shell Inventory

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Route Map

| Route | Page | Auth Required | Shell | Purpose |
|---|---|---|---|---|
| `/` | Landing | No | Public | MET Universe entry experience |
| `/login` | Login | No | Public | Email/password login |
| `/register` | Register | No | Public | Age gate → registration flow |
| `/privacy` | Privacy Policy | No | Public | COPPA-compliant privacy disclosure |
| `/onboarding` | Onboarding | Yes | Public | Level reveal → notebook setup → first mission |
| `/chat` | Talk to MET | Yes | AppShell | Primary chat interface |
| `/missions` | Field Missions | Yes | AppShell | Mission catalog and step-by-step interface |
| `/notebook` | My Field Notebook | Yes | AppShell | Entry list, creation, detail, feedback |
| `/badges` | Badge Gallery | Yes | AppShell | Earned, in-progress, and locked badges |
| `/dashboard` | Dashboard | Yes | AppShell | Parent or educator progress view |
| `/auth/callback` | Auth Callback | — | — | Supabase auth redirect handler |

### API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/chat` | POST | Yes | AI chat with MET and Teddy |
| `/api/badges` | POST | Yes | Badge evaluation |
| `/api/notebook-feedback` | POST | Yes | MET feedback on notebook entries |
| `/api/credentials` | GET | Public | Open Badges 3.0 verification endpoint |

---

## 2. Shell Architecture

```
METUniverse (wrapper)
  ├── Public routes (no shell)
  │   ├── Landing page
  │   ├── Login
  │   ├── Register (AgeGate → ParentalConsentForm)
  │   ├── Privacy Policy
  │   └── Onboarding (LevelReveal → NotebookSetup → FirstMission)
  │
  └── Authenticated routes (AppShell)
      ├── NavBar (fixed top)
      │   ├── MET Universe logo
      │   ├── Level badge
      │   └── Student name
      ├── Sidebar (fixed desktop, overlay mobile)
      │   ├── Talk to MET → /chat
      │   ├── Field Missions → /missions
      │   ├── My Field Notebook → /notebook
      │   ├── Badges → /badges
      │   ├── Dashboard → /dashboard
      │   └── Level indicator + tagline
      └── Main content area
          └── [Page component]
```

---

## 3. Component Inventory — Shell Level

| Component | Location | Purpose | MetTutor Dependencies |
|---|---|---|---|
| `METUniverse` | `layout/METUniverse.tsx` | Top-level wrapper, loading state, auth routing | **None** |
| `AppShell` | `layout/AppShell.tsx` | Authenticated page wrapper with nav + sidebar | **None** |
| `NavBar` | `layout/NavBar.tsx` | Top navigation with branding and level badge | **None** |
| `Sidebar` | `layout/Sidebar.tsx` | Side navigation with route links | **None** |
| `ErrorBoundary` | `layout/ErrorBoundary.tsx` | React error boundary with branded recovery | **None** |

### Navigation Dependencies

| Dependency | Source | MetTutor Shared? |
|---|---|---|
| React 19 | npm | No — independent install |
| Next.js 16 | npm | No — independent install |
| Tailwind CSS v4 | npm | No — independent install |
| @supabase/ssr | npm | No — independent install, separate project |
| CSS variables | `globals.css` | No — MET Universe design system |
| Level config | `lib/levels/config.ts` | No — MET and Teddy owned |

---

## 4. Zero MetTutor Dependency Verification

### 4.1 Code Verification

Run the dependency check:
```
npx tsx tests/mettutor-dependency-check.ts
```

Checks performed:
- No imports from MetTutor packages or paths
- No MetTutor Supabase project references in code
- No shared API endpoints
- No MetTutor route patterns
- No MetTutor component names

### 4.2 Infrastructure Verification

| Check | Expected | Actual |
|---|---|---|
| Supabase project | MET-FieldGuide (`fcupipvoekuzxhmtgpsq`) | |
| Supabase org | MET Scientia LLC (`ohaylbnvnijrdhfsxzqf`) | |
| No MetTutor project refs | Zero matches | |
| No shared API keys | Confirmed | |
| Independent domain | metandteddy.com (pending) | |

---

## 5. Entry Experience

The entry experience is the first thing a new visitor sees at `/`.

### Flow

```
Visit metandteddy.com
  → Landing page (dark teal hero, grid motif, MET and Teddy tagline)
  → "Start Exploring" → /register (age gate)
  → "Field Missions" → /register (age gate)
  → Already registered → /login → /chat
```

### Design Elements

- Dark teal (--met-teal-900) hero background
- Grid-line measurement motif (subtle, 4% opacity)
- "MET and Teddy" title with teal accent
- "Every measurement tells a story" tagline
- Ruler-tick divider
- Four certification level badges (Explorer · K–2 through Metrologist · 9–12)
- Two CTAs: "Start Exploring" (teal) and "Field Missions" (amber)
- Footer: "MET Universe — A MET Scientia Experience · © 2026 MET Scientia, LLC"

---

*MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
