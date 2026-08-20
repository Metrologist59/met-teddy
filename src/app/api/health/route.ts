// src/app/api/health/route.ts
// Health check endpoint for monitoring.

import { NextResponse } from "next/server"

interface HealthStatus {
  status:    "healthy" | "degraded" | "unhealthy"
  timestamp: string
  version:   string
  checks: {
    app:        "ok" | "error"
    supabase:   "ok" | "not_configured" | "error"
    ai_engine:  "ok" | "not_configured" | "error"
    metlibrary: "ok" | "not_configured" | "error"
  }
}

export async function GET() {
  const checks: HealthStatus["checks"] = {
    app: "ok",
    supabase: "not_configured",
    ai_engine: "not_configured",
    metlibrary: "not_configured",
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        signal: AbortSignal.timeout(5000),
      })
      checks.supabase = res.ok ? "ok" : "error"
    } catch {
      checks.supabase = "error"
    }
  }

  if (process.env.ANTHROPIC_API_KEY) checks.ai_engine = "ok"
  if (process.env.METLIBRARY_SUPABASE_URL && process.env.METLIBRARY_SERVICE_ROLE_KEY) checks.metlibrary = "ok"

  const values = Object.values(checks)
  const hasError = values.includes("error")
  const allOk = values.every(v => v === "ok")

  return NextResponse.json({
    status: hasError ? "unhealthy" : allOk ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    checks,
  } satisfies HealthStatus, {
    status: hasError ? 503 : 200,
    headers: { "Cache-Control": "no-store" },
  })
}
