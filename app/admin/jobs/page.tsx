"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Building, Briefcase } from "lucide-react";

interface Job {
  id: string;
  companyId: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  location: string;
  locationEn: string;
  workMode: string;
  workModeEn: string;
  tags: string[];
  tagsEn: string[];
  profile: {
    salary?: string;
    salaryEn?: string;
    experience?: string;
    experienceEn?: string;
    language?: string;
    languageEn?: string;
    education?: string;
    educationEn?: string;
    skills?: string[];
    skillsEn?: string[];
  };
  sort?: number;
}

interface Company {
  id: string;
  name: string;
  nameEn: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, companiesRes] = await Promise.all([
        fetch("/api/admin/jobs"),
        fetch("/api/admin/companies"),
      ]);
      const jobsData = await jobsRes.json();
      const companiesData = await companiesRes.json();
      setJobs(jobsData.jobs || []);
      setCompanies(companiesData.companies || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingJob) return;
    setSaving(true);

    try {
      const method = isCreating ? "POST" : "PUT";
      const response = await fetch("/api/admin/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingJob),
      });

      if (response.ok) {
        await fetchData();
        setEditingJob(null);
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
    if (!confirm("确定要删除这个岗位吗？")) return;

    try {
      await fetch(`/api/admin/jobs?id=${id}`, { method: "DELETE" });
      await fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("删除失败");
    }
  };

  const createNewJob = () => {
    const newId = `job-${Date.now()}`;
    setEditingJob({
      id: newId,
      companyId: companies[0]?.id || "",
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      location: "",
      locationEn: "",
      workMode: "on-site",
      workModeEn: "On-site",
      tags: [],
      tagsEn: [],
      profile: {},
      sort: 999,
    });
    setIsCreating(true);
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || companyId;
  };

  if (loading) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center">加载中...</div>;
  }

  // 编辑模式
  if (editingJob) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setEditingJob(null); setIsCreating(false); }} className="text-text-secondary hover:text-accent">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-text-primary">
                {isCreating ? "新建岗位" : "编辑岗位"}
              </h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingJob(null); setIsCreating(false); }} className="px-4 py-2 text-text-secondary hover:text-text-primary">
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
                <label className="block text-sm font-medium text-text-primary mb-1">公司</label>
                <select
                  value={editingJob.companyId}
                  onChange={(e) => setEditingJob({ ...editingJob, companyId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">ID</label>
                <input
                  type="text"
                  value={editingJob.id}
                  onChange={(e) => setEditingJob({ ...editingJob, id: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                  disabled={!isCreating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">排序权重 (数字越小越靠前)</label>
                <input
                  type="number"
                  value={editingJob.sort || 999}
                  onChange={(e) => setEditingJob({ ...editingJob, sort: parseInt(e.target.value) || 999 })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                  placeholder="999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">中文标题</label>
                <input
                  type="text"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">英文标题</label>
                <input
                  type="text"
                  value={editingJob.titleEn}
                  onChange={(e) => setEditingJob({ ...editingJob, titleEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">地点 (中文)</label>
                <input
                  type="text"
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">地点 (英文)</label>
                <input
                  type="text"
                  value={editingJob.locationEn}
                  onChange={(e) => setEditingJob({ ...editingJob, locationEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">工作模式 (中文)</label>
                <input
                  type="text"
                  value={editingJob.workMode}
                  onChange={(e) => setEditingJob({ ...editingJob, workMode: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">工作模式 (英文)</label>
                <input
                  type="text"
                  value={editingJob.workModeEn}
                  onChange={(e) => setEditingJob({ ...editingJob, workModeEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 薪资待遇 */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">薪资待遇</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">薪资 (中文)</label>
                <input
                  type="text"
                  value={editingJob.profile.salary || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, profile: { ...editingJob.profile, salary: e.target.value } })}
                  placeholder="如: 50-80K·15薪"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">薪资 (英文)</label>
                <input
                  type="text"
                  value={editingJob.profile.salaryEn || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, profile: { ...editingJob.profile, salaryEn: e.target.value } })}
                  placeholder="如: 50-80K·15 months"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">经验要求 (中文)</label>
                <input
                  type="text"
                  value={editingJob.profile.experience || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, profile: { ...editingJob.profile, experience: e.target.value } })}
                  placeholder="如: 3-5年"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">经验要求 (英文)</label>
                <input
                  type="text"
                  value={editingJob.profile.experienceEn || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, profile: { ...editingJob.profile, experienceEn: e.target.value } })}
                  placeholder="如: 3-5 years"
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">语言要求 (中文)</label>
                <input
                  type="text"
                  value={editingJob.profile.language || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, profile: { ...editingJob.profile, language: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">语言要求 (英文)</label>
                <input
                  type="text"
                  value={editingJob.profile.languageEn || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, profile: { ...editingJob.profile, languageEn: e.target.value } })}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">岗位描述</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">中文描述</label>
                <textarea
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 rounded-xl border border-border focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">英文描述</label>
                <textarea
                  value={editingJob.descriptionEn}
                  onChange={(e) => setEditingJob({ ...editingJob, descriptionEn: e.target.value })}
                  rows={8}
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
            <h1 className="text-xl font-bold text-text-primary">岗位管理</h1>
            <span className="text-sm text-text-secondary">({jobs.length} 个)</span>
          </div>
          <button onClick={createNewJob} className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-orange-600">
            <Plus size={18} />
            新建岗位
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">暂无岗位</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-text-primary">{job.title}</h3>
                    <p className="text-sm text-text-secondary">{job.titleEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                  <Building size={14} />
                  {getCompanyName(job.companyId)}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                  <Briefcase size={14} />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-500 mb-4">
                  排序: {job.sort || 999}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingJob(job); setIsCreating(false); }}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
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