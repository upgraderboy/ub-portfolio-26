import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/get-portfolio-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Failed to fetch portfolio data:", err);
    return NextResponse.json({ error: "Database read failed: " + err.message }, { status: 500 });
  }
}
