import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readCompanies, readIndustries, readJobs, validId, writeCollection } from "@/lib/admin-store";
import { sortCompaniesByWeeklyViews } from "@/lib/analytics-store";
import type { Company } from "@/lib/data";

const unauthorized = () => NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });

function normalize(input: Partial<Company>): Company {
  return {
    id: String(input.id || "").trim().toLowerCase(),
    industryId: String(input.industryId || "").trim(),
    name: String(input.name || "").trim(),
    nameEn: String(input.nameEn || "").trim(),
    logo: String(input.logo || "").trim(),
    logoEmoji: String(input.logoEmoji || "").trim(),
    description: String(input.description || "").trim(),
    descriptionEn: String(input.descriptionEn || "").trim(),
    stage: String(input.stage || "").trim(),
    stageEn: String(input.stageEn || "").trim(),
    location: String(input.location || "").trim(),
    locationEn: String(input.locationEn || "").trim(),
    sort: Number.isFinite(Number(input.sort)) ? Number(input.sort) : 999,
  };
}

async function validate(company: Company, originalId?: string) {
  if (!validId(company.id)) return "公司编号只能使用小写字母、数字和连字符";
  if (!company.name) return "请填写公司名称";
  const industries = await readIndustries();
  if (!industries.some((item) => item.id === company.industryId)) return "请选择有效行业";
  const companies = await readCompanies();
  if (companies.some((item) => item.id === company.id && item.id !== originalId)) return "公司编号已存在";
  return "";
}

export async function GET() {
  const companies = await sortCompaniesByWeeklyViews(await readCompanies());
  return NextResponse.json({ companies }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const company = normalize(await request.json());
  const error = await validate(company);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const companies = await readCompanies();
  companies.push(company);
  await writeCollection("companies", companies);
  return NextResponse.json({ success: true, company }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const body = await request.json();
  const originalId = String(body.originalId || body.id || "");
  const company = normalize(body);
  const error = await validate(company, originalId);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const companies = await readCompanies();
  const index = companies.findIndex((item) => item.id === originalId);
  if (index < 0) return NextResponse.json({ error: "公司不存在" }, { status: 404 });
  companies[index] = company;
  await writeCollection("companies", companies);
  return NextResponse.json({ success: true, company });
}

export async function DELETE(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const id = request.nextUrl.searchParams.get("id") || "";
  const jobs = await readJobs();
  if (jobs.some((job) => job.companyId === id)) {
    return NextResponse.json({ error: "该公司仍有关联岗位，请先删除或转移岗位" }, { status: 409 });
  }
  const companies = await readCompanies();
  if (!companies.some((item) => item.id === id)) return NextResponse.json({ error: "公司不存在" }, { status: 404 });
  await writeCollection("companies", companies.filter((item) => item.id !== id));
  return NextResponse.json({ success: true });
}
