import type { Metadata } from "next";
import { getCompany } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return { title: "公司未找到", robots: { index: false } };
  return {
    title: `${company.name} 招聘机会`,
    description: company.description.slice(0, 155),
    alternates: { canonical: `/company/${id}` },
    openGraph: { title: `${company.name} 招聘机会`, description: company.description, url: `/company/${id}` },
  };
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) { return children; }
