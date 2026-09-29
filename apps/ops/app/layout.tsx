import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3A Ops Console",
  description: "Astor OS · 运营后台 — 报告审批 / 审计 / 成员",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100 min-h-screen">{children}</body>
    </html>
  );
}