"use client";

import { getProfile, getIndustries, getCompanies, getJobTypes } from "@/lib/data";
import Hero from "@/components/Hero";
import IndustryCard from "@/components/IndustryCard";
import CompanyCard from "@/components/CompanyCard";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, TrendingUp, Microscope, Code, Brain, Crown } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const { language, t } = useI18n();

  useEffect(() => {
    setProfile(getProfile());
    setIndustries(getIndustries());
    setCompanies(getCompanies());
    setJobTypes(getJobTypes());
  }, []);

  if (!profile) return null;

  const iconMap: Record<string, any> = {
    handshake: <Briefcase className="w-6 h-6" />,
    "trending-up": <TrendingUp className="w-6 h-6" />,
    microscope: <Microscope className="w-6 h-6" />,
    code: <Code className="w-6 h-6" />,
    brain: <Brain className="w-6 h-6" />,
    crown: <Crown className="w-6 h-6" />,
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero profile={profile} />

      {/* Job Types Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8 font-handwriting">
          {language === "zh" ? "岗位分类" : "Job Categories"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {jobTypes.map((type, index) => {
            const name = language === "zh" ? type.nameZh : type.name;
            return (
              <Link
                key={type.id}
                href={`/jobs?type=${type.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent-light flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    {iconMap[type.icon] || <Briefcase className="w-6 h-6" />}
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Companies Section - put first */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8 font-handwriting">
          {t.team}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </div>
      </section>

      {/* Industries Section - put after companies */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-text-primary mb-8 font-handwriting">
          {t.industryTrack}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <IndustryCard key={industry.id} industry={industry} index={index} />
          ))}
        </div>
      </section>

      <Footer profile={profile} />
    </main>
  );
}