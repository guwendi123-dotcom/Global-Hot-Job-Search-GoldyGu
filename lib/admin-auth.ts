import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";

function secrets() {
  try {
    const { env } = getCloudflareContext();
    const values = env as CloudflareEnv;
    return {
      password: values.ADMIN_PASSWORD || "",
      sessionToken: values.ADMIN_SESSION_TOKEN || "",
    };
  } catch {
    return { password: "", sessionToken: "" };
  }
}

export function passwordIsValid(value: string): boolean {
  const { password } = secrets();
  return Boolean(password && value && password === value);
}

export function requestIsAdmin(request: NextRequest): boolean {
  const { sessionToken } = secrets();
  return Boolean(sessionToken && request.cookies.get("goldy_admin")?.value === sessionToken);
}

export function adminSessionToken(): string {
  return secrets().sessionToken;
}
