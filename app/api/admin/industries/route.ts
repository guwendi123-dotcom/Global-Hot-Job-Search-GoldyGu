import { NextRequest, NextResponse } from "next/server";
import { getIndustries } from "@/lib/data";

const DATA_FILE = process.cwd() + "/data/industries.json";

function getIndustriesFromFile() {
  try {
    const fs = require('fs');
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    // 文件系统不可用
  }
  return getIndustries();
}

export async function GET() {
  const industries = getIndustriesFromFile();
  return NextResponse.json({ industries });
}