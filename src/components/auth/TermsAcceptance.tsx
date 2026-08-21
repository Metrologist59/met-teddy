// src/components/auth/TermsAcceptance.tsx
// EULA + Privacy Policy acceptance gate, shown before account
// creation for every registration flow. The checkbox blocks
// Continue; the server independently refuses to create an account
// without eulaAccepted=true and a matching pinned version (see
// src/app/api/register/route.ts) — this component cannot itself
// prove a human read the terms, only that they took the action.

"use client"

interface TermsAcceptanceProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function TermsAcceptance({ checked, onChange }: TermsAcceptanceProps) {
  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-semibold mb-3" style={{ color: "var(--met-text-primary)" }}>
        Before you continue
      </h3>

      <div className="met-card p-4 mb-4 text-sm space-y-2" style={{ color: "var(--met-text-secondary)" }}>
        <p>
          MET and Teddy is an educational tool from MET Scientia, LLC. Please
          read our{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--met-teal-400)" }}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--met-teal-400)" }}>
            Privacy Policy
          </a>{" "}
          before creating an account.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#2AB8AB]"
        />
        <span className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
          I have read and agree to the Terms of Service and Privacy Policy.
        </span>
      </label>
    </div>
  )
}
