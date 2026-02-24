import { NextRequest, NextResponse } from "next/server";
import { searchSubsidies } from "@/lib/subsidies";
import type { SubsidySearchFilters } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters }: { filters: SubsidySearchFilters } = body;
    const result = await searchSubsidies(filters ?? {});
    return NextResponse.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
