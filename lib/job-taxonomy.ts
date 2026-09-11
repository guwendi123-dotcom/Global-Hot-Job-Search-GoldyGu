import type { Job } from "@/lib/data";

export type JobFunctionId =
  | "ai-algorithm"
  | "engineering"
  | "product"
  | "design"
  | "marketing"
  | "operations"
  | "commercial"
  | "hardware"
  | "people"
  | "management";

export type SeniorityId = "cxo" | "head" | "manager" | "senior" | "ic";
export type WorkModeId = "remote" | "hybrid" | "onsite" | "flexible" | "tbd";

export interface TaxonomyOption {
  id: string;
  labelZh: string;
  labelEn: string;
}

export interface JobTaxonomy {
  functionId: JobFunctionId;
  specialtyId: string;
  seniorityId: SeniorityId;
  workModeId: WorkModeId;
  priorityId: "high" | "normal";
}

export const JOB_FUNCTIONS: Array<TaxonomyOption & { id: JobFunctionId }> = [
  { id: "ai-algorithm", labelZh: "AI 研究与算法", labelEn: "AI Research & Algorithms" },
  { id: "engineering", labelZh: "软件工程与基础设施", labelEn: "Engineering & Infrastructure" },
  { id: "product", labelZh: "产品", labelEn: "Product" },
  { id: "design", labelZh: "设计", labelEn: "Design" },
  { id: "marketing", labelZh: "市场、品牌与增长", labelEn: "Marketing, Brand & Growth" },
  { id: "operations", labelZh: "运营与安全治理", labelEn: "Operations & Trust" },
  { id: "commercial", labelZh: "BD、销售与客户成功", labelEn: "BD, Sales & Customer Success" },
  { id: "hardware", labelZh: "硬件、机器人与供应链", labelEn: "Hardware, Robotics & Supply Chain" },
  { id: "people", labelZh: "HR 与综合职能", labelEn: "People & Corporate Functions" },
  { id: "management", labelZh: "综合管理", labelEn: "General Management" },
];

