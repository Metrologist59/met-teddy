# MET and Teddy — Production Launch Plan

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC
**Prerequisite:** Step 4.15 Pre-Launch QA passed with GO decision

---

## 1. Launch Summary

| Item | Value |
|---|---|
| Application | MET and Teddy |
| Domain | metandteddy.com |
| Platform | MET Universe |
| Hosting | Vercel (production deployment) |
| Database | Supabase — MET Scientia LLC org, MET-FieldGuide project |
| Initial access | Free (Explorer tier public) |
| Target audiences | K–12 students, parents, educators |
| Owner | MET Scientia, LLC |

---

## 2. Pre-Launch Checklist (D-7 to D-1)

### D-7: Infrastructure

- [ ] Vercel production project created and configured
- [ ] metandteddy.com DNS pointed to Vercel
- [ ] SSL certificate provisioned and verified
- [ ] metandteddy.ai redirects to metandteddy.com
- [ ] All environment variables set in Vercel production
- [ ] Supabase project confirmed on MET Scientia LLC org
- [ ] Application migrations applied (0001, 0002, 0003)
- [ ] Content imported and embedded (88 entries, 1,000 chunks)

### D-3: Verification

- [ ] Pre-Launch QA (Step 4.15) GO decision received
- [ ] All 151 automated tests pass on production build
- [ ] Health endpoint (`/api/health`) returns `healthy`
- [ ] COPPA compliance certification signed
- [ ] Separation charter signed
- [ ] Privacy policy live at metandteddy.com/privacy

### D-1: Final

- [ ] Production build deployed to Vercel (`--prod`)
- [ ] Landing page loads at metandteddy.com
- [ ] Registration flow functional (student, parent, educator)
- [ ] Chat responds (test message at each level)
- [ ] Missions catalog loads
- [ ] Badge gallery loads
- [ ] PWA manifest served correctly
- [ ] Monitoring alerts configured
- [ ] Support email (support@metandteddy.com) receiving
- [ ] MetTutor referral banner deployed (Step 4.13 §7)

---

## 3. Launch Day Runbook (D-0)

### 3.1 Launch Sequence

| Time | Action | Owner | Verify |
|---|---|---|---|
| 06:00 | Final health check — `/api/health` returns healthy | Tech lead | Status 200 |
| 06:15 | Verify all environment variables in Vercel production | Tech lead | No placeholders |
| 06:30 | Run production smoke test (5 test queries, one per page) | Tech lead | All pass |
| 07:00 | Enable Supabase Auth (re-add middleware if not done) | Tech lead | Login works |
| 07:15 | Create first real parent + student account (internal test) | Content lead | Full flow works |
| 07:30 | **Public access activated** — no code change needed, app is live | Owner | metandteddy.com accessible |
| 08:00 | Send launch announcement (see §6) | Owner | Email sent |
| 08:00 | Post to social channels | Owner | Posts live |
| 08:00 | Activate MetTutor referral banner | MetTutor lead | Banner displays |
| 09:00 | First monitoring check — errors, latency, signups | Tech lead | Dashboard reviewed |
| 12:00 | Midday monitoring check | Tech lead | No issues |
| 18:00 | End-of-day monitoring check | Tech lead | Metrics recorded |

### 3.2 Rollback Procedure

If a critical issue is discovered on launch day:

| Severity | Action |
|---|---|
| Page won't load | Roll back to previous Vercel deployment (< 2 min) |
| Auth broken | Disable middleware, allow unauthenticated access temporarily |
| AI not responding | Display maintenance message in chat, investigate API key |
| Data integrity issue | Take app offline, restore from pre-launch database snapshot |
| Security vulnerability | Take app offline immediately, investigate, patch, redeploy |

---

## 4. Launch Monitoring Dashboard

### 4.1 Real-Time Signals (Monitor Continuously D-0 Through D+7)

| Signal | Source | Alert Threshold |
|---|---|---|
| HTTP error rate | Vercel analytics | > 1% of requests return 5xx |
| Health endpoint | External ping (every 60s) | Non-200 for > 2 minutes |
| Chat API latency (p95) | Application logs | > 8 seconds |
| Chat API error rate | Application logs | > 5% of chat requests fail |
| Database connections | Supabase dashboard | > 80% of pool |
| MetLibrary federation | Application logs | Federation timeout > 3 consecutive |

### 4.2 Daily Metrics (Track D+1 Through D+30)

| Metric | Source | Day 1 Baseline |
|---|---|---|
| New signups (total) | profiles table | |
| Signups by role (student / parent / educator) | profiles table | |
| Signups by level (Explorer / Inv / Inn / Met) | profiles table | |
| Active sessions | Vercel analytics | |
| Chat messages sent | Chat API logs | |
| Missions started | Application data | |
| Missions completed | Application data | |
| Notebook entries created | notebook_entries table | |
| Badges earned | earned_badges table | |
| Parent dashboard views | Page analytics | |
| PWA installs | Vercel analytics | |

### 4.3 Weekly Metrics (Track W+1 Through W+8)

