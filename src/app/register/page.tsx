// src/app/register/page.tsx
// Registration page with COPPA-compliant age gating.

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AgeGate } from "@/components/auth/AgeGate"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

type Flow = "parent_led" | "educator_led" | "self_led"
type Step = "age_gate" | "register" | "complete"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("age_gate")
  const [flow, setFlow] = useState<Flow | null>(null)
  const [grade, setGrade] = useState<number>(0)

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [childFirstName, setChildFirstName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [consentChecked, setConsentChecked] = useState(false)

  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleAgeGateResult(result: { isUnder13: boolean; grade: number; flow: Flow }) {
    setFlow(result.flow)
    setGrade(result.grade)
    setStep("register")
  }

  async function handleSubmit() {
    setError(null)

    // Validation
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (flow === "parent_led" && !childFirstName.trim()) {
      setError("Please enter your child's first name.")
      return
    }
    if (flow === "parent_led" && !consentChecked) {
      setError("Parental consent is required for students under 13.")
      return
    }
    if (!firstName.trim()) {
      setError("First name is required.")
      return
    }

    setLoading(true)

    try {
      // 1. Supabase auth signup
      const supabase = createBrowserSupabaseClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            role: flow === "parent_led" ? "parent" : flow === "educator_led" ? "educator" : "student",
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("Account creation failed. Please try again.")
        setLoading(false)
        return
      }

      // 2. Create profile via API route
      const profileRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow,
          userId: authData.user.id,
          email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          grade,
          childFirstName: childFirstName.trim(),
          schoolName: schoolName.trim(),
        }),
      })

      const profileData = await profileRes.json()

      if (!profileRes.ok) {
        setError(profileData.error || "Profile creation failed.")
        setLoading(false)
        return
      }

      // 3. Success — redirect
      setStep("complete")
      setTimeout(() => {
        if (flow === "educator_led") {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
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

        {/* Registration Form */}
        {step === "register" && flow && (
          <div className="met-card p-6">
            <h2
              className="text-lg font-semibold mb-1"
              style={{ color: "var(--met-text-primary)" }}
            >
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

              {/* COPPA consent checkbox (parent-led only) */}
              {flow === "parent_led" && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#2AB8AB]"
                  />
                  <span className="text-sm" style={{ color: "var(--met-text-secondary)" }}>
                    I am the parent or legal guardian of this child. I consent to the
                    collection and use of my child&apos;s information as described in the{" "}
                    <a href="/privacy" className="underline" style={{ color: "var(--met-teal-400)" }}>
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              )}

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

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{
                  background: "var(--met-teal-400)",
                  color: "white",
                }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === "complete" && (
          <div className="met-card p-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--met-text-primary)" }}>
              Welcome to MET Universe!
            </h2>
            <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
              {flow === "educator_led"
                ? "Setting up your dashboard..."
                : "Let\u2019s get you started with MET and Teddy..."}
            </p>
          </div>
        )}

        {/* Login link */}
        {step !== "complete" && (
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
