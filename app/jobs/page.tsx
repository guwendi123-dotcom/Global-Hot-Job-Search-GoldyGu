"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, TrendingUp, Microscope, Code, Brain, Crown, Palette, Clipboard, Globe } from "lucide-react";
import { getJobsSync, getJobTypes, getCompaniesSync } from "@/lib/data";
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
  searchParams: Promise<{ type?: string }>;
}) {
  const [params, setParams] = useState<{ type?: string }>({});
  const { language, t } = useI18n();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);

  useEffect(() => {
    searchParams.then(p => setParams(p));
    setJobs(getJobsSync());
    setCompanies(getCompaniesSync());
    setJobTypes(getJobTypes());
  }, [searchParams]);

  const typeParam = params.type;

  // Filter jobs by type - support comma-separated types
  const filteredJobs = typeParam
    ? jobs.filter((job) => {
        const jobTypes = job.jobType ? job.jobType.split(",").map((t: string) => t.trim()) : [];
        const jobTypesEn = job.jobTypeEn ? job.jobTypeEn.split(",").map((t: string) => t.trim()) : [];
        return jobTypes.includes(typeParam) || jobTypesEn.includes(typeParam);
      })
    : jobs;

  // Get current job type info
  const currentType = typeParam ? jobTypes.find((type) => type.id === typeParam) : null;

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
        </div>
      </section>

      {/* Jobs List */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary font-handwriting">
            {currentType ? (language === "zh" ? currentType.nameZh : currentType.name) : t.allJobs}
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
          </div>
        )}
      </section>
    </main>
  );
}