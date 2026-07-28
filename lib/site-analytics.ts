import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Company, Job } from "@/lib/data";
import { getKv, readCompanies, readJobs } from "@/lib/admin-store";

const EVENT_TTL_SECONDS = 200 * 24 * 60 * 60;
const VALID_RANGES = new Set([7, 30, 90]);
const CLICK_EVENTS = new Set([
  "contact_linkedin",
  "contact_email",
  "contact_wechat",
  "wechat_qr_open",
  "company_to_job",
]);

export type AnalyticsEventName =
  | "page_view"
  | "contact_linkedin"
  | "contact_email"
  | "contact_wechat"
  | "wechat_qr_open"
  | "company_to_job";

type DailyAnalytics = {
  pageViews: Record<string, number>;
  entryPages: Record<string, number>;
  sources: Record<string, number>;
  flows: Record<string, number>;
  countries: Record<string, number>;
  devices: Record<string, number>;
  utmSources: Record<string, number>;
  clicks: Record<string, number>;
};

type CloudflareGroup = {
  count: number;
  sum?: { visits?: number };
  dimensions?: Record<string, string | number>;
};

export type MetricRow = { label: string; value: number };
export type TrendRow = { date: string; pageViews: number; visits: number; effectiveJobViews: number };

export type DashboardSnapshot = {
  rangeDays: number;
  generatedAt: string;
  cloudflare: {
    available: boolean;
    error?: string;
    pageViews: number;
    visits: number;
    trend: TrendRow[];
    pages: MetricRow[];
    entryPages: MetricRow[];
    sources: MetricRow[];
    countries: MetricRow[];
    devices: MetricRow[];
    browsers: MetricRow[];
  };
  summary: {
    pageViews: number;
    visits: number;
    effectiveJobViews: number;
    companyPageViews: number;
    contactClicks: number;
  };
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    effectiveViews: number;
    pageViews: number;
    contactClicks: number;
    rankChange: number | null;
  }>;
  companies: Array<{
    id: string;
    name: string;
    profileViews: number;
    jobViews: number;
    totalInterest: number;
    rankChange: number | null;
  }>;
  sources: MetricRow[];
  entryPages: MetricRow[];
  flows: MetricRow[];
  utmSources: MetricRow[];
  countries: MetricRow[];
  devices: MetricRow[];
  alerts: Array<{ kind: "rise" | "zero" | "conversion"; text: string }>;
};

function blankDaily(): DailyAnalytics {
  return {
    pageViews: {},
    entryPages: {},
    sources: {},
    flows: {},
    countries: {},
    devices: {},
    utmSources: {},
    clicks: {},
  };
}

function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function dayKeys(rangeDays: number): string[] {
  const now = new Date();
  return Array.from({ length: rangeDays }, (_, offset) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - offset);
    return utcDay(date);
  }).reverse();
}

function safePart(value: unknown, fallback = "未知"): string {
  const clean = String(value || "").trim().slice(0, 180);
  return clean || fallback;
}

function safePath(value: unknown): string {
  const raw = safePart(value, "/");
  if (!raw.startsWith("/")) return "/";
  return raw.split("?")[0].split("#")[0].slice(0, 180) || "/";
}

function increment(map: Record<string, number>, key: string, amount = 1) {
  map[key] = Math.max(0, Number(map[key]) || 0) + amount;
}

function trimMap(map: Record<string, number>, limit = 250): Record<string, number> {
  return Object.fromEntries(
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  );
}

function analyticsKey(day: string): string {
  return `analytics:site-events:${day}`;
}

function jobViewsKey(day: string): string {
  return `analytics:job-views:${day}`;
}

function snapshotKey(rangeDays: number): string {
  return `analytics:dashboard:${rangeDays}`;
}

function previousSnapshotKey(rangeDays: number): string {
  return `analytics:dashboard:previous:${rangeDays}`;
}

function normalizeRange(value: number): number {
  return VALID_RANGES.has(value) ? value : 30;
}

function deviceFromUserAgent(userAgent: string): string {
  if (/ipad|tablet/i.test(userAgent)) return "平板";
  if (/mobile|iphone|android/i.test(userAgent)) return "手机";
  return "电脑";
}

