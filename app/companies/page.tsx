"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import { getCompanies, getJobs } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function CompaniesPage() {
  const { language } = useI18n();
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    Promise.all([getCompanies(), getJobs()]).then(([nextCompanies, nextJobs]) => {
      setCompanies(nextCompanies);
      setJobs(nextJobs);
    });
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary">
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-ink mb-10"><ArrowLeft size={17} />{language === "zh" ? "返回首页" : "Back home"}</Link>
        <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mb-10">
          <div>
            <p className="eyebrow">{language === "zh" ? "合作公司合集" : "Company directory"}</p>
            <h1 className="hero-title !text-[clamp(2.8rem,6vw,5rem)]">{language === "zh" ? "发现值得加入的创新团队" : "Discover teams worth joining"}</h1>
            <p className="hero-copy">{language === "zh" ? "这里汇集 GoldyHire 当前合作的全部公司。公司名称沿用公开页面的脱敏展示，点击卡片可查看公司介绍和在招岗位。" : "Explore every company currently featured on GoldyHire and open each profile to see available roles."}</p>
          </div>
          <div className="trust-chip"><Building2 size={17} />{companies.length} {language === "zh" ? "家合作公司" : "companies"}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} jobCount={jobs.filter((job) => job.companyId === company.id).length} />
          ))}
        </div>
      </section>
    </main>
  );
}
