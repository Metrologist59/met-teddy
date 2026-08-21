// src/app/terms/page.tsx
// Terms of Service / EULA for MET and Teddy.

import { EULA_VERSION } from "@/lib/legal"

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--met-text-muted)" }}>
          MET and Teddy · MET Universe · Version {EULA_VERSION} · Effective August 2026
        </p>

        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "var(--met-text-secondary)" }}
        >
          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Agreement to Terms
            </h2>
            <p>
              These Terms of Service govern use of MET and Teddy, operated by
              MET Scientia, LLC. By creating an account, you agree to these
              terms on behalf of yourself and, where applicable, the child
              whose account you are registering.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Educational Use
            </h2>
            <p>
              MET and Teddy is an educational tool for measurement science,
              intended for students ages 5–18, their parents, and their
              educators. It is not a substitute for classroom instruction and
              does not provide professional certification recognized outside
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Accounts
            </h2>
            <p>
              Accounts under 13 require a parent or guardian to register on
              the child&apos;s behalf and to provide verifiable parental
              consent, as described in our{" "}
              <a href="/coppa" className="underline" style={{ color: "var(--met-teal-400)" }}>
                Children&apos;s Privacy Policy
              </a>. School accounts may be provisioned by an educator under a
              district agreement. You are responsible for keeping your
              account credentials confidential.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Acceptable Use
            </h2>
            <p>
              MET and Teddy has no social features and no messaging between
              students. You agree not to attempt to circumvent age or
              consent verification, not to misuse the platform to collect
              data about other users, and not to interfere with its normal
              operation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Content and Badges
            </h2>
            <p>
              Certification levels (Explorer, Investigator, Innovator,
              Metrologist) and badges reflect progress within MET and Teddy
              only. They are issued by MET Scientia, LLC and are not
              equivalent to, and do not replace, formal academic credit or
              professional metrology certification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Changes to These Terms
            </h2>
            <p>
              We may update these terms as MET and Teddy evolves. Material
              changes will be reflected in a new version number, and
              continued use after a change constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Contact
            </h2>
            <p>
              For questions about these terms, contact MET Scientia, LLC at
              the address provided on our website.
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