export function isAnalyticsBot(userAgent: string): boolean {
  return !userAgent || /bot|crawler|spider|preview|slurp|headless|lighthouse/i.test(userAgent);
}

export async function recordSiteEvent(input: {
  event: AnalyticsEventName;
  path?: string;
  previousPath?: string;
  referrerHost?: string;
  referrerPath?: string;
  utmSource?: string;
  context?: string;
  country?: string;
  userAgent?: string;
}): Promise<boolean> {
  const kv = getKv();
  if (!kv) return false;

  const event = input.event;
  if (event !== "page_view" && !CLICK_EVENTS.has(event)) return false;

  const key = analyticsKey(utcDay(new Date()));
  const daily = (await kv.get<DailyAnalytics>(key, "json")) || blankDaily();
  const path = safePath(input.path);
  const country = safePart(input.country, "未知").toUpperCase().slice(0, 3);
  const device = deviceFromUserAgent(input.userAgent || "");

  if (event === "page_view") {
    increment(daily.pageViews, path);
    increment(daily.countries, country);
    increment(daily.devices, device);

    const previousPath = input.previousPath ? safePath(input.previousPath) : "";
    if (previousPath && previousPath !== path) {
      increment(daily.flows, `${previousPath} → ${path}`);
    } else {
      increment(daily.entryPages, path);
      const host = safePart(input.referrerHost, "直接访问").toLowerCase();
      const refPath = input.referrerPath ? safePath(input.referrerPath) : "";
      increment(daily.sources, host === "直接访问" ? host : `${host}${refPath === "/" ? "" : refPath}`);
    }

    const utmSource = safePart(input.utmSource, "").toLowerCase();
    if (utmSource) increment(daily.utmSources, utmSource);
  } else {
    const context = safePart(input.context, "global");
    increment(daily.clicks, `${event}:${context}`);
  }

  for (const map of Object.values(daily)) Object.assign(map, trimMap(map));
  await kv.put(key, JSON.stringify(daily), { expirationTtl: EVENT_TTL_SECONDS });
  return true;
}

function mergeMaps(target: Record<string, number>, source: Record<string, number>) {
  for (const [key, value] of Object.entries(source || {})) increment(target, key, Math.max(0, Number(value) || 0));
}

function rows(map: Record<string, number>, limit = 12): MetricRow[] {
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "zh-CN"))
    .slice(0, limit);
}

function envValues() {
  try {
    const { env } = getCloudflareContext();
    const values = env as CloudflareEnv;
    return {
      token: values.CLOUDFLARE_ANALYTICS_TOKEN || "",
      accountId: values.CLOUDFLARE_ACCOUNT_ID || "f45f9163e487de1656b3905cb93e2333",
      siteTag: values.CLOUDFLARE_ANALYTICS_SITE_TAG || "4bbebdbe483647a9845a19fa353cf804",
    };
  } catch {
    return { token: "", accountId: "", siteTag: "" };
  }
}

async function queryCloudflare(rangeDays: number) {
  const { token, accountId, siteTag } = envValues();
  if (!token || !accountId || !siteTag) {
    throw new Error("Cloudflare 只读统计密钥尚未配置");
  }

  const days = dayKeys(rangeDays);
  const start = `${days[0]}T00:00:00Z`;
  const end = `${days[days.length - 1]}T23:59:59Z`;
  const filter = `siteTag: "${siteTag}", bot: 0, datetime_geq: "${start}", datetime_leq: "${end}"`;
  const query = `query {
    viewer {
      accounts(filter: {accountTag: "${accountId}"}) {
        trend: rumPageloadEventsAdaptiveGroups(limit: 5000, filter: {${filter}}) {
          count sum { visits } dimensions { date requestPath }
        }
        pages: rumPageloadEventsAdaptiveGroups(limit: 2000, filter: {${filter}}) {
          count sum { visits } dimensions { requestPath }
        }
        sources: rumPageloadEventsAdaptiveGroups(limit: 2000, filter: {${filter}}) {
          count dimensions { refererHost refererPath }
        }
        countries: rumPageloadEventsAdaptiveGroups(limit: 500, filter: {${filter}}) {
          count dimensions { countryName }
        }
        devices: rumPageloadEventsAdaptiveGroups(limit: 100, filter: {${filter}}) {
          count dimensions { deviceType }
        }
        browsers: rumPageloadEventsAdaptiveGroups(limit: 100, filter: {${filter}}) {
          count dimensions { userAgentBrowser }
        }
      }
    }
  }`;

  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const payload = await response.json() as {
    data?: { viewer?: { accounts?: Array<Record<string, CloudflareGroup[]>> } };
    errors?: Array<{ message?: string }>;
  };
  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message || `Cloudflare 返回 ${response.status}`);
  }
  const result = payload.data?.viewer?.accounts?.[0];
  if (!result) throw new Error("Cloudflare 未返回统计数据");
  return result;
}

