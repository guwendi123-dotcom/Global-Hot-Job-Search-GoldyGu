"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Binary, BriefcaseBusiness, Building2, ChevronDown, CircleUserRound,
  Code2, Filter, MapPin, Megaphone, Palette, RotateCcw, Search, Settings2,
  ShieldCheck, Sparkles, UsersRound, Wrench,
} from "lucide-react";
import { getJobs, getCompanies, type Job } from "@/lib/data";
import { getLocationGroup, jobMatchesLocation, LOCATION_GROUPS } from "@/lib/location-filters";
import {
  getFunctionOption, getSpecialtyOption, inferJobTaxonomy, JOB_FUNCTIONS,
  JOB_SPECIALTIES, normalizeFunctionParam, SENIORITY_OPTIONS, taxonomySearchText,
  WORK_MODE_OPTIONS, type JobFunctionId,
} from "@/lib/job-taxonomy";
import { useI18n } from "@/lib/i18n";
import { Suspense, useEffect, useMemo, useState } from "react";
import JobCard from "@/components/JobCard";

type Filters = {
  q?: string; function?: string; specialty?: string; level?: string; mode?: string;
  region?: string; place?: string; status?: string; type?: string;
};

const functionIcons: Record<JobFunctionId, React.ReactNode> = {
  "ai-algorithm": <Binary size={18} />,
  engineering: <Code2 size={18} />,
  product: <Sparkles size={18} />,
  design: <Palette size={18} />,
  marketing: <Megaphone size={18} />,
  operations: <ShieldCheck size={18} />,
  commercial: <BriefcaseBusiness size={18} />,
  hardware: <Wrench size={18} />,
  people: <UsersRound size={18} />,
  management: <CircleUserRound size={18} />,
};

export default function JobsPage() {
  return <Suspense fallback={<main className="min-h-screen bg-bg-primary" />}><JobsExplorer /></Suspense>;
}

