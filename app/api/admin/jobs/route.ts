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
  return NextResponse.json(
    { error: "Job mutations are disabled. Update data/jobs.json through the reviewed publishing workflow." },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Job mutations are disabled." },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "Job mutations are disabled." },
    { status: 405, headers: { Allow: "GET" } }
  );
}