function cloudflareRows(groups: CloudflareGroup[], key: string, limit = 12): MetricRow[] {
  const map: Record<string, number> = {};
  for (const group of groups || []) {
    const label = safePart(group.dimensions?.[key], "未知");
    increment(map, label, Math.max(0, Number(group.count) || 0));
  }
  return rows(map, limit);
}

function titleForPath(path: string, companies: Company[], jobs: Job[]): string {
  if (path === "/") return "首页";
  if (path === "/jobs") return "全部岗位";
  if (path === "/companies") return "全部公司";
  if (path === "/contact") return "联系咕咕";
  const jobId = path.match(/^\/job\/([^/]+)/)?.[1];
  if (jobId) return jobs.find((job) => job.id === jobId)?.title || path;
  const companyId = path.match(/^\/company\/([^/]+)/)?.[1];
  if (companyId) return companies.find((company) => company.id === companyId)?.name || path;
  return path;
}

function clickCount(clicks: Record<string, number>, event: string, context?: string): number {
  if (context) return clicks[`${event}:${context}`] || 0;
  return Object.entries(clicks)
    .filter(([key]) => key.startsWith(`${event}:`))
    .reduce((sum, [, value]) => sum + value, 0);
}

function rankMap(items: Array<{ id: string }>): Map<string, number> {
  return new Map(items.map((item, index) => [item.id, index + 1]));
}

export async function readDashboardSnapshot(range: number): Promise<DashboardSnapshot | null> {
  const kv = getKv();
  if (!kv) return null;
  return kv.get<DashboardSnapshot>(snapshotKey(normalizeRange(range)), "json");
}

