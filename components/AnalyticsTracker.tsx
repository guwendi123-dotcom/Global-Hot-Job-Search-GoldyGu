"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function sendAnalyticsEvent(event: string, context = "global") {
  if (typeof window === "undefined") return;
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, path: window.location.pathname, context }),
    keepalive: true,
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (lastPath.current === pathname) return;

    let previousPath = "";
    try {
      previousPath = sessionStorage.getItem("goldyhire:last-path") || "";
      sessionStorage.setItem("goldyhire:last-path", pathname);
    } catch {}

    let referrerHost = "";
    let referrerPath = "";
    if (!previousPath && document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        referrerHost = referrer.host;
        referrerPath = referrer.pathname;
      } catch {}
    }

    const search = new URLSearchParams(window.location.search);
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "page_view",
        path: pathname,
        previousPath,
        referrerHost,
        referrerPath,
        utmSource: search.get("utm_source") || "",
      }),
      keepalive: true,
    }).catch(() => {});
    lastPath.current = pathname;
  }, [pathname]);

  return null;
}
