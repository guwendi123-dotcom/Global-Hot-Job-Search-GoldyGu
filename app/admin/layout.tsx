"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) setAuthenticated(true);
    else setError(data.error || "登录失败");
    setLoading(false);
  };

  if (authenticated === null) {
    return <main className="min-h-screen bg-bg-primary flex items-center justify-center">正在验证...</main>;
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center px-5">
        <form onSubmit={login} className="w-full max-w-sm bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center mb-5"><LockKeyhole size={22} /></div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">GoldyHire 管理后台</h1>
          <p className="text-sm text-text-secondary mb-6">登录后可独立新增、编辑和删除公司、岗位与行业。</p>
          <label className="block text-sm font-medium mb-2">管理密码</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none" />
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <button disabled={loading} className="w-full mt-5 px-4 py-3 bg-ink text-white rounded-xl disabled:opacity-50">{loading ? "登录中..." : "登录"}</button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
