import { NextRequest, NextResponse } from "next/server";
import { getRecommendedSubsidies } from "@/lib/subsidies";
import type { BusinessProfile } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile }: { profile: BusinessProfile } = body;

    if (!profile) {
      return NextResponse.json(
        { error: "profile is required" },
        { status: 400 }
      );
    }

    const items = await getRecommendedSubsidies(profile);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
