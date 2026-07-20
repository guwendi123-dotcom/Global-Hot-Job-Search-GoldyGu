import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
