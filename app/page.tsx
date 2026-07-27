"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin, Search, Sparkles } from "lucide-react";
import { getCompanies, getIndustries, getJobs, getJobTypes, getProfile } from "@/lib/data";
import Hero from "@/components/Hero";
import CompanyCard from "@/components/CompanyCard";
import IndustryCard from "@/components/IndustryCard";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const { language } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    setProfile(getProfile());
    setJobTypes(getJobTypes());
    Promise.all([getIndustries(), getCompanies(), getJobs()]).then(([nextIndustries, nextCompanies, nextJobs]) => {
      setIndustries(nextIndustries);
      setCompanies(nextCompanies);
      setJobs(nextJobs);
    });
  }, []);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const company = companies.find((item) => item.id === job.companyId);
    const haystack = [job.title, job.titleEn, company?.name, company?.nameEn, job.location, job.locationEn, ...(job.tags || [])].join(" ").toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesLocation = !location || `${job.location} ${job.locationEn}`.includes(location);
    const matchesType = !jobType || job.jobType?.split(",").map((item: string) => item.trim()).includes(jobType);
    return matchesQuery && matchesLocation && matchesType;
  }), [jobs, companies, query, location, jobType]);

  if (!profile) return null;

  const companyName = (id: string) => {
    const company = companies.find((item) => item.id === id);
    return language === "zh" ? company?.name || id : company?.nameEn || company?.name || id;
  };

  const typeName = (id: string) => {
    const type = jobTypes.find((item) => item.id === id);
    return language === "zh" ? type?.nameZh || id : type?.name || id;
  };

  const featuredCompanies = companies.slice(0, 8);

  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero profile={profile} jobCount={jobs.length} companyCount={companies.length} industryCount={industries.length} />

      <section id="jobs" className="relative max-w-6xl mx-auto px-5 pt-10 md:pt-16 scroll-mt-24">
        <img src="/art/cat-sitting-v3.png" alt="" className="pointer-events-none absolute left-8 -top-[88px] hidden h-[116px] w-[82px] object-contain md:block" />
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="eyebrow">{language === "zh" ? "每天发现新机会" : "Fresh opportunities"}</p>
            <h2 className="section-title">{language === "zh" ? "最新在招岗位" : "Latest opportunities"}</h2>
          </div>
          <p className="hidden md:block text-sm text-text-secondary">{language === "zh" ? `共 ${filteredJobs.length} 个岗位` : `${filteredJobs.length} roles`}</p>
        </div>

        <div className="grid md:grid-cols-[1fr_180px_180px] gap-3 mb-4">
          <label className="filter-control">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "zh" ? "搜索岗位、公司或关键词" : "Search roles, companies or skills"} aria-label={language === "zh" ? "搜索岗位" : "Search jobs"} />
          </label>
          <label className="filter-control">
            <MapPin size={17} />
            <select value={location} onChange={(event) => setLocation(event.target.value)} aria-label={language === "zh" ? "筛选地点" : "Filter location"}>
              <option value="">{language === "zh" ? "全部地点" : "All locations"}</option>
              {["北京", "上海", "深圳", "杭州", "香港", "新加坡", "Remote"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <ChevronDown size={15} />
          </label>
          <label className="filter-control">
            <Sparkles size={17} />
            <select value={jobType} onChange={(event) => setJobType(event.target.value)} aria-label={language === "zh" ? "筛选岗位方向" : "Filter role type"}>
              <option value="">{language === "zh" ? "岗位方向" : "Role type"}</option>
              {jobTypes.map((type) => <option key={type.id} value={type.id}>{language === "zh" ? type.nameZh : type.name}</option>)}
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="hidden md:block overflow-hidden rounded-2xl border border-ink/15 bg-white/65">
          <table className="w-full text-sm">
            <thead className="bg-white/70 text-text-secondary">
              <tr><th>{language === "zh" ? "岗位" : "Role"}</th><th>{language === "zh" ? "公司" : "Company"}</th><th>{language === "zh" ? "方向" : "Track"}</th><th>{language === "zh" ? "地点" : "Location"}</th><th>{language === "zh" ? "更新" : "Updated"}</th><th aria-label="查看详情" /></tr>
            </thead>
            <tbody>
              {filteredJobs.slice(0, ITEMS_PER_PAGE).map((job, index) => (
                <tr key={job.id}>
                  <td><Link href={`/job/${job.id}`} className="font-semibold hover:text-accent">{language === "zh" ? job.title : job.titleEn || job.title}</Link></td>
                  <td>{companyName(job.companyId)}</td>
                  <td>{typeName(job.jobType?.split(",")[0]?.trim())}</td>
                  <td>{language === "zh" ? job.location : job.locationEn || job.location}</td>
                  <td><span className="status-dot" />{index < 3 ? (language === "zh" ? "最新" : "New") : (language === "zh" ? "持续招聘" : "Hiring")}</td>
                  <td><Link href={`/job/${job.id}`} aria-label={`查看 ${job.title}`} className="table-arrow"><ArrowRight size={17} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:hidden gap-3">
          {filteredJobs.slice(0, ITEMS_PER_PAGE).map((job) => (
            <Link key={job.id} href={`/job/${job.id}`} className="mobile-job-card">
              <div><span>{companyName(job.companyId)}</span><h3>{language === "zh" ? job.title : job.titleEn || job.title}</h3></div>
              <p><MapPin size={14} />{language === "zh" ? job.location : job.locationEn || job.location}</p>
              <ArrowRight className="text-ink" size={20} />
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && <div className="empty-state">{language === "zh" ? "没有找到匹配岗位，换个关键词试试。" : "No matching roles. Try another search."}</div>}
        <div className="flex justify-center mt-6"><Link href="/jobs" className="primary-pill">{language === "zh" ? "查看全部岗位" : "View all jobs"}<ArrowRight size={17} /></Link></div>
        <img src="/art/cat-sleeping-v3.png" alt="" className="hidden md:block w-[118px] h-[92px] object-contain ml-auto mr-8 -mt-12" />
      </section>

      <section id="industries" className="max-w-6xl mx-auto px-5 py-14 scroll-mt-24">
        <p className="eyebrow">{language === "zh" ? "按赛道探索" : "Explore by track"}</p>
        <h2 className="section-title mb-6">{language === "zh" ? "探索行业" : "Explore industries"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((industry, index) => <IndustryCard key={industry.id} industry={industry} index={index} compact />)}
        </div>
      </section>

      <section id="companies" className="max-w-6xl mx-auto px-5 pb-14 scroll-mt-24">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div><p className="eyebrow">{language === "zh" ? "精选创新团队" : "Selected teams"}</p><h2 className="section-title">{language === "zh" ? "精选合作公司" : "Featured companies"}</h2></div>
          <span className="hidden md:block text-sm text-text-secondary">{language === "zh" ? "更多公司与岗位持续更新" : "More teams added regularly"}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {featuredCompanies.map((company, index) => <CompanyCard key={company.id} company={company} index={index} jobCount={jobs.filter((job) => job.companyId === company.id).length} />)}
        </div>
        <div className="text-center mt-7">
          <Link href="/companies" className="primary-pill">{language === "zh" ? "查看全部公司" : "View all companies"}<ArrowRight size={17} /></Link>
          <p className="text-xs text-text-secondary mt-3">{language === "zh" ? "更多合作公司及岗位持续更新" : "More companies and roles are added regularly"}</p>
        </div>
      </section>

      <Footer profile={profile} />
    </main>
  );
}
