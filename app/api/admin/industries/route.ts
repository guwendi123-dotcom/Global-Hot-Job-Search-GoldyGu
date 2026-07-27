import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readCompanies, readIndustries, validId, writeCollection } from "@/lib/admin-store";
import type { Industry } from "@/lib/data";

const unauthorized = () => NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });

function normalize(input: Partial<Industry>): Industry {
  return {
    id: String(input.id || "").trim().toLowerCase(),
    name: String(input.name || "").trim(),
    nameEn: String(input.nameEn || "").trim(),
    description: String(input.description || "").trim(),
    descriptionEn: String(input.descriptionEn || "").trim(),
    icon: String(input.icon || "sparkles").trim(),
  };
}

async function validate(industry: Industry, originalId?: string) {
  if (!validId(industry.id)) return "行业编号只能使用小写字母、数字和连字符";
  if (!industry.name) return "请填写行业名称";
  const industries = await readIndustries();
  if (industries.some((item) => item.id === industry.id && item.id !== originalId)) return "行业编号已存在";
  return "";
}

export async function GET() {
  return NextResponse.json({ industries: await readIndustries() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const industry = normalize(await request.json());
  const error = await validate(industry);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const industries = await readIndustries();
  industries.push(industry);
  await writeCollection("industries", industries);
  return NextResponse.json({ success: true, industry }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const body = await request.json();
  const originalId = String(body.originalId || body.id || "");
  const industry = normalize(body);
  const error = await validate(industry, originalId);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const industries = await readIndustries();
  const index = industries.findIndex((item) => item.id === originalId);
  if (index < 0) return NextResponse.json({ error: "行业不存在" }, { status: 404 });
  industries[index] = industry;
  await writeCollection("industries", industries);
  return NextResponse.json({ success: true, industry });
}

export async function DELETE(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const id = request.nextUrl.searchParams.get("id") || "";
  const companies = await readCompanies();
  if (companies.some((company) => company.industryId === id)) {
    return NextResponse.json({ error: "该行业仍有关联公司，请先调整公司行业" }, { status: 409 });
  }
  const industries = await readIndustries();
  if (!industries.some((item) => item.id === id)) return NextResponse.json({ error: "行业不存在" }, { status: 404 });
  await writeCollection("industries", industries.filter((item) => item.id !== id));
  return NextResponse.json({ success: true });
}
