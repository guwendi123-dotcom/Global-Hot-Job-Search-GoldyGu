"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-[#fffaf4]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-2xl tracking-tight text-ink">GoldyHire<span className="text-coral">✦</span></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-ink">
          <Link href="/#jobs" className="hover:text-accent">{language === "zh" ? "找岗位" : "Jobs"}</Link>
          <Link href="/companies" className="hover:text-accent">{language === "zh" ? "合作公司" : "Companies"}</Link>
          <Link href="/#industries" className="hover:text-accent">{language === "zh" ? "行业" : "Industries"}</Link>
          <Link href="/contact" className="hover:text-accent">{language === "zh" ? "联系咕咕" : "Contact"}</Link>
        </nav>
        <div className="flex items-center gap-1 border border-ink/15 bg-white/60 rounded-full p-1">
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
    </header>
  );
}
