import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readCompanies, readCompanyIdentities, writeCompanyIdentities } from "@/lib/admin-store";

const unauthorized = () => NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });

export async function GET(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  return NextResponse.json(
    { identities: await readCompanyIdentities() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const body = await request.json();
  const companyId = String(body.companyId || "").trim();
  const realName = String(body.realName || "").trim();
  if (!companyId || !realName) return NextResponse.json({ error: "请填写真实公司名" }, { status: 400 });
  if (!(await readCompanies()).some((company) => company.id === companyId)) {
    return NextResponse.json({ error: "公司不存在" }, { status: 404 });
  }
  const identities = await readCompanyIdentities();
  const index = identities.findIndex((item) => item.companyId === companyId);
  if (index >= 0) identities[index] = { companyId, realName };
  else identities.push({ companyId, realName });
  await writeCompanyIdentities(identities);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const companyId = request.nextUrl.searchParams.get("companyId") || "";
  const identities = await readCompanyIdentities();
  await writeCompanyIdentities(identities.filter((item) => item.companyId !== companyId));
  return NextResponse.json({ success: true });
}
