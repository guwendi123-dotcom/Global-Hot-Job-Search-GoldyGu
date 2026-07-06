"use client";

import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import type { Company } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

interface CompanyCardProps {
  company: Company;
  index: number;
}

export default function CompanyCard({ company, index }: CompanyCardProps) {
  const { language } = useI18n();

  const name = language === "zh" ? company.name : (company.nameEn || company.name);
  const description = language === "zh" ? company.description : (company.descriptionEn || company.description);
  const stage = language === "zh" ? company.stage : (company.stageEn || company.stage);
  const location = language === "zh" ? company.location : (company.locationEn || company.location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/company/${company.id}`}>
        <div className="group bg-bg-card rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full">
          {/* Logo placeholder */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
            🏢
          </div>

          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors font-handwriting">
            {name}
          </h3>

          <p className="text-text-secondary text-sm mb-4 line-clamp-2 font-handwriting">
            {description}
          </p>

          <div className="flex gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1 font-handwriting">
              <Building2 size={14} />
              {stage}
            </span>
            <span className="flex items-center gap-1 font-handwriting">
              <MapPin size={14} />
              {location}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}