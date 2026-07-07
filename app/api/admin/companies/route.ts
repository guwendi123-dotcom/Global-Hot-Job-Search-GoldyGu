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

export async function GET() {
  const companies = getCompanies();
  return NextResponse.json({ companies });
}

export async function POST(request: NextRequest) {
  try {
    const company = await request.json();
    const companies = getCompanies();
    companies.push(company);
    saveCompanies(companies);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const company = await request.json();
    const companies = getCompanies();
    const index = companies.findIndex((c: any) => c.id === company.id);
    if (index !== -1) {
      companies[index] = company;
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