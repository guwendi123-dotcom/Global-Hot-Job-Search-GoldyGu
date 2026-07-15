import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    let filePath = "";
    let key = "";

    if (type === "job") {
      filePath = path.join(process.cwd(), "data", "jobs.json");
      key = "jobs";
    } else if (type === "company") {
      filePath = path.join(process.cwd(), "data", "companies.json");
      key = "companies";
    } else if (type === "industry") {
      filePath = path.join(process.cwd(), "data", "industries.json");
      key = "industries";
    } else {
      return NextResponse.json({ error: "无效的类型" }, { status: 400 });
    }

    // 读取现有数据
    const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // 处理新数据 - 支持单条或数组
    const newItems = Array.isArray(data) ? data : [data];

    newItems.forEach((item: any) => {
      if (!item.id) {
        item.id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      if (item.sort === undefined) {
        item.sort = 1;
      }
      existingData.unshift(item);
    });

    // 写入文件
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({
      success: true,
      message: `已添加 ${newItems.length} 条${type === 'job' ? '岗位' : type === 'company' ? '公司' : '行业'}数据`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}