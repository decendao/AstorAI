import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
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
 * Astor 愿景 —— 宣言 + 名字由来 + 我们相信 + 与旧方式的对比。
 *
 * 没有独立的"页面头"区块: 文档标题 (Astor AI 愿景哲学 / 关于 AstorAI /
 * 副标题) 已并入 Manifesto 的 lead 模式, 与正文连成一篇 ——
 * 点导航进来直接落在内容上, 而不是先撞见一个光秃秃的标题页。
 *
 * 叙事顺序:
 *   Manifesto 为什么存在 (标题 + 全文, 一段连续)
 *   名字由来  在情绪高点后放一个停顿, 解释这个符号
 *   我们相信  五条不妥协的原则, 落地成可执行的信条
 *   旧方式    最后对照行业现状, 收束
 */
export default function VisionPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <Manifesto lead />
      <NameOrigin />
      <BelieveSection />
      <Contrast />

      <SiteFooter />
    </main>
  );
}
