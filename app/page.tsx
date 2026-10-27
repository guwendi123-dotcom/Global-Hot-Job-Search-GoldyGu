"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Building2, Check, ChevronDown, Copy, Globe2, Linkedin, Mail, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, Target, Phone, X } from "lucide-react";
import { getCompanies, getIndustries, getJobs, getProfile } from "@/lib/data";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { getLocationGroup, jobMatchesLocation, LOCATION_GROUPS } from "@/lib/location-filters";
import { getFunctionOption, inferJobTaxonomy, JOB_FUNCTIONS, taxonomySearchText } from "@/lib/job-taxonomy";

const ITEMS_PER_PAGE = 8;

const INDUSTRY_DISPLAY: Record<string, { zh: string; en: string }> = {
  "ai-agent": { zh: "AI Agent", en: "AI Agent" },
  "embodied-ai": { zh: "Embodied AI", en: "Embodied AI" },
  ai: { zh: "LLM / Foundation Models", en: "LLM / Foundation Models" },
  web3: { zh: "Web3", en: "Web3" },
  semiconductor: { zh: "Semi / Chips", en: "Semi / Chips" },
  "smart-hardware": { zh: "Smart HW", en: "Smart HW" },
  internet: { zh: "Internet / SaaS", en: "Internet / SaaS" },
};

