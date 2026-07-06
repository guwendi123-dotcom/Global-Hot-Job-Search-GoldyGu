"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={() => setLanguage("zh")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === "zh"
            ? "bg-accent text-white"
            : "bg-white text-text-secondary border border-border hover:border-accent"
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          language === "en"
            ? "bg-accent text-white"
            : "bg-white text-text-secondary border border-border hover:border-accent"
        }`}
      >
        EN
      </button>
    </div>
  );
}