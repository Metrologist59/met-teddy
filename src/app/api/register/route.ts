// src/app/api/register/route.ts
// Profile creation API for MET and Teddy registration.
// Called after Supabase auth.signUp() succeeds client-side.

import { NextRequest, NextResponse } from "next/server"
import {
  createParentProfile,
  createStudentProfile,
  createEducatorProfile,
  recordConsent,
} from "@/lib/auth/profiles"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { flow, userId, email, firstName, lastName, grade, childFirstName, schoolName } = body

    if (!flow || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (flow === "parent_led") {
      // Create parent profile
      const parentResult = await createParentProfile(userId, firstName, lastName, email)
      if (!parentResult.success) {
        return NextResponse.json({ error: parentResult.error }, { status: 500 })
      }

      // Record consent (parent is registering on behalf of child)
      const consentResult = await recordConsent(
        userId,        // student_id placeholder — updated when child profile is created
        userId,        // parent_id
        "registration_form",
        req.headers.get("x-forwarded-for") ?? undefined
      )

      return NextResponse.json({
        success: true,
        role: "parent",
        childFirstName,
        grade,
      })
    }

    if (flow === "self_led") {
      // Student 13+ — self-registration
      const result = await createStudentProfile(
        userId,
        firstName,
        grade,
        "",  // no parent
      )
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({ success: true, role: "student" })
    }

    if (flow === "educator_led") {
      const result = await createEducatorProfile(userId, firstName, lastName, email, schoolName)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({ success: true, role: "educator" })
    }

    return NextResponse.json({ error: "Invalid flow" }, { status: 400 })
  } catch (err) {
    console.error("Register API error:", err)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
