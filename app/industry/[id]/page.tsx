"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCompanies, getIndustries, getJobs, getProfile, type Company, type Industry, type Job } from "@/lib/data";
import CompanyCard from "@/components/CompanyCard";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

export default function IndustryPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useI18n();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getIndustries(), getCompanies(), getJobs()]).then(([industries, allCompanies, allJobs]) => {
      setIndustry(industries.find((item) => item.id === id) || null);
      setCompanies(allCompanies.filter((item) => item.industryId === id));
      setJobs(allJobs);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <main className="academy-subpage subpage-state">{language === "zh" ? "加载中..." : "Loading..."}</main>;
  if (!industry) return <main className="academy-subpage subpage-state">{language === "zh" ? "行业未找到" : "Industry not found"}</main>;

  const name = language === "zh" ? industry.name : industry.nameEn || industry.name;
  const description = language === "zh" ? industry.description : industry.descriptionEn || industry.description;

  return (
    <main className="academy-subpage">
      <section className="subpage-intro">
        <div className="subpage-intro-inner">
          <Link href="/#industries" className="subpage-back">{language === "zh" ? "← 返回行业图鉴" : "← Back to industries"}</Link>
          <p className="eyebrow">{language === "zh" ? "行业方向" : "Industry track"}</p>
          <h1 className="subpage-title">{name}</h1>
          <p className="subpage-lede">{description}</p>
          <div className="subpage-inline-stats"><span><Building2 size={16} /><strong>{companies.length}</strong>{language === "zh" ? "家团队" : "teams"}</span><span><strong>{jobs.filter((job) => companies.some((company) => company.id === job.companyId)).length}</strong>{language === "zh" ? "个相关岗位" : "related roles"}</span></div>
        </div>
      </section>
      <section className="subpage-content-wrap">
        <div className="subpage-panel">
          <div className="subpage-section-heading compact"><div><p className="eyebrow">{language === "zh" ? "团队图鉴" : "Team directory"}</p><h2>{language === "zh" ? "该行业合作公司" : "Teams in this track"}</h2></div><span>{companies.length}</span></div>
          {companies.length ? <div className="subpage-card-grid">{companies.map((company, index) => <CompanyCard key={company.id} company={company} index={index} jobCount={jobs.filter((job) => job.companyId === company.id).length} />)}</div> : <div className="empty-state">{language === "zh" ? "暂无公司数据" : "No company data yet"}</div>}
        </div>
      </section>
      <Footer profile={getProfile()} />
    </main>
  );
}
