// src/lib/retrieval/dualSource.ts
// Dual-source retrieval pipeline for MET and Teddy.
// v2: Full pipeline — MET Field Guide + MetLibrary + Standards Bridge
//     resolution + latency tracking.
//
// Pipeline:
//   1. Embed the query (gemini-embedding-001, 768d, RETRIEVAL_QUERY)
//   2. Search the MET Field Guide (grade-band filtered)
//   3. Search MetLibrary if available (federation, graceful degradation)
//   4. Blend results by certification level weights
//   5. Resolve Standards Bridge citations
//   6. Build the context string for system prompt injection
//   7. Track latency

import { createClient } from "@supabase/supabase-js"
import { embedQuery, formatVector } from "./embed"
import { buildContext } from "./context"
import { retrieveFromMetLibrary, isMetLibraryAvailable } from "./metlibrary"
import { resolveBridge, formatCitationFooter } from "./bridge"
import type { CertificationLevel, GradeBand } from "@/lib/levels/config"
import { LEVELS } from "@/lib/levels/config"

// ── Types ────────────────────────────────────────────────────────────────────

export interface RetrievedChunk {
  id:          string
  chunk_text:  string
  chunk_label: string
  source_kb:   "met_field_guide" | "metlibrary"
  grade_band:  string
  domain:      string
  similarity:  number
}

export interface RetrievalResult {
  chunks:           RetrievedChunk[]
  context:          string
  citationFooter:   string
  metlibraryAvailable: boolean
  latencyMs:        number
}

// ── MET Field Guide client ──────────────────────────────────────────────────

function getFieldGuideSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// ── Field Guide retrieval ───────────────────────────────────────────────────

async function retrieveFromFieldGuide(
  embedding:  number[],
  gradeBand:  string,
  matchCount: number,
): Promise<RetrievedChunk[]> {
  const supabase = getFieldGuideSupabase()
  const vectorStr = formatVector(embedding)

  const { data, error } = await supabase
    .schema("field_guide")
    .rpc("search_field_guide", {
      query_embedding:  vectorStr,
      match_grade_band: gradeBand,
      match_domain:     null,
      match_count:      matchCount,
      match_threshold:  0.0,
    })

  if (error) {
    console.error("[fieldGuide] search error:", error.message)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id:          row.id ?? "",
    chunk_text:  row.chunk_text ?? "",
    chunk_label: row.chunk_label ?? "",
    source_kb:   "met_field_guide" as const,
    grade_band:  row.grade_band ?? gradeBand,
    domain:      row.domain ?? "general",
    similarity:  row.similarity ?? 0,
  }))
}

// ── Main pipeline ───────────────────────────────────────────────────────────

/**
 * The complete dual-source retrieval pipeline.
 *
 * 1. Embed the query
 * 2. Search MET Field Guide (always)
 * 3. Search MetLibrary (if available — graceful degradation)
 * 4. Blend by level weights
 * 5. Resolve Standards Bridge for citations
 * 6. Build context string
 */
export async function dualSourceRetrieve(
  query:      string,
  gradeBand:  string,
  level:      CertificationLevel,
  matchCount: number = 10,
): Promise<RetrievalResult> {
  const empty: RetrievalResult = {
    chunks: [],
    context: "",
    citationFooter: "",
    metlibraryAvailable: false,
    latencyMs: 0,
  }

  const startTime = Date.now()

  try {
    // ── Step 1: Embed the query ──────────────────────────────────────
    const embedding = await embedQuery(query)

    // ── Step 2 & 3: Parallel retrieval from both sources ─────────────
    const weights = LEVELS[level].retrievalBlend
    const fgCount = Math.max(1, Math.round(matchCount * weights.fieldGuide))
    const mlCount = Math.max(1, matchCount - fgCount)

    const [fgChunks, mlResult] = await Promise.all([
      retrieveFromFieldGuide(embedding, gradeBand, fgCount),
      isMetLibraryAvailable()
        ? retrieveFromMetLibrary(query, mlCount)
        : Promise.resolve({ chunks: [], available: false }),
    ])

    // ── Step 4: Blend results ────────────────────────────────────────
    // MET Field Guide chunks come first (primary source at most levels),
    // MetLibrary chunks follow (secondary, weight-adjusted).
    const mlChunks: RetrievedChunk[] = mlResult.chunks.map(c => ({
      id:          c.id,
      chunk_text:  c.content,
      chunk_label: `[MetLibrary] ${c.document_title ?? ""}${c.section_heading ? " — " + c.section_heading : ""}`,
      source_kb:   "metlibrary" as const,
      grade_band:  gradeBand,
      domain:      "general",
      similarity:  c.similarity * weights.metLibrary,
    }))

    const allChunks = [...fgChunks, ...mlChunks]
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, matchCount)

    // ── Step 5: Resolve Standards Bridge ─────────────────────────────
    // Extract concept slugs from chunk labels for bridge resolution.
    const conceptHints = fgChunks
      .map(c => c.chunk_label)
      .filter(Boolean)

    const bridgeResolutions = await resolveBridge(
      conceptHints,
      gradeBand as GradeBand,
      level,
    )

    const citationFooter = formatCitationFooter(bridgeResolutions, level)

    // ── Step 6: Build context ────────────────────────────────────────
    const context = buildContext(allChunks, level)

    const latencyMs = Date.now() - startTime

    return {
      chunks: allChunks,
      context,
      citationFooter,
      metlibraryAvailable: mlResult.available,
      latencyMs,
    }

  } catch (err: any) {
    console.error("[dualSourceRetrieve] pipeline error:", err.message)
    return {
      ...empty,
      latencyMs: Date.now() - startTime,
    }
  }
}
