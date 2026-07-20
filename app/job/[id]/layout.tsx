import type { Metadata } from "next";
import { getCompany, getJob } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return { title: "岗位未找到", robots: { index: false } };
  const company = getCompany(job.companyId);
  const title = `${job.title}｜${company?.name || job.companyId}`;
  return {
    title,
    description: job.description.replace(/\s+/g, " ").slice(0, 155),
    alternates: { canonical: `/job/${id}` },
    openGraph: { title, description: job.description.slice(0, 200), url: `/job/${id}`, type: "website" },
  };
}

export default function JobLayout({ children }: { children: React.ReactNode }) { return children; }
