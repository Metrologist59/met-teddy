// src/lib/http/request.ts
// Small request-derived helpers used by the registration and auth routes.
// Typed against the plain Web `Request` (NextRequest is a subtype) so
// the same helpers work in both Route Handlers (which receive a plain
// Request) and API routes typed against NextRequest.

/** Per-request origin, derived from forwarded headers. Falls back to
 *  the request URL, then NEXT_PUBLIC_SITE_URL. Never hardcode the env
 *  var alone — it points at production, so local dev would otherwise
 *  mail out production confirmation links. */
export function getSiteOrigin(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto")
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")

  if (proto && host) return `${proto}://${host}`

  try {
    return new URL(req.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  }
}

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/
const IPV6_RE = /^[0-9a-fA-F:]+$/

/** First hop of x-forwarded-for, validated as a plausible IP literal.
 *  Behind a proxy this header is "client, proxy1, proxy2" — writing
 *  the raw value into an INET column fails with 22P02. Returns null
 *  rather than a malformed value. */
export function firstIp(req: Request): string | null {
  const header = req.headers.get("x-forwarded-for")
  if (!header) return null

  const candidate = header.split(",")[0]?.trim()
  if (!candidate) return null

  if (IPV4_RE.test(candidate) || (candidate.includes(":") && IPV6_RE.test(candidate))) {
    return candidate
  }
  return null
}

/** Validates a `next` redirect target is a same-origin relative path,
 *  never an absolute URL or protocol-relative path (open-redirect guard). */
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null
  if (!next.startsWith("/")) return null
  if (next.startsWith("//") || next.startsWith("/\\")) return null
  return next
}
