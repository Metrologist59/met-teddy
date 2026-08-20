# MET and Teddy — School & District Deployment Guide

**Version:** 1.0.0
**Date:** August 2026
**Owner:** MET Scientia, LLC

---

## 1. Overview

MET and Teddy is a web-based measurement science learning platform for K–12 students. It runs in any modern browser — no installation, no app store, no device management required. Schools and districts can deploy classroom-wide through educator accounts.

**URL:** https://metandteddy.com
**Requirements:** Modern browser (Chrome, Safari, Firefox, Edge), internet connection
**Devices:** Desktop, laptop, Chromebook, iPad, tablet, phone
**Install:** Optional — installable as a progressive web app (PWA) for home-screen access

---

## 2. Deployment Options

### Option A: Browser Access (Recommended)

Students navigate to metandteddy.com and log in. No IT involvement required beyond allowing the domain.

**IT action:** Allowlist `metandteddy.com` and `*.supabase.co` in your web filter.

### Option B: PWA Install

Students visit metandteddy.com in Chrome or Safari and select "Add to Home Screen" or "Install App." Creates a standalone app experience without an app store.

**IT action:** Same as Option A. PWA installation may require device policy adjustment on managed Chromebooks.

### Option C: Managed Chromebook Deployment

For districts managing Chromebooks through Google Admin Console:

1. Add `metandteddy.com` to the allowed URL list
2. Optionally force-install the PWA via Google Admin → Apps & Extensions → Add → Add from URL
3. The app appears on the student's shelf without manual install

---

## 3. Account Provisioning

### 3.1 Educator-Led (Recommended for Schools)

1. Educator creates an educator account at metandteddy.com/register
2. Educator creates a classroom with grade band
3. Educator adds students by first name only (COPPA data minimization)
4. Students receive login credentials from their educator
5. No parental consent form required — covered by the district COPPA agreement

### 3.2 District Agreement (Bulk)

For districts provisioning across multiple schools:

1. District signs the MET and Teddy COPPA District Agreement
2. Agreement covers parental consent for all enrolled students
3. MET Scientia, LLC provisions educator accounts for each participating teacher
4. Educators manage their own classrooms from the dashboard

### 3.3 Account Types

| Type | Created By | Can See | Can Do |
|---|---|---|---|
| Student | Parent or educator | Own notebook, badges, missions | Chat, missions, notebook |
| Parent | Self-registration | Own child's data only | View progress, adjust level, revoke consent |
| Educator | Self-registration | All students in their classrooms | View progress, adjust levels, manage roster |

---

## 4. COPPA Compliance for Schools

### 4.1 Data Collected

- Student first name only (no last name for under-13)
- Grade level
- Measurement data (notebook entries — student work product)
- Badge progress
- Chat interactions with MET (AI responses, not stored long-term)

### 4.2 Data NOT Collected

- No photos, videos, or audio
- No location data
- No contact information from students
- No social features or messaging between students
- No advertising
- No data sold to third parties

### 4.3 School Exception to Individual Consent

Under COPPA, schools may consent on behalf of parents for educational technology used in the classroom. The MET and Teddy District Agreement provides this authorization. Individual parental consent is not required when the school has signed the agreement.

### 4.4 Data Retention & Deletion

- Student data is retained for the school year unless the educator or district requests earlier deletion
- Upon request, all student data is deleted within 30 days
- Deletion is logged in the audit trail
- Educators can remove individual students from their classroom at any time

---

## 5. Technical Requirements

### 5.1 Browser Support

| Browser | Minimum Version | Status |
|---|---|---|
| Chrome | 100+ | Full support |
| Safari | 16+ | Full support |
| Firefox | 100+ | Full support |
| Edge | 100+ | Full support |
| Chrome on Android | 100+ | Full support |
| Safari on iOS | 16+ | Full support |

### 5.2 Network Requirements

| Resource | Domain | Port | Protocol |
|---|---|---|---|
| Application | metandteddy.com | 443 | HTTPS |
| Database | *.supabase.co | 443 | HTTPS |
| Fonts | fonts.googleapis.com | 443 | HTTPS |
| AI Engine | api.anthropic.com | 443 | HTTPS |

### 5.3 Bandwidth

- Initial page load: ~500 KB
- Ongoing chat: ~5–20 KB per message exchange
- No video or audio streaming
- Suitable for low-bandwidth environments

---

## 6. Accessibility

MET and Teddy targets WCAG 2.1 AA compliance:

- Keyboard navigable throughout
- Screen reader compatible
- Color contrast ≥ 4.5:1
- Reduced motion support
- Focus indicators on all interactive elements
- Form labels on all inputs

---

## 7. Support

| Channel | Contact |
|---|---|
| Educator support | support@metandteddy.com |
| Technical issues | support@metandteddy.com |
| COPPA and privacy | privacy@metscientia.com |
| District agreements | partnerships@metscientia.com |

---

## 8. Pricing

| Tier | Access | Cost |
|---|---|---|
| Explorer (K–2) | Full access to Explorer-level content | Free |
| Full Access (all levels) | All certification levels, all missions | Contact for school/district pricing |

---

## 9. Procurement Checklist

For district procurement officers:

- [ ] COPPA District Agreement signed
- [ ] Data Processing Agreement (DPA) reviewed
- [ ] `metandteddy.com` and `*.supabase.co` allowlisted
- [ ] Educator accounts provisioned
- [ ] Student roster loaded per classroom
- [ ] Parent notification sent (per district policy)
- [ ] Accessibility requirements confirmed (WCAG 2.1 AA)

---

*MET and Teddy · MET Universe — A MET Scientia Experience*
*© 2026 MET Scientia, LLC*
