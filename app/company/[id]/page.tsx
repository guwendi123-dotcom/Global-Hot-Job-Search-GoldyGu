"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Building2 } from "lucide-react";
import {
  getCompanies,
  getJobs,
  getIndustries,
  getProfile,
  type Company,
  type Job,
  type Industry
} from "@/lib/data";
import JobCard from "@/components/JobCard";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

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
      Promise.all([getCompanies(), getJobs(), getIndustries()]).then(([companies, allJobs, industries]) => {
        const companyData = companies.find((item) => item.id === id) || null;
        setCompany(companyData);
        setJobs(allJobs.filter((item) => item.companyId === id));
        setIndustry(companyData ? industries.find((item) => item.id === companyData.industryId) || null : null);
        setLoading(false);
      });
    }
  }, [params?.id]);

  if (loading) {
    return (
      <main className="academy-subpage subpage-state">
        <div className="text-text-secondary">Loading...</div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="academy-subpage subpage-state">
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
    <main className="academy-subpage">
      <section className="subpage-intro">
        <div className="subpage-intro-inner">
          <Link href="/companies" className="subpage-back">{language === "zh" ? "← 返回合作公司" : "← Back to companies"}</Link>
          <div className="subpage-entity-hero">
            <div className="subpage-entity-logo">
              {company.logo ? <img src={company.logo} alt="" className="w-14 h-14 object-contain" /> : company.logoEmoji || "🏢"}
            </div>
            <div className="min-w-0">
              <p className="eyebrow">{language === "zh" ? "合作团队档案" : "Partner team profile"}</p>
              <h1 className="subpage-title">
                {name}
              </h1>
              <p className="subpage-lede">
                {description}
              </p>
              <div className="subpage-meta-row">
                <span>
                  <Building2 size={16} />
                  {stage}
                </span>
                <span>
                  <MapPin size={16} />
                  {location}
                </span>
                {industry && (
                  <Link
                    href={`/industry/${industry.id}`}
                    className="subpage-meta-link"
                  >
                    {industryName}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="subpage-content-wrap">
        <div className="subpage-panel">
          <div className="subpage-section-heading compact"><div><p className="eyebrow">{language === "zh" ? "团队机会" : "Team opportunities"}</p><h2>{t.jobs}</h2></div><span>{jobs.length}</span></div>

        {jobs.length > 0 ? (
          <div className="subpage-card-grid">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} company={company} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary">{t.noJobs}</p>
          </div>
        )}
        </div>
      </section>
      <Footer profile={getProfile()} />
    </main>
  );
}
