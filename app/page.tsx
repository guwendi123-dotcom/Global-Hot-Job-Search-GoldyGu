"use client";

import { getProfile, getIndustriesSync, getCompaniesSync, getJobTypes, getJobsSync } from "@/lib/data";
import Hero from "@/components/Hero";
import IndustryCard from "@/components/IndustryCard";
import CompanyCard from "@/components/CompanyCard";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, TrendingUp, Microscope, Code, Brain, Crown, Palette, Clipboard, Globe, Clock, MapPin, Building2, X } from "lucide-react";

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

  // 地点筛选状态
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // 地点分组定义
  const locationGroups = [
    // 🇨🇳 中国
    { id: "beijing", name: "北京", nameEn: "Beijing", icon: "🏯", keywords: ["北京"] },
    { id: "shanghai-hz", name: "上海/杭州", nameEn: "Shanghai / Hangzhou", icon: "🏙️", keywords: ["上海", "杭州"] },
    { id: "gz-sz", name: "广州/深圳", nameEn: "Guangzhou / Shenzhen", icon: "🌆", keywords: ["广州", "深圳"] },
    // 🇺🇸 美国 - 旧金山湾区
    { id: "sf-north-bay", name: "北湾", nameEn: "North Bay", icon: "🌲", keywords: ["马林", "纳帕", "索诺马", "索拉诺", "Marin", "Napa", "Sonoma", "Solano", "North Bay"] },
    { id: "sf-city", name: "旧金山市", nameEn: "San Francisco", icon: "🌉", keywords: ["旧金山", "San Francisco"] },
    { id: "sf-east-bay", name: "东湾", nameEn: "East Bay", icon: "🏗️", keywords: ["奥克兰", "伯克利", "弗里蒙特", "Oakland", "Berkeley", "Fremont", "East Bay"] },
    { id: "sf-silicon-valley", name: "硅谷", nameEn: "Silicon Valley", icon: "💻", keywords: ["圣何塞", "圣克拉拉", "库比蒂诺", "森尼韦尔", "帕罗奥图", "山景城", "San Jose", "Santa Clara", "Cupertino", "Sunnyvale", "Palo Alto", "Mountain View", "Silicon Valley", "MTV"] },
    // 🇺🇸 美国 - 其他
    { id: "la", name: "洛杉矶", nameEn: "Los Angeles", icon: "🌴", keywords: ["洛杉矶", "Los Angeles"] },
    { id: "hk", name: "香港", nameEn: "Hong Kong", icon: "🇭🇰", keywords: ["香港", "Hong Kong"] },
    // 🌍 其他地区
    { id: "europe", name: "欧洲", nameEn: "Europe", icon: "🏰", keywords: ["欧洲", "Europe", "UK", "英国", "德国", "法国", "London"] },
    { id: "se-asia", name: "东南亚", nameEn: "Southeast Asia", icon: "🌴", keywords: ["东南亚", "Singapore", "新加坡", "吉隆坡", "曼谷", "越南", "Thailand", "Malaysia"] },
    // 🏠 Remote
    { id: "remote", name: "Remote/远程", nameEn: "Remote", icon: "🏠", keywords: ["Remote", "远程", "全球", "Global"] },
  ];

  // 判断岗位是否匹配选中的地点
  const isJobMatchLocation = (job: any, selected: string[]) => {
    if (selected.length === 0) return true;
    const loc = job.location || "";
    const locEn = job.locationEn || "";
    return selected.some(groupId => {
      const group = locationGroups.find(g => g.id === groupId);
      if (!group) return false;
      return group.keywords.some(kw => loc.includes(kw) || locEn.includes(kw));
    });
  };

  // 切换地点选择
  const toggleLocation = (groupId: string) => {
    setSelectedLocations(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
    setCurrentPage(1);
  };

  // 清除所有筛选
  const clearLocationFilter = () => {
    setSelectedLocations([]);
    setCurrentPage(1);
  };

  // 筛选后的岗位
  const filteredJobs = jobs.filter(job => isJobMatchLocation(job, selectedLocations));

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

      {/* Toggle Job Table Button and Location Filter */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowJobTable(!showJobTable)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            <Briefcase size={18} />
            {showJobTable ? t.collapseJobList : t.expandJobList}
          </button>

          {/* Location Filter */}
          {showJobTable && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-secondary mr-2">
                {language === "zh" ? "地点:" : "Location:"}
              </span>
              {locationGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => toggleLocation(group.id)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-full border transition-all ${
                    selectedLocations.includes(group.id)
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-text-secondary border-border hover:border-accent"
                  }`}
                >
                  <span>{group.icon}</span>
                  <span>{language === "zh" ? group.name : group.nameEn}</span>
                </button>
              ))}
              {selectedLocations.length > 0 && (
                <button
                  onClick={clearLocationFilter}
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-all"
                >
                  <X size={14} />
                  {language === "zh" ? "清除" : "Clear"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Job Count Info */}
        {showJobTable && selectedLocations.length > 0 && (
          <div className="mt-4 text-sm text-text-secondary">
            {language === "zh"
              ? `显示 ${filteredJobs.length} 个岗位（总共 ${jobs.length} 个）`
              : `Showing ${filteredJobs.length} jobs (${jobs.length} total)`}
          </div>
        )}

        {/* Job Table with Pagination */}
        {showJobTable && (
          <div className="mt-4 bg-white rounded-2xl border border-border overflow-hidden">
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
                  {filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((job, index) => {
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
            {filteredJobs.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-bg-primary">
                <span className="text-sm text-text-secondary">
                  {language === "zh"
                    ? `第 ${currentPage} 页，共 ${Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)} 页`
                    : `Page ${currentPage} of ${Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)}`
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
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredJobs.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage >= Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)}
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