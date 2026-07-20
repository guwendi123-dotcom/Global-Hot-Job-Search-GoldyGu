"use client";

import Link from "next/link";
import { ArrowRight, Building2, MapPin, Users } from "lucide-react";
import type { Company } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const tones = ["company-lilac", "company-blue", "company-coral", "company-yellow", "company-mint", "company-sky", "company-pink", "company-violet"];

export default function CompanyCard({ company, index, jobCount = 0 }: { company: Company; index: number; jobCount?: number }) {
  const { language } = useI18n();
  const name = language === "zh" ? company.name : company.nameEn || company.name;
  const description = language === "zh" ? company.description : company.descriptionEn || company.description;
  const stage = language === "zh" ? company.stage : company.stageEn || company.stage;
  const location = language === "zh" ? company.location : company.locationEn || company.location;
  return (
    <Link href={`/company/${company.id}`} className={`company-card ${tones[index % tones.length]}`}>
      <div className="company-logo">
        {company.logo ? <img src={company.logo} alt="" /> : <Building2 size={28} />}
      </div>
      <div className="min-w-0 flex-1">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="company-meta"><span><Building2 size={14} />{stage}</span><span><Users size={14} />{language === "zh" ? "团队规模请咨询" : "Team size on request"}</span><span><MapPin size={14} />{location}</span></div>
        <strong>{jobCount} {language === "zh" ? "个在招岗位" : "open roles"}</strong>
      </div>
      <span className="company-arrow"><ArrowRight size={17} /></span>
    </Link>
  );
}
