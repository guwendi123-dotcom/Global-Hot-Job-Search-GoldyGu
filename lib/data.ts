import profileData from '@/config/profile.json';
import industriesData from '@/data/industries.json';
import companiesData from '@/data/companies.json';
import jobsData from '@/data/jobs.json';

export interface Profile {
  name: string;
  title: string;
  titleEn?: string;
  tagline: string;
  taglineEn?: string;
  avatar: string;
  bio: string;
  bioEn?: string;
  contact: {
    email: string;
    wechat: string;
    phone: string;
    linkedin: string;
  };
}

export interface Industry {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
}

export interface Company {
  id: string;
  industryId: string;
  name: string;
  nameEn?: string;
  logo: string;
  description: string;
  descriptionEn?: string;
  stage: string;
  stageEn?: string;
  location: string;
  locationEn?: string;
  sort?: number;
}

export interface JobProfile {
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
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  jobType?: string;
  jobTypeEn?: string;
  workMode?: string;
  workModeEn?: string;
  location?: string;
  locationEn?: string;
  tags: string[];
  tagsEn?: string[];
  profile: JobProfile;
  sort?: number;
}

export function getProfile(): Profile {
  return profileData as Profile;
}

export function getIndustriesSync(): Industry[] {
  return industriesData as Industry[];
}

export function getCompaniesSync(): Company[] {
  return (companiesData as Company[]).sort((a, b) => (a.sort || 999) - (b.sort || 999));
}

export function getJobsSync(): Job[] {
  return (jobsData as Job[]).sort((a, b) => (a.sort || 999) - (b.sort || 999));
}

export function getIndustry(id: string): Industry | undefined {
  return getIndustriesSync().find(i => i.id === id);
}

export function getCompany(id: string): Company | undefined {
  return getCompaniesSync().find(c => c.id === id);
}

export function getJob(id: string): Job | undefined {
  return getJobsSync().find(j => j.id === id);
}

export function getJobsByType(jobType: string): Job[] {
  return getJobsSync().filter(j => j.jobType === jobType).sort((a, b) => (a.sort || 999) - (b.sort || 999));
}

export function getJobsByCompanySync(companyId: string): Job[] {
  return getJobsSync().filter(j => j.companyId === companyId).sort((a, b) => (a.sort || 999) - (b.sort || 999));
}

import jobTypesData from '@/lib/job-types.json';

export interface JobType {
  id: string;
  name: string;
  nameZh: string;
  icon: string;
}

export function getJobTypes(): JobType[] {
  return jobTypesData as JobType[];
}

export function getJobType(id: string): JobType | undefined {
  return getJobTypes().find(t => t.id === id);
}

// 客户端使用的异步函数 - 从 API 获取动态数据
export async function getCompanies(): Promise<Company[]> {
  try {
    const res = await fetch('/api/admin/companies', { cache: 'no-store' });
    const data = await res.json();
    return (data.companies || []).sort((a: Company, b: Company) => (a.sort || 999) - (b.sort || 999));
  } catch (e) {
    console.error('Failed to fetch companies:', e);
    return getCompaniesSync();
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch('/api/admin/jobs', { cache: 'no-store' });
    const data = await res.json();
    return (data.jobs || []).sort((a: Job, b: Job) => (a.sort || 999) - (b.sort || 999));
  } catch (e) {
    console.error('Failed to fetch jobs:', e);
    return getJobsSync();
  }
}

export async function getIndustries(): Promise<Industry[]> {
  try {
    const res = await fetch('/api/admin/industries', { cache: 'no-store' });
    const data = await res.json();
    return data.industries || [];
  } catch (e) {
    console.error('Failed to fetch industries:', e);
    return getIndustriesSync();
  }
}

export async function getCompaniesByIndustry(industryId: string): Promise<Company[]> {
  const companies = await getCompanies();
  return companies.filter(c => c.industryId === industryId);
}

export async function getJobsByCompany(companyId: string): Promise<Job[]> {
  const jobs = await getJobs();
  return jobs.filter(j => j.companyId === companyId).sort((a, b) => (a.sort || 999) - (b.sort || 999));
}

export async function getJobsByIndustry(industryId: string): Promise<Job[]> {
  const companies = await getCompaniesByIndustry(industryId);
  const companyIds = companies.map(c => c.id);
  const jobs = await getJobs();
  return jobs.filter(j => companyIds.includes(j.companyId)).sort((a, b) => (a.sort || 999) - (b.sort || 999));
}