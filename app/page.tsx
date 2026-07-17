"use client";

import { getProfile, getIndustriesSync, getCompaniesSync, getJobTypes, getJobsSync } from "@/lib/data";
import Hero from "@/components/Hero";
import IndustryCard from "@/components/IndustryCard";
import CompanyCard from "@/components/CompanyCard";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, TrendingUp, Microscope, Code, Brain, Crown, Palette, Clipboard, Globe, Clock, MapPin, Building2 } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [showJobTable, setShowJobTable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;
  const { language, t } = useI18n();

  useEffect(() => {
    setProfile(getProfile());
    setIndustries(getIndustriesSync());
    setCompanies(getCompaniesSync());
    setJobTypes(getJobTypes());
    // 获取岗位并按 sort 排序（sort 越小越新）
    const allJobs = getJobsSync();
    const sortedJobs = [...allJobs].sort((a, b) => (a.sort || 999) - (b.sort || 999));
    setJobs(sortedJobs);
  }, []);

  if (!profile) return null;

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

  // 获取公司名称
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return companyId;
    return language === "zh" ? company.name : (company.nameEn || company.name);
  };

  // 获取岗位分类名称
  const getJobTypeNames = (jobType: string) => {
    if (!jobType) return "";
    const types = jobType.split(",");
    return types.map(type => {
      const found = jobTypes.find(t => t.id === type.trim());
      if (!found) return type.trim();
      return language === "zh" ? found.nameZh : found.name;
    }).join(", ");
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero profile={profile} />

      {/* Toggle Job Table Button */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <button
          onClick={() => setShowJobTable(!showJobTable)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          <Briefcase size={18} />
          {showJobTable ? t.collapseJobList : t.expandJobList}
        </button>

        {/* Job Table with Pagination */}
        {showJobTable && (
          <div className="mt-6 bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-primary border-b border-border">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">{t.job}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">{t.company}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">{t.category}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">{t.location}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">{t.lastUpdated}</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((job, index) => {
                    const sortLabel = job.sort <= 5 ? t.newest : job.sort <= 20 ? t.hot : t.recommended;
                    const rowIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                    return (
                      <tr
                        key={job.id}
                        className={`border-b border-border hover:bg-accent-light/30 transition-colors ${
                          rowIndex % 2 === 0 ? "bg-white" : "bg-bg-primary/30"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <Link href={`/job/${job.id}`} className="hover:text-accent">
                            <div className="font-semibold text-text-primary">{job.title}</div>
                            <div className="text-sm text-text-secondary">{job.titleEn}</div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-text-secondary" />
                            <span className="text-text-primary">{getCompanyName(job.companyId)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {job.jobType?.split(",").map((type: string) => {
                              const typeId = type.trim();
                              const found = jobTypes.find(t => t.id === typeId);
                              return found ? (
                                <span
                                  key={typeId}
                                  className="px-2 py-1 text-xs bg-accent-light text-accent rounded-full"
                                >
                                  {language === "zh" ? found.nameZh : found.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <MapPin size={14} />
                            {language === "zh" ? job.location : job.locationEn}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            sortLabel === "最新" ? "bg-green-100 text-green-600" :
                            sortLabel === "热门" ? "bg-orange-100 text-orange-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {sortLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {jobs.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-bg-primary">
                <span className="text-sm text-text-secondary">
                  {language === "zh"
                    ? `第 ${currentPage} 页，共 ${Math.ceil(jobs.length / ITEMS_PER_PAGE)} 页`
                    : `Page ${currentPage} of ${Math.ceil(jobs.length / ITEMS_PER_PAGE)}`
                  }
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm bg-bg-primary text-text-secondary rounded-lg hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.previousPage}
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(jobs.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage >= Math.ceil(jobs.length / ITEMS_PER_PAGE)}
                    className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.nextPage}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Job Types Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8 font-handwriting">
          {language === "zh" ? "岗位分类" : "Job Categories"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {jobTypes.map((type, index) => {
            const name = language === "zh" ? type.nameZh : type.name;
            return (
              <Link
                key={type.id}
                href={`/jobs?type=${type.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent-light flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    {iconMap[type.icon] || <Briefcase className="w-6 h-6" />}
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8 font-handwriting">
          {t.team}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8 font-handwriting">
          {t.industryTrack}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <IndustryCard key={industry.id} industry={industry} index={index} />
          ))}
        </div>
      </section>

      <Footer profile={profile} />
    </main>
  );
}