import { NextRequest, NextResponse } from "next/server";
import { getSubsidyById } from "@/lib/subsidies";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const subsidy = await getSubsidyById(id);

  if (!subsidy) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(subsidy);
}
