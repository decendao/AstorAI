import { SectionMark } from "@/components/ui/Editorial";

export function Contrast() {
  return (
    <section id="contrast" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="The Shift" cn="成本被重写" n="03" />

        <div className="hair-t hair-b grid lg:grid-cols-[1fr_auto_1fr] max-w-[1000px] mx-auto">
          <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 text-center">
            <div className="font-display font-normal tracking-[-0.02em] leading-none mb-4 sm:mb-6 text-[clamp(38px,8.4vw,110px)] text-paper/[0.13]">
              1000万
            </div>
            <div className="text-[12px] sm:text-[14px] tracking-[0.2em] text-paper/25 leading-[2]">
              传统私人银行
              <br />
              准入门槛
            </div>
            <p className="text-[14px] sm:text-[17px] leading-[1.9] text-paper/40 mt-4 sm:mt-6 max-w-[42ch] mx-auto">
              分析师、律师、税务师，一个团队一年数百万起。
              <br />
              绝大多数家庭被这道门槛挡在门外。
            </p>
          </div>

          <div className="flex items-center justify-center py-6 lg:py-0 px-5 sm:px-8 hair-x font-display italic text-[13px] sm:text-[16px] tracking-[0.16em] lg:writing-v text-gold-500 text-center leading-[1.8]">
            同样的方法论
            <br />
            一支 AI 团队
          </div>

          <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 text-center">
            <div className="font-display font-normal italic tracking-[-0.02em] leading-none mb-4 sm:mb-6 text-[clamp(38px,8.4vw,110px)] text-gold-500">
              ¥100
            </div>
            <div className="text-[12px] sm:text-[14px] tracking-[0.2em] text-gold-500 leading-[2]">
              AstorAI
              <br />
              每月
            </div>
            <p className="text-[14px] sm:text-[17px] leading-[1.9] text-paper/40 mt-4 sm:mt-6 max-w-[42ch] mx-auto">
              我们做的不是私行的平替，是<em className="em-gold">前置环节</em>。
              <br />
              复杂资产状况 → 一份清晰、可审计的诊断报告。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
