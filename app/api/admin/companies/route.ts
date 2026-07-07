import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "companies.json");

function getCompanies() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function saveCompanies(companies: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2));
}

// 自动补齐缺失的翻译
function fillMissingTranslations(company: any) {
  const filled = { ...company };

  // 公司基本信息翻译补齐
  if (!filled.nameEn && filled.name) filled.nameEn = filled.name;
  if (!filled.descriptionEn && filled.description) filled.descriptionEn = filled.description;
  if (!filled.stageEn && filled.stage) filled.stageEn = filled.stage;
  if (!filled.locationEn && filled.location) filled.locationEn = filled.location;

  return filled;
}

export async function GET() {
  const companies = getCompanies();
  return NextResponse.json({ companies });
}

export async function POST(request: NextRequest) {
  try {
    const company = await request.json();
    const filledCompany = fillMissingTranslations(company);
    const companies = getCompanies();
    companies.push(filledCompany);
    saveCompanies(companies);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const company = await request.json();
    const filledCompany = fillMissingTranslations(company);
    const companies = getCompanies();
    const index = companies.findIndex((c: any) => c.id === company.id);
    if (index !== -1) {
      companies[index] = filledCompany;
      saveCompanies(companies);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const companies = getCompanies().filter((c: any) => c.id !== id);
    saveCompanies(companies);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}