import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionMark } from "@/components/ui/Editorial";
import { Manifesto } from "@/components/manifesto/Manifesto";
import { BelieveSection } from "@/components/believe/BelieveSection";
import { Contrast } from "@/components/contrast/Contrast";

export const metadata: Metadata = {
  title: "Astor 愿景 · AstorAI",
  description:
    "我们不做推荐、不做交易、不承诺收益、不代客理财。我们只做一件事：帮你透过资产理解自己。",
};

/**
 * Astor 愿景 —— 宣言 + 我们相信 + 与旧方式的对比。
 *
 * 这三块原本都堆在 landing page 上, 把首页撑得很长;
 * 拆成 subpage 后 landing 只留入口, 深度内容在这里。
 */
export default function VisionPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <section className="relative z-10 pt-28 sm:pt-36 pb-[clamp(60px,8vw,110px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Vision" cn="Astor 愿景" n="01" />
          <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-6 sm:mb-8 text-[clamp(28px,5.4vw,60px)] max-w-[18ch]">
            我们不替你做决定，
            <br />
            我们让你<em className="em-gold">看清自己的决定</em>。
          </h1>
          <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch]">
            在这里，资产不是用来被交易的筹码，而是用来被理解的坐标。
          </p>
        </div>
      </section>

      <Manifesto />
      <BelieveSection />
      <Contrast />

      <SiteFooter />
    </main>
  );
}
