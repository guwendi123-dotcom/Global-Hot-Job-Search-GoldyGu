"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, ChevronDown, Globe2, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import GoldyLogo from "@/components/GoldyLogo";

export default function Hero({ jobCount, companyCount, industryCount }: { jobCount: number; companyCount: number; industryCount: number }) {
  const { language, setLanguage } = useI18n();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [jobType, setJobType] = useState("");

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region) params.set("region", region);
    if (jobType) params.set("function", jobType);
    window.location.href = `/jobs${params.toString() ? `?${params}` : ""}`;
  };

  const quickLinks = language === "zh"
    ? [["AI / ML", "ai-algorithm"], ["PM", "product"], ["AI Infra", "engineering"], ["GTM", "marketing"], ["Remote", "mode-remote"], ["MKT", "marketing"]]
    : [["AI / ML", "ai-algorithm"], ["PM", "product"], ["AI Infra", "engineering"], ["GTM", "marketing"], ["Remote", "mode-remote"], ["MKT", "marketing"]];

  return (
    <section className="academy-hero-shell">
      <div className="academy-hero">
        <nav className="academy-nav" aria-label={language === "zh" ? "主导航" : "Main navigation"}>
          <GoldyLogo />
          <div className="academy-nav-links">
            <Link href="/#jobs">{language === "zh" ? "找岗位" : "Jobs"}</Link>
            <Link href="/companies">{language === "zh" ? "合作公司" : "Companies"}</Link>
            <Link href="/#industries">{language === "zh" ? "行业" : "Industries"}</Link>
            <Link href="/shijie-ai" target="_blank" rel="noreferrer">{language === "zh" ? "时界 AI" : "Time AI"}<span>✦</span></Link>
            <Link href="/contact">{language === "zh" ? "联系咕咕" : "Contact Goldy"}</Link>
          </div>
          <div className="academy-nav-tools">
            <span className="academy-nav-global"><Globe2 size={16} />{language === "zh" ? "全球" : "Global"}</span>
            <div className="academy-language" aria-label={language === "zh" ? "切换语言" : "Language switcher"}>
              <button type="button" className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中</button>
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            </div>
          </div>
        </nav>

        <div className="academy-hero-grid">
          <div className="academy-character-wrap">
            <img src="/art/goldy-academy-hero.png" alt={language === "zh" ? "咕咕使用电脑为候选人寻找机会" : "Goldy curating opportunities with her cats"} />
          </div>
          <div className="academy-hero-copy">
            <p className="academy-eyebrow">{language === "zh" ? "真实职位 · 持续更新 · 深度匹配" : "Real roles · Fresh updates · Thoughtful matching"}</p>
            <h1>{language === "zh" ? "全球科技机会图鉴" : "A field guide to global tech opportunities"}</h1>
            <p>{language === "zh" ? "从方向、地点和阶段出发，找到真正适合你的下一份工作。" : "Explore roles by function, location and career stage."}</p>
            <form className="academy-search" onSubmit={submitSearch}>
              <label className="academy-keyword"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "zh" ? "搜索岗位、公司或关键词" : "Search roles, companies or skills"} /></label>
              <label><Globe2 size={17} /><select value={region} onChange={(event) => setRegion(event.target.value)}><option value="">{language === "zh" ? "全球" : "Global"}</option><option value="china">{language === "zh" ? "中国" : "China"}</option><option value="us-canada">{language === "zh" ? "美国/加拿大" : "US/Canada"}</option><option value="singapore">{language === "zh" ? "新加坡" : "Singapore"}</option><option value="europe">{language === "zh" ? "欧洲" : "Europe"}</option></select><ChevronDown size={14} /></label>
              <label><BriefcaseBusiness size={17} /><select value={jobType} onChange={(event) => setJobType(event.target.value)}><option value="">{language === "zh" ? "全部职能" : "All functions"}</option><option value="ai-algorithm">AI / ML</option><option value="engineering">Eng / AI Infra</option><option value="product">Product / PM</option><option value="marketing">MKT / Growth</option><option value="operations">Ops</option><option value="commercial">BD / Sales</option></select><ChevronDown size={14} /></label>
              <button type="submit">{language === "zh" ? "开始探索" : "Explore"}</button>
            </form>
            <div className="academy-trending"><span>{language === "zh" ? "热门搜索" : "Popular"}</span>{quickLinks.map(([label, value]) => <Link key={`${label}-${value}`} href={value === "mode-remote" ? "/jobs?mode=remote" : `/jobs?function=${value}`}>{label}</Link>)}</div>
          </div>
        </div>
      </div>

      <div className="academy-metrics" aria-label={language === "zh" ? "网站数据" : "Site metrics"}>
        <span><strong>{jobCount || 60}+</strong>{language === "zh" ? "在招岗位" : "open roles"}</span>
        <span><strong>{companyCount || 12}</strong>{language === "zh" ? "合作团队" : "teams"}</span>
        <span><strong>{industryCount || 7}</strong>{language === "zh" ? "行业方向" : "tracks"}</span>
      </div>

    </section>
  );
}
