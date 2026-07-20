import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Contact submissions are temporarily unavailable while secure storage is being configured.",
    },
    { status: 503, headers: { "Retry-After": "86400" } }
  );
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
