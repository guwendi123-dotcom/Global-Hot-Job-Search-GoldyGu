const zhReplacements: Array<[RegExp, string]> = [
  [/OiiOii AI\s*动画创作工具/gi, "该 AI 动画创作工具"],
  [/MaxInsights/gi, "该公司"],
  [/MEXC Exchange/gi, "该交易平台"],
  [/MEXC/gi, "该交易平台"],
  [/Nirva/gi, "该公司"],
  [/#sudo R1/gi, "核心机器人系统"],
  [/#sudo/gi, "该机器人平台"],
  [/Sudo AI/gi, "该机器人平台"],
  [/\bSudo\b/gi, "该机器人平台"],
  [/Teamily AI/gi, "该 Personal AGI 产品"],
  [/OiiOii AI/gi, "该 AI 动画创作工具"],
  [/OiiOii/gi, "该 AI 动画创作工具"],
  [/Vord AI/gi, "该隐私 AI 对话平台"],
  [/\bVord\b/gi, "该隐私 AI 对话平台"],
];

const enReplacements: Array<[RegExp, string]> = [
  [/OiiOii's AI animation creation tool/gi, "the AI animation creation product"],
  [/MaxInsights/gi, "the company"],
  [/MEXC Exchange/gi, "the trading platform"],
  [/MEXC/gi, "the trading platform"],
  [/Nirva/gi, "the company"],
  [/#sudo R1/gi, "the core robotics system"],
  [/#sudo/gi, "the robotics platform"],
  [/Sudo AI/gi, "the robotics platform"],
  [/\bSudo\b/gi, "the robotics platform"],
  [/Teamily AI/gi, "the Personal AGI product"],
  [/OiiOii AI/gi, "the AI animation creation product"],
  [/OiiOii/gi, "the AI animation creation product"],
  [/Vord AI/gi, "the privacy-first AI chat platform"],
  [/\bVord\b/gi, "the privacy-first AI chat platform"],
];

function replaceAll(value: string | undefined, replacements: Array<[RegExp, string]>): string {
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value || "");
}

export function sanitizePublicJob<T extends { description?: string; descriptionEn?: string }>(job: T): T {
  return {
    ...job,
    description: replaceAll(job.description, zhReplacements),
    descriptionEn: replaceAll(job.descriptionEn, enReplacements),
  };
}
