/**
 * MET and Teddy — Beta Analysis Script
 * © 2026 MET Scientia, LLC
 *
 * Processes beta response data and produces a refinement report.
 * Run after collecting beta data.
 *
 * Usage: npx tsx scripts/analyzeBeta.ts <beta-data.json>
 *
 * Input: JSON file with array of beta response records.
 * Output: Refinement report with per-level metrics and recommendations.
 */

import { readFileSync, writeFileSync } from "fs"

// ── Types ────────────────────────────────────────────────────────

interface BetaRecord {
  sessionId:    string
  studentId:    string
  certLevel:    string
  gradeBand:    string
  query:        string
  response:     string
  responseTime: number      // ms
  citationPresent: boolean
  teddyPresent: boolean
  mediationPassed: boolean
  wordCount:    number
  timestamp:    string
}

interface LevelMetrics {
  level:              string
  totalResponses:     number
  avgResponseTime:    number
  p95ResponseTime:    number
  avgWordCount:       number
  citationRate:       number
  teddyAppearanceRate: number
  mediationPassRate:  number
  shortResponses:     number   // under 50 words
  longResponses:      number   // over max for level
  bannedWordCount:    number
}

// ── Analysis ─────────────────────────────────────────────────────

function analyze(records: BetaRecord[]): LevelMetrics[] {
  const levels = ["Explorer", "Investigator", "Innovator", "Metrologist"]
  const maxWords: Record<string, number> = {
    Explorer: 150, Investigator: 250, Innovator: 400, Metrologist: 500,
  }

  return levels.map(level => {
    const levelRecords = records.filter(r => r.certLevel === level)
    if (levelRecords.length === 0) {
      return {
        level, totalResponses: 0, avgResponseTime: 0, p95ResponseTime: 0,
        avgWordCount: 0, citationRate: 0, teddyAppearanceRate: 0,
        mediationPassRate: 0, shortResponses: 0, longResponses: 0, bannedWordCount: 0,
      }
    }

    const times = levelRecords.map(r => r.responseTime).sort((a, b) => a - b)
    const words = levelRecords.map(r => r.wordCount)
    const max = maxWords[level] ?? 300

    return {
      level,
      totalResponses: levelRecords.length,
      avgResponseTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      p95ResponseTime: times[Math.floor(times.length * 0.95)] ?? 0,
      avgWordCount: Math.round(words.reduce((a, b) => a + b, 0) / words.length),
      citationRate: levelRecords.filter(r => r.citationPresent).length / levelRecords.length,
      teddyAppearanceRate: levelRecords.filter(r => r.teddyPresent).length / levelRecords.length,
      mediationPassRate: levelRecords.filter(r => r.mediationPassed).length / levelRecords.length,
      shortResponses: words.filter(w => w < 50).length,
      longResponses: words.filter(w => w > max).length,
      bannedWordCount: levelRecords.filter(r =>
        /\bobviously\b/i.test(r.response) || /\byou\s+simply\b/i.test(r.response)
      ).length,
    }
  })
}

// ── Recommendations ──────────────────────────────────────────────

