"use client";

import Link from "next/link";
import { ArrowRight, Globe2, RefreshCw, Search } from "lucide-react";
import type { Profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Hero({ profile, jobCount, companyCount, industryCount }: { profile: Profile; jobCount: number; companyCount: number; industryCount: number }) {
  const { language } = useI18n();
  return (
    <section className="max-w-6xl mx-auto px-5 pt-12 md:pt-20 pb-5">
      <div className="grid md:grid-cols-[1.05fr_.95fr] items-center gap-8">
        <div>
          <span className="hero-kicker"><span className="status-dot" />{language === "zh" ? "全球科技招聘 · 持续更新" : "Global tech hiring · Updated regularly"}</span>
          <h1 className={`hero-title ${language === "en" ? "hero-title-en" : ""}`}>{language === "zh" ? <>连接全球科技<br />人才与机会</> : <>Global tech talent<br />meets opportunity</>}</h1>
          <p className="hero-copy">{language === "zh" ? "聚焦 AI Agent、具身智能、Web3 与全球化科技公司，发现真实、持续更新的职业机会。" : "Curated opportunities across AI agents, embodied AI, Web3 and global technology companies."}</p>
          <a href="#jobs" className="hero-search"><Search size={19} /><span>{language === "zh" ? "搜索岗位、公司或关键词" : "Search roles, companies or skills"}</span></a>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="#jobs" className="primary-pill">{language === "zh" ? "浏览全部岗位" : "Browse all jobs"}<ArrowRight size={17} /></a>
            <Link href="/contact" className="secondary-pill">{language === "zh" ? "联系咕咕" : "Contact Goldy"}</Link>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="trust-chip"><Globe2 size={16} />{language === "zh" ? "全球科技招聘" : "Global tech hiring"}</span>
            <span className="trust-chip"><RefreshCw size={16} />{language === "zh" ? "持续更新岗位" : "Fresh opportunities"}</span>
          </div>
        </div>
        <div className="relative">
          <img src="/art/goldy-hero.png" alt={language === "zh" ? "咕咕和三只猫的插画" : "Goldy with three cats"} className="w-full rounded-[42%_42%_18%_18%]" />
        </div>
      </div>
      <div className="metrics-row">
        <div><strong>{jobCount || "60"}+</strong><span>{language === "zh" ? "在招岗位" : "Open roles"}</span></div>
        <div><strong>{companyCount || "12"}</strong><span>{language === "zh" ? "合作公司" : "Companies"}</span></div>
        <div><strong>{industryCount || "7"}</strong><span>{language === "zh" ? "行业方向" : "Industry tracks"}</span></div>
        <div><strong><Globe2 /></strong><span>{language === "zh" ? "全球机会" : "Global reach"}</span></div>
      </div>
    </section>
  );
}
