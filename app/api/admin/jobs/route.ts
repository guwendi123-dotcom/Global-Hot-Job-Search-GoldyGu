import { NextRequest, NextResponse } from "next/server";
import { requestIsAdmin } from "@/lib/admin-auth";
import { readCompanies, readJobs, validId, writeCollection } from "@/lib/admin-store";
import type { Job } from "@/lib/data";

const unauthorized = () => NextResponse.json({ error: "请先登录管理后台" }, { status: 401 });

function list(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || "").split(/[,，\n]/).map((item) => item.trim()).filter(Boolean);
}

function normalize(input: Partial<Job>): Job {
  const profile = input.profile || {};
  return {
    id: String(input.id || "").trim().toLowerCase(),
    companyId: String(input.companyId || "").trim(),
    title: String(input.title || "").trim(),
    titleEn: String(input.titleEn || "").trim(),
    description: String(input.description || "").trim(),
    descriptionEn: String(input.descriptionEn || "").trim(),
    jobType: String(input.jobType || "").trim(),
    jobTypeEn: String(input.jobTypeEn || "").trim(),
    workMode: String(input.workMode || "").trim(),
    workModeEn: String(input.workModeEn || "").trim(),
    location: String(input.location || "").trim(),
    locationEn: String(input.locationEn || "").trim(),
    tags: list(input.tags),
    tagsEn: list(input.tagsEn),
    profile: {
      salary: String(profile.salary || "").trim(),
      salaryEn: String(profile.salaryEn || "").trim(),
      experience: String(profile.experience || "").trim(),
      experienceEn: String(profile.experienceEn || "").trim(),
      language: String(profile.language || "").trim(),
      languageEn: String(profile.languageEn || "").trim(),
      education: String(profile.education || "").trim(),
      educationEn: String(profile.educationEn || "").trim(),
      skills: list(profile.skills),
      skillsEn: list(profile.skillsEn),
    },
    sort: Number.isFinite(Number(input.sort)) ? Number(input.sort) : 999,
  };
}

async function validate(job: Job, originalId?: string) {
  if (!validId(job.id)) return "岗位编号只能使用小写字母、数字和连字符";
  if (!job.title) return "请填写岗位名称";
  const companies = await readCompanies();
  if (!companies.some((item) => item.id === job.companyId)) return "请选择有效公司";
  const jobs = await readJobs();
  if (jobs.some((item) => item.id === job.id && item.id !== originalId)) return "岗位编号已存在";
  return "";
}

export async function GET() {
  const jobs = (await readJobs()).sort((a, b) => (a.sort || 999) - (b.sort || 999));
  return NextResponse.json({ jobs }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const job = normalize(await request.json());
  const error = await validate(job);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const jobs = await readJobs();
  jobs.push(job);
  await writeCollection("jobs", jobs);
  return NextResponse.json({ success: true, job }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const body = await request.json();
  const originalId = String(body.originalId || body.id || "");
  const job = normalize(body);
  const error = await validate(job, originalId);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const jobs = await readJobs();
  const index = jobs.findIndex((item) => item.id === originalId);
  if (index < 0) return NextResponse.json({ error: "岗位不存在" }, { status: 404 });
  jobs[index] = job;
  await writeCollection("jobs", jobs);
  return NextResponse.json({ success: true, job });
}

export async function DELETE(request: NextRequest) {
  if (!requestIsAdmin(request)) return unauthorized();
  const id = request.nextUrl.searchParams.get("id") || "";
  const jobs = await readJobs();
  if (!jobs.some((item) => item.id === id)) return NextResponse.json({ error: "岗位不存在" }, { status: 404 });
  await writeCollection("jobs", jobs.filter((item) => item.id !== id));
  return NextResponse.json({ success: true });
}
