# MET and Teddy — Independence Attestation
# Version: 1.0.0 · August 2026
# © 2026 MET Scientia, LLC

## Statement of Independence

MET and Teddy operates as an independent application with no shared
authentication, session, credential, directory, or account linkage
with MetTutor or any other platform.

## Specific Boundaries

| Boundary | Attestation |
|---|---|
| Authentication | Independent Supabase Auth instance on the MET Scientia LLC account. No shared auth provider, no SSO, no federated identity with MetTutor. |
| User accounts | Separate profiles table. A user who has both a MetTutor account and a MET and Teddy account has two independent accounts with no linkage. |
| Session tokens | Independent session management. No shared cookies, no shared JWT signing keys. |
| Database | MET-FieldGuide Supabase project (org `ohaylbnvnijrdhfsxzqf`, project `fcupipvoekuzxhmtgpsq`). No shared tenancy with MetTutor's project. |
| Credentials | No API keys, service keys, or secrets shared between the two applications. |
| Student data | Student profiles, notebook entries, badges, and progress records are stored exclusively in the MET and Teddy database under MET Scientia, LLC. |
| MetLibrary access | Both applications access MetLibrary under separate arrangements with the Metrology Institute. The shared content source creates no runtime, data, or account dependency between them. |

## COPPA Compliance

MET and Teddy implements COPPA-compliant data handling for students
under 13:

- Verifiable parental consent required before account activation
- Data minimization: first name only, no last name for under-13
- No advertising, no data sales, no social features
- Parental review, revocation, and deletion rights
- Educator/school provisioning under district agreements
- Auditable consent records with method and timestamp

## Effective Date

This attestation is effective as of the application's first deployment
and applies for the lifetime of the MET and Teddy application.

Attested by: MET Scientia, LLC
