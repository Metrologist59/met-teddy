/**
 * MET and Teddy — AI Response Validation Suite
 * © 2026 MET Scientia, LLC
 *
 * Comprehensive testing of the AI backend across all four certification
 * levels. Tests concept explanations, Teddy interactions, guardrail
 * compliance, citation format, mediation boundary, and source blend.
 *
 * Usage: npx tsx scripts/testAIResponses.ts
 *
 * Requires .env.local with ANTHROPIC_API_KEY and GOOGLE_API_KEY.
 * Calls the live API — each run costs tokens.
 */

import { readFileSync, writeFileSync } from "fs"
import { config } from "dotenv"
import { HumanMessage } from "@langchain/core/messages"
import { metAndTeddyApp } from "../src/agents/metAndTeddy/graph"
import { teddyEngine } from "../src/lib/teddy/engine"
import { mediationGuard } from "../src/lib/mediation/guard"
import { routeFromBand } from "../src/lib/levels/routing"
import { getLevelAdaptation, BASE_PROMPT } from "../src/agents/metAndTeddy/prompts"
import { LEVELS } from "../src/lib/levels/config"

// Load .env.local before any module reads process.env at call time
config({ path: ".env.local" })

// ── Types ────────────────────────────────────────────────────────────────────

type Level = "Explorer" | "Investigator" | "Innovator" | "Metrologist"
type GradeBand = "K-2" | "3-5" | "6-8" | "9-12"

interface TestCase {
  id:        string
  level:     Level
  band:      GradeBand
  message:   string
  category:  string
  checks:    Check[]
}

interface Check {
  name:        string
  test:        (reply: string) => boolean
  critical:    boolean  // if true, failure blocks sign-off
}

interface TestResult {
  id:        string
  level:     Level
  category:  string
  reply:     string
  checks:    { name: string; passed: boolean; critical: boolean }[]
  allPassed: boolean
}

// ── Check library ────────────────────────────────────────────────────────────

const hasCitationFooter = (reply: string) => reply.includes("📐")
const noBannedWords = (reply: string) => !/\b(obviously|simply|just)\b/i.test(reply) || /just\s+(like|as|the|a|about|now|then|right|because)/i.test(reply)
const noRanking = (reply: string) => !/\b(behind|below grade|younger level|below level)\b/i.test(reply)
const noVIMClause = (reply: string) => !/VIM\s+(?:§\s*)?\d+\.\d+/i.test(reply)
const noGUMClause = (reply: string) => !/GUM\s+(?:§\s*)?\d+\.\d+/i.test(reply)
const noISO17025Clause = (reply: string) => !/ISO\s*\/?\s*IEC\s+17025.*§\s*\d+/i.test(reply)
const hasTeddy = (reply: string) => /teddy/i.test(reply)
const noTeddy = (reply: string) => !/teddy/i.test(reply) // for when Teddy should be absent
const mentionsUnit = (reply: string) => /\b(unit|units|inches|centimeters|cm|mm|grams|kg|seconds|degrees|volts|ohms)\b/i.test(reply)
const responseLengthOk = (reply: string, maxWords: number) => reply.split(/\s+/).length <= maxWords
const hasStandardName = (reply: string) => /\b(VIM|GUM|ISO|NIST|ANSI|NCSL|CCT|OIML)\b/.test(reply)

// ── Test matrix ──────────────────────────────────────────────────────────────

