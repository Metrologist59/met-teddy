# MET and Teddy — Infrastructure Specification & DR Plan

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Production Stack

| Layer | Service | Account | Independence |
|---|---|---|---|
| Hosting | Vercel | MET Scientia, LLC account | No shared tenancy with MetTutor |
| Database | Supabase | MET Scientia LLC org (`ohaylbnvnijrdhfsxzqf`) | Separate org, project, credentials |
| CDN | Vercel Edge Network | Included with Vercel | Independent deployment |
| Domain | metandteddy.com | MET Scientia, LLC registrar | Independent domain (also register metandteddy.ai, redirect to .com) |
| SSL | Vercel auto-provisioned | Let's Encrypt via Vercel | Per-deployment certificates |
| AI Engine | Anthropic API | MET Scientia, LLC API key | Independent key, billing |
| Embeddings | Google AI (Gemini) | MET Scientia, LLC API key | Independent key, billing |
| CI/CD | GitHub Actions | MET Scientia, LLC repository | Independent pipeline |
| Secrets | Vercel environment variables | Per-environment (staging, production) | No shared vault with MetTutor |
| Monitoring | Vercel Analytics + `/api/health` | MET Scientia, LLC | Independent dashboard |
| MetLibrary | Supabase (Metrology Institute) | Independent entitlement | Separate credentials and rate limits |

---

## 2. Environment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   DEVELOPMENT                        │
│  localhost:3000 → MET-FieldGuide Supabase (dev)     │
│  .env.local with dev keys                           │
└─────────────────────┬───────────────────────────────┘
                      │ git push staging
┌─────────────────────▼───────────────────────────────┐
│                    STAGING                           │
│  staging.metandteddy.com → Supabase (staging branch)│
│  Vercel preview deployment                          │
│  GitHub Actions: quality → test → build → deploy    │
└─────────────────────┬───────────────────────────────┘
                      │ git push main (after review)
┌─────────────────────▼───────────────────────────────┐
│                   PRODUCTION                         │
│  metandteddy.com → Supabase (production)            │
│  Vercel production deployment                       │
│  Full monitoring, alerting, backups                  │
└─────────────────────────────────────────────────────┘
```

---

## 3. Database

### 3.1 Supabase Project

| Property | Value |
|---|---|
| Organization | MET Scientia LLC (`ohaylbnvnijrdhfsxzqf`) |
| Project ID | `fcupipvoekuzxhmtgpsq` |
| Region | ca-central-1 |
| Schemas | `field_guide`, `standards_bridge`, `public` (app tables) |

### 3.2 Tables

**Content (field_guide schema):** concepts, vocabulary, missions, character_patterns, standards_bridge_entries, content_chunks

**Application (public schema):** profiles, parental_consents, classrooms, classroom_students, deletion_log, notebook_entries, notebook_measurements, notebook_reflections, notebook_uncertainty, notebook_templates, badge_definitions, badge_criteria, earned_badges, badge_progress

### 3.3 Backups

| Method | Frequency | Retention | Recovery |
|---|---|---|---|
| Supabase daily backup | Daily, automatic | 7 days (free), 30 days (pro) | Point-in-time restore from dashboard |
| Manual pg_dump | Weekly (scheduled) | 90 days in cloud storage | Restore to any Supabase project |
| Migration files | Version controlled | Permanent (git) | Replay from 0001 to rebuild schema |
| Content seed files | Version controlled | Permanent (git) | Re-import and re-embed |

---

## 4. Secrets Management

### 4.1 Where Secrets Live

| Secret | Development | Staging | Production |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` | Vercel env | Vercel env |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` | Vercel env | Vercel env |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` | Vercel env | Vercel env |
| `ANTHROPIC_API_KEY` | `.env.local` | Vercel env | Vercel env |
| `GOOGLE_API_KEY` | `.env.local` | Vercel env | Vercel env |
| `METLIBRARY_SUPABASE_URL` | `.env.local` | Vercel env | Vercel env |
| `METLIBRARY_SERVICE_ROLE_KEY` | `.env.local` | Vercel env | Vercel env |
| `VERCEL_TOKEN` | — | GitHub secret | GitHub secret |

