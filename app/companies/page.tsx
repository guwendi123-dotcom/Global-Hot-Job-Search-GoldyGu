"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import Footer from "@/components/Footer";
import { getCompanies, getJobs, getProfile } from "@/lib/data";
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
    <main className="academy-subpage">
      <section className="subpage-intro subpage-intro-wide">
        <div className="subpage-intro-inner">
          <Link href="/" className="subpage-back">{language === "zh" ? "← 返回首页" : "← Back home"}</Link>
          <div className="subpage-intro-heading">
          <div>
            <p className="eyebrow">{language === "zh" ? "合作公司合集" : "Company directory"}</p>
            <h1 className="subpage-title">{language === "zh" ? "发现值得加入的创新团队" : "Discover teams worth joining"}</h1>
            <p className="subpage-lede">{language === "zh" ? "这里汇集 GoldyHire 当前合作的全部公司。公司名称沿用公开页面的脱敏展示，点击卡片可查看公司介绍和在招岗位。" : "Explore every company currently featured on GoldyHire and open each profile to see available roles."}</p>
          </div>
          <div className="subpage-count-chip"><Building2 size={17} /><strong>{companies.length}</strong><span>{language === "zh" ? "家合作公司" : "companies"}</span></div>
          </div>
        </div>
      </section>
      <section className="subpage-content-wrap">
        <div className="subpage-panel">
          <div className="subpage-section-heading compact"><div><p className="eyebrow">{language === "zh" ? "团队图鉴" : "Team directory"}</p><h2>{language === "zh" ? "全部合作团队" : "All partner teams"}</h2></div><span>{companies.length}</span></div>
          <div className="subpage-card-grid">
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} jobCount={jobs.filter((job) => job.companyId === company.id).length} />
          ))}
          </div>
        </div>
      </section>
      <Footer profile={getProfile()} />
    </main>
  );
}
