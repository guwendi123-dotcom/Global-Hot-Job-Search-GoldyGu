import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readJobs, readRoleProfiles, writeRoleProfiles, type RoleProfile } from "@/lib/admin-store";

const unauthorized = () => NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });
const list = (value: unknown): string[] => Array.isArray(value)
  ? value.map(String).map((item) => item.trim()).filter(Boolean)
  : String(value || "").split(/[,，\n]/).map((item) => item.trim()).filter(Boolean);

function normalize(input: Partial<RoleProfile>): RoleProfile {
  const priority = ["high", "medium", "normal", "paused"].includes(String(input.priority))
    ? input.priority as RoleProfile["priority"]
    : "normal";
  return {
    jobId: String(input.jobId || "").trim(),
    internalCompanyName: String(input.internalCompanyName || "").trim() || undefined,
    publicJobTitle: String(input.publicJobTitle || "").trim() || undefined,
    priority,
    hc: String(input.hc || "").trim() || undefined,
    compensation: String(input.compensation || "").trim() || undefined,
    reportingLine: String(input.reportingLine || "").trim() || undefined,
    teamScope: String(input.teamScope || "").trim() || undefined,
    confirmedScope: String(input.confirmedScope || "").trim() || undefined,
    sourcingAgentMustHave: String(input.sourcingAgentMustHave || "").trim() || undefined,
    targetBackgrounds: list(input.targetBackgrounds),
    excludedBackgrounds: list(input.excludedBackgrounds),
    matchingPriority: list(input.matchingPriority),
    secondaryValue: list(input.secondaryValue),
    doNotOverweight: list(input.doNotOverweight),
    hardConstraints: list(input.hardConstraints),
    lastAlignedAt: String(input.lastAlignedAt || "").trim() || undefined,
    internalNotes: String(input.internalNotes || "").trim() || undefined,
    similarJobIds: list(input.similarJobIds),
  };
}

export async function GET(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  return NextResponse.json({ roleProfiles: await readRoleProfiles() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const profile = normalize(await request.json());
  if (!profile.jobId) return NextResponse.json({ error: "缺少岗位编号" }, { status: 400 });
  if (!(await readJobs()).some((job) => job.id === profile.jobId)) {
    return NextResponse.json({ error: "岗位不存在" }, { status: 404 });
  }
  const profiles = await readRoleProfiles();
  const index = profiles.findIndex((item) => item.jobId === profile.jobId);
  if (index >= 0) profiles[index] = profile;
  else profiles.push(profile);
  await writeRoleProfiles(profiles);
  return NextResponse.json({ success: true, profile });
}

export async function DELETE(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const jobId = request.nextUrl.searchParams.get("jobId") || "";
  const profiles = await readRoleProfiles();
  await writeRoleProfiles(profiles.filter((item) => item.jobId !== jobId));
  return NextResponse.json({ success: true });
}
