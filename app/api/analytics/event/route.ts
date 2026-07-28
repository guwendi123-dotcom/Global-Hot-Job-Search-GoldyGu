import { NextRequest, NextResponse } from "next/server";
import { isAnalyticsBot, recordSiteEvent, type AnalyticsEventName } from "@/lib/site-analytics";

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  if (isAnalyticsBot(userAgent)) {
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
  const counted = await recordSiteEvent({
    event: String(body.event || "") as AnalyticsEventName,
    path: body.path,
    previousPath: body.previousPath,
    referrerHost: body.referrerHost,
    referrerPath: body.referrerPath,
    utmSource: body.utmSource,
    context: body.context,
    country: request.headers.get("cf-ipcountry") || "未知",
    userAgent,
  });
  return NextResponse.json({ counted }, { headers: { "Cache-Control": "no-store" } });
}
