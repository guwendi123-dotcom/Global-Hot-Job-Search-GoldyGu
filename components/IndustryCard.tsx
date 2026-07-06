"use client";

import { motion } from "framer-motion";
import { ChevronRight, Bot, Brain, Cpu } from "lucide-react";
import Link from "next/link";
import type { Industry } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

interface IndustryCardProps {
  industry: Industry;
  index: number;
}

const iconMap: Record<string, React.ReactNode> = {
  robot: <Bot className="w-8 h-8" />,
  brain: <Brain className="w-8 h-8" />,
  cpu: <Cpu className="w-8 h-8" />,
  bot: <Brain className="w-8 h-8" />,
  blocks: <Cpu className="w-8 h-8" />,
};

export default function IndustryCard({ industry, index }: IndustryCardProps) {
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
        <div className="group bg-bg-card rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
          {/* Hover decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-light opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full -mr-4 -mt-4" />

          <div className="flex items-start justify-between relative z-10">
            <div className="w-14 h-14 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
              {iconMap[industry.icon] || <Brain className="w-8 h-8" />}
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </div>

          <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors font-handwriting">
            {name}
          </h3>
          <p className="text-text-secondary text-sm font-handwriting">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}