import { NextRequest, NextResponse } from "next/server";
import companiesData from "@/data/companies.json";

// 强制使用静态导入的数据
export async function GET() {
  try {
    const companies = companiesData as any[];
    return NextResponse.json({ companies });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to read companies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Company mutations are disabled. Update data/companies.json through the reviewed publishing workflow." },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Company mutations are disabled." },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "Company mutations are disabled." },
    { status: 405, headers: { Allow: "GET" } }
  );
}