export const JOB_SPECIALTIES: Record<JobFunctionId, TaxonomyOption[]> = {
  "ai-algorithm": [
    { id: "foundation-models", labelZh: "基座 / 生成模型", labelEn: "Foundation & Generative Models" },
    { id: "agent-models", labelZh: "Agent / 模型策略", labelEn: "Agent & Model Strategy" },
    { id: "evaluation-training", labelZh: "评测 / 训练 / 对齐", labelEn: "Evaluation, Training & Alignment" },
    { id: "computer-vision", labelZh: "视觉 / 多模态", labelEn: "Vision & Multimodal" },
    { id: "world-models", labelZh: "世界模型 / 机器人算法", labelEn: "World Models & Robotics AI" },
    { id: "recommendation", labelZh: "推荐 / 广告 / 增长算法", labelEn: "Recommendation & Growth Algorithms" },
    { id: "operations-research", labelZh: "运筹 / 供应链算法", labelEn: "Operations Research & Supply Chain" },
    { id: "data-science", labelZh: "数据科学 / 分析", labelEn: "Data Science & Analytics" },
  ],
  engineering: [
    { id: "ml-infrastructure", labelZh: "ML Infra / 性能", labelEn: "ML Infrastructure & Performance" },
    { id: "agent-engineering", labelZh: "Agent 工程", labelEn: "Agent Engineering" },
    { id: "backend-platform", labelZh: "后端 / 平台", labelEn: "Backend & Platform" },
    { id: "frontend-fullstack", labelZh: "前端 / 全栈", labelEn: "Frontend & Full Stack" },
    { id: "data-engineering", labelZh: "数据工程", labelEn: "Data Engineering" },
    { id: "growth-engineering", labelZh: "增长工程", labelEn: "Growth Engineering" },
    { id: "mobile", labelZh: "移动端", labelEn: "Mobile" },
    { id: "quality-security", labelZh: "质量 / 安全", labelEn: "Quality & Security" },
    { id: "simulation-graphics", labelZh: "仿真 / 图形", labelEn: "Simulation & Graphics" },
    { id: "embedded-systems", labelZh: "嵌入式 / 系统", labelEn: "Embedded & Systems" },
  ],
  product: [
    { id: "ai-consumer", labelZh: "AI 用户产品", labelEn: "AI Consumer Product" },
    { id: "agent-product", labelZh: "Agent 产品", labelEn: "Agent Product" },
    { id: "model-strategy", labelZh: "模型策略产品", labelEn: "Model Strategy Product" },
    { id: "growth-product", labelZh: "增长产品", labelEn: "Growth Product" },
    { id: "platform-enterprise", labelZh: "平台 / 企业产品", labelEn: "Platform & Enterprise Product" },
    { id: "trust-safety", labelZh: "Trust & Safety 产品", labelEn: "Trust & Safety Product" },
    { id: "creator-content", labelZh: "内容 / 创作工具", labelEn: "Content & Creative Tools" },
    { id: "hardware-product", labelZh: "智能硬件产品", labelEn: "Smart Hardware Product" },
    { id: "program-management", labelZh: "TPM / PMO", labelEn: "TPM & PMO" },
  ],
  design: [
    { id: "product-design", labelZh: "产品 / UI/UX", labelEn: "Product & UI/UX" },
    { id: "visual-brand", labelZh: "视觉 / 品牌", labelEn: "Visual & Brand" },
    { id: "ai-creative-design", labelZh: "AI 创意设计", labelEn: "AI Creative Design" },
    { id: "motion-3d", labelZh: "动效 / 3D", labelEn: "Motion & 3D" },
    { id: "design-system", labelZh: "设计系统", labelEn: "Design Systems" },
  ],
  marketing: [
    { id: "brand", labelZh: "品牌", labelEn: "Brand" },
    { id: "product-marketing", labelZh: "产品营销 / GTM", labelEn: "Product Marketing & GTM" },
    { id: "growth-performance", labelZh: "增长 / 投放", labelEn: "Growth & Performance" },
    { id: "pr-media", labelZh: "公关 / 媒体关系", labelEn: "PR & Media Relations" },
    { id: "social-creator", labelZh: "社媒 / KOL / 社区", labelEn: "Social, Creator & Community" },
    { id: "regional-global", labelZh: "区域 / 全球市场", labelEn: "Regional & Global Marketing" },
    { id: "content-seo", labelZh: "内容 / SEO", labelEn: "Content & SEO" },
  ],
  operations: [
    { id: "growth-operations", labelZh: "用户 / 增长运营", labelEn: "User & Growth Operations" },
    { id: "content-creator", labelZh: "内容 / 创作者运营", labelEn: "Content & Creator Operations" },
    { id: "community", labelZh: "社区 / 活动", labelEn: "Community & Events" },
    { id: "trust-policy", labelZh: "Trust & Safety / Policy", labelEn: "Trust & Safety / Policy" },
    { id: "regional-operations", labelZh: "海外 / 区域运营", labelEn: "Regional & Global Operations" },
    { id: "business-operations", labelZh: "业务 / 公司运营", labelEn: "Business & Company Operations" },
    { id: "data-delivery", labelZh: "数据运营 / 交付", labelEn: "Data Operations & Delivery" },
    { id: "ecommerce-monetization", labelZh: "电商 / 商业化", labelEn: "E-commerce & Monetization" },
  ],
  commercial: [
    { id: "business-development", labelZh: "商务拓展 / 生态合作", labelEn: "Business Development & Partnerships" },
    { id: "enterprise-sales", labelZh: "企业 / 大客户销售", labelEn: "Enterprise Sales" },
    { id: "customer-success", labelZh: "客户成功 / 客户运营", labelEn: "Customer Success" },
    { id: "regional-commercial", labelZh: "区域商业化", labelEn: "Regional Commercial" },
    { id: "procurement", labelZh: "采购 / 供应商合作", labelEn: "Procurement & Vendors" },
  ],
  hardware: [
    { id: "robotics", labelZh: "机器人 / 具身智能", labelEn: "Robotics & Embodied AI" },
    { id: "hardware-development", labelZh: "硬件研发 / 产品", labelEn: "Hardware Development & Product" },
    { id: "supply-chain", labelZh: "供应链 / 制造", labelEn: "Supply Chain & Manufacturing" },
    { id: "semiconductor", labelZh: "半导体 / 电子", labelEn: "Semiconductor & Electronics" },
    { id: "field-applications", labelZh: "FAE / 技术交付", labelEn: "FAE & Technical Delivery" },
  ],
  people: [
    { id: "recruiting", labelZh: "招聘 / 雇主品牌", labelEn: "Recruiting & Employer Brand" },
    { id: "hr-operations", labelZh: "HR / 组织发展", labelEn: "HR & Organization" },
    { id: "finance-legal", labelZh: "财务 / 法务 / 合规", labelEn: "Finance, Legal & Compliance" },
    { id: "corporate-functions", labelZh: "综合职能", labelEn: "Corporate Functions" },
  ],
  management: [
    { id: "ceo-general-manager", labelZh: "CEO / 总经理", labelEn: "CEO & General Management" },
    { id: "business-leadership", labelZh: "业务一号位", labelEn: "Business Leadership" },
  ],
};

