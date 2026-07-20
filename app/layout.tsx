import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.goldyhire.com"),
  title: {
    default: "GoldyHire｜AI、具身智能与 Web3 全球人才机会",
    template: "%s｜GoldyHire",
  },
  description: "发现 AI Agent、具身智能、Web3 与全球科技公司的真实招聘机会，由猎头顾问咕咕持续更新。",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    siteName: "GoldyHire",
    title: "GoldyHire｜全球科技人才与岗位机会",
    description: "AI Agent、具身智能、Web3 与全球科技公司的真实招聘机会。",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoldyHire｜全球科技人才与岗位机会",
    description: "AI Agent、具身智能、Web3 与全球科技公司的真实招聘机会。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-body antialiased">
        <I18nProvider>
          <LanguageSwitcher />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
