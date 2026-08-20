# MET and Teddy — Separation Charter

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC
**Status:** For Approval

---

## 1. Purpose

This charter formally defines MET and Teddy as a separate application from MetTutor. It establishes the boundaries — product, audience, data, brand, and infrastructure — that govern the two applications and ensures that neither depends on the other for any operational function.

The charter also defines the shared MetLibrary arrangement and its limits, the conditions under which the MET and Teddy persona is removed from MetTutor, and the responsibilities of each product team.

This document is binding upon approval by MET Scientia, LLC.

---

## 2. Product Boundaries

### 2.1 What Each Product Is

| Product | Definition |
|---|---|
| **MET and Teddy** | An AI-powered measurement science learning adventure for K–12 students (ages 5–18), their parents, and their educators. Lives in MET Universe. Owned and operated by MET Scientia, LLC. |
| **MetTutor** | A professional AI-powered measurement science platform for college students and working practitioners — calibration technicians, metrology engineers, quality managers, and lab directors. |

### 2.2 What Each Product Owns

| Asset | MET and Teddy | MetTutor |
|---|---|---|
| Application shell | MET Universe | MetTutor platform |
| Knowledge base (owned) | MET Field Guide | — |
| Knowledge base (shared, read) | MetLibrary (via independent entitlement) | MetLibrary (via independent entitlement) |
| AI persona | MET and Teddy (K–12 character pair) | Professional assistant (no character) |
| Certification system | Explorer → Investigator → Innovator → Metrologist | ASQ CCT exam alignment |
| Learning modes | Field Missions, Concept, My Field Notebook, Badges | Concept, Problems, Exam Prep, Documents |
| Content tiers | Tier 1 (core), Tier 2 (industry/careers/stories), Tier 3 (curated external) | MetLibrary direct access |
| Standards Bridge | Owned and operated | Not applicable |
| Badge system | Open Badges 3.0, issued by MET Scientia, LLC | Not applicable |
| COPPA compliance surface | Required (under-13 users) | Not applicable (18+ users) |

### 2.3 What Neither Product Shares

The following are explicitly prohibited between the two applications:

- Application shell, routes, or navigation components
- User accounts, credentials, sessions, or authentication tokens
- Student data, notebook entries, badge records, or progress data
- AI system prompts, level-adaptation layers, or Teddy behavioral logic
- Infrastructure: hosting, CI/CD pipelines, databases, secrets, or monitoring
- Brand identity: logos, color palettes, character assets, or marketing copy
- Code dependencies: no shared npm packages, no shared internal libraries, no shared API endpoints

---

## 3. Audience Boundaries

