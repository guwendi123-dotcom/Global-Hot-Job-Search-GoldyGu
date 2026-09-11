"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BriefcaseBusiness, Building2, Check, ChevronRight, CircleAlert,
  ExternalLink, FilePenLine, Filter, LockKeyhole, MapPin, Save, Search, Sparkles,
  UsersRound, X,
} from "lucide-react";
import type { Company, Job } from "@/lib/data";
import {
  getFunctionOption, getSeniorityOption, getSpecialtyOption, inferJobTaxonomy,
  JOB_FUNCTIONS,
} from "@/lib/job-taxonomy";

type Identity = { companyId: string; realName: string };
type RoleProfile = {
  jobId: string;
  internalCompanyName?: string;
  publicJobTitle?: string;
  priority?: "high" | "medium" | "normal" | "paused";
  hc?: string;
  compensation?: string;
  reportingLine?: string;
  teamScope?: string;
  confirmedScope?: string;
  sourcingAgentMustHave?: string;
  targetBackgrounds?: string[];
  excludedBackgrounds?: string[];
  matchingPriority?: string[];
  secondaryValue?: string[];
  doNotOverweight?: string[];
  hardConstraints?: string[];
  lastAlignedAt?: string;
  internalNotes?: string;
  similarJobIds?: string[];
};

const emptyProfile = (jobId: string): RoleProfile => ({
  jobId,
  priority: "normal",
  targetBackgrounds: [], excludedBackgrounds: [], matchingPriority: [], secondaryValue: [],
  doNotOverweight: [], hardConstraints: [], similarJobIds: [],
});

const priorityLabels = { high: "高优 / 急招", medium: "重点关注", normal: "常规", paused: "暂停" };
const lines = (value?: string[]) => (value || []).join("\n");
const splitLines = (value: string) => value.split(/\n|[,，]/).map((item) => item.trim()).filter(Boolean);