export async function refreshDashboardSnapshot(range: number): Promise<DashboardSnapshot> {
  const rangeDays = normalizeRange(range);
  const kv = getKv();
  if (!kv) throw new Error("云端统计存储不可用");

  const days = dayKeys(rangeDays);
  const [companies, jobs, previous, ...dailyData] = await Promise.all([
    readCompanies(),
    readJobs(),
    readDashboardSnapshot(rangeDays),
    ...days.flatMap((day) => [
      kv.get<DailyAnalytics>(analyticsKey(day), "json"),
      kv.get<Record<string, number>>(jobViewsKey(day), "json"),
    ]),
  ]);

  const local = blankDaily();
  const jobViewCounts: Record<string, number> = {};
  const localTrend = new Map(days.map((date) => [date, 0]));
  for (let index = 0; index < days.length; index++) {
    const eventData = (dailyData[index * 2] as DailyAnalytics | null) || blankDaily();
    const jobData = (dailyData[index * 2 + 1] as Record<string, number> | null) || {};
    for (const key of Object.keys(local) as Array<keyof DailyAnalytics>) mergeMaps(local[key], eventData[key]);
    mergeMaps(jobViewCounts, jobData);
    localTrend.set(days[index], Object.values(jobData).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0));
  }

  let cloudflare = {
    available: false,
    error: "",
    pageViews: 0,
    visits: 0,
    trend: days.map((date) => ({ date, pageViews: 0, visits: 0, effectiveJobViews: localTrend.get(date) || 0 })),
    pages: [] as MetricRow[],
    entryPages: [] as MetricRow[],
    sources: [] as MetricRow[],
    countries: [] as MetricRow[],
    devices: [] as MetricRow[],
    browsers: [] as MetricRow[],
  };

  try {
    const result = await queryCloudflare(rangeDays);
    const trendMap = new Map(days.map((date) => [date, { pageViews: 0, visits: 0 }]));
    for (const group of result.trend || []) {
      const path = safePath(group.dimensions?.requestPath);
      if (path.startsWith("/admin") || path.startsWith("/api")) continue;
      const date = safePart(group.dimensions?.date, "");
      const current = trendMap.get(date);
      if (!current) continue;
      current.pageViews += Math.max(0, Number(group.count) || 0);
      current.visits += Math.max(0, Number(group.sum?.visits) || 0);
    }
    const cfTrend = days.map((date) => ({
      date,
      pageViews: trendMap.get(date)?.pageViews || 0,
      visits: trendMap.get(date)?.visits || 0,
      effectiveJobViews: localTrend.get(date) || 0,
    }));
    const publicGroups = (groups: CloudflareGroup[]) => (groups || []).filter((group) => {
      const path = safePath(group.dimensions?.requestPath);
      return !path.startsWith("/admin") && !path.startsWith("/api");
    });
    cloudflare = {
      available: true,
      error: "",
      pageViews: cfTrend.reduce((sum, item) => sum + item.pageViews, 0),
      visits: cfTrend.reduce((sum, item) => sum + item.visits, 0),
      trend: cfTrend,
      pages: cloudflareRows(publicGroups(result.pages), "requestPath", 30),
      entryPages: (result.pages || [])
        .filter((group) => {
          const path = safePath(group.dimensions?.requestPath);
          return !path.startsWith("/admin") && !path.startsWith("/api") && Number(group.sum?.visits || 0) > 0;
        })
        .map((group) => ({
          label: safePath(group.dimensions?.requestPath),
          value: Math.max(0, Number(group.sum?.visits) || 0),
        }))
        .reduce<MetricRow[]>((list, item) => {
          const existing = list.find((row) => row.label === item.label);
          if (existing) existing.value += item.value;
          else list.push(item);
          return list;
        }, [])
        .sort((a, b) => b.value - a.value)
        .slice(0, 15),
      sources: (result.sources || [])
        .filter((group) => {
          const host = safePart(group.dimensions?.refererHost, "");
          return host && !/^(www\.)?goldyhire\.com$/i.test(host);
        })
        .reduce<MetricRow[]>((list, group) => {
          const host = safePart(group.dimensions?.refererHost, "直接访问");
          const path = safePath(group.dimensions?.refererPath);
          const label = host === "直接访问" ? host : `${host}${path === "/" ? "" : path}`;
          const existing = list.find((item) => item.label === label);
          if (existing) existing.value += Math.max(0, Number(group.count) || 0);
          else list.push({ label, value: Math.max(0, Number(group.count) || 0) });
          return list;
        }, [])
        .sort((a, b) => b.value - a.value)
        .slice(0, 15),
      countries: cloudflareRows(result.countries, "countryName"),
      devices: cloudflareRows(result.devices, "deviceType"),
      browsers: cloudflareRows(result.browsers, "userAgentBrowser"),
    };
  } catch (error) {
    cloudflare.error = error instanceof Error ? error.message : "Cloudflare 数据读取失败";
  }

  const cfPageMap = Object.fromEntries(cloudflare.pages.map((item) => [item.label, item.value]));
  const companyById = new Map(companies.map((company) => [company.id, company]));
  const previousJobRanks = rankMap(previous?.jobs || []);
  const previousCompanyRanks = rankMap(previous?.companies || []);

  const jobRows = jobs
    .map((job) => ({
      id: job.id,
      title: job.title,
      company: companyById.get(job.companyId)?.name || job.companyId,
      effectiveViews: jobViewCounts[job.id] || 0,
      pageViews: cfPageMap[`/job/${job.id}`] || local.pageViews[`/job/${job.id}`] || 0,
      contactClicks:
        clickCount(local.clicks, "contact_linkedin", job.id)
        + clickCount(local.clicks, "contact_email", job.id)
        + clickCount(local.clicks, "contact_wechat", job.id),
      rankChange: null as number | null,
    }))
    .sort((a, b) => b.effectiveViews - a.effectiveViews || b.pageViews - a.pageViews || a.title.localeCompare(b.title, "zh-CN"));
  jobRows.forEach((item, index) => {
    const old = previousJobRanks.get(item.id);
    item.rankChange = old ? old - (index + 1) : null;
  });

  const companyRows = companies
    .map((company) => {
      const companyJobs = jobs.filter((job) => job.companyId === company.id);
      const jobViews = companyJobs.reduce((sum, job) => sum + (jobViewCounts[job.id] || 0), 0);
      const profileViews = cfPageMap[`/company/${company.id}`] || local.pageViews[`/company/${company.id}`] || 0;
      return {
        id: company.id,
        name: company.name,
        profileViews,
        jobViews,
        totalInterest: profileViews + jobViews,
        rankChange: null as number | null,
      };
    })
    .sort((a, b) => b.totalInterest - a.totalInterest || a.name.localeCompare(b.name, "zh-CN"));
  companyRows.forEach((item, index) => {
    const old = previousCompanyRanks.get(item.id);
    item.rankChange = old ? old - (index + 1) : null;
  });

  const contactClicks =
    clickCount(local.clicks, "contact_linkedin")
    + clickCount(local.clicks, "contact_email")
    + clickCount(local.clicks, "contact_wechat")
    + clickCount(local.clicks, "wechat_qr_open");
  const effectiveJobViews = Object.values(jobViewCounts).reduce((sum, value) => sum + value, 0);
  const companyPageViews = companyRows.reduce((sum, item) => sum + item.profileViews, 0);

  const alerts: DashboardSnapshot["alerts"] = [];
  for (const job of jobRows.filter((item) => item.effectiveViews === 0).slice(0, 3)) {
    alerts.push({ kind: "zero", text: `「${job.title}」近 ${rangeDays} 天暂无有效浏览` });
  }
  for (const job of jobRows.filter((item) => (item.rankChange || 0) >= 3).slice(0, 3)) {
    alerts.push({ kind: "rise", text: `「${job.title}」热度上升 ${job.rankChange} 位` });
  }
  if (effectiveJobViews >= 10 && contactClicks === 0) {
    alerts.push({ kind: "conversion", text: "岗位已有浏览，但暂未记录到联系点击，可检查联系入口文案与位置" });
  }

  const prettyPageRows = (items: MetricRow[]) => items
    .filter((item) => !item.label.startsWith("/admin") && !item.label.startsWith("/api"))
    .map((item) => ({ ...item, label: titleForPath(item.label, companies, jobs) }));

  const snapshot: DashboardSnapshot = {
    rangeDays,
    generatedAt: new Date().toISOString(),
    cloudflare,
    summary: {
      pageViews: cloudflare.pageViews || Object.values(local.pageViews).reduce((sum, value) => sum + value, 0),
      visits: cloudflare.visits,
      effectiveJobViews,
      companyPageViews,
      contactClicks,
    },
    jobs: jobRows,
    companies: companyRows,
    sources: cloudflare.sources.length ? cloudflare.sources : rows(local.sources, 15),
    entryPages: prettyPageRows(cloudflare.entryPages.length ? cloudflare.entryPages : rows(local.entryPages, 15)),
    flows: rows(local.flows, 15).map((item) => ({
      ...item,
      label: item.label.split(" → ").map((path) => titleForPath(path, companies, jobs)).join(" → "),
    })),
    utmSources: rows(local.utmSources, 12),
    countries: cloudflare.countries.length ? cloudflare.countries : rows(local.countries),
    devices: cloudflare.devices.length ? cloudflare.devices : rows(local.devices),
    alerts,
  };

  if (previous) await kv.put(previousSnapshotKey(rangeDays), JSON.stringify(previous));
  await kv.put(snapshotKey(rangeDays), JSON.stringify(snapshot));
  return snapshot;
}

export function snapshotToCsv(snapshot: DashboardSnapshot): string {
  const escape = (value: string | number | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [
    ["类型", "排名", "名称", "公司", "有效岗位浏览", "页面浏览", "联系点击", "排名变化"].map(escape).join(","),
    ...snapshot.jobs.map((job, index) => [
      "岗位", index + 1, job.title, job.company, job.effectiveViews, job.pageViews, job.contactClicks, job.rankChange,
    ].map(escape).join(",")),
    ...snapshot.companies.map((company, index) => [
      "公司", index + 1, company.name, "", company.jobViews, company.profileViews, "", company.rankChange,
    ].map(escape).join(",")),
  ];
  return `\uFEFF${lines.join("\n")}`;
}
