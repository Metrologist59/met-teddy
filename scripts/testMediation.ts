// scripts/testMediation.ts
// Verbatim-Leakage Test Suite for MET and Teddy.
// Tests the mediation guard against known patterns.
// No API calls — runs entirely locally against the guard function.
//
// Usage: npx tsx scripts/testMediation.ts

import { mediationGuard } from "../src/lib/mediation/guard"
import type { RetrievedChunk } from "../src/lib/retrieval/dualSource"

// ── Test cases ───────────────────────────────────────────────────────────────

interface TestCase {
  id:       string
  level:    "Explorer" | "Investigator" | "Innovator" | "Metrologist"
  response: string
  chunks:   RetrievedChunk[]
  expectPass: boolean
  reason:   string
}

const MOCK_ML_CHUNK: RetrievedChunk = {
  id: "ml-001",
  chunk_text: "Per VIM 2.1 measurement is the process of experimentally obtaining one or more quantity values that can reasonably be attributed to a quantity the result is only an approximation",
  chunk_label: "[MetLibrary] VIM — Measurement",
  source_kb: "metlibrary",
  grade_band: "9-12",
  domain: "general",
  similarity: 0.85,
}

const TESTS: TestCase[] = [
  // ── Should PASS ────────────────────────────────────────────────────
  {
    id: "E-clean-1",
    level: "Explorer",
    response: "Measurement means using a tool to find a number that tells you something about the world — like how long or how heavy something is!\n\n📐 Source: MET Field Guide",
    chunks: [],
    expectPass: true,
    reason: "Clean Explorer response with no standards references",
  },
  {
    id: "I-clean-1",
    level: "Investigator",
    response: "Calibration is when you check your measuring tool against a known standard to see how accurate it is. It tells you the error — it doesn't fix the instrument.\n\n📐 Source: MET Field Guide · Based on the International Vocabulary of Metrology",
    chunks: [],
    expectPass: true,
    reason: "Clean Investigator response with named standard but no clause number",
  },
  {
    id: "N-clean-1",
    level: "Innovator",
    response: "Measurement uncertainty is a range around your measured value that characterizes how far off it could be. You build it from individual components combined by root-sum-of-squares.\n\n📐 Source: MET Field Guide · GUM §3.1",
    chunks: [],
    expectPass: true,
    reason: "Innovator with clause reference in citation footer only",
  },
  {
    id: "M-clean-1",
    level: "Metrologist",
    response: "Per VIM 2.1 (JCGM 200:2012), measurement is the process of experimentally obtaining one or more quantity values that can reasonably be attributed to a quantity. The GUM framework (JCGM 100:2008 §4.2) evaluates Type A uncertainty through statistical analysis.\n\n📐 JCGM 200:2012 (VIM) §2.1 — Measurement",
    chunks: [MOCK_ML_CHUNK],
    expectPass: true,
    reason: "Metrologist level — raw standards text is appropriate",
  },

  // ── Should FAIL ────────────────────────────────────────────────────
  {
    id: "E-fail-clause",
    level: "Explorer",
    response: "Per VIM 2.1, measurement means using a tool to find a number!\n\n📐 Source: MET Field Guide",
    chunks: [],
    expectPass: false,
    reason: "Explorer response contains VIM clause reference in body text",
  },
  {
    id: "E-fail-iso",
    level: "Explorer",
    response: "ISO/IEC 17025:2017 §6.4 says you need to take care of your tools. That means keeping them clean and storing them properly.\n\n📐 Source: MET Field Guide",
    chunks: [],
    expectPass: false,
    reason: "Explorer response contains ISO 17025 clause reference",
  },
  {
    id: "I-fail-gum",
    level: "Investigator",
    response: "The GUM §4.2 says you should use statistics to figure out uncertainty. That means taking many measurements and calculating the standard deviation.\n\n📐 Source: MET Field Guide · Based on the Guide to Uncertainty",
    chunks: [],
    expectPass: false,
    reason: "Investigator response contains GUM clause reference in body",
  },
  {
    id: "E-fail-term",
    level: "Explorer",
    response: "You need to use the Welch-Satterthwaite equation to figure out how many degrees of freedom you have.\n\n📐 Source: MET Field Guide",
    chunks: [],
    expectPass: false,
    reason: "Explorer response contains professional terminology",
  },
  {
    id: "I-fail-term",
    level: "Investigator",
    response: "The coverage probability tells us how confident we are. Use Type A evaluation to find the standard deviation.\n\n📐 Source: MET Field Guide · Based on the GUM",
    chunks: [],
    expectPass: false,
    reason: "Investigator response contains multiple professional terms",
  },
  {
    id: "N-fail-clause-body",
    level: "Innovator",
    response: "Per JCGM 200:2012 §2.1, measurement is the process of experimentally obtaining quantity values. The EURAMET cg-13 guidelines cover temperature calibration.\n\n📐 Source: MET Field Guide · VIM §2.1",
    chunks: [],
    expectPass: false,
    reason: "Innovator has clause references in the body text, not just the footer",
  },
  {
    id: "E-fail-verbatim",
    level: "Explorer",
    response: "measurement is the process of experimentally obtaining one or more quantity values that can reasonably be attributed to a quantity the result is only an approximation and that is why we have uncertainty",
    chunks: [MOCK_ML_CHUNK],
    expectPass: false,
    reason: "Explorer response contains >15 consecutive words from MetLibrary chunk",
  },
  {
    id: "N-fail-asme",
    level: "Innovator",
    response: "Caliper calibration follows ASME B89.1.14 procedures. You check the indication error at multiple test points using traceable gauge blocks.\n\n📐 Source: MET Field Guide · VIM §3.1",
    chunks: [],
    expectPass: false,
    reason: "Innovator body contains ASME reference",
  },
]

// ── Runner ───────────────────────────────────────────────────────────────────

function main() {
  console.log("MET and Teddy — Verbatim-Leakage Test Suite")
  console.log("============================================\n")

  let passed = 0
  let failed = 0

  for (const test of TESTS) {
    const result = mediationGuard(test.response, test.level, test.chunks)

    const testPassed = result.passed === test.expectPass
    const status = testPassed ? "✓" : "✗"
    const label = testPassed ? "PASS" : "FAIL"

    console.log(`  ${status} [${test.id}] ${test.level} — ${label}`)

    if (!testPassed) {
      console.log(`    Expected: ${test.expectPass ? "pass" : "fail"}`)
      console.log(`    Got:      ${result.passed ? "pass" : "fail"}`)
      console.log(`    Reason:   ${test.reason}`)
      if (result.violations.length > 0) {
        for (const v of result.violations) {
          console.log(`    Violation: ${v.type} — "${v.match}"`)
        }
      }
      failed++
    } else {
      passed++
    }
  }

  console.log(`\n============================================`)
  console.log(`Passed: ${passed} / ${TESTS.length}`)
  console.log(`Failed: ${failed} / ${TESTS.length}`)

  if (failed > 0) {
    console.log("\n✗ SOME TESTS FAILED")
    process.exit(1)
  } else {
    console.log("\n✓ ALL TESTS PASSED — mediation guard verified.")
  }
}

main()