function JobsExplorer() {
  const { language, t } = useI18n();
  const searchParams = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams.entries()) as Filters, [searchParams]);
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    setQuery(params.q || "");
  }, [params.q]);

  useEffect(() => {
    Promise.all([getJobs(), getCompanies()]).then(([nextJobs, nextCompanies]) => {
      setJobs(nextJobs);
      setCompanies(nextCompanies);
    });
  }, []);

  const selectedFunction = normalizeFunctionParam(params.function || params.type);
  const selectedSpecialty = params.specialty;
  const selectedLevel = params.level;
  const selectedMode = params.mode;
  const selectedRegion = params.region;
  const selectedPlace = params.place;
  const selectedStatus = params.status;
  const currentRegion = getLocationGroup(selectedRegion);
  const currentPlace = currentRegion?.options.find((option) => option.id === selectedPlace);

  const buildHref = (overrides: Filters, clear: Array<keyof Filters> = []) => {
    const next: Filters = { ...params, q: query.trim() || undefined, ...overrides };
    clear.forEach((key) => delete next[key]);
    delete next.type;
    const search = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => value && search.set(key, value));
    return search.size ? `/jobs?${search.toString()}` : "/jobs";
  };

  const filteredJobs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const taxonomy = inferJobTaxonomy(job);
      const company = companies.find((item) => item.id === job.companyId);
      const haystack = [
        job.title, job.titleEn, job.description, job.descriptionEn, job.location, job.locationEn,
        company?.name, company?.nameEn, ...(job.tags || []), ...(job.tagsEn || []), taxonomySearchText(job),
      ].filter(Boolean).join(" ").toLowerCase();
      return (!needle || haystack.includes(needle))
        && (!selectedFunction || taxonomy.functionId === selectedFunction)
        && (!selectedSpecialty || taxonomy.specialtyId === selectedSpecialty)
        && (!selectedLevel || taxonomy.seniorityId === selectedLevel)
        && (!selectedMode || taxonomy.workModeId === selectedMode)
        && (!selectedStatus || (selectedStatus === "open" ? !job.hiringStatus || job.hiringStatus === "open" : job.hiringStatus === selectedStatus))
        && jobMatchesLocation(job, selectedRegion, selectedPlace);
    });
  }, [jobs, companies, query, selectedFunction, selectedSpecialty, selectedLevel, selectedMode, selectedRegion, selectedPlace, selectedStatus]);

  const functionCounts = useMemo(() => new Map(JOB_FUNCTIONS.map((item) => [
    item.id, jobs.filter((job) => inferJobTaxonomy(job).functionId === item.id).length,
  ])), [jobs]);
  const jobsInFunction = selectedFunction ? jobs.filter((job) => inferJobTaxonomy(job).functionId === selectedFunction) : jobs;
  const visibleLocationGroups = LOCATION_GROUPS.map((group) => ({
    ...group,
    count: jobsInFunction.filter((job) => jobMatchesLocation(job, group.id)).length,
  })).filter((group) => group.count > 0);
  const specialtyOptions = selectedFunction ? JOB_SPECIALTIES[selectedFunction].map((option) => ({
    ...option,
    count: jobsInFunction.filter((job) => inferJobTaxonomy(job).specialtyId === option.id).length,
  })).filter((option) => option.count > 0) : [];

  const activeFilterCount = [selectedFunction, selectedSpecialty, selectedLevel, selectedMode, selectedRegion, selectedPlace, selectedStatus].filter(Boolean).length;
  const currentFunction = getFunctionOption(selectedFunction);
  const currentSpecialty = selectedFunction ? getSpecialtyOption(selectedFunction, selectedSpecialty) : undefined;

  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white/90 border-b border-border sticky top-0 z-30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent">
            <ArrowLeft size={18} />{t.backToHome}
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-secondary">
            <Settings2 size={15} />
            {language === "zh" ? "按职能、方向、职级与地区组合筛选" : "Combine function, specialty, level and location"}
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{language === "zh" ? "更准确地找到适合你的机会" : "A clearer way to find your next role"}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
              {language === "zh" ? "先选职能，再看具体方向" : "Start with function, then narrow by specialty"}
            </h1>
            <p className="mt-3 text-sm md:text-base leading-7 text-text-secondary">
              {language === "zh" ? "负责人、Director 和 CXO 不再与职能混在一起；你可以单独叠加职级、城市和办公方式。" : "Leadership level is separated from job function, so you can combine it with city and work mode."}
            </p>
          </div>

          <form action="/jobs" className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={(event) => {
            event.preventDefault();
            window.location.href = buildHref({ q: query.trim() || undefined });
          }}>
            <label className="filter-control flex-1 bg-bg-primary/60">
              <Search size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "zh" ? "搜索岗位、公司、技能或业务关键词" : "Search roles, companies, skills or business terms"} />
            </label>
            <button className="px-6 py-3 rounded-xl bg-ink text-white text-sm font-semibold hover:-translate-y-0.5">{language === "zh" ? "搜索" : "Search"}</button>
          </form>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {JOB_FUNCTIONS.map((item) => {
              const count = functionCounts.get(item.id) || 0;
              const active = item.id === selectedFunction;
              return (
                <Link key={item.id} href={active ? buildHref({}, ["function", "specialty"]) : buildHref({ function: item.id }, ["specialty"])} className={`group rounded-2xl border px-3.5 py-3.5 text-left transition-all ${active ? "bg-ink text-white border-ink shadow-md" : "bg-bg-primary/50 text-ink border-border hover:border-accent hover:-translate-y-0.5"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={active ? "text-white" : "text-accent"}>{functionIcons[item.id]}</span>
                    <span className={`text-xs ${active ? "text-white/65" : "text-text-secondary"}`}>{count}</span>
                  </div>
                  <span className="block mt-2 text-sm font-semibold leading-5">{language === "zh" ? item.labelZh : item.labelEn}</span>
                </Link>
              );
            })}
          </div>

          {selectedFunction && specialtyOptions.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-bg-primary/70 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-sm font-semibold text-ink">{language === "zh" ? `${currentFunction?.labelZh} · 二级方向` : `${currentFunction?.labelEn} · Specialties`}</p>
                {selectedSpecialty && <Link href={buildHref({}, ["specialty"])} className="text-xs text-accent hover:underline">{language === "zh" ? "查看全部方向" : "All specialties"}</Link>}
              </div>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map((item) => (
                  <Link key={item.id} href={item.id === selectedSpecialty ? buildHref({}, ["specialty"]) : buildHref({ specialty: item.id })} className={`rounded-full px-3 py-1.5 text-xs font-medium border ${item.id === selectedSpecialty ? "bg-accent text-white border-accent" : "bg-white text-text-secondary border-border hover:border-accent hover:text-accent"}`}>
                    {language === "zh" ? item.labelZh : item.labelEn} · {item.count}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-7">
        <div className="rounded-2xl border border-border bg-white p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="inline-flex items-center gap-2 font-bold text-ink"><Filter size={17} className="text-accent" />{language === "zh" ? "组合筛选" : "Refine"}</h2>
            {activeFilterCount > 0 && <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent"><RotateCcw size={13} />{language === "zh" ? `清除 ${activeFilterCount} 项` : `Clear ${activeFilterCount}`}</Link>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <SelectFilter label={language === "zh" ? "职级" : "Seniority"} value={selectedLevel || ""} options={SENIORITY_OPTIONS} language={language} onChange={(value) => { window.location.href = value ? buildHref({ level: value }) : buildHref({}, ["level"]); }} />
            <SelectFilter label={language === "zh" ? "办公方式" : "Work mode"} value={selectedMode || ""} options={WORK_MODE_OPTIONS} language={language} onChange={(value) => { window.location.href = value ? buildHref({ mode: value }) : buildHref({}, ["mode"]); }} />
            <SelectFilter label={language === "zh" ? "地区" : "Region"} value={selectedRegion || ""} options={visibleLocationGroups.map((item) => ({ id: item.id, labelZh: `${item.labelZh} · ${item.count}`, labelEn: `${item.labelEn} · ${item.count}` }))} language={language} onChange={(value) => { window.location.href = value ? buildHref({ region: value }, ["place"]) : buildHref({}, ["region", "place"]); }} icon={<MapPin size={16} />} />
            <SelectFilter label={language === "zh" ? "招聘状态" : "Hiring status"} value={selectedStatus || ""} options={[
              { id: "open", labelZh: "开放招聘", labelEn: "Open" },
              { id: "offer-stage", labelZh: "Offer 阶段", labelEn: "Offer stage" },
              { id: "paused", labelZh: "暂停招聘", labelEn: "Paused" },
              { id: "closed", labelZh: "已关闭", labelEn: "Closed" },
            ]} language={language} onChange={(value) => { window.location.href = value ? buildHref({ status: value }) : buildHref({}, ["status"]); }} />
          </div>

          {currentRegion && (
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-secondary mr-1">{language === "zh" ? "具体城市" : "City / area"}</span>
              <Link href={buildHref({}, ["place"])} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!selectedPlace ? "bg-ink text-white" : "bg-bg-primary text-text-secondary hover:text-accent"}`}>{language === "zh" ? `全部${currentRegion.labelZh}` : `All ${currentRegion.labelEn}`}</Link>
              {currentRegion.options.map((option) => {
                const count = jobsInFunction.filter((job) => jobMatchesLocation(job, currentRegion.id, option.id)).length;
                if (!count) return null;
                return <Link key={option.id} href={buildHref({ place: option.id })} className={`px-3 py-1.5 rounded-full text-xs font-medium ${selectedPlace === option.id ? "bg-accent text-white" : "bg-bg-primary text-text-secondary hover:text-accent"}`}>{language === "zh" ? option.labelZh : option.labelEn} · {count}</Link>;
              })}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 mt-9 mb-5">
          <div>
            <p className="eyebrow">{language === "zh" ? "筛选结果" : "Results"}</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink">
              {currentSpecialty ? (language === "zh" ? currentSpecialty.labelZh : currentSpecialty.labelEn) : currentFunction ? (language === "zh" ? currentFunction.labelZh : currentFunction.labelEn) : t.allJobs}
              {(currentPlace || currentRegion) && <span className="ml-2 text-base font-semibold text-accent">· {language === "zh" ? currentPlace?.labelZh || currentRegion?.labelZh : currentPlace?.labelEn || currentRegion?.labelEn}</span>}
            </h2>
          </div>
          <span className="shrink-0 text-sm text-text-secondary">{filteredJobs.length} {t.jobsCount}</span>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job, index) => <JobCard key={job.id} job={job} company={companies.find((company) => company.id === job.companyId)} index={index} />)}
          </div>
        ) : (
          <div className="empty-state bg-white">
            <Building2 size={28} className="mx-auto mb-3 text-accent" />
            <p>{language === "zh" ? "暂时没有完全匹配的岗位，试试减少一个筛选条件。" : "No exact matches yet. Try removing one filter."}</p>
            <Link href="/jobs" className="inline-flex mt-4 text-sm font-semibold text-accent hover:underline">{language === "zh" ? "查看全部岗位" : "View all roles"}</Link>
          </div>
        )}
      </section>
    </main>
  );
}

function SelectFilter({ label, value, options, language, onChange, icon }: {
  label: string;
  value: string;
  options: Array<{ id: string; labelZh: string; labelEn: string }>;
  language: "zh" | "en";
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="filter-control bg-bg-primary/60">
      {icon || <ChevronDown size={16} />}
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        <option value="">{label}</option>
        {options.map((option) => <option key={option.id} value={option.id}>{language === "zh" ? option.labelZh : option.labelEn}</option>)}
      </select>
      <ChevronDown size={14} />
    </label>
  );
}
