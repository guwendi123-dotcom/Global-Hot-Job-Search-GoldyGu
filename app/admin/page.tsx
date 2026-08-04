"use client";

import Link from "next/link";
import { BarChart3, Building2, BriefcaseBusiness, Download, Layers3, LogOut } from "lucide-react";

const cards = [
  { href: "/admin/companies", title: "公司管理", copy: "维护公开代称、真实公司名、Logo、行业与排序", icon: Building2 },
  { href: "/admin/jobs", title: "岗位管理", copy: "发布岗位，保存后立即在前台显示", icon: BriefcaseBusiness },
  { href: "/admin/industries", title: "行业管理", copy: "维护行业分类、名称和介绍", icon: Layers3 },
  { href: "/admin/analytics", title: "数据看板", copy: "查看访问趋势、热门岗位公司与流量来源", icon: BarChart3 },
];

export default function AdminPage() {
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  };
  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
          <div><p className="text-sm text-text-secondary">内容控制台</p><h1 className="text-2xl font-bold">GoldyHire 管理后台</h1></div>
          <button onClick={logout} className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-red-600"><LogOut size={17} />退出</button>
        </div>
      </header>
      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 mb-7 text-sm text-green-800">
          保存成功后，数据会写入云端并立即供前台读取，无需重新部署网站。
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ href, title, copy, icon: Icon }) => (
            <Link key={href} href={href} className="bg-white rounded-2xl border border-border p-6 hover:-translate-y-1 hover:shadow-md transition-all">
              <Icon size={24} className="mb-5 text-accent" /><h2 className="font-bold text-lg mb-2">{title}</h2><p className="text-sm text-text-secondary">{copy}</p>
            </Link>
          ))}
        </div>
        <a href="/api/admin/export" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white hover:border-accent"><Download size={17} />下载全部数据备份</a>
      </section>
    </main>
  );
}