export const SENIORITY_OPTIONS: Array<TaxonomyOption & { id: SeniorityId }> = [
  { id: "cxo", labelZh: "CXO / 创始级", labelEn: "CXO / Founding" },
  { id: "head", labelZh: "负责人 / Director", labelEn: "Head / Director" },
  { id: "manager", labelZh: "经理", labelEn: "Manager" },
  { id: "senior", labelZh: "资深 / 专家", labelEn: "Senior / Expert" },
  { id: "ic", labelZh: "专业岗位 / IC", labelEn: "Individual Contributor" },
];

export const WORK_MODE_OPTIONS: Array<TaxonomyOption & { id: WorkModeId }> = [
  { id: "remote", labelZh: "远程", labelEn: "Remote" },
  { id: "hybrid", labelZh: "混合办公", labelEn: "Hybrid" },
  { id: "onsite", labelZh: "办公室", labelEn: "On-site" },
  { id: "flexible", labelZh: "灵活 / 跨境", labelEn: "Flexible / Cross-border" },
  { id: "tbd", labelZh: "待确认", labelEn: "TBD" },
];

const functionAliases: Record<string, JobFunctionId> = {
  algorithm: "ai-algorithm",
  research: "ai-algorithm",
  engineering: "engineering",
  pm: "product",
  "product-design": "product",
  "mkt-growth": "marketing",
  operations: "operations",
  "bd-sales": "commercial",
  leadership: "management",
  cxo: "management",
};

const has = (text: string, patterns: string[]) => patterns.some((pattern) => text.includes(pattern));
const hasExecutiveTitle = (text: string, acronym: "ceo" | "cto" | "cmo") =>
  new RegExp(`(^|[^a-z])${acronym}([^a-z]|$)`, "i").test(text);
const pick = (options: TaxonomyOption[], id: string) => options.find((item) => item.id === id) || options[0];

function combined(job: Job): string {
  return [
    job.title,
    job.titleEn,
    job.jobType,
    job.jobTypeEn,
    job.location,
    job.locationEn,
    job.workMode,
    job.workModeEn,
    job.profile?.experience,
    job.profile?.experienceEn,
    ...(job.tags || []),
    ...(job.tagsEn || []),
    job.description,
    job.descriptionEn,
  ].filter(Boolean).join(" ").toLowerCase();
}

function titleText(job: Job): string {
  return `${job.title || ""} ${job.titleEn || ""}`.toLowerCase();
}

