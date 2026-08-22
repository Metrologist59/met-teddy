// src/app/register/page.tsx
// Registration page with COPPA-compliant age gating, EULA acceptance,
// and email-confirmation handoff.
//
// Account creation is entirely server-side (see /api/register) — this
// page only collects input and displays state. It never calls
// supabase.auth.signUp() itself and never learns a user id: the
// server derives role from flow, stamps timestamps, and creates the
// profile using the service-role client, since the registering user
// has no session until they confirm their email.

"use client"

import { useState } from "react"
import { AgeGate } from "@/components/auth/AgeGate"
import { TermsAcceptance } from "@/components/auth/TermsAcceptance"
import { ParentalConsentForm } from "@/components/auth/ParentalConsentForm"
import { EULA_VERSION, PRIVACY_VERSION } from "@/lib/legal"

type Flow = "parent_led" | "educator_led" | "self_led"
type Step = "age_gate" | "terms" | "form" | "consent" | "check_email"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("age_gate")
  const [flow, setFlow] = useState<Flow | null>(null)
  const [grade, setGrade] = useState<number>(0)

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [ageAttested, setAgeAttested] = useState(false)

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [childFirstName, setChildFirstName] = useState("")
  const [schoolName, setSchoolName] = useState("")

  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentEmail, setSentEmail] = useState("")

  function handleAgeGateResult(result: { isUnder13: boolean; grade: number; flow: Flow }) {
    setFlow(result.flow)
    setGrade(result.grade)
    setStep("terms")
  }

  function handleTermsContinue() {
    setError(null)
    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.")
      return
    }
    if (flow === "self_led" && !ageAttested) {
      setError("Please confirm you are 13 years of age or older to continue.")
      return
    }
    setStep("form")
  }

  function validateForm(): string | null {
    if (!email || !password) return "Email and password are required."
    if (password.length < 8) return "Password must be at least 8 characters."
    if (password !== confirmPassword) return "Passwords do not match."
    if (!firstName.trim()) return "First name is required."
    if (flow === "parent_led" && !childFirstName.trim()) return "Please enter your child's first name."
    return null
  }

  function handleFormContinue() {
    setError(null)
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    if (flow === "parent_led") {
      setStep("consent")
    } else {
      submitRegistration()
    }
  }

  async function submitRegistration() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow,
          email,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          grade,
          childFirstName: childFirstName.trim(),
          schoolName: schoolName.trim(),
          eulaAccepted: true,
          eulaVersion: EULA_VERSION,
          privacyAccepted: true,
          privacyVersion: PRIVACY_VERSION,
          ageAttested,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.")
        setLoading(false)
        setStep(flow === "parent_led" ? "consent" : "form")
        return
      }

      setSentEmail(data.email ?? email)
      setLoading(false)
      setStep("check_email")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      setStep(flow === "parent_led" ? "consent" : "form")
    }
  }

  function handleConsent() {
    submitRegistration()
  }

  const inputStyle = {
    background: "var(--met-surface)",
    border: "1px solid rgba(42, 184, 171, 0.2)",
    color: "var(--met-text-primary)",
  }

  const inputFocusClass =
    "w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors focus:ring-2 focus:ring-[#2AB8AB]"

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

        {/* Terms Acceptance */}
        {step === "terms" && (
          <div className="met-card p-6">
            <TermsAcceptance checked={termsAccepted} onChange={setTermsAccepted} />

            {flow === "self_led" && (
              <label className="flex items-start gap-3 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={ageAttested}
                  onChange={(e) => setAgeAttested(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#2AB8AB]"
                />
                <span className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
                  I certify that I am 13 years of age or older. MET and Teddy
                  accounts for students under 13 must be created by a parent
                  or guardian.
                </span>
              </label>
            )}

            {error && (
              <div
                className="mt-4 px-4 py-3 rounded-lg text-sm"
                style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleTermsContinue}
              className="w-full mt-6 py-3 rounded-lg text-sm font-semibold transition-opacity"
              style={{ background: "var(--met-teal-400)", color: "white" }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Registration Form */}
        {step === "form" && flow && (
          <div className="met-card p-6">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--met-text-primary)" }}>
              {flow === "parent_led" && "Parent Registration"}
              {flow === "educator_led" && "Educator Registration"}
              {flow === "self_led" && "Student Registration"}
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--met-text-muted)" }}>
              {flow === "parent_led" && `Register to set up your child's measurement adventure. Grade ${grade} selected.`}
              {flow === "educator_led" && "Create your educator account to manage classrooms."}
              {flow === "self_led" && `Create your account to start exploring. Grade ${grade} selected.`}
            </p>

            <div className="space-y-4">
              {/* First name */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                  {flow === "parent_led" ? "Your first name" : "First name"}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={inputFocusClass}
                  style={inputStyle}
                />
              </div>

              {/* Last name (parent and educator only) */}
              {(flow === "parent_led" || flow === "educator_led") && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputFocusClass}
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Child's first name (parent-led only, COPPA: first name only) */}
              {flow === "parent_led" && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                    Child&apos;s first name
                  </label>
                  <input
                    type="text"
                    value={childFirstName}
                    onChange={(e) => setChildFirstName(e.target.value)}
                    placeholder="First name only"
                    className={inputFocusClass}
                    style={inputStyle}
                  />
                  <p className="text-xs mt-1" style={{ color: "var(--met-text-muted)" }}>
                    For privacy, we only collect your child&apos;s first name.
                  </p>
                </div>
              )}

              {/* School name (educator only) */}
              {flow === "educator_led" && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                    School or organization
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="School name"
                    className={inputFocusClass}
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputFocusClass}
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputFocusClass}
                  style={inputStyle}
                />
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--met-text-secondary)" }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={inputFocusClass}
                  style={inputStyle}
                />
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#EF4444",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Continue / Submit button */}
              <button
                onClick={handleFormContinue}
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{
                  background: "var(--met-teal-400)",
                  color: "white",
                }}
              >
                {loading ? "Creating account..." : flow === "parent_led" ? "Continue" : "Create Account"}
              </button>
            </div>
          </div>
        )}

        {/* Parental Consent (parent-led only) */}
        {step === "consent" && flow === "parent_led" && (
          <div className="met-card p-6">
            <ParentalConsentForm studentFirstName={childFirstName.trim() || "your child"} onConsent={handleConsent} />

            {error && (
              <div
                className="mt-4 px-4 py-3 rounded-lg text-sm"
                style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}
              >
                {error}
              </div>
            )}
            {loading && (
              <p className="mt-4 text-sm text-center" style={{ color: "var(--met-text-muted)" }}>
                Creating account...
              </p>
            )}
          </div>
        )}

        {/* Check your email */}
        {step === "check_email" && (
          <div className="met-card p-6 text-center">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Check your email
            </h2>
            <p className="text-sm mb-2" style={{ color: "var(--met-text-muted)" }}>
              We sent a confirmation link to <strong>{sentEmail}</strong>. Click it
              to activate your account.
            </p>
            {flow === "parent_led" && (
              <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
                Confirming your email also verifies your parental consent —
                that&apos;s all that&apos;s needed for {childFirstName.trim() || "your child"} to get started.
              </p>
            )}
          </div>
        )}

        {/* Login link */}
        {step !== "check_email" && (
          <p
            className="text-center mt-6 text-sm"
            style={{ color: "var(--met-text-muted)" }}
          >
            Already have an account?{" "}
            <a href="/login" className="font-medium" style={{ color: "var(--met-teal-400)" }}>
              Log in
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
