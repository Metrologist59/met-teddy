/**
 * MET and Teddy — MetTutor Dependency Check
 * © 2026 MET Scientia, LLC
 *
 * Scans the codebase for any MetTutor references to verify
 * complete separation at the shell level.
 *
 * Usage: npx tsx tests/mettutor-dependency-check.ts
 */

import { readdirSync, readFileSync, statSync } from "fs"
import { join, extname } from "path"

const SCAN_DIRS = ["src", "docs", "supabase"]
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".md", ".sql", ".json"]
const SKIP_DIRS = ["node_modules", ".next", ".git", "dist"]

// Patterns that indicate MetTutor coupling
const FORBIDDEN_PATTERNS = [
  { pattern: /from\s+['"].*mettutor/gi, name: "Import from MetTutor" },
  { pattern: /require\(['"].*mettutor/gi, name: "Require MetTutor" },
  { pattern: /yvtcdawmkmvusstqgnjm/g, name: "MetTutor Supabase org ID" },
  { pattern: /metrology-tutor/g, name: "MetTutor Supabase project name" },
  { pattern: /metlibrary-prod/g, name: "MetLibrary-prod Supabase project name" },
  { pattern: /mettutor\.com/gi, name: "MetTutor domain reference" },
  { pattern: /MetTutorApp|metTutorGraph|MetTutorAgent/g, name: "MetTutor code identifier" },
  { pattern: /\/mettutor\//gi, name: "MetTutor route path" },
]

// Allowed patterns (contextual mentions in docs are fine)
const ALLOWED_CONTEXTS = [
  "separation-charter",
  "independence-attestation",
  "navigation-architecture",
  "PHASE3_TEST_MATRIX",
  "mettutor-dependency-check",  // this file itself
]

let passed = 0
let failed = 0
const violations: { file: string; pattern: string; line: string }[] = []

function scanFile(filePath: string) {
  const content = readFileSync(filePath, "utf-8")
  const lines = content.split("\n")
  const isAllowedContext = ALLOWED_CONTEXTS.some(ctx => filePath.includes(ctx))

  for (const { pattern, name } of FORBIDDEN_PATTERNS) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        // Reset regex lastIndex
        pattern.lastIndex = 0

        if (isAllowedContext) continue // docs that discuss separation are fine

        violations.push({
          file: filePath,
          pattern: name,
          line: `L${i + 1}: ${lines[i].trim().slice(0, 80)}`,
        })
      }
      pattern.lastIndex = 0
    }
  }
}

function scanDir(dir: string) {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }

  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry)) continue
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      scanDir(fullPath)
    } else if (EXTENSIONS.includes(extname(entry))) {
      scanFile(fullPath)
    }
  }
}

console.log("MET and Teddy — MetTutor Dependency Check")
console.log("==========================================\n")

for (const dir of SCAN_DIRS) {
  console.log(`Scanning ${dir}/...`)
  scanDir(dir)
}

console.log("")

if (violations.length === 0) {
  console.log("✓ ZERO MetTutor dependencies found.")
  console.log("  The MET and Teddy codebase is fully independent.")
  passed++
} else {
  console.log(`✗ ${violations.length} MetTutor reference(s) found:\n`)
  for (const v of violations) {
    console.log(`  File: ${v.file}`)
    console.log(`  Pattern: ${v.pattern}`)
    console.log(`  ${v.line}\n`)
  }
  failed++
}

console.log("\n==========================================")
if (failed === 0) {
  console.log("✓ INDEPENDENCE VERIFIED")
} else {
  console.log("✗ INDEPENDENCE CHECK FAILED")
  process.exit(1)
}
