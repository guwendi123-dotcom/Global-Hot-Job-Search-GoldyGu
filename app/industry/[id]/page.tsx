"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCompanies, getIndustries, getJobs, type Company, type Industry, type Job } from "@/lib/data";
import CompanyCard from "@/components/CompanyCard";

export default function IndustryPage() {
  const { id } = useParams<{ id: string }>();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getIndustries(), getCompanies(), getJobs()]).then(([industries, allCompanies, allJobs]) => {
      setIndustry(industries.find((item) => item.id === id) || null);
      setCompanies(allCompanies.filter((item) => item.industryId === id));
      setJobs(allJobs);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <main className="min-h-screen bg-bg-primary flex items-center justify-center">加载中...</main>;
  if (!industry) return <main className="min-h-screen bg-bg-primary flex items-center justify-center">行业未找到</main>;

  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border"><div className="max-w-5xl mx-auto px-4 py-4"><Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent"><ArrowLeft size={18} />返回首页</Link></div></header>
      <section className="bg-white border-b border-border"><div className="max-w-5xl mx-auto px-4 py-16"><h1 className="text-4xl font-bold text-text-primary mb-4">{industry.name}</h1><p className="text-lg text-text-secondary">{industry.description}</p></div></section>
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-8">该行业公司 ({companies.length})</h2>
        {companies.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{companies.map((company, index) => <CompanyCard key={company.id} company={company} index={index} jobCount={jobs.filter((job) => job.companyId === company.id).length} />)}</div> : <p className="text-text-secondary">暂无公司数据</p>}
      </section>
    </main>
  );
}
