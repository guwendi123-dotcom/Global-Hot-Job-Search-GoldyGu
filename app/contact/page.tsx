"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Linkedin, Mail, Send, Sparkles } from "lucide-react";
import { getJobsSync, getProfile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { sendAnalyticsEvent } from "@/components/AnalyticsTracker";

export default function ContactPage() {
  const { language } = useI18n();
  const profile = getProfile();
  const [jobs, setJobs] = useState(getJobsSync());
  const [form, setForm] = useState({ name: "", email: "", interestedJob: "", message: "" });

  useEffect(() => setJobs(getJobsSync()), []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    sendAnalyticsEvent("contact_email", form.interestedJob || "contact-form");
    const job = jobs.find((item) => item.id === form.interestedJob);
    const subject = job
      ? `${language === "zh" ? "岗位咨询" : "Job inquiry"}: ${job.titleEn || job.title}`
      : language === "zh" ? "来自 GoldyHire 的咨询" : "Inquiry from GoldyHire";
    const body = [
      `${language === "zh" ? "姓名" : "Name"}: ${form.name}`,
      `${language === "zh" ? "邮箱" : "Email"}: ${form.email}`,
      job ? `${language === "zh" ? "感兴趣岗位" : "Interested role"}: ${job.title} / ${job.titleEn || ""}` : "",
      "",
      form.message,
    ].filter(Boolean).join("\n");
    window.location.href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const text = language === "zh" ? {
    title: "联系咕咕",
    subtitle: "选择岗位并填写简短信息，点击后会打开你的邮件应用。你也可以直接通过 LinkedIn 联系我。",
    name: "姓名",
    email: "你的邮箱",
    job: "感兴趣的岗位（可选）",
    choose: "请选择岗位",
    message: "想了解的内容",
    send: "打开邮件并发送",
    back: "返回首页",
  } : {
    title: "Contact Goldy",
    subtitle: "Choose a role and add a short note. We’ll open your email app so you stay in control of what is sent.",
    name: "Name",
    email: "Your email",
    job: "Interested role (optional)",
    choose: "Select a role",
    message: "How can I help?",
    send: "Open email to send",
    back: "Back to home",
  };

  return (
    <main className="academy-subpage">
      <section className="subpage-intro">
        <div className="subpage-intro-inner">
          <Link href="/" className="subpage-back">{language === "zh" ? "← 返回首页" : "← Back home"}</Link>
          <p className="eyebrow">{language === "zh" ? "和咕咕聊聊" : "Talk to Goldy"}</p>
          <h1 className="subpage-title">{text.title}</h1>
          <p className="subpage-lede">{text.subtitle}</p>
        </div>
      </section>
      <section className="subpage-content-wrap">
        <div className="subpage-contact-grid">
          <div className="subpage-panel subpage-form-panel">
            <div className="subpage-panel-title"><Sparkles size={20} /><div><p>{language === "zh" ? "岗位与合作咨询" : "Role & partnership inquiry"}</p><span>{language === "zh" ? "填写后会打开你的邮件应用" : "Your email app will open when ready"}</span></div></div>
          <form onSubmit={submit} className="subpage-form">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={text.name} />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={text.email} />
            <label className="block text-sm font-medium text-text-primary">
              <span className="block mb-2">{text.job}</span>
              <select value={form.interestedJob} onChange={(e) => setForm({ ...form, interestedJob: e.target.value })}>
                <option value="">{text.choose}</option>
                {jobs.map((job) => <option key={job.id} value={job.id}>{language === "zh" ? job.title : job.titleEn || job.title}</option>)}
              </select>
            </label>
            <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={text.message} />
            <button type="submit" className="subpage-primary-button">
              <Send size={18} /> {text.send}
            </button>
          </form>
          </div>
          <aside className="subpage-contact-aside">
            <p className="eyebrow">{language === "zh" ? "直接联系" : "Direct contact"}</p>
            <h2>{language === "zh" ? "选择你顺手的方式" : "Choose what works for you"}</h2>
            <p>{language === "zh" ? "岗位匹配、团队咨询或合作需求，都可以直接联系。" : "Reach out about a role, a team or a partnership."}</p>
            <a onClick={() => sendAnalyticsEvent("contact_email", "contact-page")} href={`mailto:${profile.contact.email}`}><Mail size={18} /><span><strong>Email</strong><small>{profile.contact.email}</small></span></a>
            <a onClick={() => sendAnalyticsEvent("contact_linkedin", "contact-page")} href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={18} /><span><strong>LinkedIn</strong><small>{language === "zh" ? "查看咕咕的职业主页" : "View Goldy's profile"}</small></span></a>
          </aside>
        </div>
      </section>
    </main>
  );
}
