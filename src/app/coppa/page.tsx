// src/app/coppa/page.tsx
// Children's Privacy Policy (COPPA disclosure) for MET and Teddy.
// Linked from ParentalConsentForm and referenced in middleware's
// public route list — previously missing, so that link 404'd.

export default function CoppaPage() {
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
          Children&apos;s Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--met-text-muted)" }}>
          MET and Teddy · MET Universe · Effective August 2026
        </p>

        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "var(--met-text-secondary)" }}
        >
          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              COPPA Compliance
            </h2>
            <p>
              MET and Teddy, operated by MET Scientia, LLC, complies with the
              Children&apos;s Online Privacy Protection Act (COPPA).
              Verifiable parental consent is required before collecting
              personal information from a child under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              How Consent Works
            </h2>
            <p>
              A parent or guardian registers on the child&apos;s behalf and
              acknowledges what is collected and why. Consent becomes
              verified when the parent confirms their own email address —
              the same confirmation step every account requires. The
              child&apos;s account does not become usable until that
              verification completes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              What We Collect for a Child Under 13
            </h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>First name only — no last name</li>
              <li>Grade level, to set an age-appropriate certification level</li>
              <li>Measurement data the child creates during Field Missions</li>
              <li>Badge progress</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              What We Do Not Collect
            </h2>
            <ul className="space-y-1 list-disc pl-5">
              <li>No photos, no location data, no contact information</li>
              <li>No social features, no messaging between students</li>
              <li>No advertising, no data sold to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Your Rights as a Parent
            </h2>
            <p>
              Review your child&apos;s data from your dashboard at any time.
              Revoke consent at any time — this deactivates the account.
              Request complete deletion of all data.
            </p>
          </section>

          <div className="met-ruler-divider mt-8" />

          <p className="text-xs mt-4" style={{ color: "var(--met-text-muted)" }}>
            © 2026 MET Scientia, LLC · MET and Teddy · In Support of the Metrology Institute
          </p>
        </div>
      </article>
    </div>
  )
}
