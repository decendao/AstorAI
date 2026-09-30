import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionMark } from "@/components/ui/Editorial";
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
 */
export default function MatchPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <section className="relative z-10 pt-28 sm:pt-36 pb-[clamp(40px,5vw,70px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Match" cn="匹配你的 Astor" n="03" />
          <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-6 sm:mb-8 text-[clamp(28px,5.4vw,60px)] max-w-[18ch]">
            先认识自己，
            <br />
            再谈<em className="em-gold">资产配置</em>。
          </h1>
          <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch]">
            6 道题 · 约 2 分钟 · 无需注册。全部在浏览器本地计算，不上传你的任何答案。
          </p>
        </div>
      </section>

      <SurveyFlow />

      <SiteFooter />
    </main>
  );
}