export default function SourcingWorkbenchPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [profiles, setProfiles] = useState<RoleProfile[]>([]);
  const [query, setQuery] = useState("");
  const [functionId, setFunctionId] = useState("");
  const [profileState, setProfileState] = useState("all");
  const [priority, setPriority] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RoleProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/jobs", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/admin/companies", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/admin/company-identities", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/admin/role-profiles", { cache: "no-store" }).then((response) => response.json()),
    ]).then(([jobData, companyData, identityData, profileData]) => {
      const nextJobs = jobData.jobs || [];
      setJobs(nextJobs);
      setCompanies(companyData.companies || []);
      setIdentities(identityData.identities || []);
      setProfiles(profileData.roleProfiles || []);
      setSelectedId(nextJobs[0]?.id || "");
    });
  }, []);

  const companyFor = (job?: Job) => companies.find((item) => item.id === job?.companyId);
  const identityFor = (job?: Job) => identities.find((item) => item.companyId === job?.companyId)?.realName;
  const profileFor = (jobId?: string) => profiles.find((item) => item.jobId === jobId);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const taxonomy = inferJobTaxonomy(job);
    const company = companies.find((item) => item.id === job.companyId);
    const identity = identities.find((item) => item.companyId === job.companyId)?.realName;
    const profile = profiles.find((item) => item.jobId === job.id);
    const text = [job.title, job.titleEn, company?.name, company?.nameEn, identity, job.location, job.locationEn, profile?.confirmedScope, profile?.sourcingAgentMustHave, ...(profile?.targetBackgrounds || [])].filter(Boolean).join(" ").toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (!functionId || taxonomy.functionId === functionId)
      && (profileState === "all" || (profileState === "complete" ? Boolean(profile) : !profile))
      && (!priority || (profile?.priority || "normal") === priority);
  }), [jobs, companies, identities, profiles, query, functionId, profileState, priority]);

  useEffect(() => {
    if (filteredJobs.length && !filteredJobs.some((job) => job.id === selectedId)) setSelectedId(filteredJobs[0].id);
  }, [filteredJobs, selectedId]);

  const selectedJob = jobs.find((job) => job.id === selectedId);
  const selectedProfile = profileFor(selectedId);
  const selectedCompany = companyFor(selectedJob);
  const selectedIdentity = identityFor(selectedJob);
  const selectedTaxonomy = selectedJob ? inferJobTaxonomy(selectedJob) : null;

  const similarJobs = useMemo(() => {
    if (!selectedJob || !selectedTaxonomy) return [];
    const explicit = selectedProfile?.similarJobIds || [];
    const score = (job: Job) => {
      const taxonomy = inferJobTaxonomy(job);
      let value = 0;
      if (taxonomy.functionId === selectedTaxonomy.functionId) value += 3;
      if (taxonomy.specialtyId === selectedTaxonomy.specialtyId) value += 5;
      if (taxonomy.seniorityId === selectedTaxonomy.seniorityId) value += 1;
      if (job.location && selectedJob.location && (job.location.includes(selectedJob.location) || selectedJob.location.includes(job.location))) value += 1;
      if (explicit.includes(job.id)) value += 20;
      return value;
    };
    return jobs.filter((job) => job.id !== selectedJob.id).map((job) => ({ job, score: score(job) })).filter((item) => item.score >= 5).sort((a, b) => b.score - a.score).slice(0, 6).map((item) => item.job);
  }, [jobs, selectedJob, selectedProfile, selectedTaxonomy]);

  const startEdit = () => {
    if (!selectedJob) return;
    setDraft(structuredClone(selectedProfile || emptyProfile(selectedJob.id)));
    setEditing(true);
    setMessage("");
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/role-profiles", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setProfiles((current) => [...current.filter((item) => item.jobId !== draft.jobId), data.profile]);
      setEditing(false);
      setMessage("私密画像已保存，仅登录后可见。");
    } else setMessage(data.error || "保存失败");
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#f6f2eb]">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-[1500px] mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-secondary hover:text-accent"><ArrowLeft size={20} /></Link>
            <div><p className="text-xs font-semibold tracking-wider text-accent uppercase">Private sourcing workspace</p><h1 className="text-xl font-extrabold text-ink">咕咕寻访模式</h1></div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white"><LockKeyhole size={14} />私密信息 · 登录后可见</div>
        </div>
      </header>

      <section className="max-w-[1500px] mx-auto px-5 py-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-start gap-2 mb-5">
          <CircleAlert size={17} className="mt-0.5 shrink-0" />这里包含真实公司名和内部对焦信息，禁止复制到公开网站、社交平台、群聊或候选人书面沟通。
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_190px_170px_160px] mb-5">
          <label className="filter-control bg-white"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索岗位、真实公司或画像关键词" /></label>
          <label className="filter-control bg-white"><Filter size={16} /><select value={functionId} onChange={(event) => setFunctionId(event.target.value)}><option value="">全部职能</option>{JOB_FUNCTIONS.map((item) => <option key={item.id} value={item.id}>{item.labelZh}</option>)}</select></label>
          <label className="filter-control bg-white"><FilePenLine size={16} /><select value={profileState} onChange={(event) => setProfileState(event.target.value)}><option value="all">全部画像</option><option value="complete">已补充私密画像</option><option value="missing">待补充画像</option></select></label>
          <label className="filter-control bg-white"><Sparkles size={16} /><select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="">全部优先级</option>{Object.entries(priorityLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        </div>

        <div className="grid lg:grid-cols-[390px_minmax(0,1fr)] gap-5 items-start">
          <aside className="rounded-2xl border border-border bg-white overflow-hidden lg:sticky lg:top-[94px]">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between"><span className="text-sm font-bold">岗位清单</span><span className="text-xs text-text-secondary">{filteredJobs.length} / {jobs.length}</span></div>
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
              {filteredJobs.map((job) => {
                const active = job.id === selectedId;
                const roleProfile = profileFor(job.id);
                const company = companyFor(job);
                const realName = identityFor(job);
                return (
                  <button key={job.id} onClick={() => { setSelectedId(job.id); setEditing(false); setMessage(""); }} className={`w-full px-4 py-4 text-left border-b border-border/70 flex gap-3 hover:bg-bg-primary ${active ? "bg-[#fff3e9]" : "bg-white"}`}>
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${roleProfile ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="min-w-0 flex-1"><strong className="block text-sm text-ink truncate">{job.title}</strong><span className="block mt-1 text-xs text-text-secondary truncate">{realName || "真实公司待录入"} · {company?.name}</span><span className="block mt-1.5 text-[11px] text-text-secondary">{job.location || "地点待确认"}</span></span>
                    <ChevronRight size={16} className={active ? "text-accent" : "text-slate-300"} />
                  </button>
                );
              })}
            </div>
          </aside>

          {selectedJob && selectedTaxonomy ? (
            <section className="space-y-4">
              <div className="rounded-3xl border border-border bg-white p-5 md:p-7">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge tone="dark">{getFunctionOption(selectedTaxonomy.functionId)?.labelZh}</Badge>
                      <Badge tone="coral">{getSpecialtyOption(selectedTaxonomy.functionId, selectedTaxonomy.specialtyId)?.labelZh}</Badge>
                      <Badge>{getSeniorityOption(selectedTaxonomy.seniorityId)?.labelZh}</Badge>
                      <Badge tone={selectedProfile?.priority === "high" ? "red" : "default"}>{priorityLabels[selectedProfile?.priority || "normal"]}</Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-ink">{selectedJob.title}</h2>
                    <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <Meta icon={<Building2 size={16} />} label="真实公司" value={selectedIdentity || selectedProfile?.internalCompanyName || "待录入"} strong />
                      <Meta icon={<BriefcaseBusiness size={16} />} label="公开代称" value={selectedCompany?.name || "—"} />
                      <Meta icon={<MapPin size={16} />} label="Base" value={selectedJob.location || "待确认"} />
                      <Meta icon={<UsersRound size={16} />} label="HC" value={selectedProfile?.hc || "待补充"} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/job/${selectedJob.id}`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:border-accent"><ExternalLink size={16} />公开页</Link>
                    <button onClick={startEdit} className="inline-flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white"><FilePenLine size={16} />编辑画像</button>
                  </div>
                </div>
                {message && <p className={`mt-4 rounded-xl px-3 py-2 text-sm ${message.includes("失败") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{message}</p>}
              </div>

              {editing && draft ? (
                <RoleProfileEditor draft={draft} setDraft={setDraft} saving={saving} onSave={save} onCancel={() => setEditing(false)} />
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoCard title="岗位与组织口径">
                      <InfoRow label="核心职责" value={selectedProfile?.confirmedScope} />
                      <InfoRow label="汇报关系" value={selectedProfile?.reportingLine} />
                      <InfoRow label="团队 / Scope" value={selectedProfile?.teamScope} />
                      <InfoRow label="内部薪酬口径" value={selectedProfile?.compensation || selectedJob.profile.salary} />
                      <InfoRow label="最近对焦" value={selectedProfile?.lastAlignedAt} />
                    </InfoCard>
                    <InfoCard title="核心候选人画像">
                      <InfoRow label="一句话画像" value={selectedProfile?.sourcingAgentMustHave} />
                      <ListRow label="关键匹配点" values={selectedProfile?.matchingPriority} />
                      <ListRow label="加分项" values={selectedProfile?.secondaryValue} />
                    </InfoCard>
                    <InfoCard title="寻访边界">
                      <ListRow label="参考背景 / 目标团队" values={selectedProfile?.targetBackgrounds} />
                      <ListRow label="明确排除" values={selectedProfile?.excludedBackgrounds} />
                      <ListRow label="不要过度看重" values={selectedProfile?.doNotOverweight} />
                      <ListRow label="硬约束" values={selectedProfile?.hardConstraints} />
                    </InfoCard>
                    <InfoCard title="内部备注与相似岗位">
                      <InfoRow label="备注" value={selectedProfile?.internalNotes} />
                      <div className="mt-4"><p className="text-xs font-semibold text-text-secondary mb-2">可一鱼多吃的岗位</p><div className="space-y-2">{similarJobs.length ? similarJobs.map((job) => <button key={job.id} onClick={() => setSelectedId(job.id)} className="w-full rounded-xl border border-border px-3 py-2 text-left hover:border-accent"><strong className="block text-sm text-ink">{job.title}</strong><span className="text-xs text-text-secondary">{identityFor(job) || companyFor(job)?.name} · {job.location || "地点待确认"}</span></button>) : <p className="text-sm text-text-secondary">暂无高相似岗位</p>}</div></div>
                    </InfoCard>
                  </div>
                  {!selectedProfile && <div className="rounded-2xl border border-dashed border-accent/50 bg-accent-light/40 p-6 text-center"><FilePenLine size={24} className="mx-auto text-accent mb-2" /><p className="font-bold text-ink">这个岗位还没有结构化私密画像</p><p className="mt-1 text-sm text-text-secondary">公开 JD 与自动分类已经可用；点击“编辑画像”补充内部对焦信息。</p></div>}
                </>
              )}
            </section>
          ) : <div className="rounded-2xl border border-border bg-white p-10 text-center text-text-secondary">选择一个岗位查看寻访信息</div>}
        </div>
      </section>
    </main>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "dark" | "coral" | "red" }) {
  const styles = { default: "bg-bg-primary text-text-secondary", dark: "bg-ink text-white", coral: "bg-accent-light text-accent", red: "bg-red-50 text-red-700" };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[tone]}`}>{children}</span>;
}

function Meta({ icon, label, value, strong }: { icon: React.ReactNode; label: string; value: string; strong?: boolean }) {
  return <div className="rounded-xl bg-bg-primary px-3 py-2.5 flex gap-2"><span className="mt-0.5 text-accent">{icon}</span><span className="min-w-0"><span className="block text-[11px] text-text-secondary">{label}</span><span className={`block truncate ${strong ? "font-bold text-ink" : "text-text-primary"}`}>{value}</span></span></div>;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-border bg-white p-5"><h3 className="font-extrabold text-ink mb-4">{title}</h3>{children}</article>;
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return <div className="py-2.5 border-t border-border/60 first:border-t-0 first:pt-0"><p className="text-xs font-semibold text-text-secondary">{label}</p><p className={`mt-1 text-sm leading-6 whitespace-pre-wrap ${value ? "text-ink" : "text-slate-400"}`}>{value || "待补充"}</p></div>;
}

function ListRow({ label, values }: { label: string; values?: string[] }) {
  return <div className="py-2.5 border-t border-border/60 first:border-t-0 first:pt-0"><p className="text-xs font-semibold text-text-secondary mb-1.5">{label}</p>{values?.length ? <ul className="space-y-1.5">{values.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2 text-sm leading-6 text-ink"><Check size={14} className="mt-1.5 shrink-0 text-emerald-600" />{item}</li>)}</ul> : <p className="text-sm text-slate-400">待补充</p>}</div>;
}

function RoleProfileEditor({ draft, setDraft, saving, onSave, onCancel }: { draft: RoleProfile; setDraft: (value: RoleProfile) => void; saving: boolean; onSave: () => void; onCancel: () => void }) {
  const field = (key: keyof RoleProfile, value: string) => setDraft({ ...draft, [key]: value });
  const listField = (key: keyof RoleProfile, value: string) => setDraft({ ...draft, [key]: splitLines(value) });
  return (
    <div className="rounded-2xl border border-ink/20 bg-white p-5 md:p-7">
      <div className="flex items-center justify-between mb-5"><div><p className="text-xs text-accent font-semibold">PRIVATE ROLE PROFILE</p><h3 className="text-xl font-extrabold">编辑私密岗位画像</h3></div><button onClick={onCancel} className="p-2 rounded-full hover:bg-bg-primary"><X size={20} /></button></div>
      <div className="grid md:grid-cols-2 gap-4">
        <SelectInput label="优先级" value={draft.priority || "normal"} onChange={(value) => setDraft({ ...draft, priority: value as RoleProfile["priority"] })} options={Object.entries(priorityLabels)} />
        <TextInput label="HC" value={draft.hc || ""} onChange={(value) => field("hc", value)} placeholder="如：2–3 个 / HC 充足" />
        <TextInput label="内部薪酬口径" value={draft.compensation || ""} onChange={(value) => field("compensation", value)} />
        <TextInput label="最近对焦日期" value={draft.lastAlignedAt || ""} onChange={(value) => field("lastAlignedAt", value)} placeholder="YYYY-MM-DD" />
        <TextInput label="汇报关系" value={draft.reportingLine || ""} onChange={(value) => field("reportingLine", value)} />
        <TextInput label="团队 / Scope" value={draft.teamScope || ""} onChange={(value) => field("teamScope", value)} />
      </div>
      <div className="mt-4 space-y-4">
        <AreaInput label="核心职责 / 已确认 Scope" value={draft.confirmedScope || ""} onChange={(value) => field("confirmedScope", value)} />
        <AreaInput label="一句话理想画像" value={draft.sourcingAgentMustHave || ""} onChange={(value) => field("sourcingAgentMustHave", value)} />
        <div className="grid md:grid-cols-2 gap-4">
          <AreaInput label="关键匹配点（每行一项）" value={lines(draft.matchingPriority)} onChange={(value) => listField("matchingPriority", value)} />
          <AreaInput label="加分项（每行一项）" value={lines(draft.secondaryValue)} onChange={(value) => listField("secondaryValue", value)} />
          <AreaInput label="参考背景 / 目标团队（每行一项）" value={lines(draft.targetBackgrounds)} onChange={(value) => listField("targetBackgrounds", value)} />
          <AreaInput label="明确排除（每行一项）" value={lines(draft.excludedBackgrounds)} onChange={(value) => listField("excludedBackgrounds", value)} />
          <AreaInput label="不要过度看重（每行一项）" value={lines(draft.doNotOverweight)} onChange={(value) => listField("doNotOverweight", value)} />
          <AreaInput label="硬约束（每行一项）" value={lines(draft.hardConstraints)} onChange={(value) => listField("hardConstraints", value)} />
        </div>
        <AreaInput label="内部备注" value={draft.internalNotes || ""} onChange={(value) => field("internalNotes", value)} />
        <AreaInput label="指定相似岗位 ID（每行一项，可不填，系统会自动推荐）" value={lines(draft.similarJobIds)} onChange={(value) => listField("similarJobIds", value)} />
      </div>
      <div className="flex justify-end gap-3 mt-6"><button onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold">取消</button><button disabled={saving} onClick={onSave} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold disabled:opacity-50"><Save size={16} />{saving ? "保存中..." : "保存私密画像"}</button></div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label><span className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-accent" /></label>;
}
function AreaInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</span><textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm leading-6 outline-none focus:border-accent" /></label>;
}
function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label><span className="block text-xs font-semibold text-text-secondary mb-1.5">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-accent">{options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>;
}