function recommend(metrics: LevelMetrics[]): string[] {
  const recs: string[] = []

  for (const m of metrics) {
    if (m.totalResponses === 0) continue

    if (m.citationRate < 0.90) {
      recs.push(`${m.level}: Citation rate is ${(m.citationRate * 100).toFixed(0)}% — below 90% target. Review base prompt citation requirements.`)
    }
    if (m.mediationPassRate < 1.0 && m.level !== "Metrologist") {
      recs.push(`${m.level}: Mediation pass rate is ${(m.mediationPassRate * 100).toFixed(0)}% — must be 100%. Tighten mediation guard or adjust prompt.`)
    }
    if (m.avgWordCount > 1.2 * ({ Explorer: 150, Investigator: 250, Innovator: 400, Metrologist: 500 }[m.level] ?? 300)) {
      recs.push(`${m.level}: Average response length (${m.avgWordCount} words) exceeds target by >20%. Add explicit length guidance to level adaptation.`)
    }
    if (m.avgWordCount < 0.5 * ({ Explorer: 150, Investigator: 250, Innovator: 400, Metrologist: 500 }[m.level] ?? 300)) {
      recs.push(`${m.level}: Average response length (${m.avgWordCount} words) is less than half the target. Responses may be too terse.`)
    }
    if (m.p95ResponseTime > 8000) {
      recs.push(`${m.level}: p95 latency is ${m.p95ResponseTime}ms — above 8s target. Check retrieval performance and context size.`)
    }
    if (m.bannedWordCount > 0) {
      recs.push(`${m.level}: ${m.bannedWordCount} responses contain banned words. Reinforce guardrails in prompt.`)
    }
    if (m.level === "Explorer" && m.teddyAppearanceRate < 0.80) {
      recs.push(`Explorer: Teddy appearance rate is ${(m.teddyAppearanceRate * 100).toFixed(0)}% — below 80% target. Increase Teddy prominence in Explorer adaptation.`)
    }
    if (m.level === "Metrologist" && m.teddyAppearanceRate > 0.20) {
      recs.push(`Metrologist: Teddy appearance rate is ${(m.teddyAppearanceRate * 100).toFixed(0)}% — above 20% target. Reduce Teddy prominence in Metrologist adaptation.`)
    }
  }

  return recs.length > 0 ? recs : ["No refinements needed — all metrics within targets."]
}

// ── Main ─────────────────────────────────────────────────────────

const inputFile = process.argv[2]

if (!inputFile) {
  console.log("MET and Teddy — Beta Analysis Script")
  console.log("====================================")
  console.log("")
  console.log("Usage: npx tsx scripts/analyzeBeta.ts <beta-data.json>")
  console.log("")
  console.log("Input format: JSON array of BetaRecord objects with fields:")
  console.log("  sessionId, studentId, certLevel, gradeBand, query, response,")
  console.log("  responseTime, citationPresent, teddyPresent, mediationPassed,")
  console.log("  wordCount, timestamp")
  console.log("")
  console.log("To generate sample data for testing, create a file with:")
  console.log('  [{ "sessionId": "s1", "studentId": "u1", "certLevel": "Explorer", ... }]')
  process.exit(0)
}

try {
  const raw = readFileSync(inputFile, "utf-8")
  const records: BetaRecord[] = JSON.parse(raw)

  console.log("MET and Teddy — Beta Analysis Report")
  console.log("====================================\n")
  console.log(`Records analyzed: ${records.length}`)
  console.log(`Students: ${new Set(records.map(r => r.studentId)).size}`)
  console.log(`Sessions: ${new Set(records.map(r => r.sessionId)).size}\n`)

  const metrics = analyze(records)

  console.log("── Per-Level Metrics ──\n")
  for (const m of metrics) {
    if (m.totalResponses === 0) continue
    console.log(`  ${m.level}:`)
    console.log(`    Responses:       ${m.totalResponses}`)
    console.log(`    Avg latency:     ${m.avgResponseTime}ms`)
    console.log(`    p95 latency:     ${m.p95ResponseTime}ms`)
    console.log(`    Avg word count:  ${m.avgWordCount}`)
    console.log(`    Citation rate:   ${(m.citationRate * 100).toFixed(0)}%`)
    console.log(`    Teddy rate:      ${(m.teddyAppearanceRate * 100).toFixed(0)}%`)
    console.log(`    Mediation pass:  ${(m.mediationPassRate * 100).toFixed(0)}%`)
    console.log(`    Too short:       ${m.shortResponses}`)
    console.log(`    Too long:        ${m.longResponses}`)
    console.log(`    Banned words:    ${m.bannedWordCount}`)
    console.log("")
  }

  const recs = recommend(metrics)
  console.log("── Recommendations ──\n")
  for (const r of recs) {
    console.log(`  → ${r}`)
  }

  // Write report
  const report = { timestamp: new Date().toISOString(), recordCount: records.length, metrics, recommendations: recs }
  writeFileSync("beta-analysis-report.json", JSON.stringify(report, null, 2))
  console.log("\nReport written to beta-analysis-report.json")

} catch (err: any) {
  console.error(`Error: ${err.message}`)
  process.exit(1)
}
