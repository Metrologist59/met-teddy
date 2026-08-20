// src/app/api/credentials/route.ts
// Open Badges 3.0 verification endpoint.
// Serves credential JSON for external verifiers.
//
// GET /api/credentials?id=<credential-id>
// Returns the full OB3 credential JSON for verification.

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const credentialId = searchParams.get("id")

  if (!credentialId) {
    return NextResponse.json(
      { error: "Missing credential ID" },
      { status: 400 }
    )
  }

  // TODO: Look up credential from database (earned_badges table)
  // For now, return a structured error indicating the lookup path
  //
  // In production:
  //   1. Query earned_badges by credential ID
  //   2. Load badge_definition
  //   3. Load student profile (anonymized)
  //   4. Generate OB3 credential
  //   5. Return with proper content-type

  return NextResponse.json(
    {
      status: "verification_pending",
      message: "Credential verification will be available when the badge system is connected to the database.",
      credentialId,
      issuer: {
        name: "MET Scientia, LLC",
        url: "https://metscientia.com",
      },
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  )
}
