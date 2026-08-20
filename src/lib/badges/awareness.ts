// src/lib/badges/awareness.ts
// Badge Awareness Module for MET and Teddy.
//
// Generates prompt blocks from the student's badge progress.
// Injected into the context layer so MET can:
//   - Celebrate earned badges (Teddy spins!)
//   - Encourage students near badge completion
//   - Connect current activities to badge criteria
//
// Phase 2: runs against mock data.
// Phase 3: wired to the real badge database.

import type { CertificationLevel } from "@/lib/levels/config"
import type { BadgeSummary, BadgeProgress } from "./types"

// ── Types ────────────────────────────────────────────────────────────────────

export interface BadgeDirective {
  hasData:     boolean
  promptBlock: string
}

// ── Main awareness function ──────────────────────────────────────────────────

/**
 * Generates a badge awareness prompt block from the student's
 * badge summary. Injected into the system prompt context layer.
 */
export function badgeAwareness(
  summary: BadgeSummary | null,
  level:   CertificationLevel,
): BadgeDirective {
  if (!summary) {
    return {
      hasData: false,
      promptBlock: buildNoBadgesBlock(level),
    }
  }

  const parts: string[] = ["STUDENT'S BADGE PROGRESS:"]

  // ── Total earned ───────────────────────────────────────────────────
  parts.push(`Badges earned: ${summary.totalEarned}`)

  // ── Most recently earned (celebrate!) ──────────────────────────────
  if (summary.recentBadge) {
    parts.push("")
    parts.push(`🏅 Most recent badge: "${summary.recentBadge.name}" — earned ${summary.recentBadge.earnedAt}`)
    parts.push(getCelebrationInstruction(level))
  }

  // ── Near completion (encourage!) ───────────────────────────────────
  if (summary.nearComplete.length > 0) {
    parts.push("")
    parts.push("NEAR COMPLETION — encourage the student toward these:")
    for (const bp of summary.nearComplete) {
      parts.push(formatNearComplete(bp, level))
    }
  }

  // ── In progress ────────────────────────────────────────────────────
  if (summary.inProgress.length > 0) {
    parts.push("")
    parts.push("IN PROGRESS:")
    for (const bp of summary.inProgress) {
      if (!bp.isNearComplete) {
        parts.push(`  • ${bp.badgeName}: ${bp.completed}/${bp.totalRequired} (${bp.percentDone}%)`)
      }
    }
  }

  // ── Level-specific badge instruction ───────────────────────────────
  parts.push("")
  parts.push(getBadgeInstruction(level))

  return {
    hasData: true,
    promptBlock: parts.join("\n"),
  }
}

// ── Format near-complete badge ───────────────────────────────────────────────

function formatNearComplete(bp: BadgeProgress, level: CertificationLevel): string {
  const remaining = bp.totalRequired - bp.completed

  switch (level) {
    case "Explorer":
      return `  🌟 "${bp.badgeName}" — almost there! Just ${remaining} more to go! Teddy's already practicing his celebration spin.`

    case "Investigator":
      return `  🌟 "${bp.badgeName}" — ${bp.completed}/${bp.totalRequired} complete. ${remaining} more and you earn it!`

    case "Innovator":
      return `  🌟 "${bp.badgeName}" — ${bp.percentDone}% complete (${bp.completed}/${bp.totalRequired}). ${remaining} remaining.`

    case "Metrologist":
      return `  🌟 "${bp.badgeName}" — ${bp.completed}/${bp.totalRequired}. ${remaining} remaining toward this competency credential.`
  }
}

// ── Celebration instruction ──────────────────────────────────────────────────

function getCelebrationInstruction(level: CertificationLevel): string {
  switch (level) {
    case "Explorer":
      return "If the student hasn't been congratulated for this badge yet, celebrate! Teddy spins and barks. Make it feel like a big deal — because it is."

    case "Investigator":
      return "Acknowledge the badge warmly with Teddy involvement. Name what the student accomplished to earn it."

    case "Innovator":
      return "Acknowledge the achievement directly. Connect it to the measurement domain the student mastered."

    case "Metrologist":
      return "Acknowledge as a professional milestone. Connect to industry competency if relevant."
  }
}

// ── No badges block ──────────────────────────────────────────────────────────

function buildNoBadgesBlock(level: CertificationLevel): string {
  switch (level) {
    case "Explorer":
      return [
        "STUDENT'S BADGE PROGRESS: No badges earned yet.",
        "The student's first badge is waiting! After their first Field Mission with a notebook entry,",
        "they earn the 'First Measurement' badge. Teddy is ready to celebrate.",
      ].join("\n")

    case "Investigator":
      return [
        "STUDENT'S BADGE PROGRESS: No badges earned yet.",
        "Badges are earned by completing Field Missions with documented notebook entries.",
        "Encourage the student to start their first mission.",
      ].join("\n")

    case "Innovator":
    case "Metrologist":
      return [
        "STUDENT'S BADGE PROGRESS: No badges earned yet.",
        "Badges mark milestones in measurement competency. Recommend starting with a Field Mission.",
      ].join("\n")
  }
}

// ── Level-specific badge instruction ─────────────────────────────────────────

function getBadgeInstruction(level: CertificationLevel): string {
  switch (level) {
    case "Explorer":
      return [
        "BADGE GUIDANCE:",
        "Connect activities to badges naturally: 'If you finish this mission and write it in your notebook, you'll earn a badge!'",
        "Remember: a mission without a notebook entry earns no badge. Say this warmly, never as punishment.",
        "When celebrating, Teddy spins in circles and barks. Make badges feel magical.",
      ].join("\n")

    case "Investigator":
      return [
        "BADGE GUIDANCE:",
        "When the student is working on something that counts toward a badge, mention it: 'This counts toward your Length Master badge.'",
        "Celebrate with Teddy when badges are earned. Name the badge and what the student did.",
        "Near-complete badges: 'One more and you earn it!' — create excitement without pressure.",
      ].join("\n")

    case "Innovator":
      return [
        "BADGE GUIDANCE:",
        "Connect badge progress to domain mastery: 'Your Temperature Master badge shows you've built real competency in thermal measurement.'",
        "Near-complete badges: note the specific remaining requirement.",
        "Domain badges represent genuine measurement competency — treat them with appropriate weight.",
      ].join("\n")

    case "Metrologist":
      return [
        "BADGE GUIDANCE:",
        "Badges at this level represent professional-grade competency milestones.",
        "Connect to industry credentials: 'This domain mastery aligns with the ASQ CCT competency requirements.'",
        "Celebrate achievement matter-of-factly — the student is training as a professional.",
      ].join("\n")
  }
}
