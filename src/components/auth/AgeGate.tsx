// src/components/auth/AgeGate.tsx
// COPPA age gate — determines registration flow based on age.

"use client"

import { useState } from "react"

interface AgeGateProps {
  onResult: (result: {
    isUnder13: boolean
    grade: number
    flow: "parent_led" | "educator_led" | "self_led"
  }) => void
}

const GRADES = [
  { value: 0, label: "Kindergarten", band: "K-2" },
  { value: 1, label: "1st Grade", band: "K-2" },
  { value: 2, label: "2nd Grade", band: "K-2" },
  { value: 3, label: "3rd Grade", band: "3-5" },
  { value: 4, label: "4th Grade", band: "3-5" },
  { value: 5, label: "5th Grade", band: "3-5" },
  { value: 6, label: "6th Grade", band: "6-8" },
  { value: 7, label: "7th Grade", band: "6-8" },
  { value: 8, label: "8th Grade", band: "6-8" },
  { value: 9, label: "9th Grade", band: "9-12" },
  { value: 10, label: "10th Grade", band: "9-12" },
  { value: 11, label: "11th Grade", band: "9-12" },
  { value: 12, label: "12th Grade", band: "9-12" },
]

export function AgeGate({ onResult }: AgeGateProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [accountType, setAccountType] = useState<"student" | "parent" | "educator" | null>(null)

  function handleContinue() {
    if (selectedGrade === null) return

    const isUnder13 = selectedGrade <= 7

    if (accountType === "educator") {
      onResult({ isUnder13: false, grade: selectedGrade, flow: "educator_led" })
    } else if (isUnder13 || accountType === "parent") {
      onResult({ isUnder13, grade: selectedGrade, flow: "parent_led" })
    } else {
      onResult({ isUnder13, grade: selectedGrade, flow: "self_led" })
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Step 1: Who are you? */}
      <div className="mb-6">
        <h3
          className="font-semibold mb-3"
          style={{ color: "var(--met-text-primary)" }}
        >
          I am a...
        </h3>
        <div className="flex gap-3">
          {(["student", "parent", "educator"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setAccountType(type)}
              className="flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all"
              style={{
                background: accountType === type
                  ? "var(--met-teal-400)"
                  : "var(--met-surface-muted)",
                color: accountType === type
                  ? "white"
                  : "var(--met-text-primary)",
                border: accountType === type
                  ? "2px solid var(--met-teal-400)"
                  : "2px solid transparent",
              }}
            >
              {type === "student" ? "Student" : type === "parent" ? "Parent" : "Educator"}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Grade selection (for students and parents) */}
      {accountType && accountType !== "educator" && (
        <div className="mb-6">
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--met-text-primary)" }}
          >
            {accountType === "parent" ? "My child is in..." : "I am in..."}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {GRADES.map(({ value, label, band }) => (
              <button
                key={value}
                onClick={() => setSelectedGrade(value)}
                className="py-2 px-3 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: selectedGrade === value
                    ? "var(--met-teal-400)"
                    : "var(--met-surface-muted)",
                  color: selectedGrade === value
                    ? "white"
                    : "var(--met-text-primary)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {selectedGrade !== null && selectedGrade <= 7 && accountType === "student" && (
            <div
              className="mt-4 p-3 rounded-lg text-sm"
              style={{
                background: "var(--met-citation-bg)",
                color: "var(--met-citation-text)",
              }}
            >
              Since you are under 13, a parent or guardian will need to create your account and give permission. This keeps you safe online.
            </div>
          )}
        </div>
      )}

      {/* Continue button */}
      {accountType && (accountType === "educator" || selectedGrade !== null) && (
        <button
          onClick={handleContinue}
          className="met-btn-primary w-full py-3 text-base"
        >
          Continue
        </button>
      )}
    </div>
  )
}
