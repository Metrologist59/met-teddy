// src/lib/retrieval/embed.ts
// Query embedding for MET and Teddy dual-source retrieval.
// Transfers directly from MetTutor's src/lib/metlibrary/client.ts embedQuery().
// Model, dimensions, and task type MUST match MetLibrary exactly.

import { GoogleGenAI } from "@google/genai"

const MODEL = "gemini-embedding-001"
const DIMENSIONS = 768
const TASK_TYPE_QUERY = "RETRIEVAL_QUERY"

function getGemini() {
  return new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
}

/**
 * Embed a student's query for retrieval against both knowledge bases.
 * Uses RETRIEVAL_QUERY task type (counterpart to RETRIEVAL_DOCUMENT
 * used when the content was embedded).
 */
export async function embedQuery(query: string): Promise<number[]> {
  const ai = getGemini()
  const response: any = await ai.models.embedContent({
    model: MODEL,
    contents: query.slice(0, 6000),
    config: {
      taskType: TASK_TYPE_QUERY,
      outputDimensionality: DIMENSIONS,
    },
  })

  const values =
    response?.embeddings?.[0]?.values ??
    response?.embedding?.values ??
    null

  if (!values || !Array.isArray(values) || values.length === 0) {
    throw new Error("Gemini returned no embedding values")
  }
  return values
}

/**
 * Format a vector for Postgres (used when calling Supabase RPCs
 * that expect a vector literal).
 */
export function formatVector(values: number[]): string {
  return `[${values.join(",")}]`
}
