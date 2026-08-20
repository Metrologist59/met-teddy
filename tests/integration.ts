/**
 * MET and Teddy — Integration Test Suite
 * © 2026 MET Scientia, LLC
 *
 * Tests cross-system interactions without requiring API keys.
 * Validates: badge-notebook enforcement, level routing, trigger
 * flow, quality scoring, character state mapping, and progression.
 *
 * Usage: npx tsx tests/integration.ts
 */

// ── Imports ──────────────────────────────────────────────────────

import { evaluateBadges, type StudentBadgeContext } from "../src/lib/badges/engine"
import { BADGE_CATALOG, getBadgesByLevel, getBadgeBySlug } from "../src/lib/badges/catalog"
import { checkMissionBadgeEligibility, scoreEntryQuality } from "../src/lib/badges/notebookIntegration"
import { handleBadgeEvent, findMissionsNeedingEntries } from "../src/lib/badges/triggers"
import { generateCredential, ISSUER_PROFILE } from "../src/lib/badges/openBadges"
import { computeProgression, getProgressInsights } from "../src/lib/notebook/progression"
import { runQuickChecks } from "../src/lib/notebook/feedback"
import { TEMPLATES } from "../src/lib/notebook/notebookTypes"
import { mapToCharacterState, inferContextFromResponse, mapTeddyAction } from "../src/components/characters/stateMapper"
import { PROMINENCE_BY_LEVEL } from "../src/components/characters/types"
import type { NotebookEntry } from "../src/lib/notebook/notebookTypes"
import type { CertificationLevel } from "../src/lib/levels/config"

// ── Test harness ─────────────────────────────────────────────────

let passed = 0
let failed = 0
const failures: string[] = []

function assert(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${name}`)
    passed++
  } else {
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`)
    failed++
    failures.push(name)
  }
}

function section(name: string) {
  console.log(`\n── ${name} ──`)
}

// ── Test data factories ──────────────────────────────────────────

