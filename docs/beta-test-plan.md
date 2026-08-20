# MET and Teddy — Beta Testing Program

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Objectives

Validate MET and Teddy with real users before production launch. Collect actionable data on:

- Engagement: Do students return? How long do they stay?
- Comprehension: Does the level-adaptive content work across the K–12 span?
- Notebook usability: Do students complete entries? Is the template appropriate per level?
- Badge motivation: Do badges drive behavior? Is the notebook requirement understood?
- Character appeal: Is MET's voice right? Does Teddy resonate at each level?
- Citation comprehension: Do Innovator/Metrologist students understand the Standards Bridge citations?
- Dashboard utility: Do parents and educators find the progress view useful?
- Technical stability: Errors, performance, device compatibility

---

## 2. Participant Groups

### 2.1 Target Composition

| Group | Participants | Levels Covered | Recruitment Source |
|---|---|---|---|
| Homeschool families | 8–12 families (2–3 per level) | All four | Homeschool co-ops, STEM Facebook groups, MET Scientia network |
| STEM classroom | 1–2 classrooms (20–30 students each) | Explorer or Investigator | Partner school or after-school STEM program |
| Individual students | 8–12 students | Innovator and Metrologist | Science fair participants, STEM camps, educator referrals |
| Parents | 8–12 (linked to student participants) | — | Recruited with their children |
| Educators | 2–4 (linked to classrooms) | — | Recruited with their classrooms |

### 2.2 Participant Criteria

| Criterion | Requirement |
|---|---|
| Age range | 5–18 (K–12) |
| Parental consent | Required for all under-18 participants |
| Device access | Tablet, laptop, or desktop with modern browser |
| Internet access | Reliable connection for chat and retrieval |
| Prior measurement knowledge | Not required — the app teaches from zero |
| Commitment | 3 sessions per week for 4 weeks minimum |

### 2.3 Recruitment Materials

**Email to homeschool families:**
> Your child is invited to beta-test MET and Teddy — an AI-powered measurement science adventure for K–12 students. MET is a Measurement Education Tutor, and Teddy is his curious mini Goldendoodle. Together they guide students through hands-on Field Missions, a measurement notebook, and a badge system — all grounded in real measurement science standards. We're looking for families to test the experience and share feedback before public launch. Participation is free and takes about 2–3 sessions per week for 4 weeks.

**Email to STEM educators:**
> We're inviting STEM classrooms to pilot MET and Teddy — an AI measurement science platform for K–12. The app includes hands-on Field Missions aligned to NGSS measurement practices, an interactive notebook, and a badge system with verifiable credentials. We need 1–2 classrooms to test the full experience and provide teacher feedback. All accounts are free during beta, and your students earn real Open Badges 3.0 credentials.

---

## 3. Beta Timeline

| Week | Activity |
|---|---|
| Week 0 | Recruit participants, sign consent forms, provision accounts |
| Week 1 | Onboarding: account creation, age gate, level assignment, first mission |
| Week 2 | Core usage: chat with MET, complete 2–3 missions, begin notebook entries |
| Week 3 | Engagement: badge progress, notebook feedback from MET, dashboard review |
| Week 4 | Sustained usage: complete remaining missions, earn badges, explore freely |
| Week 5 | Feedback collection: surveys, interviews, educator debrief |
| Week 6 | Analysis and report |

---

## 4. Test Scenarios

### 4.1 Onboarding (All Levels)

| # | Scenario | Success Criteria |
|---|---|---|
| O1 | Parent creates account for under-13 child | Account created, consent recorded, child account active |
| O2 | Student (13+) self-registers | Account created, level assigned correctly |
| O3 | Educator creates classroom and adds students | Classroom created, all students can log in |
| O4 | Student completes onboarding flow | Level reveal → notebook setup → first mission, all steps completed |
| O5 | Level assignment matches grade band | Grade 2 → Explorer, Grade 5 → Investigator, etc. |

### 4.2 Chat Interface

