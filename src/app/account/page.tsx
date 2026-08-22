// src/app/account/page.tsx
// Account page — profile info, license status, code redemption, password.
// Server component: real data, not demo data — the first page in the
// app to do this.

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { loadProfileByAuthUserId } from "@/lib/auth/profiles"
import { AppShell } from "@/components/layout/AppShell"
import { LicenseCodeCard } from "@/components/dashboard/LicenseCodeCard"

const ROLE_LABELS: Record<string, string> = {
  parent: "Parent",
  educator: "Educator",
  student: "Student",
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await loadProfileByAuthUserId(supabase, user.id)

  if (!profile) {
    return (
      <AppShell studentName="Account">
        <div className="p-6 max-w-2xl mx-auto text-center">
          <p style={{ color: "var(--met-text-muted)" }}>
            We couldn&apos;t load your account. Please contact support if this continues.
          </p>
        </div>
      </AppShell>
    )
  }

  // Licenses this profile owns. Uses the RLS-respecting cookie client,
  // not the admin client — migration 0005's "Owner reads own license"
  // policy already permits exactly this read, so this is the correct,
  // minimal-privilege way to fetch it.
  const { data: licenses, error: licensesError } = await supabase
    .from("licenses")
    .select("id, license_type, seats_total, status, valid_until, source, created_at")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false })

  if (licensesError) {
    console.error("[account] failed to load licenses:", licensesError.message)
  }

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role
  const canRedeemCode = profile.role === "parent" || profile.role === "educator"

  // Only override AppShell's cert level / grade band for a student
  // viewing their own account (self-led 13+). For parent/educator,
  // those fields don't apply to their own profile row — don't pass
  // them, and let AppShell's own defaults render, same as the
  // existing dashboard page already does for non-student roles.
  const shellProps =
    profile.role === "student"
      ? { certLevel: profile.certLevel ?? undefined, gradeBand: profile.gradeBand ?? undefined }
      : {}

  return (
    <AppShell studentName={profile.displayName} {...shellProps}>
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--met-text-primary)" }}>
          My Account
        </h1>

        {/* Profile card */}
        <div className="met-card p-5">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--met-text-primary)" }}>
            Profile
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt style={{ color: "var(--met-text-muted)" }}>Name</dt>
              <dd style={{ color: "var(--met-text-primary)" }}>{profile.displayName}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--met-text-muted)" }}>Email</dt>
              <dd style={{ color: "var(--met-text-primary)" }}>{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt style={{ color: "var(--met-text-muted)" }}>Account Type</dt>
              <dd style={{ color: "var(--met-text-primary)" }}>{roleLabel}</dd>
            </div>
            {profile.role === "student" && (
              <>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--met-text-muted)" }}>Grade Band</dt>
                  <dd style={{ color: "var(--met-text-primary)" }}>{profile.gradeBand ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--met-text-muted)" }}>Certification Level</dt>
                  <dd style={{ color: "var(--met-teal-400)" }}>{profile.certLevel ?? "—"}</dd>
                </div>
              </>
            )}
          </dl>

          <a
            href="/reset-password"
            className="inline-block mt-4 text-sm font-medium"
            style={{ color: "var(--met-teal-400)" }}
          >
            Change Password →
          </a>
        </div>

        {/* License status */}
        <div className="met-card p-5">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--met-text-primary)" }}>
            Licenses
          </h2>

          {!licenses || licenses.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--met-text-muted)" }}>
              No license on this account yet.
            </p>
          ) : (
            <div className="space-y-3">
              {licenses.map((lic) => {
                const isHealthy = lic.status === "active" || lic.status === "trial"
                return (
                  <div
                    key={lic.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
                    style={{ background: "var(--met-surface)" }}
                  >
                    <div>
                      <div className="font-medium" style={{ color: "var(--met-text-primary)" }}>
                        {lic.license_type.charAt(0).toUpperCase() + lic.license_type.slice(1)}
                        {" · "}{lic.seats_total} seat{lic.seats_total === 1 ? "" : "s"}
                      </div>
                      <div className="text-xs" style={{ color: "var(--met-text-muted)" }}>
                        {lic.status === "active" && lic.valid_until
                          ? `Active until ${new Date(lic.valid_until).toLocaleDateString()}`
                          : lic.status === "trial"
                          ? "Trial"
                          : lic.status.charAt(0).toUpperCase() + lic.status.slice(1)}
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        background: isHealthy ? "rgba(42, 184, 171, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: isHealthy ? "var(--met-teal-400)" : "#EF4444",
                      }}
                    >
                      {lic.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* License code redemption — only for roles that hold a plan */}
        {canRedeemCode && <LicenseCodeCard role={profile.role as "parent" | "educator"} />}
      </div>
    </AppShell>
  )
}
