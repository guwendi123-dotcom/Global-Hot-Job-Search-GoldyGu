import type { Company, Job } from "@/lib/data";
import { getKv, readCompanies, readJobs } from "@/lib/admin-store";

const WINDOW_DAYS = 30;
const DAILY_TTL_SECONDS = 45 * 24 * 60 * 60;
const SNAPSHOT_KEY = "analytics:company-ranking:weekly";
const HOME_SNAPSHOT_KEY = "analytics:homepage-ranking:weekly-v3";
const HEAT_WEIGHT = 20;
const FRESHNESS_WEIGHT = 70;

type DailyViews = Record<string, number>;

const LEGACY_JOB_IDS: Record<string, string> = {
  "maxinsights-data-partnership": "embodied-ai-training-data-platform-job-001",
  "maxinsights-technical-project-manager": "embodied-ai-training-data-platform-job-002",
  "maxinsights-data-ops-director": "embodied-ai-training-data-platform-job-003",
  "mexc-growth-product": "global-crypto-spot-platform-job-001",
  "nirva-ios-engineer": "ai-wearable-jewelry-company-job-001",
  "saparo-fullstack-engineer": "ai-shopping-agent-platform-job-001",
  "saparo-growth-lead": "ai-shopping-agent-platform-job-002",
  "saparo-deals-operations": "ai-shopping-agent-platform-job-003",
  "sudo-brand-manager": "simulation-trained-robotics-platform-job-001",
  "sudo-devops-manager": "simulation-trained-robotics-platform-job-002",
  "sudo-fa-engineer": "simulation-trained-robotics-platform-job-003",
  "vidawheel-social-media-content-operations": "women-ai-wellness-brand-job-001",
  "vidawheel-influencer-marketing": "women-ai-wellness-brand-job-002",
  "vidawheel-performance-marketing": "women-ai-wellness-brand-job-003",
  "vidawheel-ai-agent-engineer": "women-ai-wellness-brand-job-004",
  "vidawheel-head-of-marketing-us": "women-ai-wellness-brand-job-005",
  "vidawheel-job-001": "women-ai-wellness-brand-job-006",
  "vidawheel-job-002": "women-ai-wellness-brand-job-007",
  "vidawheel-job-003": "women-ai-wellness-brand-job-008",
  "vidawheel-job-004": "women-ai-wellness-brand-job-009",
  "vidawheel-job-005": "women-ai-wellness-brand-job-010",
  "actionx-founding-global-growth-lead": "ai-native-recommendation-infrastructure-job-001",
  "actionx-full-stack-engineer-ai-product": "ai-native-recommendation-infrastructure-job-002",
  "actionx-algorithm-engineer-ai-product": "ai-native-recommendation-infrastructure-job-003",
  "novvy-senior-business-development-manager": "ai-native-ad-monetization-network-job-001",
  "vord-ai-job-001": "privacy-first-ai-chat-platform-job-001",
};

type CompanyRanking = {
  week: string;
  generatedAt: string;
  windowDays: number;
  counts: Record<string, number>;
  order: string[];
};

export type HomepageRanking = {
  week: string;
  generatedAt: string;
  windowDays: number;
  contentVersion: string;
  jobOrder: string[];
  companyOrder: string[];
  jobViews: Record<string, number>;
  companyViews: Record<string, number>;
};

