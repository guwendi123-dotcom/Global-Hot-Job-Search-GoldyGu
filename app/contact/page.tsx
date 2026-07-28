"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Linkedin, Mail, Send } from "lucide-react";
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
    <main className="min-h-screen bg-bg-primary">
      <header className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent">
            <ArrowLeft size={18} /> {text.back}
          </Link>
        </div>
      </header>
      <section className="max-w-2xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-border p-7 md:p-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">{text.title}</h1>
          <p className="text-text-secondary mb-8">{text.subtitle}</p>
          <form onSubmit={submit} className="space-y-5">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={text.name} className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={text.email} className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none" />
            <label className="block text-sm font-medium text-text-primary">
              <span className="block mb-2">{text.job}</span>
              <select value={form.interestedJob} onChange={(e) => setForm({ ...form, interestedJob: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-accent focus:outline-none">
                <option value="">{text.choose}</option>
                {jobs.map((job) => <option key={job.id} value={job.id}>{language === "zh" ? job.title : job.titleEn || job.title}</option>)}
              </select>
            </label>
            <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={text.message} className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none" />
            <button type="submit" className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-orange-600">
              <Send size={18} /> {text.send}
            </button>
          </form>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <a onClick={() => sendAnalyticsEvent("contact_email", "contact-page")} href={`mailto:${profile.contact.email}`} className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-full border border-border hover:border-accent"><Mail size={17} /> Email</a>
            <a onClick={() => sendAnalyticsEvent("contact_linkedin", "contact-page")} href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-full border border-border hover:border-accent"><Linkedin size={17} /> LinkedIn</a>
          </div>
        </div>
      </section>
    </main>
  );
}
