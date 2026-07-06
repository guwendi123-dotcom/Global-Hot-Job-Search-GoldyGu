"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, ChevronRight, DollarSign, Clock, Languages, GraduationCap, Code, Briefcase, Linkedin, MapPin, Building } from "lucide-react";
import { getJob, getCompany, getProfile, getJobTypes, type Job, type Company } from "@/lib/data";
import ProfileBadge from "@/components/ProfileBadge";
import { useI18n } from "@/lib/i18n";

interface PageProps {
  params: { id: string };
}

export default function JobPage({ params }: PageProps) {
  const { language, t } = useI18n();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const jobData = getJob(params.id);
      if (jobData) {
        setJob(jobData);
        setCompany(getCompany(jobData.companyId) || null);
        setProfile(getProfile());
        setJobTypes(getJobTypes());
      }
      setLoading(false);
    }
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center">
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
  const jobTypeId = job.jobType || (language === "en" ? job.jobTypeEn : job.jobType);
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

  const trans = {
    back: language === "zh" ? "返回" : "Back",
    skills: language === "zh" ? "技能" : "Skills",
    applyNow: language === "zh" ? "联系Goldy" : "Contact Goldy",
    interested: language === "zh" ? "对这个岗位感兴趣？" : "Interested in this position?",
    contactMe: language === "zh" ? "联系Goldy，了解更多岗位详情" : "Contact Goldy for more details",
    home: language === "zh" ? "首页" : "Home",
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href={company ? `/company/${company.id}` : "/"}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            {trans.back}
          </Link>
        </div>
      </header>

      {/* Job Detail */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12">
          {/* Breadcrumb */}
          {company && (
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
              <Link href="/" className="hover:text-accent">{trans.home}</Link>
              <ChevronRight size={14} />
              <Link href={`/company/${company.id}`} className="hover:text-accent">
                {companyName}
              </Link>
              <ChevronRight size={14} />
              <span className="text-text-primary">{title}</span>
            </div>
          )}

          {/* Title and Job Type Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-display">
              {title}
            </h1>
            {jobTypeName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent rounded-full text-sm font-medium">
                <Briefcase size={14} />
                {jobTypeName}
              </span>
            )}
          </div>

          {/* Work Mode & Location Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {workMode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm">
                <Building size={14} />
                {workMode}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm">
                <MapPin size={14} />
                {location}
              </span>
            )}
          </div>

          {company && (
            <Link
              href={`/company/${company.id}`}
              className="inline-flex items-center gap-2 text-lg text-accent hover:underline mb-6"
            >
              🏢 {companyName}
            </Link>
          )}

          {/* Profile Badges */}
          {(salary || experience || language_ || education) && (
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
          )}

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
                        if (line.match(/^\d+\.\s/)) {
                          return (
                            <div key={lineIndex} className="flex gap-3 pl-3">
                              <span className="text-accent font-semibold">{line.match(/^\d+\./)[0]}</span>
                              <span className="text-text-secondary">{line.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                          );
                        }

                        // Dash or bullet list
                        if (line.match(/^[-●]\s/)) {
                          return (
                            <div key={lineIndex} className="flex gap-3 pl-3">
                              <span className="text-accent">•</span>
                              <span className="text-text-secondary">{line.replace(/^[-●]\s*/, '')}</span>
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

          {/* CTA - LinkedIn button */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="bg-accent-light rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-1">
                  {trans.interested}
                </h3>
                <p className="text-text-secondary">
                  {trans.contactMe}
                </p>
              </div>
              <a
                href={profile?.contact?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors shadow-md"
              >
                <Linkedin size={18} />
                {trans.applyNow}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}