"use client";

import { useEffect, useMemo, useState } from "react";
import "./style.css";

type Zone = { city: string; label: string; zone: string };
type Place = { query: string; zone: string; name: string; confirmed: boolean; latitude?: number; longitude?: number };
type Person = { role: string; place: Place; start: number; end: number; lunchStart: number; lunchEnd: number };

const ZONES: Zone[] = [
  { city: "上海", label: "上海 · 中国", zone: "Asia/Shanghai" },
  { city: "北京", label: "北京 · 中国", zone: "Asia/Shanghai" },
  { city: "香港", label: "香港", zone: "Asia/Hong_Kong" },
  { city: "新加坡", label: "新加坡", zone: "Asia/Singapore" },
  { city: "东京", label: "东京 · 日本", zone: "Asia/Tokyo" },
  { city: "首尔", label: "首尔 · 韩国", zone: "Asia/Seoul" },
  { city: "悉尼", label: "悉尼 · 澳大利亚", zone: "Australia/Sydney" },
  { city: "迪拜", label: "迪拜 · 阿联酋", zone: "Asia/Dubai" },
  { city: "孟买", label: "孟买 · 印度", zone: "Asia/Kolkata" },
  { city: "伦敦", label: "伦敦 · 英国", zone: "Europe/London" },
  { city: "巴黎", label: "巴黎 · 法国", zone: "Europe/Paris" },
  { city: "柏林", label: "柏林 · 德国", zone: "Europe/Berlin" },
  { city: "纽约", label: "纽约 · 美国", zone: "America/New_York" },
  { city: "多伦多", label: "多伦多 · 加拿大", zone: "America/Toronto" },
  { city: "芝加哥", label: "芝加哥 · 美国", zone: "America/Chicago" },
  { city: "洛杉矶", label: "洛杉矶 · 美国", zone: "America/Los_Angeles" },
  { city: "旧金山", label: "旧金山 · 美国", zone: "America/Los_Angeles" },
  { city: "温哥华", label: "温哥华 · 加拿大", zone: "America/Vancouver" },
];

