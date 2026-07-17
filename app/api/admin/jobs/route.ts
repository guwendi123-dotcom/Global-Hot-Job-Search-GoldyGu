import { NextRequest, NextResponse } from "next/server";
import jobsData from "@/data/jobs.json";

export async function GET() {
  try {
    const jobs = jobsData as any[];
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to read jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: "请手动添加到 data/jobs.json" });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true, message: "删除成功，请手动从 data/jobs.json 移除" });
}