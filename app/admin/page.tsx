"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff, Download, Trash2, Linkedin, Mail, Phone, ExternalLink, FileText } from "lucide-react";

interface Submission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  interestedJob?: string;
  message: string;
  hasResume?: boolean;
  resumeName?: string | null;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // 简单的密码验证（，生产环境应该用更安全的方式）
  const ADMIN_PASSWORD = "goldy2024";

  useEffect(() => {
    // 检查是否已登录
    const savedAuth = localStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setAuthenticated(true);
      fetchSubmissions();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      fetchSubmissions();
    } else {
      alert("密码错误！");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportCSV = () => {
    const headers = ["姓名", "邮箱", "电话", "LinkedIn", "感兴趣岗位", "留言", "提交时间"];
    const rows = submissions.map((s) => [
      s.name,
      s.email,
      s.phone || "",
      s.linkedin || "",
      s.interestedJob || "",
      s.message.replace(/"/g, '""'),
      s.timestamp,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // 登录页
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">管理后台</h1>
            <p className="text-text-secondary">请输入密码访问</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              登录
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-text-secondary hover:text-accent">
              ← 返回首页
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 管理后台
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-text-secondary hover:text-accent">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">候选人留言管理</h1>
            <span className="text-sm text-text-secondary">({submissions.length} 条)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-accent border border-border rounded-full hover:border-accent transition-colors"
            >
              <Download size={16} />
              导出 CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-text-secondary hover:text-red-500"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-text-secondary">加载中...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">暂无留言</div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{submission.name}</h3>
                    <p className="text-sm text-text-secondary">{formatDate(submission.timestamp)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-text-secondary" />
                    <a href={`mailto:${submission.email}`} className="text-accent hover:underline">
                      {submission.email}
                    </a>
                  </div>
                  {submission.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-text-secondary" />
                      <span className="text-text-primary">{submission.phone}</span>
                    </div>
                  )}
                  {submission.linkedin && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin size={16} className="text-text-secondary" />
                      <a
                        href={submission.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        LinkedIn <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  {submission.interestedJob && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-text-secondary">感兴趣岗位:</span>
                      <span className="text-accent font-medium">{submission.interestedJob}</span>
                    </div>
                  )}
                  {submission.hasResume && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={16} className="text-text-secondary" />
                      <span className="text-text-secondary">简历:</span>
                      <span className="text-accent font-medium">{submission.resumeName}</span>
                    </div>
                  )}
                </div>

                <div className="bg-bg-primary rounded-xl p-4">
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{submission.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}