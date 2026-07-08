"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Building } from "lucide-react";

interface Company {
  id: string;
  industryId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  stage: string;
  stageEn: string;
  location: string;
  locationEn: string;
  logo: string;
  sort?: number;
}

interface Industry {
  id: string;
  name: string;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, industriesRes] = await Promise.all([
        fetch("/api/admin/companies"),
        fetch("/api/admin/industries"),
      ]);
      const companiesData = await companiesRes.json();
      const industriesData = await industriesRes.json();
      setCompanies(companiesData.companies || []);
      setIndustries(industriesData.industries || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingCompany) return;
    setSaving(true);

    try {
      const method = isCreating ? "POST" : "PUT";
      const response = await fetch("/api/admin/companies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCompany),
      });

      if (response.ok) {
        await fetchData();
        setEditingCompany(null);
        setIsCreating(false);
      } else {
        alert("保存失败");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个公司吗？")) return;

    try {
      await fetch(`/api/admin/companies?id=${id}`, { method: "DELETE" });
      await fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("删除失败");
    }
  };

  const createNewCompany = () => {
    const newId = `company-${Date.now()}`;
    setEditingCompany({
      id: newId,
      industryId: industries[0]?.id || "",
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      stage: "",
      stageEn: "",
      location: "",
      locationEn: "",
      logo: "",
      sort: 999,
    });
    setIsCreating(true);
  };

  const getIndustryName = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry?.name || industryId;
  };

  if (loading) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center">加载中...</div>;
  }

  // 编辑模式
  if (editingCompany) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setEditingCompany(null); setIsCreating(false); }} className="text-text-secondary hover:text-accent">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-text-primary">
                {isCreating ? "新建公司" : "编辑公司"}
              </h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingCompany(null); setIsCreating(false); }} className="px-4 py-2 text-text-secondary hover:text-text-primary">
                取消
              </button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-accent text-white rounded-full hover:bg-orange-600 disabled:opacity-50">
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">ID</label>
                <input
                  type="text"
                  value={editingCompany.id}
                  onChange={(e) => setEditingCompany({ ...editingCompany, id: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                  disabled={!isCreating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">排序权重 (数字越小越靠前)</label>
                <input
                  type="number"
                  value={editingCompany.sort || 999}
                  onChange={(e) => setEditingCompany({ ...editingCompany, sort: parseInt(e.target.value) || 999 })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                  placeholder="999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">行业</label>
                <select
                  value={editingCompany.industryId}
                  onChange={(e) => setEditingCompany({ ...editingCompany, industryId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                >
                  {industries.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">公司名称 (中文)</label>
                <input
                  type="text"
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">公司名称 (英文)</label>
                <input
                  type="text"
                  value={editingCompany.nameEn}
                  onChange={(e) => setEditingCompany({ ...editingCompany, nameEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">融资阶段 (中文)</label>
                <input
                  type="text"
                  value={editingCompany.stage}
                  onChange={(e) => setEditingCompany({ ...editingCompany, stage: e.target.value })}
                  placeholder="如: A轮"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">融资阶段 (英文)</label>
                <input
                  type="text"
                  value={editingCompany.stageEn}
                  onChange={(e) => setEditingCompany({ ...editingCompany, stageEn: e.target.value })}
                  placeholder="如: Series A"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">地点 (中文)</label>
                <input
                  type="text"
                  value={editingCompany.location}
                  onChange={(e) => setEditingCompany({ ...editingCompany, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">地点 (英文)</label>
                <input
                  type="text"
                  value={editingCompany.locationEn}
                  onChange={(e) => setEditingCompany({ ...editingCompany, locationEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">Logo 路径</label>
                <input
                  type="text"
                  value={editingCompany.logo}
                  onChange={(e) => setEditingCompany({ ...editingCompany, logo: e.target.value })}
                  placeholder="如: /logos/company.png"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">公司简介</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">中文描述</label>
                <textarea
                  value={editingCompany.description}
                  onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">英文描述</label>
                <textarea
                  value={editingCompany.descriptionEn}
                  onChange={(e) => setEditingCompany({ ...editingCompany, descriptionEn: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 列表模式
  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-secondary hover:text-accent">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">公司管理</h1>
            <span className="text-sm text-text-secondary">({companies.length} 个)</span>
          </div>
          <button onClick={createNewCompany} className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-orange-600">
            <Plus size={18} />
            新建公司
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {companies.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">暂无公司</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div key={company.id} className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-text-primary">{company.name}</h3>
                    <p className="text-sm text-text-secondary">{company.nameEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  阶段: {company.stage}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  地点: {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-500 mb-4">
                  排序: {company.sort || 999}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingCompany(company); setIsCreating(false); }}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="px-3 py-2 text-sm text-red-500 border border-border rounded-lg hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}