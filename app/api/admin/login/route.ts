import { NextRequest, NextResponse } from "next/server";
import { adminSessionToken, passwordIsValid } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password = "" } = await request.json().catch(() => ({}));
  if (!passwordIsValid(String(password))) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set("goldy_admin", adminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
