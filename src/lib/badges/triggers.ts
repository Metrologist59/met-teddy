// src/lib/badges/triggers.ts
// Cross-system trigger logic for badge evaluation.
// Fires when key events happen across missions, notebook, and badges.
//
// The flow:
//   Mission complete → check for notebook entry → evaluate badges
//   Notebook entry saved → evaluate notebook badges + re-check missions
//   Daily login → check streak badges

import { evaluateBadges, type StudentBadgeContext, type EvaluationResult } from "./engine"
import { checkMissionBadgeEligibility, type MissionBadgeCheck } from "./notebookIntegration"
import { computeProgression } from "@/lib/notebook/progression"
import type { NotebookEntry } from "@/lib/notebook/notebookTypes"
import type { BadgeDefinition } from "./catalog"
import type { CertificationLevel } from "@/lib/levels/config"

// ── Event types ──────────────────────────────────────────────────

export type BadgeEvent =
  | { type: "mission_completed"; missionSlug: string }
  | { type: "notebook_entry_saved"; entryId: string }
  | { type: "session_start" }

// ── Trigger result ───────────────────────────────────────────────

export interface TriggerResult {
  event:              BadgeEvent
  newlyEarned:        BadgeDefinition[]
  missionCheck?:      MissionBadgeCheck
  nudgeMission?:      string          // mission slug that needs a notebook entry
  celebrationQueue:   BadgeDefinition[]
}

// ── Main trigger handler ─────────────────────────────────────────

export function handleBadgeEvent(
  event:             BadgeEvent,
  ctx: {
    studentId:         string
    certLevel:         CertificationLevel
    completedMissions: string[]
    notebookEntries:   NotebookEntry[]
    earnedBadgeSlugs:  string[]
  },
): TriggerResult {
  const progression = computeProgression(ctx.notebookEntries)

  const badgeCtx: StudentBadgeContext = {
    studentId:         ctx.studentId,
    certLevel:         ctx.certLevel,
    completedMissions: ctx.completedMissions,
    notebookEntries:   ctx.notebookEntries,
    earnedBadgeSlugs:  ctx.earnedBadgeSlugs,
    streakDays:        progression.streakDays,
  }

  const evaluation = evaluateBadges(badgeCtx)
  const result: TriggerResult = {
    event,
    newlyEarned: evaluation.newlyEarned,
    celebrationQueue: [],
  }

  // ── Mission completed trigger ──────────────────────────────────

  if (event.type === "mission_completed") {
    const check = checkMissionBadgeEligibility(
      event.missionSlug,
      true,
      ctx.notebookEntries,
      ctx.certLevel,
    )
    result.missionCheck = check

    if (!check.hasNotebookEntry) {
      // Nudge: mission done but no notebook entry
      result.nudgeMission = event.missionSlug
    }
  }

  // ── Notebook entry saved trigger ───────────────────────────────

  if (event.type === "notebook_entry_saved") {
    // Re-evaluate: the new entry might complete a mission badge
    // that was previously blocked by the notebook requirement
    const reEval = evaluateBadges({
      ...badgeCtx,
      notebookEntries: ctx.notebookEntries,
    })
    result.newlyEarned = reEval.newlyEarned
  }

  // ── Build celebration queue ────────────────────────────────────

  // Certification badges celebrate first (biggest achievement)
  const certBadges = result.newlyEarned.filter(b => b.category === "certification")
  const otherBadges = result.newlyEarned.filter(b => b.category !== "certification")
  result.celebrationQueue = [...certBadges, ...otherBadges]

  return result
}

// ── Convenience: check all missions for missing entries ──────────

export function findMissionsNeedingEntries(
  completedMissions: string[],
  entries: NotebookEntry[],
): string[] {
  const missionSlugsWithEntries = new Set(
    entries.filter(e => e.missionSlug).map(e => e.missionSlug!)
  )
  return completedMissions.filter(slug => !missionSlugsWithEntries.has(slug))
}
