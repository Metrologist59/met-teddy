// src/lib/supabase/middleware.ts
// Auth middleware for MET and Teddy.
// Protects routes, checks email confirmation and COPPA consent,
// redirects as needed. No shared session or credential linkage with
// MetTutor. Runs on the Edge runtime — never import admin.ts, resend,
// or src/lib/auth/profiles.ts here.

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_EXACT = new Set([
  "/", "/login", "/register", "/coppa", "/privacy", "/terms", "/verify-email",
  "/consent-pending", "/forgot-password", "/reset-password",
])
// /auth/callback and /auth/confirm must be reachable with no session —
// that's the whole point of a confirmation link. Previously omitted,
// which meant every confirmation link redirected to /login and the
// code was never exchanged.
const PUBLIC_PREFIXES = ["/auth/"]
const PUBLIC_API = new Set(["/api/health", "/api/register"])


export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  // Collected here, applied to whichever response we end up returning
  // below — including redirects. A refreshed session's Set-Cookie
  // headers are only useful to the browser if they land on the
  // response that's actually returned; building a bare
  // NextResponse.redirect() without forwarding these would silently
  // drop a just-refreshed session, signing the user out.
  let pendingCookies: { name: string; value: string; options?: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          pendingCookies = cookiesToSet
        },
      },
    }
  )

  function finish(response: NextResponse): NextResponse {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isApi = pathname.startsWith("/api/")

  if (isApi) {
    if (PUBLIC_API.has(pathname)) return finish(NextResponse.next({ request }))
    if (!user) {
      return finish(NextResponse.json({ error: "unauthorized" }, { status: 401 }))
    }
    return finish(NextResponse.next({ request }))
  }

  if (PUBLIC_EXACT.has(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return finish(NextResponse.next({ request }))
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return finish(NextResponse.redirect(url))
  }

  if (!user.email_confirmed_at) {
    const url = request.nextUrl.clone()
    url.pathname = "/verify-email"
    url.searchParams.set("email", user.email ?? "")
    return finish(NextResponse.redirect(url))
  }

  // app_metadata is service-role-writable only (unlike user_metadata,
  // which the user can rewrite via updateUser), so it's safe to gate
  // on. Set by /api/register and flipped by finalizeConfirmation —
  // no extra DB round trip here.
  const appMeta = user.app_metadata as { consent_required?: boolean; consent_verified?: boolean }
  if (appMeta?.consent_required === true && appMeta?.consent_verified !== true) {
    const url = request.nextUrl.clone()
    url.pathname = "/consent-pending"
    return finish(NextResponse.redirect(url))
  }

  return finish(NextResponse.next({ request }))
}
