"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Linkedin, Copy, Check, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);
  const { t, language } = useI18n();

  const copyToClipboard = async (text: string, type: 'phone' | 'wechat') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedWechat(true);
        setTimeout(() => setCopiedWechat(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const title = language === "zh" ? profile.title : profile.titleEn || profile.title;
  const tagline = language === "zh" ? profile.tagline : profile.taglineEn || profile.tagline;
  const bio = language === "zh" ? profile.bio : profile.bioEn || profile.bio;

  return (
    <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Avatar - Rabbit Emoji */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center text-6xl mb-6 shadow-lg select-none"
      >
        🐰
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-text-primary mb-2 font-handwriting"
        style={{ fontFamily: '"ZCOOL XiaoWei", serif' }}
      >
        {profile.name} (咕咕)
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl text-accent font-medium mb-4"
      >
        {title}
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-text-secondary max-w-md mb-2 font-handwriting"
        style={{ fontFamily: '"ZCOOL XiaoWei", serif' }}
      >
        {tagline}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-text-secondary max-w-lg mb-8 whitespace-pre-line text-sm leading-relaxed font-handwriting"
        style={{ fontFamily: '"ZCOOL XiaoWei", serif' }}
      >
        {bio}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <a
          href={`mailto:${profile.contact.email}`}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#FF6B35', color: 'white', borderRadius: '9999px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          className="hover:bg-orange-600 hover:shadow-lg"
        >
          <Mail size={18} />
          {t.contactMe}
        </a>
        <Link
          href="/contact"
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#1A1A1A', border: '2px solid #FF6B35', borderRadius: '9999px', transition: 'all 0.2s' }}
          className="hover:bg-accent-light hover:text-accent font-medium"
        >
          <Send size={18} className="text-accent" />
          {language === "zh" ? "留言给我" : "Leave a Message"}
        </Link>
        <button
          onClick={() => copyToClipboard(profile.contact.phone, 'phone')}
          style={{ cursor: 'pointer', userSelect: 'all', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#1A1A1A', border: '1px solid #E5E7EB', borderRadius: '9999px', transition: 'all 0.2s' }}
          className="hover:border-accent hover:text-accent"
        >
          <Phone size={18} />
          {copiedPhone ? <Check size={18} /> : <Copy size={14} />}
          <span style={{ userSelect: 'all' }}>{profile.contact.phone}</span>
        </button>
        <button
          onClick={() => copyToClipboard(profile.contact.wechat, 'wechat')}
          style={{ cursor: 'pointer', userSelect: 'all', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#1A1A1A', border: '1px solid #E5E7EB', borderRadius: '9999px', transition: 'all 0.2s' }}
          className="hover:border-accent hover:text-accent"
        >
          <MessageCircle size={18} />
          {copiedWechat ? <Check size={18} /> : <Copy size={14} />}
          <span style={{ userSelect: 'all', fontSize: '0.875rem' }}>{profile.contact.wechat}</span>
        </button>
        <a
          href={profile.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#1A1A1A', border: '1px solid #E5E7EB', borderRadius: '9999px', transition: 'all 0.2s' }}
          className="hover:border-accent hover:text-accent"
        >
          <Linkedin size={18} />
          LinkedIn
        </a>
      </motion.div>
    </section>
  );
}