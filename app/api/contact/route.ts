import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "submissions.json");

interface Resume {
  name: string;
  data: string; // base64 encoded
}

interface Submission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  interestedJob?: string;
  message: string;
  resume?: Resume;
}

// 确保数据文件存在
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// 读取所有提交
function getSubmissions(): Submission[] {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 保存提交
function saveSubmission(submission: Submission) {
  ensureDataFile();
  const submissions = getSubmissions();
  submissions.unshift(submission); // 添加到开头
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, linkedin, interestedJob, message, resume } = body;

    // 验证必填字段
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const submission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || "",
      linkedin: linkedin || "",
      interestedJob: interestedJob || "",
      message,
      resume: resume || undefined,
    };

    saveSubmission(submission);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Error saving submission:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const submissions = getSubmissions();
  // 返回时隐藏简历的 base64 数据，只返回文件名
  const submissionsWithoutResume = submissions.map(({ resume, ...rest }) => ({
    ...rest,
    hasResume: !!resume,
    resumeName: resume?.name || null,
  }));
  return NextResponse.json({ submissions: submissionsWithoutResume });
}