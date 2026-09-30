import { SectionMark } from "@/components/ui/Editorial";

/**
 * 名字来源。
 *
 * ⚠️ 待你确认: 下面关于 "Astor" 的说明是基于这个词本身的历史含义
 *    (阿斯托尔家族 / 美国镀金时代的第一代巨富) 写的, 不是你们团队
 *    内部的取名故事 —— 那部分我不知道, 也不应该替你们编。
 *
 *    如果你们实际的取名理由和这里不一致(比如有更具体的由来、
 *    或者创始人本人的故事), 直接改这个数组里的文案即可,
 *    结构不用动。
 */
const ORIGIN = [
  {
    k: "姓氏",
    t: "一个 old money 的姓氏",
    d: "Astor 是西方财富史上最著名的姓氏之一。约翰·雅各布·阿斯托尔从皮毛贸易起家，成为美国第一位百万富翁；这个家族随后在地产、铁路与社交圈中延续了数代，成为“old money”的原型代名词。",
  },
  {
    k: "家族",
    t: "对应的是家族办公室",
    d: "真正管理这样一份家业的人不是银行，而是家族办公室——一支专门服务于单一家庭的团队。他们的工作不是交易，是在几代人之间翻译资产、翻译风险、翻译时间。",
  },
  {
    k: "隐喻",
    t: "我们想借的正是这一点",
    d: "不是豪车的排场，而是那种“把资产看得很长”的眼光。所以 Astor 指向的不是财富的规模，是财富的耐心。",
  },
];

export function NameOrigin() {
  return (
    <section id="name-origin" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="The Name" cn="名字的由来" n="00" />

        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[0.85fr_1.15fr] items-start">
          <div>
            <h2 className="font-display font-normal leading-[1.05] tracking-[0.01em] text-paper mb-6 text-[clamp(42px,7vw,86px)]">
              Astor
            </h2>
            <p className="text-[15px] sm:text-[18px] leading-[2.1] text-paper/40 max-w-[30ch]">
              一个关于耐心与传承的姓氏。
              <br />
              我们借它来命名这个智能体。
            </p>
          </div>

          <div className="hair-t">
            {ORIGIN.map((o) => (
              <div
                key={o.k}
                className="hair-b py-7 sm:py-9 grid sm:grid-cols-[auto_1fr] gap-3 sm:gap-9"
              >
                <div className="text-[11.5px] tracking-[0.22em] text-gold-500 min-w-[64px] pt-1.5">
                  {o.k}
                </div>
                <div>
                  <div className="text-[16px] sm:text-[21px] text-paper leading-[1.5] font-medium mb-3">
                    {o.t}
                  </div>
                  <p className="text-[14.5px] sm:text-[16.5px] leading-[2] text-paper/40 max-w-[58ch]">
                    {o.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
