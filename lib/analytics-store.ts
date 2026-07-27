import type { Company, Job } from "@/lib/data";
import { getKv, readCompanies, readJobs } from "@/lib/admin-store";

const WINDOW_DAYS = 30;
const DAILY_TTL_SECONDS = 45 * 24 * 60 * 60;
const SNAPSHOT_KEY = "analytics:company-ranking:weekly";

type DailyViews = Record<string, number>;

type CompanyRanking = {
  week: string;
  generatedAt: string;
  windowDays: number;
  counts: Record<string, number>;
  order: string[];
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
      const companyId = jobCompany.get(jobId);
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
