import { getCompany, getIndustry, getJobsByCompanySync } from "@/lib/data";
import { notFound } from "next/navigation";
import CompanyPageClient from "./CompanyPageClient";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  return (
    <CompanyPageClient
      company={company}
      jobs={getJobsByCompanySync(id)}
      industry={getIndustry(company.industryId) || null}
    />
  );
}