function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isoWeek(date: Date): string {
  const value = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((value.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${value.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function dailyKey(day: string): string {
  return `analytics:job-views:${day}`;
}

function freshnessScore(createdAt: string | undefined, now: Date): number {
  const timestamp = createdAt ? Date.parse(createdAt) : Number.NaN;
  if (!Number.isFinite(timestamp)) return 0;
  const ageDays = Math.max(0, (now.getTime() - timestamp) / 86400000);
  return Math.max(0, 1 - ageDays / WINDOW_DAYS) * FRESHNESS_WEIGHT;
}

function heatScore(views: number): number {
  return Math.log2(Math.max(0, views) + 1) * HEAT_WEIGHT;
}

function newestDate(values: Array<string | undefined>): string | undefined {
  return values
    .filter((value): value is string => Boolean(value) && Number.isFinite(Date.parse(value!)))
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

function rankingContentVersion(companies: Company[], jobs: Job[]): string {
  const latest = newestDate([
    ...companies.map((company) => company.createdAt),
    ...jobs.map((job) => job.createdAt),
  ]) || "legacy";
  return `${companies.length}:${jobs.length}:${latest}`;
}

function buildHomepageRanking(companies: Company[], jobs: Job[], dailyViews: DailyViews[]): HomepageRanking {
  const now = new Date();
  const jobViews: Record<string, number> = Object.fromEntries(jobs.map((job) => [job.id, 0]));

  for (const day of dailyViews) {
    for (const [rawJobId, rawCount] of Object.entries(day)) {
      const jobId = LEGACY_JOB_IDS[rawJobId] || rawJobId;
      if (jobId in jobViews) jobViews[jobId] += Math.max(0, Number(rawCount) || 0);
    }
  }

  const scoredJobs = [...jobs]
    .sort((a, b) => {
      const scoreA = heatScore(jobViews[a.id]) + freshnessScore(a.createdAt, now);
      const scoreB = heatScore(jobViews[b.id]) + freshnessScore(b.createdAt, now);
      return (scoreB - scoreA)
        || (jobViews[b.id] - jobViews[a.id])
        || (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0)
        || ((a.sort ?? 999) - (b.sort ?? 999))
        || a.id.localeCompare(b.id);
    });

  // 首页首屏最多展示同一家公司两个岗位，避免一次批量发布挤掉所有热门岗位。
  const featuredJobs: Job[] = [];
  const featuredCompanyCounts = new Map<string, number>();
  for (const job of scoredJobs) {
    const companyCount = featuredCompanyCounts.get(job.companyId) || 0;
    if (featuredJobs.length < 8 && companyCount < 2) {
      featuredJobs.push(job);
      featuredCompanyCounts.set(job.companyId, companyCount + 1);
    }
  }
  const featuredIds = new Set(featuredJobs.map((job) => job.id));
  const jobOrder = [
    ...featuredJobs.map((job) => job.id),
    ...scoredJobs.filter((job) => !featuredIds.has(job.id)).map((job) => job.id),
  ];

  const companyViews: Record<string, number> = Object.fromEntries(companies.map((company) => [company.id, 0]));
  const jobsByCompany = new Map<string, Job[]>();
  for (const job of jobs) {
    companyViews[job.companyId] = (companyViews[job.companyId] || 0) + (jobViews[job.id] || 0);
    jobsByCompany.set(job.companyId, [...(jobsByCompany.get(job.companyId) || []), job]);
  }

  const companyFreshness = new Map(companies.map((company) => [
    company.id,
    newestDate([company.createdAt, ...(jobsByCompany.get(company.id) || []).map((job) => job.createdAt)]),
  ]));

  const companyOrder = [...companies]
    .sort((a, b) => {
      const scoreA = heatScore(companyViews[a.id] || 0) + freshnessScore(companyFreshness.get(a.id), now);
      const scoreB = heatScore(companyViews[b.id] || 0) + freshnessScore(companyFreshness.get(b.id), now);
      return (scoreB - scoreA)
        || ((companyViews[b.id] || 0) - (companyViews[a.id] || 0))
        || (Date.parse(companyFreshness.get(b.id) || "") || 0) - (Date.parse(companyFreshness.get(a.id) || "") || 0)
        || ((a.sort ?? 999) - (b.sort ?? 999))
        || a.id.localeCompare(b.id);
    })
    .map((company) => company.id);

  return {
    week: isoWeek(now),
    generatedAt: now.toISOString(),
    windowDays: WINDOW_DAYS,
    contentVersion: rankingContentVersion(companies, jobs),
    jobOrder,
    companyOrder,
    jobViews,
    companyViews,
  };
}

export async function getHomepageRanking(): Promise<HomepageRanking> {
  const kv = getKv();
  const [companies, jobs] = await Promise.all([readCompanies(), readJobs()]);
  const contentVersion = rankingContentVersion(companies, jobs);
  const currentWeek = isoWeek(new Date());

  if (kv) {
    const existing = await kv.get<HomepageRanking>(HOME_SNAPSHOT_KEY, "json");
    if (existing?.week === currentWeek && existing.contentVersion === contentVersion) return existing;
  }

  const now = new Date();
  const days = Array.from({ length: WINDOW_DAYS }, (_, offset) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - offset);
    return utcDay(date);
  });
  const dailyViews = kv
    ? await Promise.all(days.map(async (day) => (await kv.get<DailyViews>(dailyKey(day), "json")) || {}))
    : [];
  const ranking = buildHomepageRanking(companies, jobs, dailyViews);
  if (kv) await kv.put(HOME_SNAPSHOT_KEY, JSON.stringify(ranking));
  return ranking;
}

export async function recordJobView(jobId: string): Promise<boolean> {
  const kv = getKv();
  if (!kv) return false;

  const jobs = await readJobs();
  if (!jobs.some((job) => job.id === jobId)) return false;

  const key = dailyKey(utcDay(new Date()));
  const views = (await kv.get<DailyViews>(key, "json")) || {};
  views[jobId] = Math.max(0, Number(views[jobId]) || 0) + 1;
  await kv.put(key, JSON.stringify(views), { expirationTtl: DAILY_TTL_SECONDS });
  return true;
}

function stableCompanyOrder(companies: Company[], jobs: Job[], dailyViews: DailyViews[]): CompanyRanking {
  const counts: Record<string, number> = Object.fromEntries(companies.map((company) => [company.id, 0]));
  const jobCompany = new Map(jobs.map((job) => [job.id, job.companyId]));

  for (const day of dailyViews) {
    for (const [jobId, rawCount] of Object.entries(day)) {
      const companyId = jobCompany.get(LEGACY_JOB_IDS[jobId] || jobId);
      if (companyId && companyId in counts) counts[companyId] += Math.max(0, Number(rawCount) || 0);
    }
  }

  const order = [...companies]
    .sort((a, b) =>
      (counts[b.id] - counts[a.id])
      || ((a.sort ?? 999) - (b.sort ?? 999))
      || a.name.localeCompare(b.name, "zh-CN")
    )
    .map((company) => company.id);

  return {
    week: isoWeek(new Date()),
    generatedAt: new Date().toISOString(),
    windowDays: WINDOW_DAYS,
    counts,
    order,
  };
}

export async function getWeeklyCompanyRanking(): Promise<CompanyRanking | null> {
  const kv = getKv();
  if (!kv) return null;

  const currentWeek = isoWeek(new Date());
  const existing = await kv.get<CompanyRanking>(SNAPSHOT_KEY, "json");
  if (existing?.week === currentWeek && Array.isArray(existing.order)) return existing;

  const now = new Date();
  const days = Array.from({ length: WINDOW_DAYS }, (_, offset) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - offset);
    return utcDay(date);
  });

  const [companies, jobs, ...dailyViews] = await Promise.all([
    readCompanies(),
    readJobs(),
    ...days.map(async (day) => (await kv.get<DailyViews>(dailyKey(day), "json")) || {}),
  ]);
  const ranking = stableCompanyOrder(companies, jobs, dailyViews);
  await kv.put(SNAPSHOT_KEY, JSON.stringify(ranking));
  return ranking;
}

export async function sortCompaniesByWeeklyViews(companies: Company[]): Promise<Company[]> {
  const ranking = await getWeeklyCompanyRanking();
  if (!ranking) return [...companies].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));

  const rank = new Map(ranking.order.map((id, index) => [id, index]));
  return [...companies].sort((a, b) =>
    ((rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER))
    || ((a.sort ?? 999) - (b.sort ?? 999))
  );
}
