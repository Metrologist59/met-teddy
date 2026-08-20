// src/app/privacy/page.tsx
// Privacy Policy for MET and Teddy.
// COPPA-compliant disclosure.

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ background: "var(--met-surface)" }}
    >
      <article className="max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--met-text-primary)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--met-text-muted)" }}>
          MET and Teddy · MET Universe · Effective August 2026
        </p>

        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "var(--met-text-secondary)" }}
        >
          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Who We Are
            </h2>
            <p>
              MET and Teddy is operated by MET Scientia, LLC. We provide an
              AI-powered measurement science learning experience for K–12
              students (ages 5–18). MET and Teddy is entirely separate from
              MetTutor, the professional platform. No data, accounts, or
              credentials are shared between the two.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Children's Privacy (COPPA)
            </h2>
            <p>
              We comply with the Children's Online Privacy Protection Act
              (COPPA). For students under 13, we require verifiable parental
              consent before collecting any personal information. We collect
              the minimum data necessary to provide the educational experience.
            </p>
            <p className="mt-2 font-medium" style={{ color: "var(--met-text-primary)" }}>
              For children under 13, we collect:
            </p>
            <p className="mt-1">
              First name only (no last name), grade level, measurement data
              created during Field Missions (notebook entries), and badge
              progress. We do not collect photos, location data, or contact
              information from children.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              What We Do Not Do
            </h2>
            <p>
              We do not display advertising. We do not sell data to third
              parties. We do not enable social features or messaging between
              students. We do not contact children outside the platform. We do
              not use data for any purpose other than providing the MET and
              Teddy educational experience.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Parental Rights
            </h2>
            <p>
              Parents and guardians can review all data collected about their
              child from the parent dashboard, revoke consent at any time
              (which deactivates the account), request complete deletion of
              all data, and adjust the child's certification level.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Data Storage and Security
            </h2>
            <p>
              Student data is stored on infrastructure operated by MET
              Scientia, LLC, independent from any other platform. Data is
              encrypted in transit and at rest. Access is restricted to
              authorized personnel only.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Educator and School Accounts
            </h2>
            <p>
              Schools may provision student accounts under a district
              agreement. In this case, COPPA consent is handled through the
              school's agreement rather than individual parental consent.
              Educators can manage student accounts, view progress, and
              adjust certification levels from the educator dashboard.
            </p>
          </section>

          <section>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--met-text-primary)" }}
            >
              Contact
            </h2>
            <p>
              For privacy inquiries, data access requests, or to exercise
              parental rights, contact MET Scientia, LLC at the address
              provided on our website.
            </p>
          </section>

          <div className="met-ruler-divider mt-8" />

          <p
            className="text-xs mt-4"
            style={{ color: "var(--met-text-muted)" }}
          >
            © 2026 MET Scientia, LLC · MET and Teddy · In Support of the Metrology Institute
          </p>
        </div>
      </article>
    </div>
  )
}
