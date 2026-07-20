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
  return NextResponse.json(
    { error: "Industry mutations are disabled. Update data/industries.json through the reviewed publishing workflow." },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Industry mutations are disabled." },
    { status: 405, headers: { Allow: "GET" } }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "Industry mutations are disabled." },
    { status: 405, headers: { Allow: "GET" } }
  );
}