| # | Scenario | Success Criteria | Level |
|---|---|---|---|
| C1 | Student asks "What is measurement?" | MET responds at level, Teddy appears, citation present | All |
| C2 | Student asks about a concept above their level | MET acknowledges and redirects without ranking | Explorer |
| C3 | Student addresses Teddy directly | MET narrates Teddy's body language response | Explorer, Investigator |
| C4 | Student asks about a specific standard | Citation includes Standards Bridge reference | Metrologist |
| C5 | Student asks about a career in measurement | Tier 2 career content retrieved and cited | All |
| C6 | Chat handles 10+ messages in a session | No errors, consistent character, auto-scroll works | All |

### 4.3 Field Missions

| # | Scenario | Success Criteria | Level |
|---|---|---|---|
| M1 | Student opens mission catalog | All missions for their level displayed | All |
| M2 | Student starts "Measure Teddy" | Materials checklist → steps → completion | Explorer |
| M3 | Student completes mission without notebook entry | Nudge displayed, no badge earned | All |
| M4 | Student completes mission with notebook entry | Badge earned, celebration displayed | All |
| M5 | Safety banner displays correct supervision level | K-2: "Adult co-pilot required" | All |

### 4.4 Field Notebook

| # | Scenario | Success Criteria | Level |
|---|---|---|---|
| N1 | Student creates first notebook entry | Template matches level, entry saved | All |
| N2 | Student records multiple measurements | Multiple trials accepted, stats calculated (Inv+) | Investigator+ |
| N3 | Student completes reflection | Reflection saved, quality score improves | All |
| N4 | Student requests MET feedback | AI feedback received, level-appropriate | All |
| N5 | Metrologist student fills uncertainty budget | Uncertainty components recorded | Metrologist |

### 4.5 Badges

| # | Scenario | Success Criteria | Level |
|---|---|---|---|
| B1 | Student earns first badge | Celebration overlay appears with MET and Teddy | All |
| B2 | Badge gallery shows progress | In-progress badges display percentage | All |
| B3 | Certification milestone tracks progress | Progress bar updates as badges earned | All |
| B4 | Open Badge credential generated | Valid OB3 JSON, MET Scientia LLC as issuer | Metrologist |

### 4.6 Dashboard

| # | Scenario | Success Criteria | Level |
|---|---|---|---|
| D1 | Parent views child's progress | Missions, badges, notebook entries visible | Parent |
| D2 | Parent adjusts child's level | Level override applied, content adapts | Parent |
| D3 | Educator views classroom | All students visible with progress cards | Educator |
| D4 | Educator sorts/filters students | Sort by name/level/activity works | Educator |

---

## 5. Feedback Instruments

### 5.1 Student Survey (Administered by Parent/Educator)

**Explorer/Investigator version (read aloud by adult):**

1. Did you like talking to MET? (😊 😐 😞)
2. Was Teddy fun? (😊 😐 😞)
3. Did you understand what MET told you? (😊 😐 😞)
4. Was the mission fun? (😊 😐 😞)
5. Did you like writing in your notebook? (😊 😐 😞)
6. What was your favorite part?
7. What was confusing?
8. Would you come back and use it again? (Yes / Maybe / No)

**Innovator/Metrologist version (self-administered):**

1. How would you rate MET's explanations? (1–5 stars)
2. Were the concepts at the right level for you — too easy, about right, or too hard?
3. Did you understand the citation at the bottom of MET's responses?
4. Was the notebook template useful for recording your data?
5. Did earning badges motivate you to complete missions and notebook entries?
6. What topic would you like MET to cover that wasn't available?
7. How does MET compare to other learning tools you've used?
8. Would you recommend MET and Teddy to a friend? (1–10 NPS)

### 5.2 Parent Survey

1. Was the onboarding process clear and comfortable?
2. Did you feel informed about what data is collected (COPPA)?
3. How useful was the parent dashboard for tracking progress?
4. Did your child engage with MET and Teddy independently?
5. Did the level seem right for your child?
6. Would you continue using MET and Teddy after beta? (Yes / Maybe / No)
7. Would you pay for full access? If so, what price feels fair?
8. Any concerns about safety, privacy, or content?

### 5.3 Educator Survey