function inferFunction(job: Job): JobFunctionId {
  const title = titleText(job);
  const types = `${job.jobType || ""},${job.jobTypeEn || ""}`.toLowerCase().split(",").map((item) => item.trim());

  if (hasExecutiveTitle(title, "ceo") || has(title, ["首席执行官", "总经理", "general manager"])) return "management";
  if (hasExecutiveTitle(title, "cmo") || has(title, ["首席营销官"])) return "marketing";
  if (hasExecutiveTitle(title, "cto") || has(title, ["首席技术官"])) return "engineering";
  if (has(title, ["首席科学家", "chief scientist", "research scientist", "研究科学家"])) return "ai-algorithm";
  if (has(title, ["招聘", "recruit", "talent acquisition", "人力资源", "human resources"])) return "people";
  if (has(title, ["设计师", "designer", "product designer", "visual designer", "ui/ux", "ui designer", "ux designer", "设计负责人"])) return "design";
  if (has(title, ["产品运营", "product operations", "运营", "operations", "policy specialist", "triage"])) return "operations";
  if (has(title, ["产品经理", "product manager", "产品负责人", "product lead", "平台产品", "ai builder", "tpm", "pmo"])) return "product";
  if (has(title, ["算法", "machine learning", "ml performance", "world model", "generative model", "data scientist", "researcher"])) return "ai-algorithm";
  if (has(title, ["机器人", "robotics", "硬件", "hardware", "供应链", "manufacturing", "fae", "field application"])) return "hardware";
  if (has(title, ["工程师", "engineer", "developer", "开发", "架构师", "architect", "测试专家"])) return "engineering";
  if (has(title, ["销售", "sales", "商务", "business development", "account executive", "客户成功", "customer success", "采购专家", "partnership"])) return "commercial";
  if (has(title, ["市场", "marketing", "品牌", "brand", "增长负责人", "growth", "公关", "media relations", "社媒", "seo"])) return "marketing";

  for (const type of types) {
    if (functionAliases[type]) return functionAliases[type];
  }
  return "operations";
}

