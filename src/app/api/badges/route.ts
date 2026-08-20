// src/app/api/badges/route.ts
// Badge progress API — evaluates student badge status.

import { NextResponse } from "next/server"
import { evaluateBadges, type StudentBadgeContext } from "@/lib/badges/engine"

export async function POST(request: Request) {
  try {
    const ctx = await request.json() as StudentBadgeContext
    const result = evaluateBadges(ctx)

    return NextResponse.json({
      newlyEarned: result.newlyEarned.map(b => ({
        slug: b.slug,
        name: b.name,
        description: b.description,
        category: b.category,
        icon: b.icon,
      })),
      progress: result.progress.map(p => ({
        slug: p.badge.slug,
        name: p.badge.name,
        icon: p.badge.icon,
        category: p.badge.category,
        currentValue: p.currentValue,
        targetValue: p.targetValue,
        percentage: p.percentage,
      })),
      totalEarned: result.totalEarned,
      totalAvailable: result.totalAvailable,
    })
  } catch (error) {
    console.error("Badge evaluation error:", error)
    return NextResponse.json(
      { error: "Failed to evaluate badges" },
      { status: 500 }
    )
  }
}