function makeEntry(overrides: Partial<NotebookEntry> = {}): NotebookEntry {
  return {
    id: `entry-${Date.now()}-${Math.random()}`,
    studentId: "test-student",
    certLevel: "Explorer",
    gradeBand: "K-2",
    title: "Test Entry",
    whatMeasured: "Teddy's height",
    instrument: "Ruler",
    unit: "cm",
    entryType: "mission",
    status: "complete",
    measurements: [
      { id: "m1", trialNumber: 1, value: 30.2, unit: "cm" },
    ],
    reflections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

function makeCtx(overrides: Partial<StudentBadgeContext> = {}): StudentBadgeContext {
  return {
    studentId: "test-student",
    certLevel: "Explorer",
    completedMissions: [],
    notebookEntries: [],
    earnedBadgeSlugs: [],
    streakDays: 0,
    ...overrides,
  }
}

// ── Tests ────────────────────────────────────────────────────────

function main() {
  console.log("MET and Teddy — Integration Test Suite")
  console.log("=======================================\n")

  // ── 1. Badge catalog ───────────────────────────────────────────
  section("1. Badge Catalog")

  assert("Catalog has badges", BADGE_CATALOG.length > 0)
  assert("Explorer badges exist", getBadgesByLevel("Explorer").length > 0)
  assert("Metrologist badges exist", getBadgesByLevel("Metrologist").length > 0)
  assert("Certification badges for all levels",
    ["Explorer", "Investigator", "Innovator", "Metrologist"].every(
      level => BADGE_CATALOG.some(b => b.category === "certification" && b.certLevel === level)
    )
  )
  assert("getBadgeBySlug works", getBadgeBySlug("first-entry")?.name === "First Entry!")
  assert("All badge slugs unique",
    new Set(BADGE_CATALOG.map(b => b.slug)).size === BADGE_CATALOG.length
  )

  // ── 2. Badge-notebook enforcement ──────────────────────────────
  section("2. Badge-Notebook Enforcement (Core Rule)")

  const check1 = checkMissionBadgeEligibility("measure-teddy", true, [], "Explorer")
  assert("Mission without notebook → not eligible", !check1.badgeEligible)
  assert("Mission without notebook → reason mentions notebook", check1.reason.includes("notebook"))

  const entryWithMission = makeEntry({ missionSlug: "measure-teddy" })
  const check2 = checkMissionBadgeEligibility("measure-teddy", true, [entryWithMission], "Explorer")
  assert("Mission with notebook → eligible", check2.badgeEligible)

  const check3 = checkMissionBadgeEligibility("measure-teddy", false, [], "Explorer")
  assert("Mission not complete → not eligible", !check3.badgeEligible)

  // ── 3. Entry quality scoring ───────────────────────────────────
  section("3. Entry Quality Scoring")

  const minimalEntry = makeEntry({ unit: "", measurements: [] })
  const minimalQuality = scoreEntryQuality(minimalEntry, "Explorer")
  assert("Empty entry scores low", minimalQuality.score < 50)
  assert("Empty entry below minimum", !minimalQuality.meetsMinimum)

  const goodExplorerEntry = makeEntry()
  const goodQuality = scoreEntryQuality(goodExplorerEntry, "Explorer")
  assert("Good Explorer entry meets minimum", goodQuality.meetsMinimum)

  const investigatorEntry = makeEntry({
    certLevel: "Investigator",
    measurements: [
      { id: "m1", trialNumber: 1, value: 30.2, unit: "cm" },
      { id: "m2", trialNumber: 2, value: 30.1, unit: "cm" },
      { id: "m3", trialNumber: 3, value: 30.3, unit: "cm" },
    ],
    reflections: [{ id: "r1", prompt: "Why different?", response: "Ruler moved." }],
  })
  const invQuality = scoreEntryQuality(investigatorEntry, "Investigator")
  assert("Investigator entry with 3 readings + reflection passes", invQuality.meetsMinimum)

  const metrologistEntry = makeEntry({
    certLevel: "Metrologist",
    measurements: Array.from({ length: 5 }, (_, i) => ({
      id: `m${i}`, trialNumber: i + 1, value: 30 + Math.random() * 0.5, unit: "cm",
    })),
    reflections: [{ id: "r1", prompt: "Within spec?", response: "Yes." }],
    uncertainty: [
      { id: "u1", componentName: "Repeatability", evalType: "A", value: 0.15, unit: "cm" },
      { id: "u2", componentName: "Resolution", evalType: "B", value: 0.05, unit: "cm" },
    ],
  })
  const metQuality = scoreEntryQuality(metrologistEntry, "Metrologist")
  assert("Metrologist entry with uncertainty budget passes", metQuality.meetsMinimum)

  const metNoUncert = makeEntry({ certLevel: "Metrologist", uncertainty: [] })
  const metNoUncertQ = scoreEntryQuality(metNoUncert, "Metrologist")
  assert("Metrologist entry without uncertainty fails", !metNoUncertQ.meetsMinimum)

  // ── 4. Badge evaluation engine ─────────────────────────────────
  section("4. Badge Evaluation Engine")

  const emptyCtx = makeCtx()
  const emptyResult = evaluateBadges(emptyCtx)
  assert("Empty context → no badges earned", emptyResult.newlyEarned.length === 0)
  assert("Empty context → has progress items", emptyResult.progress.length > 0)

  const oneEntryCtx = makeCtx({
    notebookEntries: [makeEntry({ entryType: "free", missionSlug: undefined })],
  })
  const oneEntryResult = evaluateBadges(oneEntryCtx)
  assert("One notebook entry → earns First Entry badge",
    oneEntryResult.newlyEarned.some(b => b.slug === "first-entry")
  )

  const streakCtx = makeCtx({ streakDays: 3 })
  const streakResult = evaluateBadges(streakCtx)
  assert("3-day streak → earns streak badge",
    streakResult.newlyEarned.some(b => b.slug === "three-day-streak")
  )

  // ── 5. Cross-system triggers ───────────────────────────────────
  section("5. Cross-System Triggers")

  const triggerResult1 = handleBadgeEvent(
    { type: "mission_completed", missionSlug: "measure-teddy" },
    { studentId: "s1", certLevel: "Explorer", completedMissions: ["measure-teddy"], notebookEntries: [], earnedBadgeSlugs: [] },
  )
  assert("Mission complete without entry → nudge", triggerResult1.nudgeMission === "measure-teddy")

  const triggerResult2 = handleBadgeEvent(
    { type: "mission_completed", missionSlug: "measure-teddy" },
    { studentId: "s1", certLevel: "Explorer", completedMissions: ["measure-teddy"], notebookEntries: [makeEntry({ missionSlug: "measure-teddy" })], earnedBadgeSlugs: [] },
  )
  assert("Mission complete with entry → no nudge", !triggerResult2.nudgeMission)

  const missing = findMissionsNeedingEntries(
    ["measure-teddy", "heavy-or-light"],
    [makeEntry({ missionSlug: "measure-teddy" })],
  )
  assert("findMissionsNeedingEntries identifies gaps", missing.length === 1 && missing[0] === "heavy-or-light")

  // ── 6. Notebook progression ────────────────────────────────────
  section("6. Notebook Progression")

  const emptyProgression = computeProgression([])
  assert("Empty entries → zero totals", emptyProgression.totalEntries === 0)

  const entries = [
    makeEntry({ domain: "length" }),
    makeEntry({ domain: "length" }),
    makeEntry({ domain: "mass" }),
  ]
  const progression = computeProgression(entries)
  assert("3 entries → totalEntries is 3", progression.totalEntries === 3)
  assert("2 domains explored", progression.domainsExplored.length === 2)
  assert("totalReadings counts all measurements", progression.totalReadings === 3)

  const insights = getProgressInsights(progression, "Explorer")
  assert("Insights generated", insights.length > 0)

  // ── 7. Notebook quick checks ───────────────────────────────────
  section("7. Notebook Quick Checks")

  const explorerChecks = runQuickChecks(makeEntry(), "Explorer")
  assert("Explorer checks include unit", explorerChecks.some(c => c.name === "Unit recorded"))
  assert("Good Explorer entry passes all", explorerChecks.every(c => c.passed))

  const badEntry = makeEntry({ unit: "", measurements: [] })
  const badChecks = runQuickChecks(badEntry, "Explorer")
  assert("Bad entry fails some checks", badChecks.some(c => !c.passed))

  // ── 8. Character state mapping ─────────────────────────────────
  section("8. Character State Mapping")

  const greetingState = mapToCharacterState("greeting", true)
  assert("Greeting → playful MET", greetingState.metExpression === "playful")
  assert("Greeting → tail_wag Teddy", greetingState.teddyBodyLanguage === "tail_wag")

  const safetyState = mapToCharacterState("safety", true)
  assert("Safety → caution MET", safetyState.metExpression === "caution")

  const hiddenState = mapToCharacterState("idle", false)
  assert("Teddy hidden when not visible", hiddenState.teddyBodyLanguage === "hidden")

  assert("inferContextFromResponse: safety", inferContextFromResponse("Be careful with that!") === "safety")
  assert("inferContextFromResponse: achievement", inferContextFromResponse("Great job! Congratulations!") === "achievement")
  assert("inferContextFromResponse: teaching default", inferContextFromResponse("Measurement is about comparing.") === "teaching")

  assert("mapTeddyAction: known", mapTeddyAction("spinning") === "spinning")
  assert("mapTeddyAction: unknown falls back", mapTeddyAction("dancing") === "sitting")

  // ── 9. Prominence scaling ──────────────────────────────────────
  section("9. Prominence Scaling")

  assert("Explorer: Teddy center, scale 1.0",
    PROMINENCE_BY_LEVEL["Explorer"].teddyPosition === "center" && PROMINENCE_BY_LEVEL["Explorer"].teddyScale === 1.0
  )
  assert("Metrologist: Teddy hidden",
    PROMINENCE_BY_LEVEL["Metrologist"].teddyPosition === "hidden"
  )
  assert("Inverse scaling: Explorer MET < Metrologist MET",
    PROMINENCE_BY_LEVEL["Explorer"].metScale < PROMINENCE_BY_LEVEL["Metrologist"].metScale
  )

  // ── 10. Notebook templates ─────────────────────────────────────
  section("10. Notebook Templates")

  const levels: CertificationLevel[] = ["Explorer", "Investigator", "Innovator", "Metrologist"]
  for (const level of levels) {
    assert(`${level} template exists`, !!TEMPLATES[level])
    assert(`${level} template has sections`, TEMPLATES[level].sections.length > 0)
    assert(`${level} template has reflection prompts`, TEMPLATES[level].reflectionPrompts.length > 0)
  }
  assert("Metrologist has uncertainty section",
    TEMPLATES["Metrologist"].sections.some(s => s.type === "uncertainty")
  )
  assert("Explorer has drawing section",
    TEMPLATES["Explorer"].sections.some(s => s.type === "drawing")
  )

  // ── 11. Open Badges 3.0 ────────────────────────────────────────
  section("11. Open Badges 3.0 Credentials")

  const testBadge = getBadgeBySlug("first-entry")!
  const testEarned = { id: "test-cred-1", badgeId: "first-entry", studentId: "s1", earnedAt: new Date().toISOString() }
  const credential = generateCredential(testBadge, testEarned, "s1", "Test Student")

  assert("Credential has @context", credential["@context"].length === 2)
  assert("Credential type includes VerifiableCredential",
    credential.type.includes("VerifiableCredential")
  )
  assert("Credential type includes OpenBadgeCredential",
    credential.type.includes("OpenBadgeCredential")
  )
  assert("Issuer is MET Scientia, LLC", credential.issuer.name === "MET Scientia, LLC")
  assert("Achievement name matches badge", credential.credentialSubject.achievement.name === testBadge.name)
  assert("Credential has schema ref", credential.credentialSchema.length > 0)

  // ── Summary ────────────────────────────────────────────────────
  console.log("\n=======================================")
  console.log("INTEGRATION TEST SUMMARY")
  console.log("=======================================")
  console.log(`Total:   ${passed + failed}`)
  console.log(`Passed:  ${passed}`)
  console.log(`Failed:  ${failed}`)

  if (failures.length > 0) {
    console.log("\nFailures:")
    for (const f of failures) {
      console.log(`  ✗ ${f}`)
    }
    process.exit(1)
  } else {
    console.log("\n✓ ALL INTEGRATION TESTS PASSED")
  }
}

main()
