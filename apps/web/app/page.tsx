import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroSection } from "@/components/hero/HeroSection";
import { PillarGrid } from "@/components/site/PillarGrid";
import { CtaSection } from "@/components/pricing/PricingSection";

/**
 * landing page —— 精简版。
 *
 * 原来这里是 9 个区块纵向堆叠 (Hero/Manifesto/Believe/Contrast/诊断/
 * 能力/审计/定价/CTA), 页面极长, 访客要滚很久才够到转化按钮。
 *
 * 现在只留三段:
 *   Hero      一屏说清我们是谁
 *   PillarGrid 四个入口, 把人送进对应 subpage
 *   Cta       收口转化
 *
 * 深度内容全部下沉:
 *   /vision  Manifesto + Believe + Contrast
 *   /agent   Capability + Audit + Pricing
 *   /match   问卷诊断 + 五维画像
 *   /contact 运营主体 + 服务边界 + 联系渠道
 *
 * 组件本身一行没改, 只是换了所在页面 —— 保持各区块组件的可复用性。
 */
export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />
      <HeroSection />
      <PillarGrid />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}
