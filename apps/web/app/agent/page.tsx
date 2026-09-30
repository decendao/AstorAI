import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionMark } from "@/components/ui/Editorial";
import { CapabilitySection, AuditSection } from "@/components/agent/AgentSections";
import { PricingSection } from "@/components/pricing/PricingSection";

export const metadata: Metadata = {
  title: "AI 智能体 · AstorAI",
  description:
    "Analyzer → Reporter → Reviewer 三段流水线，AI 出草稿、人批准，审计只追加、失败可回退。¥100/月，0% 抽成。",
};

/**
 * AI 智能体 —— 能力 + 可信(审计) + 定价。
 *
 * 定价放在这里而不是 landing: 看到"智能体怎么工作"之后再看价格,
 * 决策链是连贯的; 放首页会打断愿景的叙述。
 */
export default function AgentPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <section className="relative z-10 pt-28 sm:pt-36 pb-[clamp(60px,8vw,110px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Agent" cn="AI 智能体" n="02" />
          <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-6 sm:mb-8 text-[clamp(28px,5.4vw,60px)] max-w-[18ch]">
            AI 出草稿，
            <br />
            <em className="em-gold">人批准</em>才算数。
          </h1>
          <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch]">
            每一段输出都是 DRAFT。发布前必须过 Reviewer 与人工审批闸门 —— 这是我们和"自动理财"之间最硬的一道线。
          </p>
        </div>
      </section>

      <CapabilitySection />
      <AuditSection />
      <PricingSection />

      <SiteFooter />
    </main>
  );
}
