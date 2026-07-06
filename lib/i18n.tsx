"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "zh" | "en";

interface Translations {
  industryTrack: string;
  team: string;
  contactMe: string;
  phone: string;
  wechat: string;
  linkedin: string;
  email: string;
  madeWith: string;
  forTechTalents: string;
  location: string;
  stage: string;
  jobs: string;
  salary: string;
  experience: string;
  language: string;
  education: string;
  skills: string;
  applyNow: string;
  back: string;
  noJobs: string;
  noCompanies: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    industryTrack: "行业赛道",
    team: "合作团队",
    contactMe: "联系我",
    phone: "电话",
    wechat: "微信",
    linkedin: "LinkedIn",
    email: "邮箱",
    madeWith: "Made with",
    forTechTalents: "for tech talents",
    location: "地点",
    stage: "阶段",
    jobs: "在招岗位",
    salary: "薪资",
    experience: "经验",
    language: "语言",
    education: "学历",
    skills: "技能",
    applyNow: "联系我",
    back: "返回",
    noJobs: "暂无岗位",
    noCompanies: "暂无公司",
  },
  en: {
    industryTrack: "Industries",
    team: "Teams",
    contactMe: "Contact Me",
    phone: "Phone",
    wechat: "WeChat",
    linkedin: "LinkedIn",
    email: "Email",
    madeWith: "Made with",
    forTechTalents: "for tech talents",
    location: "Location",
    stage: "Stage",
    jobs: "Open Positions",
    salary: "Salary",
    experience: "Experience",
    language: "Language",
    education: "Education",
    skills: "Skills",
    applyNow: "Contact Me",
    back: "Back",
    noJobs: "No jobs available",
    noCompanies: "No companies available",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const defaultValue: I18nContextType = {
  language: "zh",
  setLanguage: () => {},
  t: translations.zh,
};

const I18nContext = createContext<I18nContextType>(defaultValue);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "zh" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}