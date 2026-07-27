import { NextRequest, NextResponse } from "next/server";
import { recordJobView } from "@/lib/analytics-store";
import { validId } from "@/lib/admin-store";

const BOT_PATTERN = /bot|crawler|spider|preview|facebookexternalhit|slurp|bingpreview|headless|lighthouse/i;

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) {
    return NextResponse.json({ counted: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.nextUrl.host) {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }

  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId || "").trim();
  if (!validId(jobId)) {
    return NextResponse.json({ error: "Invalid job" }, { status: 400 });
  }

  const counted = await recordJobView(jobId);
  return NextResponse.json({ counted }, { headers: { "Cache-Control": "no-store" } });
}