| Metric | Target |
|---|---|
| Week-1 retention (% of D+1 users active in W+1) | ≥ 40% |
| Mission completion rate (completed / started) | ≥ 50% |
| Notebook adoption (% of mission completers with entry) | ≥ 60% |
| Badge earn rate (badges / active students) | ≥ 1 per student |
| Level distribution | Roughly proportional to grade enrollment |
| Educator classroom creation | ≥ 1 classroom by W+2 |
| Chat satisfaction (if tracked) | ≥ 4/5 |
| Error rate trend | Declining or stable |

---

## 5. Initial Metrics Baseline

Record these on D+1 to establish the baseline:

| Metric | D+1 Value | Notes |
|---|---|---|
| Total users | | |
| Students | | |
| Parents | | |
| Educators | | |
| Explorer | | |
| Investigator | | |
| Innovator | | |
| Metrologist | | |
| Chat messages | | |
| Missions started | | |
| Missions completed | | |
| Notebook entries | | |
| Badges earned | | |
| Avg chat latency (ms) | | |
| Error rate (%) | | |
| Health status | | |

---

## 6. Launch Announcement

### 6.1 Email

> **Subject:** MET and Teddy is LIVE — Every Measurement Tells a Story
>
> We're thrilled to announce that **MET and Teddy** is now live at **metandteddy.com**!
>
> Meet MET — your Measurement Education Tutor — and his trusty companion Teddy, a curious 14-pound mini Goldendoodle who communicates entirely through body language. Together, they guide K–12 students through the world of measurement science.
>
> **What's inside:**
> - Chat with MET and Teddy — AI-powered measurement science tutoring adapted to four certification levels
> - Field Missions — hands-on measurement adventures with real tools
> - My Field Notebook — record, analyze, and reflect on your measurements
> - Badges — earn verifiable Open Badges 3.0 credentials issued by MET Scientia, LLC
>
> **Four certification levels:**
> - Explorer (K–2): Measure it. Tell me what you see!
> - Investigator (3–5): Measure it. Write it down. Now do it again.
> - Innovator (6–8): Why isn't it the same every time?
> - Metrologist (9–12): Quantify it. Defend it. Trace it.
>
> **Free to start.** Explorer-level access is free for everyone.
>
> **Safe for kids.** COPPA-compliant with parental consent for under-13. No ads, no data sales, no social features.
>
> Visit **metandteddy.com** and start exploring!
>
> *Every measurement tells a story.*
>
> — MET Scientia, LLC

### 6.2 Social Media (Short Form)

> 🧑‍🔬🐕 MET and Teddy is LIVE!
>
> AI-powered measurement science for K–12.
> Chat with MET. Complete Field Missions. Earn real badges.
> Explorer level is FREE.
>
> Every measurement tells a story.
> 👉 metandteddy.com
>
> #STEM #Measurement #K12 #METandTeddy #MeasurementScience

---

## 7. Post-Launch Support Plan

### 7.1 Support Channels

| Channel | Address | Response SLA |
|---|---|---|
| General support | support@metandteddy.com | 24 hours (business days) |
| Technical issues | support@metandteddy.com | 12 hours |
| COPPA / privacy | privacy@metscientia.com | 24 hours |
| District partnerships | partnerships@metscientia.com | 48 hours |
| Critical (app down) | Internal alert → tech lead | 1 hour |

### 7.2 Known Issues at Launch

| Issue | Impact | Workaround | Fix Timeline |
|---|---|---|---|
| Middleware removed for demo | No auth protection | Re-add when Supabase credentials configured | Pre-launch |
| ASQ CCT bridge entries missing clause refs | 4 bridge entries don't import | Manual clause reference addition | W+1 |
| MetLibrary federation pending | AI responses use cached/fallback content | App degrades gracefully | Pending Metrology Institute agreement |

### 7.3 Escalation Path

```
User reports issue → support@metandteddy.com
  → Tier 1: Content or usage question → respond within 24h
  → Tier 2: Technical bug → tech lead, respond within 12h
  → Tier 3: App down or data issue → immediate alert, 1h response
  → COPPA concern → privacy@metscientia.com, 24h response
```

### 7.4 Post-Launch Review Schedule

| Timing | Review |
|---|---|
| D+1 | Launch day metrics review — any critical issues? |
| D+7 | Week 1 review — user acquisition, error trends, support tickets |
| D+14 | Week 2 review — retention, engagement, first educator feedback |
| D+30 | Month 1 review — full metrics analysis, content operations check, beta comparison |
| D+90 | Quarter 1 review — growth trends, feature priorities, content expansion plan |

---

## 8. Success Criteria (D+30)

| Metric | Target | Status |
|---|---|---|
| Total registered users | ≥ 100 | |
| Week-1 retention | ≥ 40% | |
| Missions completed | ≥ 200 | |
| Notebook entries | ≥ 150 | |
| Badges earned | ≥ 100 | |
| Educator classrooms | ≥ 2 | |
| Error rate | < 1% | |
| Support tickets (critical) | 0 | |
| COPPA complaints | 0 | |

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
