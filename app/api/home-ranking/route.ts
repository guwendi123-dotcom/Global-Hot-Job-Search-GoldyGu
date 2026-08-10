import { NextResponse } from "next/server";
import { getHomepageRanking } from "@/lib/analytics-store";

export async function GET() {
  const ranking = await getHomepageRanking();
  return NextResponse.json(
    { jobOrder: ranking.jobOrder, companyOrder: ranking.companyOrder },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } }
  );
}
