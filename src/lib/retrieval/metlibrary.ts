// src/lib/retrieval/metlibrary.ts
// MetLibrary federation retrieval for MET and Teddy.
// Adapted from MetTutor's src/lib/metlibrary/client.ts mlRetrieve().
//
// Searches MetLibrary directly for technical grounding — formal
// definitions, clause-level content, and standards methodology.
// Graceful degradation: returns empty on any failure.
//
// BLOCKED: MetLibrary federation requires the signed entitlement
// agreement with the Metrology Institute. Until then, this module
// returns empty results and the MET Field Guide is the sole source.

import { createClient } from "@supabase/supabase-js"
import { embedQuery, formatVector } from "./embed"

// ── Types ────────────────────────────────────────────────────────────────────

export interface MetLibraryChunk {
  id:              string
  content:         string
  similarity:      number
  document_title?: string
  section_heading?: string
  document_id?:    string
  is_foundational?: boolean
  standard_body?:  string
}

export interface MetLibraryResult {
  chunks:    MetLibraryChunk[]
  available: boolean  // whether MetLibrary was reachable
}

// ── Client ───────────────────────────────────────────────────────────────────

function getMetLibrarySupabase() {
  const url = process.env.METLIBRARY_SUPABASE_URL
  const key = process.env.METLIBRARY_SERVICE_ROLE_KEY
  if (!url || !key) return null

  return createClient(url, key, { auth: { persistSession: false } })
}

// ── Federation check ─────────────────────────────────────────────────────────

/**
 * Returns true if MetLibrary federation is configured and available.
 * False means the MET Field Guide operates as the sole source.
 */
export function isMetLibraryAvailable(): boolean {
  return !!(
    process.env.METLIBRARY_SUPABASE_URL &&
    process.env.METLIBRARY_SERVICE_ROLE_KEY
  )
}

// ── Retrieval ────────────────────────────────────────────────────────────────

/**
 * Retrieve technical content from MetLibrary.
 * Returns empty results when MetLibrary is unavailable — never throws.
 *
 * This function mirrors MetTutor's mlRetrieve() but:
 *   - Uses the same embedding function (gemini-embedding-001, 768d)
 *   - Calls the same RPC (match_content_chunks_gemini)
 *   - Returns a simpler shape (no APA citations — those are handled
 *     by the Standards Bridge in MET and Teddy)
 */
export async function retrieveFromMetLibrary(
  query:      string,
  matchCount: number = 5,
  threshold:  number = 0.55,
): Promise<MetLibraryResult> {
  const empty: MetLibraryResult = { chunks: [], available: false }

  const supabase = getMetLibrarySupabase()
  if (!supabase) {
    // MetLibrary not configured — graceful degradation
    return empty
  }

  try {
    const embedding = await embedQuery(query)

    const { data, error } = await supabase.rpc("match_content_chunks_gemini", {
      query_embedding:    embedding,
      match_threshold:    threshold,
      match_count:        matchCount,
      authoritative_only: false,
      allowed_bodies:     null,
      query_text:         query,
    })

    if (error) {
      console.error("[metlibrary] RPC error:", error.message)
      return { chunks: [], available: true }  // reachable but errored
    }

    if (!data || data.length === 0) {
      return { chunks: [], available: true }
    }

    const chunks: MetLibraryChunk[] = (data as any[]).map((row) => ({
      id:              row.id ?? "",
      content:         row.content ?? row.chunk ?? "",
      similarity:      row.similarity ?? 0,
      document_title:  row.document_title ?? row.title ?? "",
      section_heading: row.section_heading ?? row.heading ?? "",
      document_id:     row.document_id ?? undefined,
      is_foundational: row.is_foundational ?? false,
      standard_body:   row.standard_body ?? undefined,
    }))

    return { chunks, available: true }

  } catch (err: any) {
    console.error("[metlibrary] unexpected error:", err.message)
    return { chunks: [], available: false }
  }
}