### 4.2 Rotation

| Secret | Rotation Cadence | Procedure |
|---|---|---|
| Supabase anon key | On compromise only | Regenerate in Supabase dashboard, update Vercel |
| Supabase service role key | Quarterly | Regenerate, update Vercel + .env.local |
| Anthropic API key | Quarterly | Regenerate in Anthropic console, update Vercel |
| Google API key | Quarterly | Regenerate in Google AI Studio, update Vercel |
| MetLibrary credentials | Per Metrology Institute policy | Coordinate with Metrology Institute |

---

## 5. Monitoring & Alerting

### 5.1 Health Check

**Endpoint:** `GET /api/health`

**Checks:**
- `app` — application responding
- `supabase` — database connectivity
- `ai_engine` — Anthropic API key configured
- `metlibrary` — MetLibrary federation configured

**Response:** `{ status: "healthy" | "degraded" | "unhealthy", checks: {...} }`

### 5.2 Monitoring Stack

| Signal | Tool | Alert Threshold |
|---|---|---|
| Uptime | Vercel / external ping | Health check returns 503 for > 2 min |
| Response time | Vercel Analytics | p95 > 3s |
| Error rate | Vercel logs | > 1% of requests return 5xx |
| Build failures | GitHub Actions | Any failure on main or staging |
| Database size | Supabase dashboard | > 80% of plan limit |
| MetLibrary latency | Application logs | Federation p95 > 2s |

---

## 6. Disaster Recovery Plan

### 6.1 Recovery Targets

| Metric | Target |
|---|---|
| RPO (Recovery Point Objective) | 24 hours (daily Supabase backup) |
| RTO (Recovery Time Objective) | 4 hours |

### 6.2 Scenarios

| Scenario | Impact | Recovery Procedure | RTO |
|---|---|---|---|
| Vercel deployment failure | Site down | Roll back to previous deployment via Vercel dashboard | < 5 min |
| Database corruption | Data loss | Restore from Supabase daily backup | 1–2 hours |
| API key compromise | Unauthorized access | Rotate key immediately, redeploy | < 30 min |
| MetLibrary federation down | Degraded AI responses (no standards grounding) | Application falls back gracefully; MET announces unavailability | Automatic |
| Anthropic API outage | Chat unavailable | Display maintenance message; queue no requests | Depends on Anthropic |
| Complete infrastructure loss | Full outage | Provision new Supabase project, replay migrations, restore backup, redeploy to Vercel | 4 hours |

### 6.3 Recovery Runbook

**Database restore:**
1. Log into Supabase dashboard (MET Scientia LLC org)
2. Select MET-FieldGuide project
3. Navigate to Database → Backups
4. Select the most recent backup before the incident
5. Restore to a new branch or in-place
6. Verify data integrity with smoke test
7. If using manual pg_dump: restore from cloud storage to new project, update Vercel env

**Full rebuild from git:**
1. Clone the met-teddy-app repository
2. Provision a new Supabase project in the MET Scientia LLC org
3. Apply migrations in order: 0001, 0002, 0003, then content schema migrations from MET-FieldGuide
4. Run content import and embedding pipeline from MET-FieldGuide seed files
5. Configure Vercel project with new Supabase credentials
6. Deploy to Vercel
7. Verify with smoke test and health check

---

## 7. Infrastructure Independence Attestation

This infrastructure specification confirms that MET and Teddy production infrastructure is wholly independent from MetTutor:

- Separate Vercel account and project
- Separate Supabase organization and project
- Separate domain and SSL certificates
- Separate CI/CD pipeline (GitHub Actions)
- Separate secrets management (no shared vault)
- Separate monitoring and alerting
- Separate backup and disaster recovery
- MetLibrary accessed under an independent entitlement with separate credentials

No shared runtime, cluster tenancy, credential store, or deployment pipeline exists between the two applications.

**Attested by:** MET Scientia, LLC
**Date:** August 2026

---

*MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
