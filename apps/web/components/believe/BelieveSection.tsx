import { SectionMark } from "@/components/ui/Editorial";

const BELIEFS = [
  {
    n: "I",
    t: "诊断先于配置",
    d: "没有体检报告的治疗都是碰运气，财富管理也一样。在你决定钱怎么放之前，先搞清楚你到底有什么。",
  },
  {
    n: "II",
    t: "感觉会骗人，画像不会",
    d: "风险姿态、资源贡献、人脉位置 —— 这些维度需要被量化，而不是被感觉。",
  },
  {
    n: "III",
    t: "信任来自透明，而非承诺",
    d: "我们不承诺收益，我们公开每一次 LLM 调用、每一次审计事件、每一次人工审批。",
  },
  {
    n: "IV",
    t: "AI 应该增强判断，而非替代判断",
    d: "AI 只出草稿，人批准才生效。我们不做那个最后按下确认键的人。",
  },
  {
    n: "V",
    t: "清晰会复利",
    d: "一次系统的诊断，会持续影响未来十年的每一个决策。这就是我们做的事。",
  },
];

export function BelieveSection() {
  return (
    <section id="believe" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="What We Believe" cn="我们相信" n="02" />

        <h2 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-[clamp(44px,6vw,80px)] text-[clamp(28px,5.4vw,60px)]">
          五件我们<em className="em-gold">不接受妥协</em>的事
        </h2>

        <div className="hair-t">
          {BELIEFS.map((b) => (
            <div
              key={b.n}
              className="hair-b grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-10 py-7 sm:py-11 px-1 hover:bg-gold-500/[0.03] hover:pl-4 transition-all duration-300"
            >
              <div className="font-display italic text-[20px] sm:text-[30px] text-gold-500 leading-none min-w-[42px] tracking-[0.05em]">
                {b.n}
              </div>
              <div>
                <div className="text-[16px] sm:text-[22px] text-paper leading-[1.5] font-medium mb-2.5">
                  {b.t}
                </div>
                <div className="text-[14px] sm:text-[16.5px] leading-[1.95] text-paper/40 max-w-[60ch]">
                  {b.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
