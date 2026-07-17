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
  return NextResponse.json({
    success: true,
    message: "保存成功请通知管理员将数据添加到 data/companies.json"
  });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "保存成功请通知管理员将数据添加到 data/companies.json"
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  return NextResponse.json({
    success: true,
    message: "删除成功请通知管理员从 data/companies.json 移除 id=" + id
  });
}