const TESTS: TestCase[] = [
  // ── EXPLORER ───────────────────────────────────────────────────────
  {
    id: "E-concept-1", level: "Explorer", band: "K-2",
    message: "What is measurement?",
    category: "concept",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
      { name: "No ranking language", test: noRanking, critical: true },
      { name: "No VIM clause in body", test: noVIMClause, critical: true },
      { name: "No GUM clause in body", test: noGUMClause, critical: true },
      { name: "Response under 200 words", test: (r) => responseLengthOk(r, 200), critical: false },
    ],
  },
  {
    id: "E-teddy-1", level: "Explorer", band: "K-2",
    message: "Hi Teddy! What are you sniffing?",
    category: "teddy-interaction",
    checks: [
      { name: "Mentions Teddy", test: hasTeddy, critical: true },
      { name: "No VIM clause", test: noVIMClause, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
    ],
  },
  {
    id: "E-above-level", level: "Explorer", band: "K-2",
    message: "What is a coverage factor?",
    category: "above-level",
    checks: [
      { name: "No VIM clause", test: noVIMClause, critical: true },
      { name: "No GUM clause", test: noGUMClause, critical: true },
      { name: "No ISO 17025 clause", test: noISO17025Clause, critical: true },
      { name: "No ranking language", test: noRanking, critical: true },
    ],
  },

  // ── INVESTIGATOR ───────────────────────────────────────────────────
  {
    id: "I-concept-1", level: "Investigator", band: "3-5",
    message: "What is calibration?",
    category: "concept",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
      { name: "No VIM clause in body", test: noVIMClause, critical: true },
      { name: "Mentions unit", test: mentionsUnit, critical: false },
    ],
  },
  {
    id: "I-mission-1", level: "Investigator", band: "3-5",
    message: "How do I measure the period of a pendulum?",
    category: "mission",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "No GUM clause", test: noGUMClause, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
    ],
  },

  // ── INNOVATOR ──────────────────────────────────────────────────────
  {
    id: "N-concept-1", level: "Innovator", band: "6-8",
    message: "Explain measurement uncertainty.",
    category: "concept",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
      { name: "No ranking language", test: noRanking, critical: true },
    ],
  },
  {
    id: "N-industry-1", level: "Innovator", band: "6-8",
    message: "How is measurement used in aerospace?",
    category: "industry",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
    ],
  },

  // ── METROLOGIST ────────────────────────────────────────────────────
  {
    id: "M-concept-1", level: "Metrologist", band: "9-12",
    message: "Explain Type A and Type B evaluation of uncertainty per the GUM.",
    category: "concept",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "References a standard", test: hasStandardName, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
    ],
  },
  {
    id: "M-career-1", level: "Metrologist", band: "9-12",
    message: "What does a calibration technician do day to day?",
    category: "career",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
    ],
  },
  {
    id: "M-deep-1", level: "Metrologist", band: "9-12",
    message: "Walk me through a Welch-Satterthwaite calculation for effective degrees of freedom.",
    category: "deep-technical",
    checks: [
      { name: "Has citation footer", test: hasCitationFooter, critical: true },
      { name: "References GUM or VIM", test: hasStandardName, critical: true },
    ],
  },

  // ── GUARDRAIL: no ranking across levels ────────────────────────────
  {
    id: "G-norank-1", level: "Explorer", band: "K-2",
    message: "Am I behind the other kids?",
    category: "guardrail",
    checks: [
      { name: "No ranking language", test: noRanking, critical: true },
      { name: "No banned words", test: noBannedWords, critical: true },
    ],
  },
]

// ── Runner ───────────────────────────────────────────────────────────────────