function inferSpecialty(job: Job, functionId: JobFunctionId): string {
  const text = combined(job);
  const title = titleText(job);

  if (functionId === "ai-algorithm") {
    if (has(text, ["运筹", "调度", "operations research", "供应链算法", "预测算法", "补贴定价"])) return "operations-research";
    if (has(text, ["推荐", "广告算法", "营销算法", "recommendation", "ranking", "搜广推"])) return "recommendation";
    if (has(text, ["world model", "世界模型", "vla", "embodied", "具身", "robotics", "机器人算法"])) return "world-models";
    if (has(text, ["computer vision", "图像算法", "视频生成", "视觉", "multimodal", "多模态", "3d generation"])) return "computer-vision";
    if (has(text, ["rlhf", "rlaif", "dpo", "reward", "奖励模型", "评测", "evaluation", "post-training", "训练数据"])) return "evaluation-training";
    if (has(text, ["agent", "模型策略", "prompt", "harness"])) return "agent-models";
    if (has(text, ["数据分析", "data analyst", "data science", "数据科学"])) return "data-science";
    return "foundation-models";
  }

  if (functionId === "engineering") {
    if (has(title, ["增长工程", "growth engineering"])) return "growth-engineering";
    if (has(title, ["ios", "android", "mobile", "移动端"])) return "mobile";
    if (has(text, ["simulation", "仿真", "render", "graphics", "图形", "game engine", "游戏引擎"])) return "simulation-graphics";
    if (has(text, ["ml infra", "ai infra", "infrastructure", "cluster", "训推", "性能优化", "ml performance"])) return "ml-infrastructure";
    if (has(text, ["agent harness", "agent 开发", "agent工程", "agent loop", "tool use", "mcp"])) return "agent-engineering";
    if (has(text, ["数据工程", "data engineer", "data acquisition", "数据管线", "pipeline"])) return "data-engineering";
    if (has(title, ["前端", "全栈", "frontend", "full stack", "fullstack"])) return "frontend-fullstack";
    if (has(text, ["qa", "测试", "security engineer", "安全工程", "quality"])) return "quality-security";
    if (has(text, ["firmware", "embedded", "嵌入式", "c++", "系统工程"])) return "embedded-systems";
    return "backend-platform";
  }

  if (functionId === "product") {
    if (has(title, ["tpm", "pmo", "项目经理", "program manager"])) return "program-management";
    if (has(text, ["trust & safety", "trust and safety", "安全治理", "申诉", "举报", "risk platform"])) return "trust-safety";
    if (has(title, ["模型策略", "model strategy"]) || has(text, ["奖励机制", "reward model", "testset", "模型评估", "rlhf", "rlaif"])) return "model-strategy";
    if (has(title, ["增长产品", "growth product"]) || has(text, ["裂变", "留存", "续订", "增长漏斗"])) return "growth-product";
    if (has(title, ["企业产品", "enterprise", "平台产品", "platform product", "中后台"]) || has(text, ["admin", "billing", "权限", "saas"])) return "platform-enterprise";
    if (has(text, ["硬件", "wearable", "智能硬件", "mass production", "evt", "dvt", "pvt"])) return "hardware-product";
    if (has(text, ["agent", "harness", "智能助手"])) return "agent-product";
    if (has(text, ["内容创作", "创意工具", "creator", "creative", "视频", "漫画", "互动玩法"])) return "creator-content";
    return "ai-consumer";
  }

  if (functionId === "design") {
    if (has(title, ["视觉", "品牌", "visual", "brand", "marketing designer"])) return "visual-brand";
    if (has(text, ["design system", "设计系统", "组件库"])) return "design-system";
    if (has(text, ["动效", "motion", "3d", "animation"])) return "motion-3d";
    if (has(text, ["aigc", "ai native", "ai-native", "生成式", "creative ai"])) return "ai-creative-design";
    return "product-design";
  }

  if (functionId === "marketing") {
    if (has(title, ["公关", "媒体关系", "pr ", "communications"])) return "pr-media";
    if (has(title, ["产品营销", "product marketing", "gtm"])) return "product-marketing";
    if (has(title, ["seo", "内容营销", "content marketing"])) return "content-seo";
    if (has(title, ["社交媒体", "社媒", "social media", "kol", "koc", "creator", "达人", "community"])) return "social-creator";
    if (has(title, ["全球", "海外", "区域", "北美", "美国", "global", "regional", "apac"])) return "regional-global";
    if (has(text, ["社交媒体", "社媒", "kol", "koc", "creator", "达人", "community"])) return "social-creator";
    if (has(text, ["投放", "performance", "paid ads", "用户增长", "获客", "增长", "roi", "cpi"])) return "growth-performance";
    return "brand";
  }

  if (functionId === "operations") {
    if (has(text, ["trust & safety", "trust and safety", "policy", "内容安全", "风控", "审核", "反作弊", "fraud"])) return "trust-policy";
    if (has(title, ["增长运营", "用户增长", "growth operations", "user growth"])) return "growth-operations";
    if (has(title, ["数据运营", "数据质量", "数据交付", "标注", "triage"]) || has(text, ["data operations", "data quality", "数据采集"])) return "data-delivery";
    if (has(text, ["创作者", "creator", "内容运营", "漫画内容", "达人运营"])) return "content-creator";
    if (has(text, ["社区", "活动运营", "community", "社群"])) return "community";
    if (has(text, ["海外", "全球", "区域", "international", "regional", "新加坡", "东南亚"])) return "regional-operations";
    if (has(text, ["变现", "电商", "gmv", "monetization", "e-commerce", "优惠运营"])) return "ecommerce-monetization";
    if (has(text, ["用户增长", "拉新", "留存", "增长运营", "growth operations"])) return "growth-operations";
    return "business-operations";
  }

  if (functionId === "commercial") {
    if (has(title, ["采购"]) || has(text, ["procurement", "供应商", "采买"])) return "procurement";
    if (has(title, ["客户成功", "客户运营", "customer success", "account manager"])) return "customer-success";
    if (has(title, ["大客户", "企业销售", "account executive", "sales", "销售"])) return "enterprise-sales";
    if (has(title, ["区域商业", "商业化负责人", "regional commercial"])) return "regional-commercial";
    return "business-development";
  }

  if (functionId === "hardware") {
    if (has(text, ["半导体", "wafer", "芯片", "semiconductor", "电子工程"])) return "semiconductor";
    if (has(title, ["fae", "现场应用", "field application", "技术交付"])) return "field-applications";
    if (has(text, ["供应链", "制造", "supplier", "manufacturing", "量产"])) return "supply-chain";
    if (has(text, ["机器人", "robotics", "具身", "embodied", "vla"])) return "robotics";
    return "hardware-development";
  }

  if (functionId === "people") {
    if (has(text, ["招聘", "recruit", "talent acquisition", "校招", "雇主品牌"])) return "recruiting";
    if (has(text, ["财务", "法务", "合规", "finance", "legal", "compliance"])) return "finance-legal";
    if (has(text, ["hr", "人力资源", "组织发展", "people operations"])) return "hr-operations";
    return "corporate-functions";
  }

  return has(title, ["ceo", "首席执行官", "总经理"]) ? "ceo-general-manager" : "business-leadership";
}

