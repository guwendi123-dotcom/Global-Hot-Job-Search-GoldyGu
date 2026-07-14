"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Clock, Languages } from "lucide-react";
import Link from "next/link";
import type { Job, Company } from "@/lib/data";
import ProfileBadge from "./ProfileBadge";
import { useI18n } from "@/lib/i18n";

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
  const salary = language === "zh" ? job.profile.salary : (job.profile.salaryEn || job.profile.salary);
  const experience = language === "zh" ? job.profile.experience : (job.profile.experienceEn || job.profile.experience);
  const lang = language === "zh" ? "语言要求" : "Language";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/job/${job.id}`}>
        <div className="group bg-bg-card rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              {company && (
                <p className="text-sm text-text-secondary mb-1">{companyName}</p>
              )}
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                {title}
              </h3>
            </div>
            <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag: string) => (
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