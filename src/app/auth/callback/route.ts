// src/app/auth/callback/route.ts
// Thin delegate to /auth/confirm. Kept as a distinct, still-public
// route in case any existing Supabase project configuration or
// bookmarked link references /auth/callback directly.

export { GET } from "@/app/auth/confirm/route"
