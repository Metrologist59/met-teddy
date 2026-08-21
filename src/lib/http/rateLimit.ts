// src/lib/http/rateLimit.ts
// Best-effort, in-memory (ip, email) throttle for /api/register.
//
// Interim measure: server-side signUp() collapses Supabase's own
// per-IP rate limit onto a single egress IP shared by every user, so
// something has to stand in until real bot protection (Turnstile via
// signUp's captchaToken option) is added. This is per-instance and
// resets on redeploy/cold start — it will not stop a distributed
// attacker. It stops a naive retry loop.

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const MAX_TRACKED_KEYS = 5000

const attempts = new Map<string, number[]>()

export function isRateLimited(ip: string | null, email: string): boolean {
  const key = `${ip ?? "unknown"}:${email.toLowerCase()}`
  const now = Date.now()
  const existing = (attempts.get(key) ?? []).filter(t => now - t < WINDOW_MS)

  if (existing.length >= MAX_ATTEMPTS) {
    attempts.set(key, existing)
    return true
  }

  existing.push(now)
  attempts.set(key, existing)

  if (attempts.size > MAX_TRACKED_KEYS) {
    const oldestKey = attempts.keys().next().value
    if (oldestKey) attempts.delete(oldestKey)
  }

  return false
}
