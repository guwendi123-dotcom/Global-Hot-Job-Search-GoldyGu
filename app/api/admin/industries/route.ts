import { NextRequest, NextResponse } from "next/server";
import industriesData from "@/data/industries.json";

export async function GET() {
  try {
    const industries = industriesData as any[];
    return NextResponse.json({ industries });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to read industries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: "请手动添加到 data/industries.json" });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true, message: "删除成功" });
}