export default function Home() {
  const { language } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [homeRanking, setHomeRanking] = useState<{ jobOrder: string[]; companyOrder: string[] }>({ jobOrder: [], companyOrder: [] });
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [place, setPlace] = useState("");
  const [jobType, setJobType] = useState("");
  const [showWechat, setShowWechat] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
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
    const haystack = [job.title, job.titleEn, company?.name, company?.nameEn, job.location, job.locationEn, ...(job.tags || []), taxonomySearchText(job)].join(" ").toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesLocation = jobMatchesLocation(job, region, place);
    const matchesType = !jobType || inferJobTaxonomy(job).functionId === jobType;
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

  const typeName = (job: any) => {
    const type = getFunctionOption(inferJobTaxonomy(job).functionId);
    return language === "zh" ? type?.labelZh : type?.labelEn;
  };

  const hiringLabel = (job: any, index: number) => {
    if (job.hiringStatus === "paused") return language === "zh" ? "暂停招聘" : "Hiring paused";
    if (job.hiringStatus === "offer-stage") return language === "zh" ? "Offer 阶段" : "Offer stage";
    if (job.hiringStatus === "closed") return language === "zh" ? "已关闭" : "Closed";
    if (index < 3) return language === "zh" ? "重点推荐" : "Featured";
    return language === "zh" ? "持续招聘" : "Hiring";
  };

  const hiringTone = (job: any, index: number) => {
    if (job.hiringStatus === "paused" || job.hiringStatus === "closed") return "muted";
    if (job.hiringStatus === "offer-stage") return "warm";
    return index < 3 ? "featured" : "active";
  };

  const featuredCompanies = [
    ...rankedCompanies.filter((company) => Boolean(company.logo)),
    ...rankedCompanies.filter((company) => !company.logo),
  ].slice(0, 8);

  const copyWechat = async () => {
    await navigator.clipboard.writeText(profile.contact.wechat);
    setWechatCopied(true);
    window.setTimeout(() => setWechatCopied(false), 1600);
  };

  return (
    <main className="home-academy-page min-h-screen" data-language={language}>
      <Hero jobCount={jobs.length} companyCount={companies.length} industryCount={industries.length} />

      <section id="jobs" className="academy-content-section academy-jobs-section relative max-w-7xl mx-auto px-5 pt-10 md:pt-14 scroll-mt-24">
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
              {JOB_FUNCTIONS.map((type) => <option key={type.id} value={type.id}>{language === "zh" ? type.labelZh : type.labelEn}</option>)}
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="home-main-grid">
        <div className="home-job-list hidden md:block">
          <div className="home-job-list-head" aria-hidden="true">
            <span>{language === "zh" ? "岗位与团队" : "Role & team"}</span>
            <span>{language === "zh" ? "方向" : "Track"}</span>
            <span>{language === "zh" ? "工作地点" : "Location"}</span>
            <span>{language === "zh" ? "招聘状态" : "Status"}</span>
            <span />
          </div>
          <div>
            {filteredJobs.slice(0, ITEMS_PER_PAGE).map((job, index) => (
              <Link key={job.id} href={`/job/${job.id}`} className="home-job-row group" aria-label={`${language === "zh" ? job.title : job.titleEn || job.title} · ${companyName(job.companyId)}`}>
                <div className="home-job-primary">
                  <h3>{language === "zh" ? job.title : job.titleEn || job.title}</h3>
                  <p>{companyName(job.companyId)}</p>
                </div>
                <div><span className="home-job-track">{typeName(job)}</span></div>
                <div className="home-job-location"><MapPin size={15} /><span>{language === "zh" ? job.location : job.locationEn || job.location}</span></div>
                <div><span className={`home-job-status home-job-status-${hiringTone(job, index)}`}><i />{hiringLabel(job, index)}</span></div>
                <span className="home-job-arrow"><ArrowRight size={17} /></span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:hidden gap-3">
          {filteredJobs.slice(0, ITEMS_PER_PAGE).map((job, index) => (
            <Link key={job.id} href={`/job/${job.id}`} className="mobile-job-card">
              <div className="mobile-job-main">
                <span className="mobile-job-company">{companyName(job.companyId)}</span>
                <h3>{language === "zh" ? job.title : job.titleEn || job.title}</h3>
              </div>
              <ArrowRight className="mobile-job-arrow" size={19} />
              <div className="mobile-job-meta">
                <span className="mobile-job-track">{typeName(job)}</span>
                <span className="mobile-job-location"><MapPin size={13} />{language === "zh" ? job.location : job.locationEn || job.location}</span>
              </div>
              <span className={`home-job-status home-job-status-${hiringTone(job, index)}`}><i />{hiringLabel(job, index)}</span>
            </Link>
          ))}
        </div>

        <aside className="goldy-why-card">
          <div className="goldy-why-heading"><span>✦</span><div><p>{language === "zh" ? "不仅是岗位列表" : "More than a job board"}</p><h3>{language === "zh" ? "为什么选择 GoldyHire" : "Why GoldyHire"}</h3></div></div>
          <div className="goldy-why-grid">
            <div><Globe2 /><strong>{language === "zh" ? "全球优质机会" : "Global roles"}</strong><span>{language === "zh" ? "精选高成长团队与核心岗位" : "Curated high-growth teams"}</span></div>
            <div><Target /><strong>{language === "zh" ? "深度匹配" : "Thoughtful matching"}</strong><span>{language === "zh" ? "结合画像与职业目标推荐" : "Beyond keyword matching"}</span></div>
            <div><ShieldCheck /><strong>{language === "zh" ? "专业可靠" : "Trusted context"}</strong><span>{language === "zh" ? "公开信息脱敏，私密画像完整" : "Useful context, handled carefully"}</span></div>
            <div><BarChart3 /><strong>{language === "zh" ? "持续更新" : "Always current"}</strong><span>{language === "zh" ? "招聘状态与优先级持续维护" : "Live hiring priorities"}</span></div>
          </div>
          <div className="goldy-contact-block">
            <div><span>{language === "zh" ? "联系咕咕" : "Talk to Goldy"}</span><small>{language === "zh" ? "聊岗位，也聊你真正想去的方向" : "Discuss roles and your next move"}</small></div>
            <div className="goldy-contact-actions">
              <button type="button" onClick={() => setShowWechat(true)}><MessageCircle />{language === "zh" ? "微信" : "WeChat"}</button>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer"><Linkedin />LinkedIn</a>
              <a href={`mailto:${profile.contact.email}`}><Mail />Email</a>
              <a href={`tel:+${profile.contact.phone}`}><Phone />{language === "zh" ? "电话" : "Phone"}</a>
            </div>
          </div>
          <img src="/art/cat-sitting-final.png" alt="" className="goldy-why-cat" />
        </aside>
        </div>

        {filteredJobs.length === 0 && <div className="empty-state">{language === "zh" ? "没有找到匹配岗位，换个关键词试试。" : "No matching roles. Try another search."}</div>}
        <div className="flex justify-center mt-6"><Link href="/jobs" className="primary-pill">{language === "zh" ? "查看全部岗位" : "View all jobs"}<ArrowRight size={17} /></Link></div>
      </section>

      <section id="companies" className="academy-content-section academy-companies-section max-w-7xl mx-auto px-5 pt-14 scroll-mt-24">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div><p className="eyebrow">{language === "zh" ? "正在招聘的团队" : "Teams hiring now"}</p><h2 className="section-title">{language === "zh" ? "值得关注的团队" : "Teams worth watching"}</h2></div>
          <Link href="/companies" className="section-link">{language === "zh" ? "查看全部" : "View all"}<ArrowRight size={15} /></Link>
        </div>
        <div className="featured-logo-grid">
          {featuredCompanies.map((company) => (
            <Link key={company.id} href={`/company/${company.id}`} className="featured-logo-card">
              <span className="featured-logo-box">{company.logo ? <img src={company.logo} alt="" /> : <b>{company.logoEmoji || company.name.slice(0, 1)}</b>}</span>
              <span><strong>{language === "zh" ? company.name : company.nameEn || company.name}</strong><small>{language === "zh" ? company.stage : company.stageEn || company.stage}</small></span>
              <em><b>{jobs.filter((job) => job.companyId === company.id).length}</b>{language === "zh" ? "个岗位" : " roles"}<ArrowRight size={14} /></em>
            </Link>
          ))}
        </div>
      </section>

      <section id="industries" className="academy-content-section academy-industries-section max-w-7xl mx-auto px-5 py-14 scroll-mt-24">
        <div className="academy-section-heading">
          <p className="eyebrow">{language === "zh" ? "按赛道探索" : "Explore by track"}</p>
          <h2 className="section-title">{language === "zh" ? "探索行业" : "Explore industries"}</h2>
        </div>
        <div className="industry-guide-grid">
          {industries.map((industry, index) => {
            const relatedCompanies = companies.filter((company) => company.industryId === industry.id);
            const relatedCompanyIds = new Set(relatedCompanies.map((company) => company.id));
            const relatedJobs = jobs.filter((job) => relatedCompanyIds.has(job.companyId));
            return (
              <Link key={industry.id} href={`/industry/${industry.id}`} className="industry-guide-card">
                <span className="industry-guide-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="industry-guide-icon"><BookOpen size={22} /></span>
                <div>
                  <h3>{INDUSTRY_DISPLAY[industry.id]?.[language] || (language === "zh" ? industry.name : industry.nameEn || industry.name)}</h3>
                  <p>{language === "zh" ? industry.description : industry.descriptionEn || industry.description}</p>
                </div>
                <span className="industry-guide-meta"><Building2 size={13} />{relatedCompanies.length} {language === "zh" ? "个团队" : "teams"}<i />{relatedJobs.length} {language === "zh" ? "个岗位" : "roles"}</span>
                <ArrowRight className="industry-guide-arrow" size={17} />
              </Link>
            );
          })}
        </div>
      </section>

      {showWechat && (
        <div className="wechat-modal" role="presentation" onClick={() => setShowWechat(false)}>
          <div className="wechat-card wechat-copy-card" role="dialog" aria-modal="true" aria-labelledby="wechat-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="wechat-close" onClick={() => setShowWechat(false)} aria-label={language === "zh" ? "关闭" : "Close"}><X size={17} /></button>
            <span className="wechat-dialog-icon"><MessageCircle size={24} /></span>
            <p className="eyebrow">{language === "zh" ? "联系咕咕" : "Talk to Goldy"}</p>
            <h2 id="wechat-title">{language === "zh" ? "复制微信号添加好友" : "Copy WeChat ID"}</h2>
            <p>{language === "zh" ? "点击下方按钮即可复制，去微信搜索添加。" : "Copy the ID below and search for it in WeChat."}</p>
            <code>{profile.contact.wechat}</code>
            <button type="button" className={`wechat-copy-button ${wechatCopied ? "copied" : ""}`} onClick={copyWechat}>
              {wechatCopied ? <Check size={17} /> : <Copy size={17} />}
              {wechatCopied ? (language === "zh" ? "已复制" : "Copied") : (language === "zh" ? "复制微信号" : "Copy WeChat ID")}
            </button>
          </div>
        </div>
      )}

      <Footer profile={profile} />
    </main>
  );
}
