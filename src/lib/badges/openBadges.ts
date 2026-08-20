// src/lib/badges/openBadges.ts
// Open Badges 3.0 credential generation.
// © 2026 MET Scientia, LLC
//
// Produces JSON-LD Verifiable Credentials per the Open Badges 3.0
// specification (1EdTech). MET Scientia, LLC is the issuer.
// Level Certification badges are the priority verifiable credentials.
//
// Reference: https://1edtech.github.io/openbadges-specification/ob_v3p0.html

import type { BadgeDefinition, EarnedBadge } from "./catalog"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Configuration ────────────────────────────────────────────────

const ISSUER_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://metandteddy.com"

export const ISSUER_PROFILE = {
  id:    `${ISSUER_BASE_URL}/issuer`,
  type:  ["Profile"],
  name:  "MET Scientia, LLC",
  url:   "https://metscientia.com",
  description: "MET Scientia, LLC — Where every question becomes a quest, and every quest is grounded in science.",
  email: "badges@metscientia.com",
}

// ── Open Badges 3.0 types ────────────────────────────────────────

export interface OB3Credential {
  "@context":          string[]
  id:                  string
  type:                string[]
  issuer:              typeof ISSUER_PROFILE
  issuanceDate:        string
  credentialSubject:   OB3CredentialSubject
  credentialSchema:    OB3CredentialSchema[]
}

interface OB3CredentialSubject {
  id:          string
  type:        string[]
  achievement: OB3Achievement
}

interface OB3Achievement {
  id:          string
  type:        string[]
  name:        string
  description: string
  criteria:    { narrative: string }
  image?:      { id: string; type: string }
  tag:         string[]
}

interface OB3CredentialSchema {
  id:   string
  type: string
}

// ── Credential generation ────────────────────────────────────────

/**
 * Generates an Open Badges 3.0 Verifiable Credential for an earned badge.
 */
export function generateCredential(
  badge:       BadgeDefinition,
  earned:      EarnedBadge,
  recipientId: string,
  recipientName: string,
): OB3Credential {
  const credentialId = `${ISSUER_BASE_URL}/credentials/${earned.id}`
  const achievementId = `${ISSUER_BASE_URL}/achievements/${badge.slug}`

  // Build criteria narrative
  const criteriaNarrative = badge.criteria
    .map(c => c.description)
    .join("; ")

  // Tags for categorization
  const tags = [
    "measurement-science",
    badge.category,
    ...(badge.certLevel ? [badge.certLevel.toLowerCase()] : []),
    ...(badge.domain ? [badge.domain] : []),
  ]

  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    ],
    id: credentialId,
    type: [
      "VerifiableCredential",
      "OpenBadgeCredential",
    ],
    issuer: ISSUER_PROFILE,
    issuanceDate: earned.earnedAt,
    credentialSubject: {
      id:   `urn:uuid:${recipientId}`,
      type: ["AchievementSubject"],
      achievement: {
        id:          achievementId,
        type:        ["Achievement"],
        name:        badge.name,
        description: badge.description,
        criteria:    { narrative: criteriaNarrative },
        tag:         tags,
      },
    },
    credentialSchema: [
      {
        id:   "https://purl.imsglobal.org/spec/ob/v3p0/schema/json/ob_v3p0_achievementcredential_schema.json",
        type: "1EdTechJsonSchemaValidator2019",
      },
    ],
  }
}

// ── Certification credential (enhanced) ──────────────────────────

/**
 * Generates an enhanced credential for Level Certification badges.
 * These are the priority verifiable credentials and include
 * additional metadata about the certification achievement.
 */
export function generateCertificationCredential(
  certLevel:     CertificationLevel,
  earned:        EarnedBadge,
  recipientId:   string,
  recipientName: string,
  stats: {
    missionsCompleted: number
    notebookEntries:   number
    totalReadings:     number
    domainsExplored:   number
  },
): OB3Credential {
  const badge: BadgeDefinition = {
    slug:        `certified-${certLevel.toLowerCase()}`,
    name:        `Certified MET ${certLevel}`,
    description: `Completed all ${certLevel} level requirements in the MET and Teddy measurement science program. Demonstrated competence across ${stats.domainsExplored} measurement domains with ${stats.missionsCompleted} missions completed, ${stats.notebookEntries} documented notebook entries, and ${stats.totalReadings} total measurement readings.`,
    category:    "certification",
    certLevel,
    icon:        certLevel === "Explorer" ? "🌟" : certLevel === "Investigator" ? "🔬" : certLevel === "Innovator" ? "💡" : "🎓",
    criteria: [
      {
        type: "level_badges_all",
        targetValue: 1,
        targetSlug: certLevel,
        description: `Earned all mission and domain badges at the ${certLevel} certification level within MET and Teddy.`,
      },
    ],
  }

  const credential = generateCredential(badge, earned, recipientId, recipientName)

  // Add certification-specific achievement tags
  credential.credentialSubject.achievement.tag.push(
    "k12-certification",
    "met-scientia",
    `${stats.missionsCompleted}-missions`,
    `${stats.domainsExplored}-domains`,
  )

  return credential
}

// ── Verification URL ─────────────────────────────────────────────

export function getVerificationUrl(credentialId: string): string {
  return `${ISSUER_BASE_URL}/api/credentials/${credentialId}`
}

// ── Export as JSON file ──────────────────────────────────────────

export function credentialToJSON(credential: OB3Credential): string {
  return JSON.stringify(credential, null, 2)
}

// ── Export as data URL for download ──────────────────────────────

export function credentialToDataUrl(credential: OB3Credential): string {
  const json = credentialToJSON(credential)
  const encoded = btoa(unescape(encodeURIComponent(json)))
  return `data:application/json;base64,${encoded}`
}
