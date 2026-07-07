"use client";

import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import type { Profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const { t, language } = useI18n();

  return (
    <footer className="bg-white border-t border-border py-12 px-4 mt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center gap-6 mb-6 font-handwriting">
          <Link
            href="/contact"
            className="text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
          >
            <MessageCircle size={16} />
            {language === "zh" ? "联系我" : "Contact Me"}
          </Link>
          <a
            href={`mailto:${profile.contact.email}`}
            className="text-text-secondary hover:text-accent transition-colors"
          >
            {t.email}
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-text-secondary text-sm mb-4 font-handwriting">
          © {new Date().getFullYear()} {profile.name} · {profile.title}
        </p>

        <p className="text-text-secondary text-xs flex items-center justify-center gap-1 font-handwriting">
          {t.madeWith} <Heart size={12} className="text-accent" /> {t.forTechTalents}
        </p>
      </div>
    </footer>
  );
}