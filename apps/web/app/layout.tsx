import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AstorAI · 比你更懂你的资产的财富智能体",
  description:
    "An Agent That Knows Your Assets Better Than You. 高净值财富诊断、统筹管理与陪伴型银行家智能体。不做推荐，不做交易。",
  metadataBase: new URL("https://astorai.cn"),
  openGraph: {
    title: "AstorAI · 比你更懂你的资产的财富智能体",
    description: "把你复杂的资产状况，变成一份清晰、可审计的诊断报告。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${cormorant.variable} ${notoSerifSC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
