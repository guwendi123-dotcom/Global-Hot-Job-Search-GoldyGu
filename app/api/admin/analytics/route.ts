import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readDashboardSnapshot, refreshDashboardSnapshot } from "@/lib/site-analytics";

function rangeFrom(request: NextRequest): number {
  return Number(request.nextUrl.searchParams.get("range") || 30);
}

export async function GET(request: NextRequest) {
  if (!requestIsAdmin(request)) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const snapshot = await readDashboardSnapshot(rangeFrom(request));
  return NextResponse.json({ snapshot }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!requestIsAdmin(request)) return NextResponse.json({ error: "未登录" }, { status: 401 });
  try {
    const snapshot = await refreshDashboardSnapshot(rangeFrom(request));
    return NextResponse.json({ snapshot }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "刷新失败" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
