"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, TrendingUp, Microscope, Code, Brain, Crown, Palette, Clipboard, Globe, MapPin, RotateCcw } from "lucide-react";
import { getJobs, getJobTypes, getCompanies } from "@/lib/data";
import { getLocationGroup, jobMatchesLocation, LOCATION_GROUPS } from "@/lib/location-filters";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";

const iconMap: Record<string, any> = {
  handshake: <Briefcase className="w-6 h-6" />,
  "trending-up": <TrendingUp className="w-6 h-6" />,
  microscope: <Microscope className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  crown: <Crown className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
  clipboard: <Clipboard className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
};

export default function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; region?: string; place?: string }>;
}) {
  const [params, setParams] = useState<{ type?: string; region?: string; place?: string }>({});
  const { language, t } = useI18n();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);

  useEffect(() => {
    searchParams.then(p => setParams(p));
    setJobTypes(getJobTypes());
    Promise.all([getJobs(), getCompanies()]).then(([nextJobs, nextCompanies]) => {
      setJobs(nextJobs);
      setCompanies(nextCompanies);
    });
  }, [searchParams]);

  const typeParam = params.type;
  const regionParam = params.region;
  const placeParam = params.place;

  // Filter jobs by type - support comma-separated types
  const typedJobs = typeParam
    ? jobs.filter((job) => {
        const jobTypes = job.jobType ? job.jobType.split(",").map((t: string) => t.trim()) : [];
        const jobTypesEn = job.jobTypeEn ? job.jobTypeEn.split(",").map((t: string) => t.trim()) : [];
        return jobTypes.includes(typeParam) || jobTypesEn.includes(typeParam);
      })
    : jobs;
  const filteredJobs = typedJobs.filter((job) => jobMatchesLocation(job, regionParam, placeParam));

  // Get current job type info
  const currentType = typeParam ? jobTypes.find((type) => type.id === typeParam) : null;
  const currentRegion = getLocationGroup(regionParam);
  const currentPlace = currentRegion?.options.find((option) => option.id === placeParam);
  const buildHref = (next: { type?: string; region?: string; place?: string }) => {
    const query = new URLSearchParams();
    if (next.type) query.set("type", next.type);
    if (next.region) query.set("region", next.region);
    if (next.place) query.set("place", next.place);
    const value = query.toString();
    return value ? `/jobs?${value}` : "/jobs";
  };
  const visibleGroups = LOCATION_GROUPS.map((group) => ({
    ...group,
    count: typedJobs.filter((job) => jobMatchesLocation(job, group.id)).length,
  })).filter((group) => group.count > 0);

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            {t.backToHome}
          </Link>
        </div>
      </header>

      {/* Job Types Filter */}
      <section className="bg-white border-b border-border py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {t.browseByCategory}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !typeParam
                  ? "bg-accent text-white"
                  : "bg-bg-primary text-text-secondary hover:text-accent hover:border-accent border border-transparent"
              }`}
            >
              <Briefcase size={16} />
              {language === "zh" ? "全部岗位" : "All roles"}
            </Link>
            {jobTypes.map((type) => {
              const name = language === "zh" ? type.nameZh : type.name;
              const isActive = type.id === typeParam;

              return (
                <Link
                  key={type.id}
                  href={`/jobs?type=${type.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent text-white"
                      : "bg-bg-primary text-text-secondary hover:text-accent hover:border-accent border border-transparent"
                  }`}
                >
                  {iconMap[type.icon] || <Briefcase size={16} />}
                  {name}
                </Link>
              );
            })}
          </div>

          <div className="mt-7 pt-6 border-t border-border">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <MapPin size={18} className="text-accent" />
                {language === "zh" ? "按地区筛选" : "Filter by location"}
              </h3>
              {regionParam && (
                <Link
                  href={buildHref({ type: typeParam })}
                  className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-accent"
                >
                  <RotateCcw size={13} />
                  {language === "zh" ? "清除地区" : "Clear location"}
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ type: typeParam })}
                className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                  !regionParam ? "bg-ink text-white border-ink" : "bg-white text-text-secondary border-border hover:border-accent hover:text-accent"
                }`}
              >
                {language === "zh" ? "全部地区" : "All locations"} · {typedJobs.length}
              </Link>
              {visibleGroups.map((group) => (
                <Link
                  key={group.id}
                  href={buildHref({ type: typeParam, region: group.id })}
                  className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                    regionParam === group.id ? "bg-ink text-white border-ink" : "bg-white text-text-secondary border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {language === "zh" ? group.labelZh : group.labelEn} · {group.count}
                </Link>
              ))}
            </div>

            {currentRegion && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-bg-primary p-3">
                <span className="text-xs font-medium text-text-secondary mr-1">
                  {language === "zh" ? "具体城市" : "City / area"}
                </span>
                <Link
                  href={buildHref({ type: typeParam, region: currentRegion.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !placeParam ? "bg-accent text-white" : "bg-white text-text-secondary hover:text-accent"
                  }`}
                >
                  {language === "zh" ? `全部${currentRegion.labelZh}` : `All ${currentRegion.labelEn}`}
                </Link>
                {currentRegion.options.map((option) => {
                  const count = typedJobs.filter((job) => jobMatchesLocation(job, currentRegion.id, option.id)).length;
                  if (!count) return null;
                  return (
                    <Link
                      key={option.id}
                      href={buildHref({ type: typeParam, region: currentRegion.id, place: option.id })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        placeParam === option.id ? "bg-accent text-white" : "bg-white text-text-secondary hover:text-accent"
                      }`}
                    >
                      {language === "zh" ? option.labelZh : option.labelEn} · {count}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary font-handwriting">
            {currentType ? (language === "zh" ? currentType.nameZh : currentType.name) : t.allJobs}
            {(currentPlace || currentRegion) && (
              <span className="block mt-2 text-base font-sans font-medium text-accent">
                {language === "zh"
                  ? currentPlace?.labelZh || currentRegion?.labelZh
                  : currentPlace?.labelEn || currentRegion?.labelEn}
              </span>
            )}
          </h1>
          <span className="text-text-secondary">
            {filteredJobs.length} {t.jobsCount}
          </span>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job, index) => {
              const company = companies.find((c) => c.id === job.companyId);
              return (
                <JobCard key={job.id} job={job} company={company} index={index} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">{t.noJobs}</p>
            <Link href={buildHref({ type: typeParam })} className="inline-flex mt-4 text-sm font-medium text-accent hover:underline">
              {language === "zh" ? "清除地区筛选" : "Clear location filter"}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