const ROLES = ["候选人", "面试官", "HR", "猎头", "其他"];
const QUICK_LOCATIONS = ["中国", "日本", "巴西", "墨西哥", "美西", "美东", "英国", "卢森堡"];
const LOCATION_RULES: { keywords: string[]; zone: string; name: string }[] = [
  { keywords: ["sunnyvale", "美国湾区", "旧金山湾区", "湾区", "硅谷", "silicon valley", "san francisco bay area", "san jose", "圣何塞", "mountain view", "palo alto", "cupertino", "旧金山", "san francisco"], zone: "America/Los_Angeles", name: "美国湾区 / Sunnyvale" },
  { keywords: ["中国台湾", "台湾", "taiwan", "台北", "taipei", "高雄", "kaohsiung", "台中", "taichung", "新竹", "hsinchu"], zone: "Asia/Taipei", name: "中国台湾" },
  { keywords: ["马来西亚", "大马", "malaysia", "吉隆坡", "kuala lumpur", "槟城", "penang", "新山", "johor bahru"], zone: "Asia/Kuala_Lumpur", name: "马来西亚 / 吉隆坡" },
  { keywords: ["印度尼西亚", "印尼", "indonesia", "雅加达", "jakarta", "巴厘岛", "bali", "泗水", "surabaya"], zone: "Asia/Jakarta", name: "印度尼西亚 / 雅加达" },
  { keywords: ["卢森堡", "luxembourg"], zone: "Europe/Luxembourg", name: "卢森堡" },
  { keywords: ["中国", "中国时间", "上海", "北京", "china time", "beijing", "shanghai"], zone: "Asia/Shanghai", name: "中国 / 北京" },
  { keywords: ["纽约", "new york", "nyc", "美东", "美国东部"], zone: "America/New_York", name: "纽约" },
  { keywords: ["伦敦", "london", "英国", "uk"], zone: "Europe/London", name: "英国 / 伦敦" },
  { keywords: ["欧洲中部", "中欧", "central europe", "cet"], zone: "Europe/Berlin", name: "欧洲中部" },
  { keywords: ["巴西", "brazil", "圣保罗", "são paulo", "sao paulo", "里约"], zone: "America/Sao_Paulo", name: "巴西 / 圣保罗" },
  { keywords: ["墨西哥城", "mexico city", "墨西哥", "mexico"], zone: "America/Mexico_City", name: "墨西哥城" },
  { keywords: ["洛杉矶", "los angeles", "la", "美西", "美国西部", "西雅图", "seattle"], zone: "America/Los_Angeles", name: "美国西部" },
  { keywords: ["芝加哥", "chicago", "美国中部", "美中"], zone: "America/Chicago", name: "美国中部" },
  { keywords: ["美国山地", "美山", "mountain time", "denver", "丹佛"], zone: "America/Denver", name: "美国山地时间" },
  { keywords: ["多伦多", "toronto"], zone: "America/Toronto", name: "多伦多" },
  { keywords: ["温哥华", "vancouver"], zone: "America/Vancouver", name: "温哥华" },
  { keywords: ["巴黎", "paris", "法国"], zone: "Europe/Paris", name: "巴黎" },
  { keywords: ["柏林", "berlin", "德国"], zone: "Europe/Berlin", name: "柏林" },
  { keywords: ["东京", "tokyo", "日本"], zone: "Asia/Tokyo", name: "东京" },
  { keywords: ["新加坡", "singapore"], zone: "Asia/Singapore", name: "新加坡" },
  { keywords: ["香港", "hong kong"], zone: "Asia/Hong_Kong", name: "香港" },
  { keywords: ["悉尼", "sydney", "澳大利亚", "澳洲", "australia", "澳洲东部", "澳大利亚东部", "australia east"], zone: "Australia/Sydney", name: "澳大利亚 / 悉尼" },
  { keywords: ["迪拜", "dubai", "阿联酋"], zone: "Asia/Dubai", name: "迪拜" },
  { keywords: ["孟买", "mumbai", "印度", "india", "班加罗尔", "bengaluru", "bangalore"], zone: "Asia/Kolkata", name: "印度" },
];
const ZONE_COORDS: Record<string, [number, number]> = {
  "America/Los_Angeles": [37.37, -122.04], "Asia/Shanghai": [31.23, 121.47], "America/New_York": [40.71, -74.01],
  "Europe/London": [51.51, -0.13], "Europe/Berlin": [52.52, 13.41], "America/Sao_Paulo": [-23.55, -46.63],
  "America/Mexico_City": [19.43, -99.13], "America/Chicago": [41.88, -87.63], "America/Denver": [39.74, -104.99],
  "America/Toronto": [43.65, -79.38], "America/Vancouver": [49.28, -123.12], "Europe/Paris": [48.86, 2.35],
  "Asia/Tokyo": [35.68, 139.69], "Asia/Singapore": [1.35, 103.82], "Asia/Hong_Kong": [22.32, 114.17],
  "Asia/Taipei": [25.03, 121.57], "Asia/Kuala_Lumpur": [3.14, 101.69],
  "Asia/Jakarta": [-6.21, 106.85], "Europe/Luxembourg": [49.61, 6.13],
  "Australia/Sydney": [-33.87, 151.21], "Asia/Dubai": [25.20, 55.27], "Asia/Kolkata": [19.08, 72.88],
};

function resolvePreset(input: string) {
  const value = input.trim().toLowerCase();
  return LOCATION_RULES.find((rule) => rule.keywords.some((keyword) => value.includes(keyword.toLowerCase()))) || null;
}

