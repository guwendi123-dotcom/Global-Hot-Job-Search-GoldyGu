import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct publishing is disabled. Content must be reviewed, committed, and deployed through GitHub.",
    },
    { status: 405, headers: { Allow: "" } }
  );
}

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
