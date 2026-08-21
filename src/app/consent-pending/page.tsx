// src/app/consent-pending/page.tsx
// Reached by a parent_led account whose email is confirmed but whose
// parental consent has not (yet) been verified — e.g. consent was
// revoked, or the confirmation callback's consent flip failed. In the
// normal flow, confirming email and verifying consent happen in the
// same step, so this page is a defense-in-depth fallback rather than
// something most parents will see.

export default function ConsentPendingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--met-surface)" }}
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--met-text-primary)" }}>
          Parental consent needed
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--met-text-secondary)" }}>
          We can&apos;t open this account yet — verified parental consent is
          required by COPPA before a child&apos;s account can be used.
        </p>

        <div className="met-card p-6 space-y-4 text-left">
          <p className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
            If you just registered, confirming your email verifies your
            consent automatically — check your inbox for the confirmation
            link. If you&apos;ve already confirmed and still see this page,
            or you previously revoked consent, contact MET Scientia, LLC to
            resolve it.
          </p>
          <a
            href="/coppa"
            className="block text-sm underline"
            style={{ color: "var(--met-teal-400)" }}
          >
            Read our Children&apos;s Privacy Policy
          </a>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--met-text-muted)" }}>
          <a href="/login" className="font-medium" style={{ color: "var(--met-teal-400)" }}>
            Back to login
          </a>
        </p>
      </div>
    </div>
  )
}