async function resolveLocation(input: string): Promise<{ zone: string; name: string; latitude?: number; longitude?: number } | null> {
  const preset = resolvePreset(input);
  if (preset) { const coords = ZONE_COORDS[preset.zone]; return { zone: preset.zone, name: preset.name, latitude: coords?.[0], longitude: coords?.[1] }; }
  try {
    new Intl.DateTimeFormat("en", { timeZone: input.trim() }).format();
    return { zone: input.trim(), name: input.trim() };
  } catch {}
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input.trim())}&count=5&language=zh&format=json`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json() as { results?: Array<{ name: string; country?: string; admin1?: string; timezone: string; latitude?: number; longitude?: number }> };
    const best = data.results?.find((item) => item.timezone);
    if (!best) return null;
    const country = /^(Taiwan|台湾)$/i.test(best.country || "") ? "中国台湾" : best.country;
    return { zone: best.timezone, name: [best.name, best.admin1, country].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(" · "), latitude: best.latitude, longitude: best.longitude };
  } catch { return null; }
}

function parts(date: Date, zone: string) {
  const values = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short",
  }).formatToParts(date);
  return Object.fromEntries(values.map((p) => [p.type, p.value]));
}

function zoneName(date: Date, zone: string) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" }).formatToParts(date);
  return p.find((x) => x.type === "timeZoneName")?.value || zone;
}

function pretty(date: Date, zone: string, seconds = false) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: zone, month: "numeric", day: "numeric", weekday: "short",
    hour: "2-digit", minute: "2-digit", ...(seconds ? { second: "2-digit" } : {}), hourCycle: "h23",
  }).format(date).replace("星期", "周");
}

function englishRange(start: Date, end: Date | null, zone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  return end ? formatter.formatRange(start, end) : formatter.format(start);
}

function englishPlace(place: Place) {
  const names: Record<string, string> = {
    "Asia/Shanghai": "China", "Asia/Taipei": "Taiwan, China", "Asia/Tokyo": "Japan", "Asia/Kuala_Lumpur": "Malaysia",
    "Asia/Jakarta": "Indonesia", "America/Los_Angeles": "U.S. West Coast", "America/New_York": "U.S. East Coast",
    "Europe/London": "UK", "Europe/Luxembourg": "Luxembourg", "America/Sao_Paulo": "Brazil", "America/Mexico_City": "Mexico",
  };
  return names[place.zone] || place.zone.split("/").pop()?.replaceAll("_", " ") || place.query;
}

function localToUtc(year: number, month: number, day: number, hour: number, minute: number, zone: string) {
  let guess = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 3; i++) {
    const p = parts(new Date(guess), zone);
    const shown = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
    guess += Date.UTC(year, month - 1, day, hour, minute) - shown;
  }
  return new Date(guess);
}

function dateKeyAt(date: Date, zone: string) {
  const p = parts(date, zone);
  return `${p.year}-${p.month}-${p.day}`;
}

function minuteOfTime(value?: string) {
  if (!value) return 0;
  const time = value.split("T").pop() || value;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function skyPhase(date: Date, zone: string, solar: { sunrise: string; sunset: string } | null) {
  const p = parts(date, zone); const now = +p.hour * 60 + +p.minute;
  const rise = solar ? minuteOfTime(solar.sunrise) : 6 * 60;
  const set = solar ? minuteOfTime(solar.sunset) : 18 * 60;
  if (now < rise - 60 || now > set + 70) return { key: "night", label: "月夜", note: "当地已入夜" };
  if (now < rise - 20) return { key: "dawn", label: "朝霞", note: "日出前的晨光" };
  if (now <= rise + 25) return { key: "sunrise", label: "日出", note: `日出约 ${solar?.sunrise.split("T").pop() || "06:00"}` };
  if (now < rise + 120) return { key: "morning", label: "朝阳", note: "当地正值清晨" };
  if (now < set - 90) return { key: "day", label: "日间", note: "太阳正在天空中" };
  if (now < set - 25) return { key: "golden", label: "夕照", note: "接近当地日落" };
  if (now <= set + 25) return { key: "sunset", label: "日落", note: `日落约 ${solar?.sunset.split("T").pop() || "18:00"}` };
  return { key: "dusk", label: "暮色", note: "天空正在入夜" };
}

function parseNatural(input: string, zone: string) {
  const now = new Date();
  const todayParts = parts(now, zone);
  let base = new Date(Date.UTC(+todayParts.year, +todayParts.month - 1, +todayParts.day));
  const lower = input.trim().toLowerCase();
  if (/明天|tomorrow/.test(lower)) base.setUTCDate(base.getUTCDate() + 1);
  else if (/后天/.test(lower)) base.setUTCDate(base.getUTCDate() + 2);
  else {
    const md = lower.match(/(?:(\d{4})[年\-/])?(\d{1,2})[月\-/](\d{1,2})[日号]?/);
    if (md) base = new Date(Date.UTC(+(md[1] || todayParts.year), +md[2] - 1, +md[3]));
    else {
      const weekNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const wi = weekNames.findIndex((w) => lower.includes(w));
      if (wi >= 0) {
        let add = (wi - base.getUTCDay() + 7) % 7;
        if (add === 0 || lower.includes("下周")) add += 7;
        base.setUTCDate(base.getUTCDate() + add);
      }
    }
  }
  let hours = [...lower.matchAll(/(\d{1,2})(?::|点)(\d{1,2})?/g)].map((m) => ({ h: +m[1], m: +(m[2] || 0) }));
  if (!hours.length) {
    if (/上午|morning/.test(lower)) hours = [{ h: 9, m: 0 }, { h: 12, m: 0 }];
    else if (/下午|afternoon/.test(lower)) hours = [{ h: 13, m: 0 }, { h: 17, m: 0 }];
    else if (/晚上|evening/.test(lower)) hours = [{ h: 18, m: 0 }, { h: 21, m: 0 }];
  }
  if (/下午|晚上|pm/.test(lower)) hours = hours.map((x) => ({ ...x, h: x.h < 12 ? x.h + 12 : x.h }));
  if (!hours.length) return null;
  const y = base.getUTCFullYear(), mo = base.getUTCMonth() + 1, d = base.getUTCDate();
  const start = localToUtc(y, mo, d, hours[0].h, hours[0].m, zone);
  const end = hours[1] ? localToUtc(y, mo, d, hours[1].h, hours[1].m, zone) : null;
  return { start, end };
}

function LocationInput({ place, onChange, label, compact = false }: { place: Place; onChange: (place: Place) => void; label: string; compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function confirm(query = place.query) {
    if (!query.trim()) { setError("请先输入一个地点"); return; }
    setLoading(true); setError("");
    const match = await resolveLocation(query);
    setLoading(false);
    if (!match) { setError("暂时没找到这个地点，请补充城市或国家后再试"); return; }
    onChange({ query, zone: match.zone, name: match.name, confirmed: true, latitude: match.latitude, longitude: match.longitude });
  }
  return <div className={`field location-field ${compact ? "compact" : ""}`}><span>{label}</span><div className="location-input"><span>⌖</span><input value={place.query} onChange={(e) => { onChange({ ...place, query: e.target.value, confirmed: false }); setError(""); }} onKeyDown={(e) => e.key === "Enter" && confirm()} placeholder="输入城市、国家或地区，如 Sunnyvale、美国湾区" /><button type="button" onClick={() => confirm()} disabled={loading}>{loading ? "识别中" : "确定"}</button></div><div className={`resolved ${place.confirmed ? "ok" : error ? "warn" : "idle"}`}>{place.confirmed ? `✓ 已匹配：${place.name} · ${place.zone}` : error || "输入后点击确定，我来匹配正确时区"}</div>{!compact && <div className="quick-locations"><small>常用</small>{QUICK_LOCATIONS.map((item) => <button type="button" key={item} onClick={() => { onChange({ ...place, query: item, confirmed: false }); confirm(item); }}>{item}</button>)}</div>}</div>;
}

function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return <button className="copy" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>{done ? "已复制 ✓" : label}</button>;
}

export default function Home() {
  const [tab, setTab] = useState<"convert" | "meet" | "now">("convert");
  const [sourcePlace, setSourcePlace] = useState<Place>({ query: "纽约", zone: "America/New_York", name: "纽约 · 美国", confirmed: true, latitude: 40.71, longitude: -74.01 });
  const [targetPlaces, setTargetPlaces] = useState<Place[]>([{ query: "中国", zone: "Asia/Shanghai", name: "中国 / 北京", confirmed: true, latitude: 31.23, longitude: 121.47 }]);
  const [natural, setNatural] = useState("下周二下午3点到5点");
  const [parsed, setParsed] = useState<ReturnType<typeof parseNatural>>(null);
  const [parseError, setParseError] = useState("");
  const [nowPlace, setNowPlace] = useState<Place>({ query: "伦敦", zone: "Europe/London", name: "英国 / 伦敦", confirmed: true, latitude: 51.51, longitude: -0.13 });
  const [clock, setClock] = useState(new Date());
  const [people, setPeople] = useState<Person[]>([
    { role: "候选人", place: { query: "纽约", zone: "America/New_York", name: "纽约 · 美国", confirmed: true }, start: 9, end: 18, lunchStart: 12, lunchEnd: 13.5 },
    { role: "面试官", place: { query: "伦敦", zone: "Europe/London", name: "英国 / 伦敦", confirmed: true }, start: 9, end: 18, lunchStart: 12, lunchEnd: 13.5 },
  ]);
  const [duration, setDuration] = useState(45);
  const [candidateName, setCandidateName] = useState("候选人");
  const [candidateNameDraft, setCandidateNameDraft] = useState("候选人");
  const [nameConfirmed, setNameConfirmed] = useState(true);
  const [messageFor, setMessageFor] = useState("候选人");
  const [messageLanguage, setMessageLanguage] = useState<"中文" | "English">("中文");
  const [candidateScenario, setCandidateScenario] = useState<"询问是否方便" | "提醒查收">("询问是否方便");
  const [calculatedAt, setCalculatedAt] = useState(0);
  const [meetError, setMeetError] = useState("");
  const [solar, setSolar] = useState<{ sunrise: string; sunset: string } | null>(null);

  useEffect(() => { const id = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!nowPlace.confirmed || nowPlace.latitude == null || nowPlace.longitude == null) { setSolar(null); return; }
    let active = true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${nowPlace.latitude}&longitude=${nowPlace.longitude}&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
    fetch(url).then((r) => r.json()).then((data: { daily?: { sunrise?: string[]; sunset?: string[] } }) => {
      if (active && data.daily?.sunrise?.[0] && data.daily?.sunset?.[0]) setSolar({ sunrise: data.daily.sunrise[0], sunset: data.daily.sunset[0] });
    }).catch(() => active && setSolar(null));
    return () => { active = false; };
  }, [nowPlace]);

  const convertRows = parsed ? [sourcePlace, ...targetPlaces].map((place, i) => ({
    place,
    zone: place.zone, role: i === 0 ? "原始时间" : `目标地点 ${i}`,
    start: pretty(parsed.start, place.zone), end: parsed.end ? pretty(parsed.end, place.zone) : "",
    abbr: zoneName(parsed.start, place.zone), dateKey: dateKeyAt(parsed.start, place.zone),
  })) : [];

  const suggestions = useMemo(() => {
    if (!calculatedAt) return [];
    const result: { date: Date; score: number; kind: "优选" | "次选"; detail: string }[] = [];
    const base = new Date(); base.setUTCMinutes(Math.ceil(base.getUTCMinutes() / 30) * 30, 0, 0);
    for (let i = 0; i < 7 * 48; i++) {
      const slot = new Date(base.getTime() + i * 30 * 60000);
      const end = new Date(slot.getTime() + duration * 60000);
      const local = people.map((p) => {
        const a = parts(slot, p.place.zone), b = parts(end, p.place.zone);
        const h1 = +a.hour + +a.minute / 60, h2 = +b.hour + +b.minute / 60;
        const weekday = new Intl.DateTimeFormat("en-US", { timeZone: p.place.zone, weekday: "short" }).format(slot);
        const businessDay = !["Sat", "Sun"].includes(weekday);
        const overlapsLunch = h1 < p.lunchEnd && h2 > p.lunchStart;
        return { work: h1 >= p.start && h2 <= p.end && businessDay && !overlapsLunch, awake: h1 >= 7 && h2 <= 22, businessDay, overlapsLunch, h1, role: p.role };
      });
      if (!local.every((x) => x.awake && x.businessDay && !x.overlapsLunch)) continue;
      const allWork = local.every((x) => x.work);
      let score = local.reduce((s, x) => s + (x.work ? 30 : 0) - Math.abs(x.h1 - 13) * 0.7, 0);
      if (allWork) score += 100;
      if (local.some((x) => x.role === "候选人" && (x.h1 < 8 || x.h1 >= 20))) score -= 18;
      if (slot.getTime() < Date.now() + 2 * 3600000) score -= 50;
      result.push({ date: slot, score, kind: allWork ? "优选" : "次选", detail: allWork ? "共同工作时间 · 已避开所有人的午休" : "正常清醒时间 · 已避开午休与周末" });
    }
    function choose(kind: "优选" | "次选") {
      const chosen: typeof result = [];
      for (const item of result.filter((x) => x.kind === kind).sort((a, b) => b.score - a.score)) {
        if (chosen.every((x) => Math.abs(x.date.getTime() - item.date.getTime()) >= 3 * 3600000)) chosen.push(item);
        if (chosen.length === 3) break;
      }
      return chosen;
    }
    return [...choose("优选"), ...choose("次选")];
  }, [people, duration, calculatedAt]);

  const sourceTimeText = convertRows[0] ? `${convertRows[0].start}${convertRows[0].end ? ` 至 ${convertRows[0].end}` : ""}` : "待转换时间";
  const targetTimeText = convertRows[1] ? `${convertRows[1].start}${convertRows[1].end ? ` 至 ${convertRows[1].end}` : ""}` : "待转换时间";
  const sourceTimeWithPlace = `${sourceTimeText}（${sourcePlace.name}时间）`;
  const targetTimeWithPlace = `${targetTimeText}（${targetPlaces[0]?.name || "目标地点"}时间）`;
  const sourceTimeEnglish = parsed ? `${englishRange(parsed.start, parsed.end, sourcePlace.zone)} (${englishPlace(sourcePlace)}, ${zoneName(parsed.start, sourcePlace.zone)})` : "Time TBD";
  const targetTimeEnglish = parsed && targetPlaces[0] ? `${englishRange(parsed.start, parsed.end, targetPlaces[0].zone)} (${englishPlace(targetPlaces[0])}, ${zoneName(parsed.start, targetPlaces[0].zone)})` : "Time TBD";
  const messages: Record<string, Record<string, string>> = {
    中文: {
      候选人: candidateScenario === "询问是否方便"
        ? `您好 ${candidateName} 👋 面试官方便安排面试的时间为 ${sourceTimeWithPlace}，换算成您所在地时间为 ${targetTimeWithPlace}。请问这个时间您是否方便参加？如果不方便，也可以告诉我您合适的时间，我们再帮您协调 😊`
        : `您好 ${candidateName} 👋 您的面试时间已经敲定为 ${targetTimeWithPlace}。面试通知稍后会发送给您，辛苦留意查收，并及时确认面试信息。如未收到也请告诉我们，我们会帮您跟进 😊`,
      HR: `您好 👋 ${candidateName}方便参加面试的时间为 ${sourceTimeWithPlace}，对应面试官所在地时间为 ${targetTimeWithPlace}。辛苦协助协调面试官的时间安排；时间敲定后也请同步我们，我们会及时提醒候选人查收并确认面试安排，谢谢 🙏`,
      面试官: `您好 👋 ${candidateName}方便参加面试的时间为 ${sourceTimeWithPlace}，对应您所在地时间为 ${targetTimeWithPlace}。请问这个时间是否方便？如需调整，也可以提供合适的时间段，我们再与候选人协调，谢谢 😊`,
    },
    English: {
      候选人: candidateScenario === "询问是否方便"
        ? `Hi ${candidateName} 👋 The interviewer is available at ${sourceTimeEnglish}. This is ${targetTimeEnglish} for you. Does this slot work? If not, please share a few suitable slots and we'll coordinate 😊`
        : `Hi ${candidateName} 👋 Your interview is confirmed for ${targetTimeEnglish}. Please check the invite and confirm the details. If it doesn't arrive, let us know and we'll follow up 😊`,
      HR: `Hi 👋 ${candidateName} is available at ${sourceTimeEnglish}, equivalent to ${targetTimeEnglish} for the interviewer. Please help align with the interviewer's schedule and keep us posted once confirmed. We'll remind the candidate to check the invite. Thanks 🙏`,
      面试官: `Hi 👋 ${candidateName} is available at ${sourceTimeEnglish}, equivalent to ${targetTimeEnglish} for you. Does this slot work? If not, please share a few alternatives and we'll coordinate with the candidate 😊`,
    },
  };
  const currentSky = skyPhase(clock, nowPlace.zone, solar);

  function runParse() {
    if (!sourcePlace.confirmed || targetPlaces.some((x) => !x.confirmed)) { setParseError("请先点击地点旁的“确定”，让我完成时区匹配。"); setParsed(null); return; }
    const value = parseNatural(natural, sourcePlace.zone);
    if (!value) { setParseError("暂时没有识别出时间，请输入日期或星期以及具体时间。"); setParsed(null); }
    else { setParsed(value); setParseError(""); }
  }

  return <main>
    <header className="site-head"><a className="brand" href="https://www.goldyhire.com"><span className="brand-mark">G</span><span>GoldyHire</span></a><a className="back" href="https://www.goldyhire.com">返回官网 ↗</a></header>
    <section className="hero">
      <div className="eyebrow"><span>✦</span> GLOBAL HIRING UTILITY</div>
      <h1>时界 <em>AI</em></h1>
      <p>跨国面试时间，一次算准。</p>
    </section>
    <section className="tool-shell">
      <nav className="tabs" aria-label="功能切换">
        <button className={tab === "convert" ? "active" : ""} onClick={() => setTab("convert")}>时间转换</button>
        <button className={tab === "meet" ? "active" : ""} onClick={() => setTab("meet")}>共同时间</button>
        <button className={tab === "now" ? "active" : ""} onClick={() => setTab("now")}>现在几点</button>
      </nav>

      {tab === "convert" && <div className="panel two-col">
        <div className="form-card">
          <div className="step">01 · 输入时间</div>
          <LocationInput label="原始地点" place={sourcePlace} onChange={setSourcePlace} />
          <label className="field"><span>日期和时间</span><input value={natural} onChange={(e) => setNatural(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runParse()} placeholder="如：下周二下午3点到5点" /></label>
          <div className="examples">支持“明天下午”、“周五晚上8点”及时间段</div>
          {targetPlaces.map((place, i) => <LocationInput key={i} label={i === 0 ? "转换到" : `目标地点 ${i + 1}`} place={place} onChange={(next) => setTargetPlaces(targetPlaces.map((x, j) => j === i ? next : x))} />)}
          <div className="form-actions"><button className="primary" onClick={runParse}>立即转换 <span>→</span></button><button className="text-button" onClick={() => setTargetPlaces([...targetPlaces, { query: "", zone: "UTC", name: "", confirmed: false }])}>＋ 添加地点</button></div>
          {parseError && <p className="error">{parseError}</p>}
        </div>
        <div className="result-card">
          <div className="step">02 · 转换结果</div>
          {!parsed ? <div className="empty"><div className="orbit">⌁</div><p>结果将在这里出现</p></div> : <>
            <div className="result-list">{convertRows.map((row, i) => <div className={`result-row ${i === 0 ? "muted" : ""}`} key={`${row.zone}-${i}`}><div><span>{row.role}</span><strong>{row.place.name}</strong></div><div className="time"><b>{row.start}</b>{row.end && <small>至 {row.end}</small>}<i>{row.abbr}</i></div></div>)}</div>
            {convertRows[1] && convertRows[0].dateKey !== convertRows[1].dateKey && <div className="notice">跨日提醒：目标地点已是另一天，请同时确认日期和星期。</div>}
            <CopyButton label="复制转换结果" text={convertRows.map((x) => `${x.role} · ${x.start}${x.end ? ` 至 ${x.end}` : ""}（${x.place.name}时间 · ${x.abbr}）`).join("\n")} />
          </>}
        </div>
      </div>}

      {tab === "meet" && <div className="panel meet-layout">
        <div className="form-card">
          <div className="step">参与人和工作时间</div>
          <div className="people-grid">{people.map((p, idx) => <div className="person" key={idx}>
            <div className="person-head"><b>参与人 {idx + 1}</b>{people.length > 2 && <button onClick={() => setPeople(people.filter((_, i) => i !== idx))}>移除</button>}</div>
            <div className="compact-row"><label className="role-field"><span>身份</span><select value={p.role} onChange={(e) => setPeople(people.map((x, i) => i === idx ? { ...x, role: e.target.value } : x))}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></label><LocationInput compact label="所在地" place={p.place} onChange={(place) => setPeople(people.map((x, i) => i === idx ? { ...x, place } : x))} /></div>
            <div className="hours"><span>工作时间</span><input type="number" min="0" max="23" value={p.start} onChange={(e) => setPeople(people.map((x, i) => i === idx ? { ...x, start: +e.target.value } : x))} />:<span>00</span><i>—</i><input type="number" min="1" max="24" value={p.end} onChange={(e) => setPeople(people.map((x, i) => i === idx ? { ...x, end: +e.target.value } : x))} />:<span>00</span></div>
            <div className="hours lunch"><span>避开午休</span><input type="number" min="10" max="15" step="0.5" value={p.lunchStart} onChange={(e) => setPeople(people.map((x, i) => i === idx ? { ...x, lunchStart: +e.target.value } : x))} /><i>—</i><input type="number" min="11" max="16" step="0.5" value={p.lunchEnd} onChange={(e) => setPeople(people.map((x, i) => i === idx ? { ...x, lunchEnd: +e.target.value } : x))} /><small>（13.5 = 13:30）</small></div>
          </div>)}</div>
          <button className="text-button add-person" onClick={() => setPeople([...people, { role: "HR", place: { query: "", zone: "UTC", name: "", confirmed: false }, start: 9, end: 18, lunchStart: 12, lunchEnd: 13.5 }])}>＋ 添加参与人</button>
          <label className="field"><span>面试时长</span><select value={duration} onChange={(e) => setDuration(+e.target.value)}><option value="30">30分钟</option><option value="45">45分钟</option><option value="60">60分钟</option><option value="90">90分钟</option></select></label>
          <button className="primary calculate" onClick={() => { const invalid = people.some((p) => !p.place.confirmed); if (invalid) { setMeetError("请先点击每个地点旁的“确定”，完成时区匹配。"); return; } setMeetError(""); setCalculatedAt(Date.now()); }}>开始计算共同时间 <span>→</span></button>
          {meetError && <p className="error">{meetError}</p>}
        </div>
        <div className="result-card recommendations">
          <div className="step">未来7天推荐</div>
          <div className="legend"><span><i className="dot good" />优选 · 共同工作时间</span><span><i className="dot okay" />次选 · 正常清醒时间</span></div>
          {!calculatedAt ? <div className="empty compact-empty"><div className="orbit">⌁</div><p>设置好参与人后，点击“开始计算”</p></div> : <div className="suggestions">{suggestions.map((s, i) => <article key={s.date.toISOString()}>
            <div className="suggest-head"><span className={s.kind === "优选" ? "tag good" : "tag okay"}>{s.kind} {i + 1}</span><small>{s.detail}</small></div>
            {people.map((p, pi) => <div className="suggest-row" key={pi}><span>{p.role} · {p.place.name}</span><b>{pretty(s.date, p.place.zone)}–{new Intl.DateTimeFormat("zh-CN", { timeZone: p.place.zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(s.date.getTime() + duration * 60000))}</b><i>{zoneName(s.date, p.place.zone)}</i></div>)}
            <CopyButton text={people.map((p) => `${p.role} · ${p.place.name}：${pretty(s.date, p.place.zone)}–${new Intl.DateTimeFormat("zh-CN", { timeZone: p.place.zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(s.date.getTime() + duration * 60000))}（${p.place.name}时间 · ${zoneName(s.date, p.place.zone)}）`).join("\n")} />
          </article>)}</div>}
        </div>
      </div>}

      {tab === "now" && <div className="panel now-panel">
        <div className="form-card"><div className="step">查询地点</div><LocationInput label="城市、国家、地区或时区" place={nowPlace} onChange={setNowPlace} /><p className="examples">可以输入 Sunnyvale、美国湾区、São Paulo、某个国家或常用时区。</p></div>
        <div className={`clock-card sky-scene phase-${currentSky.key}`}>
          <div className="stars"><i /><i /><i /><i /><i /><i /></div><div className="celestial"><span className="sun" /><span className="moon" /></div><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="sky-glow" /><div className="horizon"><i /><i /><i /><i /><i /></div>
          <div className="sky-content"><div className="sky-label">{currentSky.label}<small>{currentSky.note}</small></div><div className="clock-city">{nowPlace.confirmed ? nowPlace.name : "等待确认地点"}</div>{nowPlace.confirmed ? <><div className="clock-time">{new Intl.DateTimeFormat("zh-CN", { timeZone: nowPlace.zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(clock)}</div><div className="clock-date">{pretty(clock, nowPlace.zone)} · {zoneName(clock, nowPlace.zone)}</div>{(() => { const h = +parts(clock, nowPlace.zone).hour; return <div className={`availability ${h >= 9 && h < 18 ? "open" : "closed"}`}>{h >= 9 && h < 18 ? "通常适合工作联系" : h >= 7 && h < 22 ? "当地处于正常清醒时间" : "当地可能处于休息时间"}</div>; })()}</> : <div className="clock-help">输入地点并点击“确定”后显示当地时间</div>}</div>
        </div>
      </div>}
    </section>

    {tab === "convert" && <section className="message-card">
      <div><div className="step">沟通话术</div><h2>转换完成，顺手发出去。</h2></div>
      <div className="message-controls"><label>语言<select value={messageLanguage} onChange={(e) => setMessageLanguage(e.target.value as "中文" | "English")}><option>中文</option><option>English</option></select></label><label>发送给<select value={messageFor} onChange={(e) => setMessageFor(e.target.value)}><option>候选人</option><option>HR</option><option>面试官</option></select></label>{messageFor === "候选人" && <label>候选人场景<select value={candidateScenario} onChange={(e) => setCandidateScenario(e.target.value as "询问是否方便" | "提醒查收")}><option>询问是否方便</option><option>提醒查收</option></select></label>}<label className="name-confirm">候选人姓名<div><input value={candidateNameDraft} onChange={(e) => { setCandidateNameDraft(e.target.value); setNameConfirmed(false); }} /><button onClick={() => { setCandidateName(candidateNameDraft.trim() || "候选人"); setNameConfirmed(true); }}>确定</button></div><small>{nameConfirmed ? `已使用：${candidateName}` : "修改后点击确定生成新版本"}</small></label></div>
      <div className="message-box"><p>{messages[messageLanguage][messageFor]}</p><CopyButton text={messages[messageLanguage][messageFor]} label="复制话术" /></div>
    </section>}
    <footer><span>时界 AI · by GoldyHire</span><p>时间依据地点及具体日期自动计算。发送面试安排前，请确认参与人的常驻地点。</p></footer>
  </main>;
}
