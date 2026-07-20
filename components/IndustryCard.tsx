"use client";

import { motion } from "framer-motion";
import { ChevronRight, Bot, Brain, Cpu } from "lucide-react";
import Link from "next/link";
import type { Industry } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

interface IndustryCardProps {
  industry: Industry;
  index: number;
  compact?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  robot: <Bot className="w-8 h-8" />,
  brain: <Brain className="w-8 h-8" />,
  cpu: <Cpu className="w-8 h-8" />,
  bot: <Brain className="w-8 h-8" />,
  blocks: <Cpu className="w-8 h-8" />,
};

export default function IndustryCard({ industry, index, compact = false }: IndustryCardProps) {
  const { language } = useI18n();

  const name = language === "zh" ? industry.name : (industry.nameEn || industry.name);
  const description = language === "zh" ? industry.description : (industry.descriptionEn || industry.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/industry/${industry.id}`}>
        <div className={`group industry-card ${compact ? "industry-card-compact" : ""}`}>
          {/* Hover decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-light opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full -mr-4 -mt-4" />

          <div className="flex items-start justify-between relative z-10">
            <div className="industry-icon">
              {iconMap[industry.icon] || <Brain className="w-8 h-8" />}
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>

          <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
            {name}
          </h3>
          <p className={`${compact ? "hidden" : "block"} text-text-secondary text-sm mt-2`}>
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
