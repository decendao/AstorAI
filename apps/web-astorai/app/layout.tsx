import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astorai.cn";
const TITLE = "Astor AI · 您的智能投研副驾";
const DESC =
  "Astor AI 是面向高净值投资者与机构的智能投研助手。6 题画像诊断, 实时行情解读, 个性化组合建议, 7 天免费试用 ¥99/月起。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  metadataBase: new URL(SITE),
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE,
    siteName: "Astor AI",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
  robots: { index: true, follow: true },
  keywords: ["AI 投研", "智能投顾", "投资诊断", "组合管理", "Astor AI"],
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}