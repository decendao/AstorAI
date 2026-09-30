import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SurveyFlow } from "@/components/survey/SurveyFlow";

export const metadata: Metadata = {
  title: "匹配你的 Astor · AstorAI",
  description:
    "6 道题，约 2 分钟，无需注册。输出可审计的五维财富画像，不做推荐、不做交易。",
};

/**
 * 匹配你的 Astor —— 问卷诊断 + 五维画像。
 *
 * 诊断是整个站点的转化核心, 单独成页:
 * 从任何入口进来都能直达问卷, 不用先滚过整条 landing。
 *
 * 页面标题已并入 SurveyFlow 的 lead 模式, 无独立页面头。
 */
export default function MatchPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <SurveyFlow lead />

      <SiteFooter />
    </main>
  );
}
