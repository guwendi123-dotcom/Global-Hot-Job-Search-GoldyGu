import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "HeadHunter Portfolio | 猎头个人品牌网站",
  description: "专注具身智能与AI领域的猎头顾问，展示合作团队与优质岗位",
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