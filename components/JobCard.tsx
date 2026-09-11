"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Job, Company } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { sendAnalyticsEvent } from "@/components/AnalyticsTracker";
import { getFunctionOption, getSeniorityOption, getSpecialtyOption, inferJobTaxonomy } from "@/lib/job-taxonomy";

interface JobCardProps {
  job: Job;
  company?: Company;
  index: number;
}

export default function JobCard({ job, company, index }: JobCardProps) {
  const { language } = useI18n();

  // Bilingual content
  const title = language === "zh" ? job.title : (job.titleEn || job.title);
  const companyName = language === "zh" ? company?.name : (company?.nameEn || company?.name);
  const tags = language === "zh" ? job.tags : (job.tagsEn || job.tags);
  const taxonomy = inferJobTaxonomy(job);
  const functionOption = getFunctionOption(taxonomy.functionId);
  const specialtyOption = getSpecialtyOption(taxonomy.functionId, taxonomy.specialtyId);
  const seniorityOption = getSeniorityOption(taxonomy.seniorityId);
  const statusLabel = job.hiringStatus === "offer-stage"
    ? (language === "zh" ? "Offer 阶段" : "Offer Stage")
    : job.hiringStatus === "paused"
      ? (language === "zh"
          ? (job.hiringStatusNote || "暂停招聘")
          : (job.hiringStatusNoteEn || "Hiring Paused"))
      : job.hiringStatus === "closed"
        ? (language === "zh" ? "已关闭" : "Closed")
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/job/${job.id}`} onClick={() => sendAnalyticsEvent("company_to_job", company?.id || "jobs-list")}>
        <div className="group bg-bg-card rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              {company && (
                <p className="text-sm text-text-secondary mb-1">{companyName}</p>
              )}
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                {title}
              </h3>
              {statusLabel && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {statusLabel}
                </span>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-3 py-1 bg-ink text-white rounded-full">
              {language === "zh" ? functionOption?.labelZh : functionOption?.labelEn}
            </span>
            <span className="text-xs px-3 py-1 bg-accent-light text-accent rounded-full">
              {language === "zh" ? specialtyOption?.labelZh : specialtyOption?.labelEn}
            </span>
            {taxonomy.seniorityId !== "ic" && (
              <span className="text-xs px-3 py-1 border border-border text-text-secondary rounded-full">
                {language === "zh" ? seniorityOption?.labelZh : seniorityOption?.labelEn}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-bg-primary text-text-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Profile badges - Hidden as per user request */}
          {/* <div className="flex flex-wrap gap-2">
            {salary && (
              <ProfileBadge icon={<DollarSign size={14} />} label={salary} />
            )}
            {experience && (
              <ProfileBadge icon={<Clock size={14} />} label={experience} />
            )}
            {job.profile.language && (
              <ProfileBadge icon={<Languages size={14} />} label={lang} />
            )}
          </div> */}
        </div>
      </Link>
    </motion.div>
  );
}
