"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, ChevronRight, DollarSign, Clock, Languages, GraduationCap, Code, Briefcase, Linkedin, MapPin, Building } from "lucide-react";
import { getJobs, getCompanies, getProfile, getJobTypes, type Job, type Company } from "@/lib/data";
import ProfileBadge from "@/components/ProfileBadge";
import { useI18n } from "@/lib/i18n";
import { sendAnalyticsEvent } from "@/components/AnalyticsTracker";

export default function JobPage() {
  const params = useParams();
  const { language, t } = useI18n();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      Promise.all([getJobs(), getCompanies()]).then(([jobs, companies]) => {
        const jobData = jobs.find((item) => item.id === id) || null;
        setJob(jobData);
        setCompany(jobData ? companies.find((item) => item.id === jobData.companyId) || null : null);
        setProfile(getProfile());
        setJobTypes(getJobTypes());
        setLoading(false);
      });
    }
  }, [params?.id]);

  useEffect(() => {
    if (!job?.id) return;
    const day = new Date().toISOString().slice(0, 10);
    const storageKey = `goldyhire:job-view:${job.id}:${day}`;
    if (window.localStorage.getItem(storageKey)) return;

    fetch("/api/analytics/job-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id }),
      keepalive: true,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (result?.counted) window.localStorage.setItem(storageKey, "1");
      })
      .catch(() => {});
  }, [job?.id]);

  if (loading) {
    return (
      <main className="academy-subpage subpage-state">
        <div className="text-text-secondary">Loading...</div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="academy-subpage subpage-state">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">岗位未找到</h1>
          <Link href="/" className="text-accent hover:underline">返回首页</Link>
        </div>
      </main>
    );
  }

  // Bilingual content
  const title = language === "zh" ? job.title : (job.titleEn || job.title);
  const description = language === "zh" ? job.description : (job.descriptionEn || job.description);
  const companyName = language === "zh" ? company?.name : (company?.nameEn || company?.name);

  // Get job type
  const jobTypeId = (job.jobType || (language === "en" ? job.jobTypeEn : job.jobType))
    ?.split(",")[0]
    ?.trim();
  const jobType = jobTypeId ? jobTypes.find((item) => item.id === jobTypeId) : null;
  const jobTypeName = language === "zh"
    ? (jobType?.nameZh || jobType?.name)
    : (jobType?.name || jobType?.nameZh);

  // Work mode and location
  const workMode = language === "zh" ? job.workMode : (job.workModeEn || job.workMode);
  const location = language === "zh" ? job.location : (job.locationEn || job.location);

  // Get profile fields
  const salary = language === "zh" ? job.profile.salary : (job.profile.salaryEn || job.profile.salary);
  const experience = language === "zh" ? job.profile.experience : (job.profile.experienceEn || job.profile.experience);
  const education = language === "zh" ? job.profile.education : (job.profile.educationEn || job.profile.education);
  const language_ = language === "zh" ? job.profile.language : (job.profile.languageEn || job.profile.language);
  const skills = language === "zh" ? job.profile.skills : (job.profile.skillsEn || job.profile.skills);
  const statusLabel = job.hiringStatus === "offer-stage"
    ? (language === "zh" ? "Offer 阶段" : "Offer Stage")
    : job.hiringStatus === "paused"
      ? (language === "zh"
          ? (job.hiringStatusNote || "暂停招聘")
          : (job.hiringStatusNoteEn || "Hiring Paused"))
      : job.hiringStatus === "closed"
        ? (language === "zh" ? "已关闭" : "Closed")
        : "";

  const trans = {
    back: language === "zh" ? "返回" : "Back",
    skills: language === "zh" ? "技能" : "Skills",
    applyNow: language === "zh" ? "联系Goldy" : "Contact Goldy",
    interested: language === "zh" ? "对这个岗位感兴趣？" : "Interested in this position?",
    contactMe: language === "zh" ? "联系Goldy，了解更多岗位详情" : "Contact Goldy for more details",
    home: language === "zh" ? "首页" : "Home",
  };

  return (
    <main className="academy-subpage">
      <section className="subpage-intro subpage-intro-wide">
        <div className="subpage-intro-inner">
          <Link href={company ? `/company/${company.id}` : "/"} className="subpage-back">← {trans.back}</Link>
          {company && (
            <div className="subpage-breadcrumb">
              <Link href="/" className="hover:text-accent">{trans.home}</Link>
              <ChevronRight size={14} />
              <Link href={`/company/${company.id}`} className="hover:text-accent">
                {companyName}
              </Link>
              <ChevronRight size={14} />
              <span className="text-text-primary">{title}</span>
            </div>
          )}

          <p className="eyebrow">{language === "zh" ? "岗位档案" : "Role profile"}</p>
          <div className="subpage-title-row">
            <h1 className="subpage-title">
              {title}
            </h1>
            {jobTypeName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent rounded-full text-sm font-medium">
                <Briefcase size={14} />
                {jobTypeName}
              </span>
            )}
            {statusLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {statusLabel}
              </span>
            )}
          </div>

          <div className="subpage-meta-row">
            {workMode && (
              <span>
                <Building size={14} />
                {workMode}
              </span>
            )}
            {location && (
              <span>
                <MapPin size={14} />
                {location}
              </span>
            )}
          </div>

          {company && (
            <Link
              href={`/company/${company.id}`}
              className="subpage-company-link"
            >
              🏢 {companyName}
            </Link>
          )}

        </div>
      </section>

      <section className="subpage-content-wrap">
        <div className="subpage-detail-layout">
          <article className="subpage-panel job-description-card">
            <div className="subpage-panel-title"><Briefcase size={20} /><div><p>{language === "zh" ? "职位描述" : "Job description"}</p><span>{companyName}</span></div></div>

          {/* Profile Badges - Hidden as per user request */}
          {/* {(salary || experience || language_ || education) && (
            <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-border">
              {salary && (
                <ProfileBadge icon={<DollarSign size={16} />} label={salary} />
              )}
              {experience && (
                <ProfileBadge icon={<Clock size={16} />} label={experience} />
              )}
              {education && (
                <ProfileBadge icon={<GraduationCap size={16} />} label={education} />
              )}
              {language_ && (
                <ProfileBadge icon={<Languages size={16} />} label={language_} />
              )}
            </div>
          )} */}

          {/* JD Content - Improved formatting */}
          <div className="space-y-6">
            {description.split('\n\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null;

              // Handle sections with headers (like "核心职责：" or "任职要求：")
              if (paragraph.includes(':') || paragraph.includes('：')) {
                const colonIndex = paragraph.indexOf(':');
                const colonIndexZh = paragraph.indexOf('：');
                let splitAt = -1;
                if (colonIndex !== -1 && (colonIndexZh === -1 || colonIndex < colonIndexZh)) {
                  splitAt = colonIndex;
                } else if (colonIndexZh !== -1) {
                  splitAt = colonIndexZh;
                }

                if (splitAt !== -1) {
                  const header = paragraph.substring(0, splitAt);
                  const content = paragraph.substring(splitAt + 1);

                  return (
                    <div key={index} className="space-y-3">
                      {/* Section Header */}
                      <h3 className="text-lg font-bold text-text-primary border-l-4 border-accent pl-3">
                        {header}
                      </h3>

                      {/* Process each line in content */}
                      {content.split('\n').map((line, lineIndex) => {
                        line = line.trim();
                        if (!line) return null;

                        // Numbered list (1., 2., 3.)
                        const numberMatch = line.match(/^\d+\./);
                        if (numberMatch) {
                          return (
                            <div key={lineIndex} className="flex items-start gap-3 pl-3">
                              <span className="w-6 shrink-0 text-right text-accent font-semibold">{numberMatch[0]}</span>
                              <span className="min-w-0 flex-1 text-text-secondary leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                          );
                        }

                        // Dash or bullet list
                        if (line.match(/^[-●•]\s*/)) {
                          return (
                            <div key={lineIndex} className="flex items-start gap-3 pl-3">
                              <span className="w-3 shrink-0 text-accent leading-relaxed">•</span>
                              <span className="min-w-0 flex-1 text-text-secondary leading-relaxed">{line.replace(/^[-●•]\s*/, '')}</span>
                            </div>
                          );
                        }

                        return (
                          <p key={lineIndex} className="text-text-secondary pl-3">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  );
                }
              }

              // Plain paragraph
              return (
                <p key={index} className="text-text-secondary leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Code size={20} />
                {trans.skills}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-bg-primary text-text-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          </article>
          <aside className="subpage-detail-aside">
            <div className="subpage-aside-icon"><Mail size={22} /></div>
            <p className="eyebrow">{language === "zh" ? "下一步" : "Next step"}</p>
            <h2>{trans.interested}</h2>
            <p>{trans.contactMe}</p>
              <a
                href={profile?.contact?.linkedin}
                onClick={() => sendAnalyticsEvent("contact_linkedin", job.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="subpage-primary-button"
              >
                <Linkedin size={18} />
                {trans.applyNow}
              </a>
            <Link href="/contact" className="subpage-secondary-link">{language === "zh" ? "或发送岗位咨询" : "Or send a role inquiry"}</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
