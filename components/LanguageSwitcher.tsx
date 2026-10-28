"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoldyLogo from "@/components/GoldyLogo";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/shijie-ai")) return null;

  return (
    <><header className="public-site-header">
      <div className="public-site-header-inner">
        <GoldyLogo />
        <nav className="public-site-nav">
          <Link href="/#jobs" className="hover:text-accent">{language === "zh" ? "找岗位" : "Jobs"}</Link>
          <Link href="/companies" className="hover:text-accent">{language === "zh" ? "合作公司" : "Companies"}</Link>
          <Link href="/#industries" className="hover:text-accent">{language === "zh" ? "行业" : "Industries"}</Link>
          <Link
            href="/shijie-ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-accent"
          >
            {language === "zh" ? "时界 AI" : "Time AI"}<span className="text-coral text-[10px]">✦</span>
          </Link>
          <Link href="/contact" className="hover:text-accent">{language === "zh" ? "联系咕咕" : "Contact"}</Link>
        </nav>
        <div className="public-language-toggle">
      <button
        onClick={() => setLanguage("zh")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === "zh"
            ? "bg-ink text-white"
            : "text-text-secondary hover:text-ink"
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === "en"
            ? "bg-ink text-white"
            : "text-text-secondary hover:text-ink"
        }`}
      >
        EN
      </button>
        </div>
      </div>
    </header><div className="public-site-header-spacer" aria-hidden="true" /></>
  );
}
