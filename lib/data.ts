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
}

export function getProfile(): Profile {
  return profileData as Profile;
}

export function getIndustries(): Industry[] {
  return industriesData as Industry[];
}

export function getCompanies(): Company[] {
  return companiesData as Company[];
}

export function getJobs(): Job[] {
  return jobsData as Job[];
}

export function getIndustry(id: string): Industry | undefined {
  return getIndustries().find(i => i.id === id);
}

export function getCompany(id: string): Company | undefined {
  return getCompanies().find(c => c.id === id);
}

export function getJob(id: string): Job | undefined {
  return getJobs().find(j => j.id === id);
}

export function getCompaniesByIndustry(industryId: string): Company[] {
  return getCompanies().filter(c => c.industryId === industryId);
}

export function getJobsByCompany(companyId: string): Job[] {
  return getJobs().filter(j => j.companyId === companyId);
}

export function getJobsByIndustry(industryId: string): Job[] {
  const companyIds = getCompaniesByIndustry(industryId).map(c => c.id);
  return getJobs().filter(j => companyIds.includes(j.companyId));
}

export function getJobsByType(jobType: string): Job[] {
  return getJobs().filter(j => j.jobType === jobType);
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