// src/components/auth/ParentalConsentForm.tsx
// COPPA parental consent form.
// Collects verifiable parental consent before activating
// an under-13 student account.

"use client"

import { useState } from "react"

interface ParentalConsentFormProps {
  studentFirstName: string
  onConsent: (method: string) => void
}

export function ParentalConsentForm({
  studentFirstName,
  onConsent,
}: ParentalConsentFormProps) {
  const [agreed, setAgreed] = useState(false)
  const [method, setMethod] = useState<string>("email_confirmation")

  return (
    <div className="max-w-lg mx-auto">
      <h2
        className="text-xl font-bold mb-2"
        style={{ color: "var(--met-text-primary)" }}
      >
        Parental Consent Required
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: "var(--met-text-secondary)" }}
      >
        Before {studentFirstName} can use MET and Teddy, we need your
        permission. This is required by COPPA (the Children's Online Privacy
        Protection Act) for children under 13.
      </p>

      {/* What we collect */}
      <div className="met-card p-4 mb-6">
        <h3
          className="font-semibold text-sm mb-2"
          style={{ color: "var(--met-text-primary)" }}
        >
          What we collect and why:
        </h3>
        <ul
          className="text-sm space-y-2"
          style={{ color: "var(--met-text-secondary)" }}
        >
          <li>
            <strong>First name only</strong> — so MET can greet {studentFirstName} by name.
            We do not collect a last name for under-13 students.
          </li>
          <li>
            <strong>Grade level</strong> — to set the right certification level
            and deliver age-appropriate content.
          </li>
          <li>
            <strong>Measurement data</strong> — notebook entries the student
            creates during Field Missions. This is their work product, visible
            to you as the linked parent.
          </li>
          <li>
            <strong>Badge progress</strong> — which achievements {studentFirstName} has earned.
          </li>
        </ul>
      </div>

      {/* What we do NOT collect */}
      <div className="met-card p-4 mb-6">
        <h3
          className="font-semibold text-sm mb-2"
          style={{ color: "var(--met-text-primary)" }}
        >
          What we do NOT collect:
        </h3>
        <ul
          className="text-sm space-y-1"
          style={{ color: "var(--met-text-secondary)" }}
        >
          <li>No last name, no photos, no location data</li>
          <li>No social features, no messaging between students</li>
          <li>No advertising, no data sold to third parties</li>
          <li>No contact with the child outside the platform</li>
        </ul>
      </div>

      {/* Your rights */}
      <div className="met-card p-4 mb-6">
        <h3
          className="font-semibold text-sm mb-2"
          style={{ color: "var(--met-text-primary)" }}
        >
          Your rights as a parent:
        </h3>
        <ul
          className="text-sm space-y-1"
          style={{ color: "var(--met-text-secondary)" }}
        >
          <li>Review all data collected about {studentFirstName} at any time from your dashboard</li>
          <li>Revoke consent at any time — the account will be deactivated</li>
          <li>Request complete deletion of all data</li>
          <li>Adjust {studentFirstName}'s certification level from your dashboard</li>
        </ul>
      </div>

      {/* Consent checkbox */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 rounded"
          style={{ accentColor: "var(--met-teal-400)" }}
        />
        <span
          className="text-sm"
          style={{ color: "var(--met-text-primary)" }}
        >
          I am {studentFirstName}'s parent or legal guardian. I give permission
          for MET Scientia, LLC to collect and use the data described above for
          the purpose of providing the MET and Teddy educational experience.
          I understand I can revoke this consent at any time.
        </span>
      </label>

      {/* Submit */}
      <button
        onClick={() => onConsent(method)}
        disabled={!agreed}
        className="met-btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Give Consent
      </button>

      <p
        className="text-xs text-center mt-4"
        style={{ color: "var(--met-text-muted)" }}
      >
        MET and Teddy is owned by MET Scientia, LLC.
        Read our <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </div>
  )
}
