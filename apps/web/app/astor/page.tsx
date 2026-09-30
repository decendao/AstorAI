import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionMark, Btn } from "@/components/ui/Editorial";
import { AstorStreamDemo } from "@/components/astor/AstorStreamDemo";

export const metadata: Metadata = {
  title: "Agent 流式演示 · AstorAI",
  description:
    "Astor OS Agent 流式输出演示。当前为 mock provider，真实环境由智谱 / 通义 / DeepSeek 驱动。",
};

const NOTE = [
  { k: "Dual Gate", t: "AI 出草稿，人批准", d: "每一段输出都是 DRAFT，发布前必须过 Reviewer 与人工审批闸门。" },
  { k: "Append Only", t: "审计只追加", d: "AgentRun 记录落库后不可修改，历史无法被覆盖或抹去。" },
  { k: "Fallback", t: "失败可回退", d: "zod 校验失败自动回退规则引擎，保证输出始终结构化。" },
];

export default function AstorDemoPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <section className="relative z-10 pt-28 sm:pt-36 pb-[clamp(80px,11vw,150px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Agent Demo" cn="流式演示" n="LAB" />

          <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-6 sm:mb-8 text-[clamp(28px,5.4vw,60px)]">
            看见 Agent
            <br />
            <em className="em-gold">怎么一步步</em>想出来
          </h1>

          <p className="text-[clamp(15px,1.8vw,19px)] leading-[2.05] text-paper/40 max-w-[52ch] mb-10 sm:mb-14">
            当前为 <em className="em-gold">mock provider</em>，用于联调前端流式协议。
            真实环境接入模型后，同一套 SSE 协议不变。
          </p>

          <div className="max-w-prose mb-12 sm:mb-16">
            <AstorStreamDemo />
          </div>

          <div className="max-w-prose">
            <h2 className="font-normal text-paper tracking-[-0.004em] mt-12 sm:mt-16 mb-5 sm:mb-6 text-[clamp(21px,2.9vw,32px)]">
              这个演示背后的<em className="em-gold">三个约束</em>
            </h2>
            <div className="hair-t">
              {NOTE.map((n) => (
                <div
                  key={n.k}
                  className="hair-b py-6 sm:py-7 px-1 hover:bg-gold-500/[0.03] transition-colors duration-300"
                >
                  <div className="font-display italic text-[12.5px] tracking-[0.22em] text-gold-500 mb-2.5">
                    {n.k}
                  </div>
                  <div className="text-[16px] text-paper mb-2">{n.t}</div>
                  <div className="text-[clamp(14px,1.65vw,16px)] leading-[1.9] text-paper/40">
                    {n.d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14 sm:mt-20">
            <Btn href="/match" solid lg>
              体验五维画像诊断
            </Btn>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
