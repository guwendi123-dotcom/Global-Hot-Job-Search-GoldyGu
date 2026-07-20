import type { MetadataRoute } from "next";
import { getCompaniesSync, getIndustriesSync, getJobsSync } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.goldyhire.com";
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/jobs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/companies`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];
  return [
    ...staticPages,
    ...getJobsSync().map((job) => ({ url: `${base}/job/${job.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...getCompaniesSync().map((company) => ({ url: `${base}/company/${company.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...getIndustriesSync().map((industry) => ({ url: `${base}/industry/${industry.id}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