1. Was classroom setup straightforward?
2. How useful was the classroom dashboard?
3. Did the content align with what you teach?
4. Were the Field Missions practical for your classroom environment?
5. Did the level differentiation work for mixed-ability classrooms?
6. Would you adopt MET and Teddy for your full class? (Yes / Maybe / No)
7. What features would you need for formal classroom adoption?
8. How does this compare to other STEM tools you use?

### 5.4 Observation Log (Administered During Sessions)

| Timestamp | Student ID | Level | What Happened | Friction Point? | Quote |
|---|---|---|---|---|---|
| | | | | | |

Track: confusion moments, delight moments, abandonment points, help requests, misunderstandings.

---

## 6. Metrics to Collect

### 6.1 Engagement

| Metric | How Measured |
|---|---|
| Session count per student per week | Server logs |
| Session duration (minutes) | Server logs |
| Return rate (% who come back day 2, week 2) | Server logs |
| Messages sent per session | Chat API logs |
| Missions started vs completed | Database |
| Notebook entries per student | Database |

### 6.2 Learning

| Metric | How Measured |
|---|---|
| Concepts explored per student | Retrieval logs |
| Citation footer engagement (Innovator+) | Expandable citation clicks |
| Quality score progression over entries | QualityScore data |
| Reflection completion rate | Database |

### 6.3 Motivation

| Metric | How Measured |
|---|---|
| Badges earned per student | Database |
| Mission-to-notebook conversion rate | Cross-reference mission completions and notebook entries |
| Badge celebration dismissal time | UI event (how long they look at it) |
| Voluntary re-engagement after earning a badge | Server logs |

### 6.4 Technical

| Metric | How Measured |
|---|---|
| Error rate (5xx responses) | Server logs |
| Chat response latency (p50, p95) | API timing |
| MetLibrary federation latency | Retrieval logs |
| Device/browser distribution | User agent logs |

---

## 7. Analysis Framework

### 7.1 Success Criteria

| Dimension | Target | Minimum Viable |
|---|---|---|
| Student return rate (week 2) | ≥70% | ≥50% |
| Mission completion rate | ≥60% of started missions | ≥40% |
| Notebook entry rate | ≥1 entry per 2 missions | ≥1 per 3 |
| Student satisfaction (survey) | ≥4/5 stars | ≥3.5/5 |
| Parent satisfaction | ≥80% "would continue" | ≥60% |
| Educator adoption intent | ≥1 educator "would adopt" | ≥1 "maybe" |
| NPS (Innovator/Metrologist) | ≥30 | ≥10 |
| Error rate | <1% | <3% |
| Chat p95 latency | <5s | <8s |

### 7.2 Analysis Report Structure

1. Executive summary (key findings, go/no-go recommendation)
2. Participant demographics and engagement data
3. Per-level analysis (what worked, what didn't, at each level)
4. Feature-by-feature findings (chat, missions, notebook, badges, dashboard)
5. Technical performance
6. Verbatim quotes (organized by theme)
7. Actionable recommendations (prioritized)
8. Go/no-go decision for production launch

---

## 8. Risk Management

| Risk | Mitigation |
|---|---|
| Low recruitment | Incentivize with free continued access + early adopter badge |
| COPPA consent friction | Pre-fill consent forms, provide phone support for parents |
| Technical failures during beta | Monitor health endpoint, have rollback plan, daily log review |
| Negative feedback on character appeal | Treat as data — this is why we beta test |
| Insufficient data for analysis | Set minimum 3 sessions per participant as requirement |
| MetLibrary federation unavailable | App degrades gracefully; note in analysis if it affected responses |

---

## 9. Post-Beta Actions

| Finding | Action |
|---|---|
| Level adaptation too easy/hard | Adjust prompts and blend ratios (Step 4.12) |
| Teddy prominence wrong | Adjust PROMINENCE_BY_LEVEL config |
| Badge motivation weak | Revise badge criteria or celebration design |
| Notebook template friction | Simplify or add guidance per level |
| Citation confusion at upper levels | Adjust citation format or add explainer |
| Technical issues | Fix and retest before launch |
| Strong positive signal | Proceed to pre-launch QA (Step 4.15) |

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
