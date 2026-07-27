import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { nextJobId, nextSequentialId, readCompanies, readIndustries, readJobs } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  if (!requestIsAdmin(request)) return NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });
  const type = request.nextUrl.searchParams.get("type");
  if (type === "company") {
    return NextResponse.json({ id: nextSequentialId((await readCompanies()).map((item) => item.id), "company") });
  }
  if (type === "industry") {
    return NextResponse.json({ id: nextSequentialId((await readIndustries()).map((item) => item.id), "industry") });
  }
  if (type === "job") {
    const companyId = request.nextUrl.searchParams.get("companyId") || "";
    if (!companyId) return NextResponse.json({ error: "请选择公司" }, { status: 400 });
    return NextResponse.json({ id: nextJobId((await readJobs()).map((item) => item.id), companyId) });
  }
  return NextResponse.json({ error: "无效类型" }, { status: 400 });
}
