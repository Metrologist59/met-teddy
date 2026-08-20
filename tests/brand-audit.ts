/**
 * MET and Teddy — Brand Conformance Audit
 * © 2026 MET Scientia, LLC
 *
 * Scans every surface for brand compliance per:
 *   - MET Name Identities v1.0 §4 (name usage rules)
 *   - MET Brand Ecosystem Profile v2.0 §20, §23.3
 *
 * Usage: npx tsx tests/brand-audit.ts
 */

import { readdirSync, readFileSync, statSync } from "fs"
import { join, extname } from "path"

const SCAN_DIRS = ["src"]
const EXTENSIONS = [".ts", ".tsx", ".css"]
const SKIP_DIRS = ["node_modules", ".next", ".git"]

interface Finding {
  file:    string
  line:    number
  issue:   string
  context: string
  severity: "error" | "warning"
}

const findings: Finding[] = []

// ── Rules from Name Identities v1.0 §4 ──────────────────────────

function checkFile(filePath: string) {
  const content = readFileSync(filePath, "utf-8")
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Skip comments that discuss rules (test files, this file)
    if (filePath.includes("brand-audit") || filePath.includes("test")) continue

    // RULE: Never "Met" or "met" alone (case-sensitive — must be "MET")
    // Exclude CSS class names, variable names, "met-card" etc.
    if (/\bMet\b/.test(line) && !/met-|met_|\.met|"met|'met|`met|\/met/.test(line)) {
      // Check it's not "Metrologist" or "MetLibrary" or a comment about naming
      if (!/Metrolog|MetLibrary|MetTutor|method|meter|metal|metaph|metadat/.test(line)) {
        findings.push({
          file: filePath, line: lineNum, severity: "warning",
          issue: '"Met" should be "MET" (all caps)',
          context: line.trim().slice(0, 80),
        })
      }
    }

    // RULE: Never "MET + Teddy" or "MET/Teddy"
    if (/MET\s*[+\/]\s*Teddy/i.test(line)) {
      findings.push({
        file: filePath, line: lineNum, severity: "error",
        issue: '"MET + Teddy" or "MET/Teddy" — use "MET and Teddy"',
        context: line.trim().slice(0, 80),
      })
    }

    // RULE: Never "MET & Teddy" in body text (OK in logos/headers only)
    // Check if it's in a prose context (not a component name or heading)
    if (/MET & Teddy/.test(line) && !/className|heading|logo|h1|h2|header/i.test(line)) {
      findings.push({
        file: filePath, line: lineNum, severity: "warning",
        issue: '"MET & Teddy" in body text — use "MET and Teddy" ("&" for logos/headers only)',
        context: line.trim().slice(0, 80),
      })
    }

    // RULE: Never abbreviate "MET Scientia" to "MS" or "MET Sci"
    if (/\bMS\b/.test(line) && /scientia|MET/i.test(line)) {
      // Very noisy — skip
    }

    // RULE: "MET Field Guide" three words, not "METFieldGuide" in user-facing text
    // Technical identifiers (imports, file paths) are OK
    if (/METFieldGuide/.test(line) && !/(import|require|from|path|file|dir)/.test(line)) {
      findings.push({
        file: filePath, line: lineNum, severity: "warning",
        issue: '"METFieldGuide" in user-facing text — use "MET Field Guide" (three words)',
        context: line.trim().slice(0, 80),
      })
    }

    // RULE: Platform footer should be "MET Universe — A MET Scientia Experience"
    // NOT "Powered by MetTutor.ai" (Name Identities v1.0 §5 conflict resolved per v2.0)
    if (/Powered by MetTutor/i.test(line)) {
      findings.push({
        file: filePath, line: lineNum, severity: "error",
        issue: '"Powered by MetTutor" — removed per Brand Ecosystem Profile v2.0 §23.3',
        context: line.trim().slice(0, 80),
      })
    }

    // RULE: Copyright should be "© 2026 MET Scientia, LLC" (formal) or "© 2026 MET Scientia" (brand)
    if (/©.*MET/.test(line)) {
      if (!/© 2026 MET Scientia/.test(line)) {
        findings.push({
          file: filePath, line: lineNum, severity: "warning",
          issue: 'Copyright format — should be "© 2026 MET Scientia, LLC" or "© 2026 MET Scientia"',
          context: line.trim().slice(0, 80),
        })
      }
    }
  }
}

function scanDir(dir: string) {
  let entries: string[]
  try { entries = readdirSync(dir) } catch { return }

  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry)) continue
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) scanDir(fullPath)
    else if (EXTENSIONS.includes(extname(entry))) checkFile(fullPath)
  }
}

// ── Run ──────────────────────────────────────────────────────────

console.log("MET and Teddy — Brand Conformance Audit")
console.log("========================================\n")

for (const dir of SCAN_DIRS) {
  console.log(`Scanning ${dir}/...`)
  scanDir(dir)
}

const errors = findings.filter(f => f.severity === "error")
const warnings = findings.filter(f => f.severity === "warning")

console.log(`\nResults: ${errors.length} errors, ${warnings.length} warnings\n`)

if (errors.length > 0) {
  console.log("── ERRORS ──")
  for (const f of errors) {
    console.log(`  ✗ ${f.file}:${f.line}`)
    console.log(`    ${f.issue}`)
    console.log(`    ${f.context}\n`)
  }
}

if (warnings.length > 0) {
  console.log("── WARNINGS ──")
  for (const f of warnings) {
    console.log(`  ⚠ ${f.file}:${f.line}`)
    console.log(`    ${f.issue}`)
    console.log(`    ${f.context}\n`)
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("✓ BRAND CONFORMANCE VERIFIED — zero issues found.")
} else if (errors.length === 0) {
  console.log(`✓ No blocking errors. ${warnings.length} warning(s) to review.`)
} else {
  console.log(`✗ ${errors.length} ERROR(S) — resolve before launch.`)
  process.exit(1)
}
