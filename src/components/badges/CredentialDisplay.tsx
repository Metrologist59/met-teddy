// src/components/badges/CredentialDisplay.tsx
// Visual display of an Open Badges 3.0 verifiable credential.
// Renders the credential as a certificate-style card.

"use client"

import type { OB3Credential } from "@/lib/badges/openBadges"

interface CredentialDisplayProps {
  credential:  OB3Credential
  badgeIcon:   string
  onExport:    () => void
  onVerify:    () => void
}

export function CredentialDisplay({
  credential,
  badgeIcon,
  onExport,
  onVerify,
}: CredentialDisplayProps) {
  const achievement = credential.credentialSubject.achievement
  const issuer = credential.issuer
  const isCertification = achievement.tag.includes("k12-certification")

  return (
    <div
      className="met-card overflow-hidden"
      style={{
        border: isCertification
          ? "2px solid var(--met-teal-400)"
          : "1px solid rgba(42, 184, 171, 0.12)",
      }}
    >
      {/* Header ribbon */}
      <div
        className="p-6 text-center"
        style={{
          background: isCertification
            ? "linear-gradient(135deg, var(--met-teal-900) 0%, #0C3D38 100%)"
            : "var(--met-teal-900)",
          color: "var(--met-text-inverse)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: "var(--met-teal-400)" }}
        >
          {isCertification ? "Certificate of Achievement" : "Verified Badge"}
        </p>

        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl"
          style={{
            background: "linear-gradient(135deg, var(--met-teal-400), var(--met-amber-400))",
            boxShadow: "0 0 24px rgba(42, 184, 171, 0.4)",
          }}
        >
          {badgeIcon}
        </div>

        <h2 className="text-xl font-bold">{achievement.name}</h2>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Description */}
        <p
          className="text-sm text-center leading-relaxed mb-5"
          style={{ color: "var(--met-text-secondary)" }}
        >
          {achievement.description}
        </p>

        <div className="met-ruler-divider mb-5" />

        {/* Criteria */}
        <div className="mb-4">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: "var(--met-text-muted)" }}
          >
            Achievement Criteria
          </h3>
          <p className="text-sm" style={{ color: "var(--met-text-primary)" }}>
            {achievement.criteria.narrative}
          </p>
        </div>

        {/* Issuer */}
        <div className="mb-4">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: "var(--met-text-muted)" }}
          >
            Issued By
          </h3>
          <p className="text-sm font-medium" style={{ color: "var(--met-text-primary)" }}>
            {issuer.name}
          </p>
          <p className="text-xs" style={{ color: "var(--met-text-muted)" }}>
            {issuer.description}
          </p>
        </div>

        {/* Issuance date */}
        <div className="mb-4">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: "var(--met-text-muted)" }}
          >
            Date Issued
          </h3>
          <p className="text-sm" style={{ color: "var(--met-text-primary)" }}>
            {new Date(credential.issuanceDate).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {achievement.tag.map(tag => (
            <span
              key={tag}
              className="met-badge met-badge-teal text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Standard compliance note */}
        <div className="met-citation-footer mb-5">
          Open Badges 3.0 Verifiable Credential · 1EdTech Standard · MET Universe · Metrology Institute
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onExport}
            className="met-btn-primary flex-1 py-2.5 text-sm"
          >
            Download Credential
          </button>
          <button
            onClick={onVerify}
            className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors"
            style={{
              background: "var(--met-surface-muted)",
              color: "var(--met-text-secondary)",
            }}
          >
            Verify
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 text-center text-[10px] border-t"
        style={{
          borderColor: "rgba(42, 184, 171, 0.08)",
          color: "var(--met-text-muted)",
        }}
      >
        Credential ID: {credential.id.split("/").pop()} · © 2026 MET Scientia, LLC
      </div>
    </div>
  )
}