| Boundary | MET and Teddy | MetTutor |
|---|---|---|
| Age range | 5–18 (K–12) | 18+ (college and professional) |
| Account types | Student, Parent, Educator | Individual professional |
| Regulatory surface | COPPA (Children's Online Privacy Protection Act) | Standard professional data handling |
| Parental involvement | Required for under-13; optional for 13–18 | Not applicable |
| School/district provisioning | Supported (classroom accounts, bulk consent) | Not applicable |

A user who is both a professional (MetTutor) and a parent (MET and Teddy) holds two independent accounts with no linkage between them.

---

## 4. Data Boundaries

### 4.1 Data Segregation Policy

| Principle | Implementation |
|---|---|
| Separate databases | MET and Teddy uses the MET-FieldGuide Supabase project (org `ohaylbnvnijrdhfsxzqf`, project `fcupipvoekuzxhmtgpsq`). MetTutor uses its own Supabase project. No shared tenancy. |
| Separate credentials | No API keys, service role keys, or signing secrets are shared. |
| Separate auth | Independent Supabase Auth instances. No SSO, no federated identity, no shared session tokens. |
| No data flow | No student data flows from MET and Teddy to MetTutor or vice versa. |
| Independent backups | Each application manages its own backup and disaster recovery. |
| Independent deletion | COPPA deletion requests in MET and Teddy have no effect on MetTutor and vice versa. |

### 4.2 MetLibrary Is Content, Not Data

Both applications access MetLibrary as a read-only content source under separate arrangements with the Metrology Institute. MetLibrary access creates no data dependency between the two applications. A student's retrieval of MetLibrary content in MET and Teddy produces no record in MetTutor, and a professional's retrieval in MetTutor produces no record in MET and Teddy.

---

## 5. Brand Boundaries

| Element | MET and Teddy | MetTutor |
|---|---|---|
| Platform name | MET Universe | MetTutor |
| Platform footer | "MET Universe — A MET Scientia Experience" | MetTutor footer |
| Tagline | "Every measurement tells a story" | Professional positioning |
| Characters | MET (Measurement Education Tutor) and Teddy | None after persona strip |
| Color palette | Teal 400 / Amber 400 balanced — warm, adventurous | Professional palette |
| Visual motifs | Ruler ticks, grid lines, field notebook | Professional |
| Copyright | © 2026 MET Scientia, LLC | Separate copyright |
| Citation footer | "📐 Source: MET Field Guide · [standard name] via Standards Bridge" | Direct MetLibrary citation |

The MET and Teddy characters, their visual assets, their voice, and their behavioral engine are owned exclusively by MET Scientia, LLC. Upon persona strip (§7), MetTutor retains no MET and Teddy character assets.

---

## 6. MetLibrary Shared-Use Terms

### 6.1 Arrangement

Both MET and Teddy and MetTutor access MetLibrary under separate entitlement agreements with the Metrology Institute. The shared content source creates no runtime, data, credential, or account dependency between the two applications.

### 6.2 Terms (Pending Metrology Institute Agreement)

| Term | MET and Teddy | MetTutor |
|---|---|---|
| Access type | Read-only federation | Read-only direct |
| Credentials | Independent API key and service role key | Independent API key and service role key |
| Rate limits | Per agreement | Per agreement |
| Content mediation | MET mediates all MetLibrary content through the level-adaptation and source-blending policy. No raw standards text reaches students below the Metrologist level. | Unmediated — professionals receive MetLibrary content directly. |
| Revision notification | Metrology Institute notifies both applications independently when content is revised. Each application reconciles independently. |
| Cost allocation | Per agreement | Per agreement |

### 6.3 What This Arrangement Is Not

- It is not a shared database. Each application queries MetLibrary independently.
- It is not a data pipeline between the two applications.
- It does not create any account, session, or credential linkage.
- It does not give either application visibility into the other's retrieval patterns.

---

## 7. Persona-Strip Commitment

### 7.1 Definition

The "persona strip" is the removal of all MET and Teddy character assets, K–12 prompt layers, Teddy behavioral logic, grade-band content, and routing from MetTutor.

### 7.2 Trigger

The persona strip is triggered when all of the following conditions are met:

1. MET and Teddy is deployed to production in MET Universe (Step 4.16 complete)
2. Public access is activated
3. Parent and educator onboarding is functional
4. The referral path from MetTutor to MET Universe is live
5. MET Scientia, LLC approves the strip

### 7.3 Scope of Removal

| Remove from MetTutor | Retain in MetTutor |
|---|---|
| MET character persona | Full unmediated MetLibrary access |
| Teddy character and behavioral engine | Professional assistant persona |
| K–12 prompt layers and level-adaptation | Professional-level prompts |
| Grade-band content routing | All professional learning modes |
| MET and Teddy visual assets | MetTutor brand identity |
| Explorer/Investigator/Innovator/Metrologist naming | ASQ CCT exam alignment |
| Field Missions, My Field Notebook, Badges | Concept, Problems, Exam Prep, Documents |

### 7.4 Rollback

If the strip reveals issues, MetTutor can restore the MET and Teddy persona from the pre-strip backup for up to 30 days. After 30 days, the backup is deleted and the strip is permanent.

### 7.5 Post-Strip Referral

After the strip, MetTutor displays a referral notice for K–12 enquiries:

> "Looking for measurement science for K–12 students? Visit MET and Teddy in MET Universe — where measurement comes alive. metandteddy.com"

---

## 8. RACI Matrix

| Activity | MET Scientia, LLC (MET and Teddy) | MetTutor Team |
|---|---|---|
| MET and Teddy product decisions | **R, A** | I |
| MetTutor product decisions | I | **R, A** |
| MET Field Guide content | **R, A** | — |
| MetLibrary entitlement (MET and Teddy) | **R, A** | I |
| MetLibrary entitlement (MetTutor) | I | **R, A** |
| MET and Teddy infrastructure | **R, A** | — |
| MetTutor infrastructure | — | **R, A** |
| Persona strip planning | **A** | **R** |
| Persona strip execution | **A** (approves) | **R** (executes) |
| Persona strip verification | **R, A** | C |
| Brand identity (MET Universe) | **R, A** | — |
| COPPA compliance | **R, A** | — |
| Open Badges 3.0 issuance | **R, A** | — |
| Standards Bridge operations | **R, A** | — |

R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 9. Governance

### 9.1 Charter Amendments

This charter may be amended only by written approval of MET Scientia, LLC.

### 9.2 Dispute Resolution

Boundary disputes are resolved by reference to this charter. Where the charter is silent, the principle of maximum separation applies: if a capability, asset, or data element could reasonably belong to either product, it belongs to neither until explicitly assigned.

### 9.3 Review Cadence

This charter is reviewed annually or upon any material change to either application's scope, audience, or infrastructure.

---

## 10. Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| MET Scientia, LLC — Owner | | | |
| MET and Teddy — Product Lead | | | |
| MetTutor — Product Lead | | | |

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
