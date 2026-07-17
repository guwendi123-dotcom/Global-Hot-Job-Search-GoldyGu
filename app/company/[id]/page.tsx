"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import {
  getCompany,
  getJobsByCompanySync,
  getIndustry,
  getCompaniesSync,
  getIndustriesSync,
  type Company,
  type Job,
  type Industry
} from "@/lib/data";
import JobCard from "@/components/JobCard";
import { useI18n } from "@/lib/i18n";

export default function CompanyPage() {
  const params = useParams();
  const { language, t } = useI18n();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      // 使用同步版本作为后备
      const companyData = getCompany(id);
      if (companyData) {
        setCompany(companyData);
        setJobs(getJobsByCompanySync(id));
        setIndustry(getIndustry(companyData.industryId) || null);
      }
      setLoading(false);
    }
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">{language === "zh" ? "公司未找到" : "Company Not Found"}</h1>
          <Link href="/" className="text-accent hover:underline">{t.back}</Link>
        </div>
      </main>
    );
  }

  const name = language === "zh" ? company.name : (company.nameEn || company.name);
  const description = language === "zh" ? company.description : (company.descriptionEn || company.description);
  const stage = language === "zh" ? company.stage : (company.stageEn || company.stage);
  const location = language === "zh" ? company.location : (company.locationEn || company.location);
  const industryName = language === "zh" ? industry?.name : (industry?.nameEn || industry?.name);

  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            {language === "zh" ? "返回首页" : "Back to Home"}
          </Link>
        </div>
      </header>

      <section className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl flex-shrink-0">
              🏢
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary mb-2 font-display">
                {name}
              </h1>
              <p className="text-lg text-text-secondary mb-4">
                {description}
              </p>
              <div className="flex gap-6 text-text-secondary">
                <span className="flex items-center gap-2">
                  <Building2 size={16} />
                  {stage}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {location}
                </span>
                {industry && (
                  <Link
                    href={`/industry/${industry.id}`}
                    className="flex items-center gap-2 text-accent hover:underline"
                  >
                    {industryName}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">
          {t.jobs} ({jobs.length})
        </h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} company={company} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary">{t.noJobs}</p>
          </div>
        )}
      </section>
    </main>
  );
}