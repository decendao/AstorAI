import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
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
 *
 * 页面标题已并入 CapabilitySection 的 lead 模式, 无独立页面头。
 */
export default function AgentPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <CapabilitySection lead />
      <AuditSection />
      <PricingSection />

      <SiteFooter />
    </main>
  );
}
