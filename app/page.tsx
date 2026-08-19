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
import { getLocationGroup, jobMatchesLocation, LOCATION_GROUPS } from "@/lib/location-filters";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const { language } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [homeRanking, setHomeRanking] = useState<{ jobOrder: string[]; companyOrder: string[] }>({ jobOrder: [], companyOrder: [] });
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [place, setPlace] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    setProfile(getProfile());
    setJobTypes(getJobTypes());
    Promise.all([
      getIndustries(),
      getCompanies(),
      getJobs(),
      fetch("/api/home-ranking", { cache: "no-store" }).then((response) => response.ok ? response.json() : { jobOrder: [], companyOrder: [] }),
    ]).then(([nextIndustries, nextCompanies, nextJobs, nextRanking]) => {
      setIndustries(nextIndustries);
      setCompanies(nextCompanies);
      setJobs(nextJobs);
      setHomeRanking({ jobOrder: nextRanking.jobOrder || [], companyOrder: nextRanking.companyOrder || [] });
    });
  }, []);

  const rankedJobs = useMemo(() => {
    const rank = new Map(homeRanking.jobOrder.map((id, index) => [id, index]));
    return [...jobs].sort((a, b) =>
      ((rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER))
      || ((a.sort ?? 999) - (b.sort ?? 999))
    );
  }, [jobs, homeRanking.jobOrder]);

  const rankedCompanies = useMemo(() => {
    const rank = new Map(homeRanking.companyOrder.map((id, index) => [id, index]));
    return [...companies].sort((a, b) =>
      ((rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER))
      || ((a.sort ?? 999) - (b.sort ?? 999))
    );
  }, [companies, homeRanking.companyOrder]);

  const filteredJobs = useMemo(() => rankedJobs.filter((job) => {
    const company = companies.find((item) => item.id === job.companyId);
    const haystack = [job.title, job.titleEn, company?.name, company?.nameEn, job.location, job.locationEn, ...(job.tags || [])].join(" ").toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesLocation = jobMatchesLocation(job, region, place);
    const matchesType = !jobType || job.jobType?.split(",").map((item: string) => item.trim()).includes(jobType);
    return matchesQuery && matchesLocation && matchesType;
  }), [rankedJobs, companies, query, region, place, jobType]);

  const selectedRegion = getLocationGroup(region);
  const homepageLocationGroups = LOCATION_GROUPS.map((group) => ({
    ...group,
    count: rankedJobs.filter((job) => jobMatchesLocation(job, group.id)).length,
  })).filter((group) => group.count > 0);

  if (!profile) return null;

  const companyName = (id: string) => {
    const company = companies.find((item) => item.id === id);
    return language === "zh" ? company?.name || id : company?.nameEn || company?.name || id;
  };

  const typeName = (id: string) => {
    const type = jobTypes.find((item) => item.id === id);
    return language === "zh" ? type?.nameZh || id : type?.name || id;
  };

  const featuredCompanies = rankedCompanies.slice(0, 8);

  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero profile={profile} jobCount={jobs.length} companyCount={companies.length} industryCount={industries.length} />

      <section id="jobs" className="relative max-w-6xl mx-auto px-5 pt-10 md:pt-16 scroll-mt-24">
        <img src="/art/cat-sitting-v3.png" alt="" className="pointer-events-none absolute left-8 -top-[88px] hidden h-[116px] w-[82px] object-contain md:block" />
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="eyebrow">{language === "zh" ? "每天发现新机会" : "Fresh opportunities"}</p>
            <h2 className="section-title">{language === "zh" ? "热门与最新岗位" : "Trending & fresh opportunities"}</h2>
          </div>
          <p className="hidden md:block text-sm text-text-secondary">{language === "zh" ? `共 ${filteredJobs.length} 个岗位` : `${filteredJobs.length} roles`}</p>
        </div>

        <div className="grid md:grid-cols-[1fr_170px_170px_180px] gap-3 mb-4">
          <label className="filter-control">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "zh" ? "搜索岗位、公司或关键词" : "Search roles, companies or skills"} aria-label={language === "zh" ? "搜索岗位" : "Search jobs"} />
          </label>
          <label className="filter-control">
            <MapPin size={17} />
            <select value={region} onChange={(event) => { setRegion(event.target.value); setPlace(""); }} aria-label={language === "zh" ? "筛选地区" : "Filter region"}>
              <option value="">{language === "zh" ? "全部地区" : "All regions"}</option>
              {homepageLocationGroups.map((group) => (
                <option key={group.id} value={group.id}>{language === "zh" ? group.labelZh : group.labelEn} · {group.count}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <label className={`filter-control ${!region ? "opacity-60" : ""}`}>
            <MapPin size={17} />
            <select value={place} onChange={(event) => setPlace(event.target.value)} disabled={!region} aria-label={language === "zh" ? "筛选具体城市" : "Filter city or area"}>
              <option value="">{region ? (language === "zh" ? "全部城市" : "All cities") : (language === "zh" ? "先选地区" : "Choose region")}</option>
              {selectedRegion?.options.map((option) => {
                const count = rankedJobs.filter((job) => jobMatchesLocation(job, selectedRegion.id, option.id)).length;
                return count ? <option key={option.id} value={option.id}>{language === "zh" ? option.labelZh : option.labelEn} · {count}</option> : null;
              })}
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
                  <td><span className="status-dot" />{index < 3 ? (language === "zh" ? "推荐" : "Featured") : (language === "zh" ? "持续招聘" : "Hiring")}</td>
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
          <div><p className="eyebrow">{language === "zh" ? "近期关注与新团队" : "Trending and new teams"}</p><h2 className="section-title">{language === "zh" ? "热门合作公司" : "Trending companies"}</h2></div>
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
