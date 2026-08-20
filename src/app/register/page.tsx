// src/app/register/page.tsx
// Registration page with COPPA-compliant age gating.

"use client"

import { useState } from "react"
import { AgeGate } from "@/components/auth/AgeGate"
import { ParentalConsentForm } from "@/components/auth/ParentalConsentForm"

type Flow = "parent_led" | "educator_led" | "self_led"
type Step = "age_gate" | "register" | "consent" | "complete"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("age_gate")
  const [flow, setFlow] = useState<Flow | null>(null)
  const [grade, setGrade] = useState<number>(0)

  function handleAgeGateResult(result: { isUnder13: boolean; grade: number; flow: Flow }) {
    setFlow(result.flow)
    setGrade(result.grade)
    setStep(result.flow === "parent_led" ? "register" : "register")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--met-surface)" }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--met-text-primary)" }}>
            Join <span style={{ color: "var(--met-teal-400)" }}>MET</span> Universe
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--met-text-secondary)" }}>
            Where measurement comes alive
          </p>
        </div>

        {/* Age Gate */}
        {step === "age_gate" && (
          <div className="met-card p-6">
            <AgeGate onResult={handleAgeGateResult} />
          </div>
        )}

        {/* Registration form placeholder */}
        {step === "register" && flow && (
          <div className="met-card p-6">
            <div className="text-center py-8" style={{ color: "var(--met-text-muted)" }}>
              <p className="text-lg mb-2">
                {flow === "parent_led" && "Parent Registration"}
                {flow === "educator_led" && "Educator Registration"}
                {flow === "self_led" && "Student Registration"}
              </p>
              <p className="text-sm">
                Registration form — connects to Supabase Auth.
                Grade {grade} selected.
              </p>
            </div>
          </div>
        )}

        {/* Login link */}
        <p
          className="text-center mt-6 text-sm"
          style={{ color: "var(--met-text-muted)" }}
        >
          Already have an account?{" "}
          <a href="/login" className="font-medium" style={{ color: "var(--met-teal-400)" }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
