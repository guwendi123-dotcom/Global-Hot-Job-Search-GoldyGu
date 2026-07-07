import { NextRequest, NextResponse } from "next/server";
import { getCompanies } from "@/lib/data";

const DATA_FILE = process.cwd() + "/data/companies.json";

function getCompaniesFromFile() {
  try {
    const fs = require('fs');
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    // 文件系统不可用
  }
  return getCompanies();
}

function saveCompaniesToFile(companies: any[]) {
  try {
    const fs = require('fs');
    fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2));
  } catch (e) {
    console.error("Cannot write to file in edge environment");
  }
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
  const companies = getCompaniesFromFile();
  return NextResponse.json({ companies });
}

export async function POST(request: NextRequest) {
  try {
    const company = await request.json();
    const filledCompany = fillMissingTranslations(company);
    const companies = getCompaniesFromFile();
    companies.push(filledCompany);
    saveCompaniesToFile(companies);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const company = await request.json();
    const filledCompany = fillMissingTranslations(company);
    const companies = getCompaniesFromFile();
    const index = companies.findIndex((c: any) => c.id === company.id);
    if (index !== -1) {
      companies[index] = filledCompany;
      saveCompaniesToFile(companies);
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
    const companies = getCompaniesFromFile().filter((c: any) => c.id !== id);
    saveCompaniesToFile(companies);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}