import { getCloudflareContext } from "@opennextjs/cloudflare";
import companiesSeed from "@/data/companies.json";
import jobsSeed from "@/data/jobs.json";
import industriesSeed from "@/data/industries.json";
import companyIdentitiesSeed from "@/data/company-identities.json";
import type { Company, Industry, Job } from "@/lib/data";

export type CollectionName = "companies" | "jobs" | "industries";

const seeds: Record<CollectionName, unknown[]> = {
  companies: companiesSeed,
  jobs: jobsSeed,
  industries: industriesSeed,
};

export type GoldyKV = {
  get<T>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

export type CompanyIdentity = {
  companyId: string;
  realName: string;
};

export function getKv(): GoldyKV | null {
  try {
    const { env } = getCloudflareContext();
    return (env as CloudflareEnv).HEADHUNTER_DATA || null;
  } catch {
    return null;
  }
}

export async function readCollection<T>(name: CollectionName): Promise<T[]> {
  const kv = getKv();
  if (kv) {
    const stored = await kv.get<T[]>(`content:${name}`, "json");
    if (Array.isArray(stored)) return stored;
  }
  return structuredClone(seeds[name]) as T[];
}

export async function writeCollection<T>(name: CollectionName, value: T[]): Promise<void> {
  const kv = getKv();
  if (!kv) throw new Error("Cloud storage is unavailable");
  await kv.put(`content:${name}`, JSON.stringify(value));
}

export const readCompanies = () => readCollection<Company>("companies");
export const readJobs = () => readCollection<Job>("jobs");
export const readIndustries = () => readCollection<Industry>("industries");

export async function readCompanyIdentities(): Promise<CompanyIdentity[]> {
  const kv = getKv();
  if (kv) {
    const stored = await kv.get<CompanyIdentity[]>("admin:company-identities", "json");
    if (Array.isArray(stored)) return stored;
  }
  return structuredClone(companyIdentitiesSeed) as CompanyIdentity[];
}

export async function writeCompanyIdentities(value: CompanyIdentity[]): Promise<void> {
  const kv = getKv();
  if (!kv) throw new Error("Cloud storage is unavailable");
  await kv.put("admin:company-identities", JSON.stringify(value));
}

export function validId(id: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
}

export function nextSequentialId(existing: string[], prefix: string): string {
  const matcher = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d{3})$`);
  const next = existing.reduce((max, id) => {
    const match = id.match(matcher);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

export function nextJobId(existing: string[], companyId: string): string {
  return nextSequentialId(existing, `${companyId}-job`);
}
