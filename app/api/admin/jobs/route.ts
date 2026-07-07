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

export async function GET() {
  const jobs = getJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  try {
    const job = await request.json();
    const jobs = getJobs();
    jobs.push(job);
    saveJobs(jobs);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const job = await request.json();
    const jobs = getJobs();
    const index = jobs.findIndex((j: any) => j.id === job.id);
    if (index !== -1) {
      jobs[index] = job;
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