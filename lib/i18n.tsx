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
  // Home page
  collapseJobList: string;
  expandJobList: string;
  job: string;
  company: string;
  category: string;
  lastUpdated: string;
  newest: string;
  hot: string;
  recommended: string;
  page: string;
  totalPages: string;
  previousPage: string;
  nextPage: string;
  jobsCount: string;
  // Jobs page
  browseByCategory: string;
  allJobs: string;
  jobPositions: string;
  backToHome: string;
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
    // Home page
    collapseJobList: "收起岗位列表",
    expandJobList: "查看全部岗位",
    job: "岗位",
    company: "公司",
    category: "分类",
    lastUpdated: "更新时间",
    newest: "最新",
    hot: "热门",
    recommended: "推荐",
    page: "第",
    totalPages: "页，共",
    previousPage: "上一页",
    nextPage: "下一页",
    jobsCount: "个岗位",
    // Jobs page
    browseByCategory: "按分类浏览",
    allJobs: "全部岗位",
    jobPositions: "个岗位",
    backToHome: "返回首页",
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
    // Home page
    collapseJobList: "Collapse Job List",
    expandJobList: "View All Jobs",
    job: "Job",
    company: "Company",
    category: "Category",
    lastUpdated: "Last Updated",
    newest: "New",
    hot: "Hot",
    recommended: "Recommended",
    page: "Page",
    totalPages: "of",
    previousPage: "Previous",
    nextPage: "Next",
    jobsCount: "jobs",
    // Jobs page
    browseByCategory: "Browse by Category",
    allJobs: "All Jobs",
    jobPositions: "positions",
    backToHome: "Back to Home",
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