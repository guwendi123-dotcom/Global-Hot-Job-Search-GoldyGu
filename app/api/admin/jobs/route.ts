import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "jobs.json");

function getJobs() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function saveJobs(jobs: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
}

// 自动补齐缺失的翻译
function fillMissingTranslations(job: any) {
  const filled = { ...job };

  // 基本字段翻译补齐
  if (!filled.titleEn && filled.title) filled.titleEn = filled.title;
  if (!filled.descriptionEn && filled.description) filled.descriptionEn = filled.description;
  if (!filled.locationEn && filled.location) filled.locationEn = filled.location;
  if (!filled.workModeEn && filled.workMode) filled.workModeEn = filled.workMode;
  if (!filled.jobTypeEn && filled.jobType) filled.jobTypeEn = filled.jobType;

  // 标签翻译补齐
  if (!filled.tagsEn && filled.tags) filled.tagsEn = [...filled.tags];

  // Profile 字段翻译补齐
  if (filled.profile) {
    if (!filled.profile.salaryEn && filled.profile.salary) filled.profile.salaryEn = filled.profile.salary;
    if (!filled.profile.experienceEn && filled.profile.experience) filled.profile.experienceEn = filled.profile.experience;
    if (!filled.profile.languageEn && filled.profile.language) filled.profile.languageEn = filled.profile.language;
    if (!filled.profile.educationEn && filled.profile.education) filled.profile.educationEn = filled.profile.education;
    if (!filled.profile.skillsEn && filled.profile.skills) filled.profile.skillsEn = [...(filled.profile.skills || [])];
  }

  return filled;
}

export async function GET() {
  const jobs = getJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  try {
    const job = await request.json();
    const filledJob = fillMissingTranslations(job);
    const jobs = getJobs();
    jobs.push(filledJob);
    saveJobs(jobs);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const job = await request.json();
    const filledJob = fillMissingTranslations(job);
    const jobs = getJobs();
    const index = jobs.findIndex((j: any) => j.id === job.id);
    if (index !== -1) {
      jobs[index] = filledJob;
      saveJobs(jobs);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const jobs = getJobs().filter((j: any) => j.id !== id);
    saveJobs(jobs);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}