async function runTest(test: TestCase): Promise<TestResult> {
  const session = routeFromBand(test.band)
  const levelAdaptation = getLevelAdaptation(test.level)
  const levelConfig = LEVELS[test.level]

  const teddyDirective = teddyEngine(
    test.message,
    test.level,
    levelConfig.teddyProminence,
  )

  const systemParts = [
    BASE_PROMPT,
    levelAdaptation,
    `SESSION:\n- Student ID: test-student\n- Certification level: ${test.level}\n- Grade band: ${test.band}`,
    teddyDirective.promptBlock,
  ]

  const result = await metAndTeddyApp.invoke(
    { messages: [new HumanMessage(test.message)] },
    {
      configurable: {
        certLevel: test.level,
        gradeBand: test.band,
        studentId: "test-student",
        retrievedContext: "",
      },
    }
  )

  const lastMsg = result.messages[result.messages.length - 1]
  const reply = typeof lastMsg.content === "string" ? lastMsg.content : JSON.stringify(lastMsg.content)

  // Run mediation guard
  const guardResult = mediationGuard(reply, test.level, [])

  const checkResults = test.checks.map(check => ({
    name: check.name,
    passed: check.test(reply),
    critical: check.critical,
  }))

  // Add mediation guard result as a check for non-Metrologist levels
  if (test.level !== "Metrologist") {
    checkResults.push({
      name: "Mediation guard passes",
      passed: guardResult.passed,
      critical: true,
    })
  }

  return {
    id: test.id,
    level: test.level,
    category: test.category,
    reply,
    checks: checkResults,
    allPassed: checkResults.every(c => c.passed),
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("MET and Teddy — AI Response Validation Suite")
  console.log("=============================================\n")
  console.log(`Running ${TESTS.length} test cases...\n`)

  const results: TestResult[] = []
  let totalPassed = 0
  let totalFailed = 0
  let criticalFailures = 0

  for (const test of TESTS) {
    process.stdout.write(`  [${test.id}] ${test.level} / ${test.category}... `)

    try {
      const result = await runTest(test)
      results.push(result)

      if (result.allPassed) {
        console.log("✓ PASS")
        totalPassed++
      } else {
        const failures = result.checks.filter(c => !c.passed)
        const critFails = failures.filter(c => c.critical)
        console.log(`✗ FAIL (${failures.length} checks)`)
        for (const f of failures) {
          console.log(`    ${f.critical ? "CRITICAL" : "WARN"}: ${f.name}`)
        }
        totalFailed++
        criticalFailures += critFails.length
      }
    } catch (err: any) {
      console.log(`✗ ERROR: ${err.message}`)
      totalFailed++
      criticalFailures++
    }
  }

  // ── Summary ────────────────────────────────────────────────────────
  console.log("\n=============================================")
  console.log("VALIDATION SUMMARY")
  console.log("=============================================")
  console.log(`Total tests:        ${TESTS.length}`)
  console.log(`Passed:             ${totalPassed}`)
  console.log(`Failed:             ${totalFailed}`)
  console.log(`Critical failures:  ${criticalFailures}`)

  // Per-level summary
  const levels: Level[] = ["Explorer", "Investigator", "Innovator", "Metrologist"]
  console.log("\nPer-level results:")
  for (const level of levels) {
    const levelResults = results.filter(r => r.level === level)
    const passed = levelResults.filter(r => r.allPassed).length
    console.log(`  ${level}: ${passed}/${levelResults.length} passed`)
  }

  // Per-category summary
  const categories = [...new Set(TESTS.map(t => t.category))]
  console.log("\nPer-category results:")
  for (const cat of categories) {
    const catResults = results.filter(r => r.category === cat)
    const passed = catResults.filter(r => r.allPassed).length
    console.log(`  ${cat}: ${passed}/${catResults.length} passed`)
  }

  // ── Sign-off decision ──────────────────────────────────────────────
  console.log("\n=============================================")
  if (criticalFailures === 0) {
    console.log("✓ PHASE 2 VALIDATION PASSED — ready for sign-off.")
  } else {
    console.log(`✗ ${criticalFailures} CRITICAL FAILURE(S) — resolve before sign-off.`)
    process.exit(1)
  }

  // ── Write detailed results ─────────────────────────────────────────
  const report = results.map(r => ({
    id: r.id,
    level: r.level,
    category: r.category,
    passed: r.allPassed,
    checks: r.checks,
    replyPreview: r.reply.slice(0, 200) + (r.reply.length > 200 ? "..." : ""),
  }))

  writeFileSync("validation-report.json", JSON.stringify(report, null, 2))
  console.log("\nDetailed results written to validation-report.json")
}

main().catch(err => {
  console.error("Validation suite failed:", err)
  process.exit(1)
})
