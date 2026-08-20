// src/lib/badges/engine.ts
// Badge criteria evaluation engine.
// Checks student data against badge criteria and returns
// earned badges and progress toward unearned badges.
//
// The core rule (enforced in Step 3.11): completing a Field Mission
// without a notebook entry earns no mission badge.

import {
  BADGE_CATALOG,
  type BadgeDefinition,
  type EarnedBadge,
  type BadgeProgress,
} from "./catalog"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Student context for evaluation ───────────────────────────────

export interface StudentBadgeContext {
  studentId:           string
  certLevel:           CertificationLevel
  completedMissions:   string[]           // mission slugs
  notebookEntries:     NotebookEntry[]
  earnedBadgeSlugs:    string[]           // already earned
  streakDays:          number
}

// ── Evaluation result ────────────────────────────────────────────

export interface EvaluationResult {
  newlyEarned:   BadgeDefinition[]
  progress:      (BadgeProgress & { badge: BadgeDefinition })[]
  totalEarned:   number
  totalAvailable: number
}

// ── Main evaluation ──────────────────────────────────────────────

export function evaluateBadges(ctx: StudentBadgeContext): EvaluationResult {
  const applicableBadges = BADGE_CATALOG.filter(
    b => !b.certLevel || b.certLevel === ctx.certLevel
  )

  const newlyEarned: BadgeDefinition[] = []
  const progress: (BadgeProgress & { badge: BadgeDefinition })[] = []

  for (const badge of applicableBadges) {
    // Skip already earned
    if (ctx.earnedBadgeSlugs.includes(badge.slug)) continue

    const criterionResults = badge.criteria.map(c => evaluateCriterion(c, ctx))
    const allMet = criterionResults.every(r => r.met)

    if (allMet) {
      newlyEarned.push(badge)
    } else {
      // Compute aggregate progress
      const totalTarget = criterionResults.reduce((s, r) => s + r.target, 0)
      const totalCurrent = criterionResults.reduce((s, r) => s + r.current, 0)

      progress.push({
        badgeId:      badge.slug,
        currentValue: totalCurrent,
        targetValue:  totalTarget,
        percentage:   totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 0,
        badge,
      })
    }
  }

  return {
    newlyEarned,
    progress,
    totalEarned: ctx.earnedBadgeSlugs.length + newlyEarned.length,
    totalAvailable: applicableBadges.length,
  }
}

// ── Individual criterion evaluation ──────────────────────────────

interface CriterionResult {
  met:     boolean
  current: number
  target:  number
}

function evaluateCriterion(
  criterion: BadgeDefinition["criteria"][0],
  ctx: StudentBadgeContext,
): CriterionResult {
  const target = criterion.targetValue

  switch (criterion.type) {
    case "mission_complete": {
      const done = criterion.targetSlug
        ? ctx.completedMissions.includes(criterion.targetSlug) ? 1 : 0
        : ctx.completedMissions.length
      return { met: done >= target, current: Math.min(done, target), target }
    }

    case "mission_with_notebook": {
      // Mission completed AND has a linked notebook entry
      const slug = criterion.targetSlug
      if (!slug) return { met: false, current: 0, target }

      const missionDone = ctx.completedMissions.includes(slug)
      const hasEntry = ctx.notebookEntries.some(e => e.missionSlug === slug)
      const done = missionDone && hasEntry ? 1 : 0
      return { met: done >= target, current: done, target }
    }

    case "notebook_entry_count": {
      const count = ctx.notebookEntries.length
      return { met: count >= target, current: Math.min(count, target), target }
    }

    case "notebook_reflection": {
      const withReflections = ctx.notebookEntries.filter(
        e => e.reflections.length > 0 && e.reflections.some(r => r.response.trim() !== "")
      ).length
      return { met: withReflections >= target, current: Math.min(withReflections, target), target }
    }

    case "domain_missions_all": {
      // All missions in a domain completed (with notebook)
      // For now, count missions completed with notebook in the domain
      const domain = criterion.targetSlug
      if (!domain) return { met: false, current: 0, target }

      const domainEntries = ctx.notebookEntries.filter(
        e => e.domain === domain && e.entryType === "mission" && e.missionSlug
      )
      const count = domainEntries.length
      return { met: count >= target, current: Math.min(count, target), target }
    }

    case "readings_count": {
      const total = ctx.notebookEntries.reduce(
        (sum, e) => sum + e.measurements.length, 0
      )
      return { met: total >= target, current: Math.min(total, target), target }
    }

    case "streak_days": {
      return {
        met: ctx.streakDays >= target,
        current: Math.min(ctx.streakDays, target),
        target,
      }
    }

    case "level_badges_all": {
      // All mission + domain badges at a level earned
      const level = criterion.targetSlug as CertificationLevel | undefined
      if (!level) return { met: false, current: 0, target }

      const levelBadges = BADGE_CATALOG.filter(
        b => b.certLevel === level && (b.category === "mission" || b.category === "domain")
      )
      const earned = levelBadges.filter(b => ctx.earnedBadgeSlugs.includes(b.slug)).length
      return {
        met: earned >= levelBadges.length && levelBadges.length > 0,
        current: earned,
        target: levelBadges.length,
      }
    }

    default:
      return { met: false, current: 0, target }
  }
}

// ── Celebration messages ─────────────────────────────────────────

export function getCelebrationMessage(badge: BadgeDefinition, certLevel: CertificationLevel): string {
  if (badge.category === "certification") {
    return `🎉 You did it! You are now a Certified MET ${badge.certLevel}! This is a real achievement — Teddy is doing spins!`
  }

  if (badge.category === "mission") {
    const messages: Record<CertificationLevel, string> = {
      Explorer:     `🌟 You earned the "${badge.name}" badge! Teddy is wagging his tail so fast!`,
      Investigator: `🔬 Badge earned: "${badge.name}"! Your data record made this happen.`,
      Innovator:    `💡 "${badge.name}" — earned. Your analysis and documentation made the difference.`,
      Metrologist:  `📐 Badge earned: "${badge.name}". Documented, traceable, and verified.`,
    }
    return messages[certLevel]
  }

  return `🏅 You earned the "${badge.name}" badge!`
}
