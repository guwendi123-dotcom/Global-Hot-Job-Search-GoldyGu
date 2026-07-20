import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }],
    sitemap: "https://www.goldyhire.com/sitemap.xml",
    host: "https://www.goldyhire.com",
  };
}
