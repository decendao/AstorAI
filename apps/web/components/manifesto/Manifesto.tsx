import { SectionMark } from "@/components/ui/Editorial";

export function Manifesto() {
  return (
    <section id="manifesto" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="Manifesto" cn="为什么存在" n="01" />

        <div className="max-w-prose">
          <p className="font-bold tracking-[-0.01em] text-paper leading-[1.82] mb-[clamp(30px,4vw,48px)] text-[clamp(20px,2.8vw,34px)]">
            几十年来，最好的金融指引，
            <br />
            始终留给<em className="em-gold">最不需要它</em>的人。
          </p>

          <p className="text-[15px] sm:text-[18.5px] leading-[2.15] text-paper/40 mb-5 sm:mb-6">
            这些服务一直存在 —— 藏在七位数起步的门槛，和百分之一的费率背后。
            如果你尚未富有，大门紧闭。
          </p>

          <p className="text-[15px] sm:text-[18.5px] leading-[2.15] text-paper/40 mb-5 sm:mb-6">
            与此同时，高净值投资者也只能独自摸索。独自在复杂的资产结构里寻找方向。
            独自面对市场波动时，每一个本能都在尖叫"卖出"的时刻。
          </p>

          <p className="pull text-[clamp(17px,2.15vw,25px)] leading-[1.9] text-paper my-[clamp(30px,4vw,48px)]">
            这个行业给了你更多的产品货架，并称之为"专业"。
            <br />
            但一个产品货架的访问权，
            <em className="em-gold">并不等于理解的访问权</em>。
          </p>

          <p className="text-[15px] sm:text-[18.5px] leading-[2.15] text-paper/40 mb-5 sm:mb-6">
            AI 改变了这一切。第一次，个性化诊断可以规模化运作。
            一位家族办公室对亿万级资产负债表所用的同等深度的分析，
            如今可以持续地、私密地、<em className="em-gold">不带任何议程地</em>交付给每一位严肃的投资者。
          </p>

          <p className="text-[clamp(18px,2.3vw,27px)] leading-[1.88] text-gold-500">
            这就是 AstorAI 所做的。
            <br />
            <br />
            不是套了金融外壳的聊天机器人。一个真正的私人银行家智能体，
            理解资产背后的人，用平实的语言告诉你<em>什么才真正重要</em>。
          </p>
        </div>
      </div>
    </section>
  );
}
