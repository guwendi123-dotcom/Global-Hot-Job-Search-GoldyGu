"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { getJobs, getProfile } from "@/lib/data";
import { ArrowLeft, Send, CheckCircle, Linkedin, Mail, Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const { language, t } = useI18n();
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    interestedJob: "",
    message: "",
  });

  useEffect(() => {
    setJobs(getJobs());
    setProfile(getProfile());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(language === "zh" ? "提交失败，请重试" : "Submission failed, please try again");
      }
    } catch (error) {
      console.error(error);
      alert(language === "zh" ? "提交失败，请重试" : "Submission failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  const trans = {
    title: language === "zh" ? "联系我" : "Contact Me",
    subtitle: language === "zh"
      ? "填写以下表单，我会尽快与你联系"
      : "Fill in the form below and I'll get back to you soon",
    name: language === "zh" ? "姓名" : "Name",
    namePlaceholder: language === "zh" ? "请输入你的姓名" : "Enter your name",
    email: language === "zh" ? "邮箱" : "Email",
    emailPlaceholder: language === "zh" ? "your@email.com" : "your@email.com",
    phone: language === "zh" ? "电话" : "Phone",
    phonePlaceholder: language === "zh" ? "请输入你的电话" : "Enter your phone number",
    linkedin: "LinkedIn",
    linkedinPlaceholder: "https://linkedin.com/in/your-profile",
    interestedJob: language === "zh" ? "感兴趣的岗位" : "Interested Position",
    selectJob: language === "zh" ? "请选择岗位（可选）" : "Select a position (optional)",
    message: language === "zh" ? "留言" : "Message",
    messagePlaceholder: language === "zh"
      ? "告诉我你的背景、期望岗位或其他想说的话..."
      : "Tell me about your background, desired position, or anything else...",
    submit: language === "zh" ? "提交" : "Submit",
    back: language === "zh" ? "返回首页" : "Back to Home",
    success: language === "zh" ? "提交成功！" : "Submitted Successfully!",
    successMsg: language === "zh"
      ? "感谢你的留言，我会尽快回复你。"
      : "Thank you for your message. I'll get back to you soon.",
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">{trans.success}</h1>
          <p className="text-text-secondary mb-6">{trans.successMsg}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={18} />
            {trans.back}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            {trans.back}
          </Link>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-border p-8 md:p-12">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">{trans.title}</h1>
          <p className="text-text-secondary mb-8">{trans.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {trans.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={trans.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {trans.email} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={trans.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {trans.phone}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={trans.phonePlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {trans.linkedin}
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder={trans.linkedinPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Interested Job */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {trans.interestedJob}
              </label>
              <select
                value={formData.interestedJob}
                onChange={(e) => setFormData({ ...formData, interestedJob: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors bg-white"
              >
                <option value="">{trans.selectJob}</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {language === "zh" ? job.title : job.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {trans.message}
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-text-secondary" />
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={trans.messagePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <span>{language === "zh" ? "提交中..." : "Submitting..."}</span>
              ) : (
                <>
                  <Send size={18} />
                  {trans.submit}
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}