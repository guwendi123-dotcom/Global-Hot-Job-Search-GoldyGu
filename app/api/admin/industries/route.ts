import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "industries.json");

function getIndustries() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export async function GET() {
  const industries = getIndustries();
  return NextResponse.json({ industries });
}