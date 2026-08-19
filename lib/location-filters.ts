import type { Job } from "@/lib/data";

export interface LocationOption {
  id: string;
  labelZh: string;
  labelEn: string;
  keywords: string[];
  excludeKeywords?: string[];
}

export interface LocationGroup {
  id: string;
  labelZh: string;
  labelEn: string;
  options: LocationOption[];
}

const westCoastKeywords = [
  "旧金山", "湾区", "sanfrancisco", "bayarea", "paloalto", "sunnyvale",
  "sanjose", "圣何塞", "sancarlos", "fremont", "山景城", "mountainview",
  "洛杉矶", "losangeles", "西雅图", "seattle",
];

const eastCoastKeywords = [
  "纽约", "newyork", "nyc", "波士顿", "boston", "华盛顿dc", "washingtondc",
];

export const LOCATION_GROUPS: LocationGroup[] = [
  {
    id: "china-mainland",
    labelZh: "中国大陆",
    labelEn: "Mainland China",
    options: [
      { id: "shanghai", labelZh: "上海", labelEn: "Shanghai", keywords: ["上海", "shanghai"] },
      { id: "beijing", labelZh: "北京", labelEn: "Beijing", keywords: ["北京", "beijing"] },
      { id: "shenzhen", labelZh: "深圳", labelEn: "Shenzhen", keywords: ["深圳", "shenzhen"] },
      { id: "hangzhou", labelZh: "杭州", labelEn: "Hangzhou", keywords: ["杭州", "hangzhou"] },
      { id: "guangzhou", labelZh: "广州", labelEn: "Guangzhou", keywords: ["广州", "guangzhou"] },
    ],
  },
  {
    id: "us-west",
    labelZh: "美国西部",
    labelEn: "US West",
    options: [
      {
        id: "sf-bay-area",
        labelZh: "旧金山湾区",
        labelEn: "SF Bay Area",
        keywords: [
          "旧金山", "湾区", "sanfrancisco", "bayarea", "paloalto", "sunnyvale",
          "sanjose", "圣何塞", "sancarlos", "fremont", "山景城", "mountainview",
        ],
      },
      { id: "los-angeles", labelZh: "洛杉矶", labelEn: "Los Angeles", keywords: ["洛杉矶", "losangeles"] },
      { id: "seattle", labelZh: "西雅图", labelEn: "Seattle", keywords: ["西雅图", "seattle"] },
    ],
  },
  {
    id: "us-east",
    labelZh: "美国东部",
    labelEn: "US East",
    options: [
      { id: "new-york", labelZh: "纽约", labelEn: "New York", keywords: ["纽约", "newyork", "nyc"] },
      { id: "boston", labelZh: "波士顿", labelEn: "Boston", keywords: ["波士顿", "boston"] },
      { id: "washington-dc", labelZh: "华盛顿 DC", labelEn: "Washington, DC", keywords: ["华盛顿dc", "washingtondc"] },
    ],
  },
  {
    id: "us-other",
    labelZh: "美国其他 / Remote",
    labelEn: "Other US / Remote",
    options: [
      {
        id: "us-flexible",
        labelZh: "美国不限城市 / Remote",
        labelEn: "US Flexible / Remote",
        keywords: ["美国", "北美", "unitedstates", "usa", "usremote", "northamerica"],
        excludeKeywords: [...westCoastKeywords, ...eastCoastKeywords],
      },
    ],
  },
  {
    id: "hong-kong",
    labelZh: "香港",
    labelEn: "Hong Kong",
    options: [
      { id: "hong-kong", labelZh: "香港", labelEn: "Hong Kong", keywords: ["香港", "hongkong"] },
    ],
  },
  {
    id: "singapore",
    labelZh: "新加坡",
    labelEn: "Singapore",
    options: [
      { id: "singapore", labelZh: "新加坡", labelEn: "Singapore", keywords: ["新加坡", "singapore"] },
    ],
  },
  {
    id: "asia-other",
    labelZh: "亚洲及中东其他",
    labelEn: "Other Asia & Middle East",
    options: [
      { id: "japan", labelZh: "东京 / 日本", labelEn: "Tokyo / Japan", keywords: ["东京", "日本", "tokyo", "japan"] },
      { id: "seoul", labelZh: "首尔", labelEn: "Seoul", keywords: ["首尔", "seoul"] },
      { id: "kuala-lumpur", labelZh: "吉隆坡", labelEn: "Kuala Lumpur", keywords: ["吉隆坡", "kualalumpur"] },
      { id: "abu-dhabi", labelZh: "阿布扎比", labelEn: "Abu Dhabi", keywords: ["阿布扎比", "abudhabi"] },
      { id: "apac-flexible", labelZh: "亚太其他 / 不限城市", labelEn: "Other APAC / Flexible", keywords: ["亚太", "apac"] },
    ],
  },
  {
    id: "global-remote",
    labelZh: "全球 / Remote",
    labelEn: "Global / Remote",
    options: [
      { id: "remote", labelZh: "全球 / Remote", labelEn: "Global / Remote", keywords: ["全球", "remote", "远程"] },
    ],
  },
  {
    id: "other",
    labelZh: "其他 / 待确认",
    labelEn: "Other / TBD",
    options: [
      { id: "tbd", labelZh: "其他 / 待确认", labelEn: "Other / TBD", keywords: ["待确认", "tbd", "tbc"] },
    ],
  },
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s·,，/()（）.\-]/g, "");
}

export function getJobLocationText(job: Pick<Job, "location" | "locationEn">): string {
  return normalize(`${job.location || ""} ${job.locationEn || ""}`);
}

export function optionMatchesLocation(text: string, option: LocationOption): boolean {
  const matches = option.keywords.some((keyword) => text.includes(normalize(keyword)));
  if (!matches) return false;
  return !(option.excludeKeywords || []).some((keyword) => text.includes(normalize(keyword)));
}

export function jobMatchesLocation(job: Pick<Job, "location" | "locationEn">, groupId?: string, optionId?: string): boolean {
  if (!groupId) return true;
  const group = LOCATION_GROUPS.find((item) => item.id === groupId);
  if (!group) return true;
  const text = getJobLocationText(job);
  if (group.id === "other" && !text) return true;
  if (optionId) {
    const option = group.options.find((item) => item.id === optionId);
    return option ? optionMatchesLocation(text, option) : true;
  }
  return group.options.some((option) => optionMatchesLocation(text, option));
}

export function getLocationGroup(groupId?: string): LocationGroup | undefined {
  return LOCATION_GROUPS.find((item) => item.id === groupId);
}
