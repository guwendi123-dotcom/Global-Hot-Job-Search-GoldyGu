import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getIndustry, getCompaniesSync, getIndustriesSync } from "@/lib/data";
import CompanyCard from "@/components/CompanyCard";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const industries = getIndustriesSync();
  return industries.map((industry) => ({
    id: industry.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const industry = getIndustry(id);
  if (!industry) return { title: "Not Found" };
  return {
    title: `${industry.name} - 行业岗位`,
    description: industry.description,
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { id } = await params;
  const industry = getIndustry(id);

  if (!industry) {
    notFound();
  }

  // 使用同步版本
  const companies = getCompaniesSync().filter(c => c.industryId === id);
  
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            返回首页
          </Link>
        </div>
      </header>
      
      {/* Industry Hero */}
      <section className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4 font-display">
            {industry.name}
          </h1>
          <p className="text-lg text-text-secondary">
            {industry.description}
          </p>
        </div>
      </section>
      
      {/* Companies */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">
          该行业公司 ({companies.length})
        </h2>
        
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary">暂无公司数据</p>
          </div>
        )}
      </section>
    </main>
  );
}
