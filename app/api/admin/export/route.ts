import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readCompanies, readCompanyIdentities, readIndustries, readJobs } from "@/lib/admin-store";

export async function GET(request: NextRequest) {
  if (!requestIsAdmin(request)) return NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });
  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      industries: await readIndustries(),
      companies: await readCompanies(),
      companyIdentities: await readCompanyIdentities(),
      jobs: await readJobs(),
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="goldyhire-backup-${new Date().toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-store",
      },
    }
  );
}