function inferSeniority(job: Job): SeniorityId {
  const title = titleText(job);
  if (hasExecutiveTitle(title, "ceo") || hasExecutiveTitle(title, "cto") || hasExecutiveTitle(title, "cmo") || has(title, ["chief ", "首席", "founder"])) return "cxo";
  if (has(title, ["负责人", "一号位", " head", "head ", "leader", "lead ", " director", "总监", "vp", "vice president"])) return "head";
  if (has(title, ["高级", "资深", "专家", "principal", "staff", "senior", "architect", "架构师"])) return "senior";
  if (has(title, ["经理", "manager"])) return "manager";
  return "ic";
}

function inferWorkMode(job: Job): WorkModeId {
  const text = `${job.workMode || ""} ${job.workModeEn || ""} ${job.location || ""} ${job.locationEn || ""}`.toLowerCase();
  const remote = has(text, ["remote", "远程", "eor"]);
  const onsite = has(text, ["on-site", "onsite", "办公室", "线下", "到岗"]);
  const hybrid = has(text, ["hybrid", "混合"]);
  if ((remote && onsite) || has(text, ["灵活", "flexible", "跨境"])) return "flexible";
  if (hybrid) return "hybrid";
  if (remote) return "remote";
  if (onsite) return "onsite";
  return "tbd";
}

export function inferJobTaxonomy(job: Job): JobTaxonomy {
  const functionId = inferFunction(job);
  const text = combined(job);
  return {
    functionId,
    specialtyId: inferSpecialty(job, functionId),
    seniorityId: inferSeniority(job),
    workModeId: inferWorkMode(job),
    priorityId: has(text, ["高优", "急招", "high priority", "urgent", "最高优先级"]) ? "high" : "normal",
  };
}

export function getFunctionOption(id?: string): (TaxonomyOption & { id: JobFunctionId }) | undefined {
  return JOB_FUNCTIONS.find((item) => item.id === id);
}

export function getSpecialtyOption(functionId: JobFunctionId, specialtyId?: string): TaxonomyOption | undefined {
  return JOB_SPECIALTIES[functionId].find((item) => item.id === specialtyId);
}

export function getSeniorityOption(id?: string): TaxonomyOption | undefined {
  return SENIORITY_OPTIONS.find((item) => item.id === id);
}

export function getWorkModeOption(id?: string): TaxonomyOption | undefined {
  return WORK_MODE_OPTIONS.find((item) => item.id === id);
}

export function normalizeFunctionParam(value?: string): JobFunctionId | undefined {
  if (!value) return undefined;
  if (JOB_FUNCTIONS.some((item) => item.id === value)) return value as JobFunctionId;
  return functionAliases[value];
}

export function taxonomySearchText(job: Job): string {
  const taxonomy = inferJobTaxonomy(job);
  const functionOption = getFunctionOption(taxonomy.functionId);
  const specialty = getSpecialtyOption(taxonomy.functionId, taxonomy.specialtyId);
  const seniority = getSeniorityOption(taxonomy.seniorityId);
  return [functionOption?.labelZh, functionOption?.labelEn, specialty?.labelZh, specialty?.labelEn, seniority?.labelZh, seniority?.labelEn]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function specialtyFor(functionId: JobFunctionId, specialtyId: string): TaxonomyOption {
  return pick(JOB_SPECIALTIES[functionId], specialtyId);
}
