import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionMark } from "@/components/ui/Editorial";
import { Manifesto } from "@/components/manifesto/Manifesto";
import { NameOrigin } from "@/components/manifesto/NameOrigin";
import { BelieveSection } from "@/components/believe/BelieveSection";
import { Contrast } from "@/components/contrast/Contrast";

export const metadata: Metadata = {
  title: "Astor AI 愿景哲学 · AstorAI",
  description:
    "几十年来，最好的金融指引，始终留给最不需要它的人。我们不做推荐、不做交易、不承诺收益、不代客理财 —— 我们只帮你透过资产理解自己。",
};

/**
 * Astor 愿景 —— 名字由来 + 宣言 + 我们相信 + 与旧方式的对比。
 *
 * 叙事顺序:
 *   页面头    Astor AI 愿景哲学
 *   Manifesto 为什么存在 (最强的一段, 紧接着头图)
 *   名字由来  在情绪高点后放一个停顿, 解释这个符号
 *   我们相信  五条不妥协的原则, 落地成可执行的信条
 *   旧方式    最后对照行业现状, 收束
 */
export default function VisionPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <section className="relative z-10 pt-28 sm:pt-36 pb-[clamp(60px,8vw,110px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Manifesto" cn="Astor AI 愿景哲学" n="01" />

          <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-6 sm:mb-8 text-[clamp(28px,5.4vw,60px)] max-w-[18ch]">
            关于 AstorAI
          </h1>

          <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch]">
            比你更懂你的资产的财富智能体。
          </p>
        </div>
      </section>

      <Manifesto />
      <NameOrigin />
      <BelieveSection />
      <Contrast />

      <SiteFooter />
    </main>
  );
}
