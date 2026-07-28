"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Building2,
  Download,
  Eye,
  MousePointerClick,
  RefreshCw,
  Users,
} from "lucide-react";
import type { DashboardSnapshot, MetricRow } from "@/lib/site-analytics";
import type { LucideIcon } from "lucide-react";

function number(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value || 0);
}

function RankChange({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-text-secondary">新</span>;
  if (value === 0) return <span className="text-xs text-text-secondary">—</span>;
  return <span className={`text-xs font-semibold ${value > 0 ? "text-green-600" : "text-red-500"}`}>{value > 0 ? `↑${value}` : `↓${Math.abs(value)}`}</span>;
}

function MiniBars({ rows, empty = "暂无数据" }: { rows: MetricRow[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  if (!rows.length) return <p className="text-sm text-text-secondary py-8 text-center">{empty}</p>;
  return (
    <div className="space-y-3">
      {rows.slice(0, 10).map((row) => (
        <div key={row.label}>
          <div className="flex justify-between gap-4 text-sm mb-1">
            <span className="truncate" title={row.label}>{row.label}</span>
            <strong>{number(row.value)}</strong>
          </div>
          <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState(30);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = async (days: number) => {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/admin/analytics?range=${days}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error || "读取失败");
    setSnapshot(data.snapshot || null);
    setLoading(false);
  };

  useEffect(() => { load(range); }, [range]);

  const refresh = async () => {
    setRefreshing(true);
    setError("");
    const response = await fetch(`/api/admin/analytics?range=${range}`, { method: "POST" });
    const data = await response.json().catch(() => ({}));
    if (response.ok) setSnapshot(data.snapshot);
    else setError(data.error || "刷新失败");
    setRefreshing(false);
  };

  const trendMax = useMemo(() => Math.max(1, ...(snapshot?.cloudflare.trend || []).map((day) => day.pageViews)), [snapshot]);
  const summaryCards: Array<{ label: string; value: number; icon: LucideIcon; hint: string }> = snapshot ? [
    { label: "访问次数", value: snapshot.summary.visits, icon: Users, hint: "Cloudflare 会话数" },
    { label: "页面浏览", value: snapshot.summary.pageViews, icon: Eye, hint: "公开页面 PV" },
    { label: "有效岗位浏览", value: snapshot.summary.effectiveJobViews, icon: BarChart3, hint: "每岗位每日去重" },
    { label: "公司页浏览", value: snapshot.summary.companyPageViews, icon: Building2, hint: "公司详情页" },
    { label: "联系点击", value: snapshot.summary.contactClicks, icon: MousePointerClick, hint: "微信 / 邮件 / LinkedIn" },
  ] : [];

  return (
    <main className="min-h-screen bg-bg-primary pb-16">
      <header className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-10 h-10 rounded-xl border border-border inline-flex items-center justify-center hover:border-accent" aria-label="返回管理后台"><ArrowLeft size={18} /></Link>
            <div><p className="text-xs text-text-secondary">管理后台</p><h1 className="text-xl font-bold">网站数据看板</h1></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[7, 30, 90].map((days) => (
              <button key={days} onClick={() => setRange(days)} className={`px-3 py-2 rounded-xl text-sm border ${range === days ? "bg-ink text-white border-ink" : "bg-white border-border"}`}>{days} 天</button>
            ))}
            <a href={`/api/admin/analytics/export?range=${range}`} className="px-3 py-2 rounded-xl text-sm border border-border bg-white inline-flex items-center gap-2"><Download size={16} />CSV</a>
            <button onClick={refresh} disabled={refreshing} className="px-4 py-2 rounded-xl text-sm bg-accent text-white inline-flex items-center gap-2 disabled:opacity-60">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />{refreshing ? "刷新中…" : "刷新最新数据"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 pt-7">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 mb-6 text-sm text-blue-900 flex flex-wrap justify-between gap-2">
          <span>页面只显示上次缓存；只有点击“刷新最新数据”时才读取 Cloudflare，不会持续请求。</span>
          <span>{snapshot ? `上次刷新：${new Date(snapshot.generatedAt).toLocaleString("zh-CN")}` : "尚未生成快照"}</span>
        </div>
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 mb-6 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="py-24 text-center text-text-secondary">正在读取缓存数据…</div>
        ) : !snapshot ? (
          <div className="bg-white border border-border rounded-3xl p-10 text-center">
            <BarChart3 size={34} className="mx-auto text-accent mb-4" />
            <h2 className="text-xl font-bold mb-2">还没有 {range} 天数据快照</h2>
            <p className="text-sm text-text-secondary mb-5">点击刷新后生成第一份快照，以后打开本页不会自动联网。</p>
            <button onClick={refresh} disabled={refreshing} className="px-5 py-3 rounded-xl bg-accent text-white">{refreshing ? "正在生成…" : "生成数据快照"}</button>
          </div>
        ) : (
          <>
            {!snapshot.cloudflare.available && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 mb-6 text-sm text-yellow-900 flex gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>岗位有效浏览等站内统计可用；Cloudflare 访客、来源与国家数据暂未接通：{snapshot.cloudflare.error || "未配置"}</span>
              </div>
            )}

            <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              {summaryCards.map(({ label, value, icon: Icon, hint }) => (
                <div key={label} className="bg-white border border-border rounded-2xl p-5">
                  <Icon size={20} className="text-accent mb-4" />
                  <strong className="text-3xl block">{number(value)}</strong>
                  <span className="font-semibold text-sm block mt-1">{label}</span>
                  <span className="text-xs text-text-secondary">{hint}</span>
                </div>
              ))}
            </section>

            <section className="bg-white border border-border rounded-2xl p-5 md:p-6 mb-6">
              <div className="flex justify-between items-end mb-5"><div><h2 className="font-bold text-lg">访问趋势</h2><p className="text-xs text-text-secondary">每天的公开页面浏览；橙色越高代表访问越多</p></div></div>
              <div className="h-48 flex items-end gap-1.5">
                {snapshot.cloudflare.trend.map((day) => (
                  <div key={day.date} className="flex-1 min-w-0 h-full flex flex-col justify-end group">
                    <div title={`${day.date}：${day.pageViews} PV / ${day.visits} 次访问`} className="w-full bg-accent/75 hover:bg-accent rounded-t-md transition-colors" style={{ height: `${Math.max(3, (day.pageViews / trendMax) * 100)}%` }} />
                    {(snapshot.rangeDays <= 30 || day.date.endsWith("-01")) && <span className="text-[9px] text-text-secondary text-center mt-1 truncate">{day.date.slice(5)}</span>}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid xl:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-border"><h2 className="font-bold text-lg">热门岗位</h2><p className="text-xs text-text-secondary">以有效岗位浏览优先排序</p></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink/[.03] text-text-secondary"><tr><th className="p-3 text-left">#</th><th className="p-3 text-left">岗位</th><th className="p-3 text-right">有效浏览</th><th className="p-3 text-right">页面浏览</th><th className="p-3 text-right">变化</th></tr></thead>
                    <tbody>{snapshot.jobs.slice(0, 12).map((job, index) => (
                      <tr key={job.id} className="border-t border-border/70">
                        <td className="p-3 text-text-secondary">{index + 1}</td>
                        <td className="p-3"><Link href={`/job/${job.id}`} target="_blank" className="font-semibold hover:text-accent inline-flex items-center gap-1">{job.title}<ArrowUpRight size={13} /></Link><span className="block text-xs text-text-secondary mt-0.5">{job.company}</span></td>
                        <td className="p-3 text-right font-semibold">{number(job.effectiveViews)}</td>
                        <td className="p-3 text-right">{number(job.pageViews)}</td>
                        <td className="p-3 text-right"><RankChange value={job.rankChange} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-border"><h2 className="font-bold text-lg">热门公司</h2><p className="text-xs text-text-secondary">公司页浏览 + 旗下岗位有效浏览</p></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink/[.03] text-text-secondary"><tr><th className="p-3 text-left">#</th><th className="p-3 text-left">公司</th><th className="p-3 text-right">公司页</th><th className="p-3 text-right">岗位</th><th className="p-3 text-right">变化</th></tr></thead>
                    <tbody>{snapshot.companies.slice(0, 12).map((company, index) => (
                      <tr key={company.id} className="border-t border-border/70">
                        <td className="p-3 text-text-secondary">{index + 1}</td>
                        <td className="p-3"><Link href={`/company/${company.id}`} target="_blank" className="font-semibold hover:text-accent inline-flex items-center gap-1">{company.name}<ArrowUpRight size={13} /></Link></td>
                        <td className="p-3 text-right">{number(company.profileViews)}</td>
                        <td className="p-3 text-right font-semibold">{number(company.jobViews)}</td>
                        <td className="p-3 text-right"><RankChange value={company.rankChange} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold mb-1">访客从哪里来</h2><p className="text-xs text-text-secondary mb-5">外部网站或直接访问</p><MiniBars rows={snapshot.sources} /></div>
              <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold mb-1">最常进入的页面</h2><p className="text-xs text-text-secondary mb-5">公开页面访问热度</p><MiniBars rows={snapshot.entryPages} /></div>
              <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold mb-1">站内跳转路径</h2><p className="text-xs text-text-secondary mb-5">从本次部署开始累计</p><MiniBars rows={snapshot.flows} empty="新埋点刚启用，产生访问后会显示" /></div>
            </section>

            <section className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold mb-5">国家 / 地区</h2><MiniBars rows={snapshot.countries} /></div>
              <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold mb-5">设备类型</h2><MiniBars rows={snapshot.devices} /></div>
              <div className="bg-white border border-border rounded-2xl p-5"><h2 className="font-bold mb-1">UTM 来源</h2><p className="text-xs text-text-secondary mb-5">以后分享带 utm_source 的链接即可归因</p><MiniBars rows={snapshot.utmSources} empty="暂未检测到 UTM 来源" /></div>
            </section>

            <section className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-4">招聘运营提醒</h2>
              {snapshot.alerts.length ? <div className="grid md:grid-cols-2 gap-3">{snapshot.alerts.map((alert, index) => <div key={`${alert.kind}-${index}`} className="rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-3 text-sm">{alert.text}</div>)}</div> : <p className="text-sm text-text-secondary">目前没有需要特别提醒的异常。</p>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
