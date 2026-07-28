import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readDashboardSnapshot, snapshotToCsv } from "@/lib/site-analytics";

export async function GET(request: NextRequest) {
  if (!requestIsAdmin(request)) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const range = Number(request.nextUrl.searchParams.get("range") || 30);
  const snapshot = await readDashboardSnapshot(range);
  if (!snapshot) return NextResponse.json({ error: "请先刷新一次数据" }, { status: 404 });
  return new NextResponse(snapshotToCsv(snapshot), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="goldyhire-analytics-${snapshot.rangeDays}d.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
