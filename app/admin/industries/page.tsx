"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

type Industry = {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
};

const empty: Industry = { id: "", name: "", nameEn: "", description: "", descriptionEn: "", icon: "sparkles" };

export default function IndustriesAdminPage() {
  const [items, setItems] = useState<Industry[]>([]);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/industries", { cache: "no-store" });
    const data = await response.json();
    setItems(data.industries || []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    const response = await fetch("/api/admin/next-id?type=industry", { cache: "no-store" });
    const data = await response.json();
    setEditing({ ...empty, id: data.id || "" });
    setCreating(true);
  };

  const save = async () => {
    if (!editing) return;
    const response = await fetch("/api/admin/industries", {
      method: creating ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return alert(data.error || "保存失败");
    await load();
    setEditing(null);
    setCreating(false);
    setNotice("行业已保存，前台已同步更新");
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除这个行业吗？")) return;
    const response = await fetch(`/api/admin/industries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return alert(data.error || "删除失败");
    await load();
    setNotice("行业已删除");
  };

  if (editing) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <header className="bg-white border-b border-border"><div className="max-w-3xl mx-auto px-5 py-5 flex justify-between"><h1 className="text-xl font-bold">{creating ? "新建行业" : "编辑行业"}</h1><div className="flex gap-3"><button onClick={() => setEditing(null)}>取消</button><button onClick={save} className="px-4 py-2 bg-accent text-white rounded-xl">保存</button></div></div></header>
        <section className="max-w-3xl mx-auto px-5 py-8">
          <div className="bg-white border border-border rounded-2xl p-6 grid md:grid-cols-2 gap-4">
            <label className="text-sm font-medium">行业编号<input value={editing.id} disabled={!creating} onChange={(e) => setEditing({ ...editing, id: e.target.value })} className="block w-full mt-1 px-4 py-2 border border-border rounded-xl disabled:bg-gray-50" /><span className="block text-xs text-text-secondary mt-1">自动按 industry-001 顺序生成</span></label>
            <label className="text-sm font-medium">图标名称<input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="block w-full mt-1 px-4 py-2 border border-border rounded-xl" /></label>
            <label className="text-sm font-medium">中文名称<input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="block w-full mt-1 px-4 py-2 border border-border rounded-xl" /></label>
            <label className="text-sm font-medium">英文名称<input value={editing.nameEn || ""} onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })} className="block w-full mt-1 px-4 py-2 border border-border rounded-xl" /></label>
            <label className="text-sm font-medium md:col-span-2">中文介绍<textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="block w-full mt-1 px-4 py-2 border border-border rounded-xl" /></label>
            <label className="text-sm font-medium md:col-span-2">英文介绍<textarea rows={4} value={editing.descriptionEn || ""} onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })} className="block w-full mt-1 px-4 py-2 border border-border rounded-xl" /></label>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border"><div className="max-w-5xl mx-auto px-5 py-5 flex justify-between items-center"><div className="flex gap-4 items-center"><Link href="/admin"><ArrowLeft /></Link><h1 className="text-xl font-bold">行业管理</h1><span className="text-sm text-text-secondary">({items.length})</span></div><button onClick={create} className="inline-flex gap-2 items-center px-4 py-2 bg-accent text-white rounded-xl"><Plus size={17} />新建行业</button></div></header>
      <section className="max-w-5xl mx-auto px-5 py-8">
        {notice && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => <article key={item.id} className="bg-white border border-border rounded-2xl p-6"><p className="text-xs text-text-secondary mb-2">{item.id}</p><h2 className="font-bold text-lg">{item.name}</h2><p className="text-sm text-text-secondary mt-2 line-clamp-2">{item.description}</p><div className="flex gap-2 mt-5"><button onClick={() => { setEditing(item); setCreating(false); }} className="flex-1 border border-border rounded-lg px-3 py-2">编辑</button><button onClick={() => remove(item.id)} className="text-red-600 border border-border rounded-lg px-3 py-2">删除</button></div></article>)}
        </div>
      </section>
    </main>
  );
}
