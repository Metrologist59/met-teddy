// src/components/badges/CredentialExport.tsx
// Export and share Open Badges 3.0 credentials.
// Download as JSON, copy verification URL.

"use client"

import { useState } from "react"
import {
  credentialToJSON,
  credentialToDataUrl,
  getVerificationUrl,
  type OB3Credential,
} from "@/lib/badges/openBadges"

interface CredentialExportProps {
  credential: OB3Credential
  badgeName:  string
  onClose:    () => void
}

export function CredentialExport({ credential, badgeName, onClose }: CredentialExportProps) {
  const [copied, setCopied] = useState(false)

  const credentialId = credential.id.split("/").pop() ?? ""
  const verifyUrl = getVerificationUrl(credentialId)

  function handleDownload() {
    const dataUrl = credentialToDataUrl(credential)
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${badgeName.toLowerCase().replace(/\s+/g, "-")}-credential.json`
    link.click()
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(verifyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement("input")
      input.value = verifyUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="met-card p-5">
      <h3
        className="font-semibold text-sm mb-4"
        style={{ color: "var(--met-text-primary)" }}
      >
        Export Credential
      </h3>

      {/* Download JSON */}
      <div className="mb-4">
        <p className="text-xs mb-2" style={{ color: "var(--met-text-secondary)" }}>
          Download the verifiable credential as a JSON file. This file can be
          shared with schools, portfolios, or any system that supports Open Badges 3.0.
        </p>
        <button
          onClick={handleDownload}
          className="met-btn-primary w-full py-2.5 text-sm"
        >
          Download .json
        </button>
      </div>

      {/* Verification URL */}
      <div className="mb-4">
        <p className="text-xs mb-2" style={{ color: "var(--met-text-secondary)" }}>
          Share this verification URL. Anyone can verify the credential is authentic.
        </p>
        <div
          className="flex items-center gap-2 p-2 rounded-lg text-xs"
          style={{
            background: "var(--met-surface-muted)",
            color: "var(--met-text-muted)",
          }}
        >
          <span className="flex-1 truncate">{verifyUrl}</span>
          <button
            onClick={handleCopyUrl}
            className="flex-shrink-0 px-3 py-1 rounded font-medium transition-colors"
            style={{
              background: copied ? "var(--met-success)" : "var(--met-teal-400)",
              color: "white",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Raw JSON preview */}
      <details className="mb-4">
        <summary
          className="text-xs font-medium cursor-pointer mb-1"
          style={{ color: "var(--met-text-muted)" }}
        >
          View raw credential JSON
        </summary>
        <pre
          className="text-[10px] p-3 rounded-lg overflow-x-auto"
          style={{
            background: "var(--met-surface-muted)",
            color: "var(--met-text-secondary)",
            maxHeight: "200px",
          }}
        >
          {credentialToJSON(credential)}
        </pre>
      </details>

      <button
        onClick={onClose}
        className="w-full text-center text-sm py-2"
        style={{ color: "var(--met-text-muted)" }}
      >
        Close
      </button>
    </div>
  )
}
