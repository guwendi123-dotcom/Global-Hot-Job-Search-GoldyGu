"use client";

import Link from "next/link";
import { ArrowRight, Linkedin, Mail } from "lucide-react";
import type { Profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Footer({ profile }: { profile: Profile }) {
  const { language } = useI18n();
  return (
    <>
      <section className="max-w-6xl mx-auto px-5 pb-12 relative">
        <div className="contact-band">
          <img src="/art/goldy-hero.png" alt="" />
          <div><h2>{language === "zh" ? "信任是每一次合作的起点" : "Trust starts every partnership"}</h2><p>{language === "zh" ? "咕咕专注连接全球优秀科技人才与有远见的团队，用真诚与专业，助力彼此成就更多可能。" : "Connecting exceptional global technology talent with ambitious teams."}</p></div>
          <Link href="/contact" className="primary-pill">{language === "zh" ? "和咕咕聊聊" : "Talk to Goldy"}<ArrowRight size={17} /></Link>
          <img src="/art/cat-white-final.png" alt="" className="footer-cat" />
        </div>
      </section>
      <footer className="border-t border-ink/10 px-5 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr_1fr] gap-8">
          <div><div className="text-2xl font-bold text-ink">GoldyHire<span className="text-coral">✦</span></div><p className="text-sm text-text-secondary mt-3 max-w-xs">{language === "zh" ? "连接全球科技人才与机会，让优秀的人遇见更好的未来。" : "Connecting global technology talent with better opportunities."}</p></div>
          <div className="footer-links"><strong>{language === "zh" ? "探索" : "Explore"}</strong><Link href="/#jobs">{language === "zh" ? "找岗位" : "Jobs"}</Link><Link href="/#industries">{language === "zh" ? "行业" : "Industries"}</Link><Link href="/#companies">{language === "zh" ? "合作公司" : "Companies"}</Link></div>
          <div className="footer-links"><strong>{language === "zh" ? "联系" : "Contact"}</strong><a href={`mailto:${profile.contact.email}`}><Mail size={14} />{profile.contact.email}</a><a href={profile.contact.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} />LinkedIn</a></div>
        </div>
        <p className="max-w-6xl mx-auto text-xs text-text-secondary mt-10">© {new Date().getFullYear()} GoldyHire. All rights reserved.</p>
      </footer>
    </>
  );
}
