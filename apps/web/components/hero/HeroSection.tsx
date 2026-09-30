import { Btn } from "@/components/ui/Editorial";

export function HeroSection() {
  const meta = [
    { k: "Est. MMXXVI", v: "上海 · 始于 2026" },
    { k: "¥100 / 月", v: "普惠订阅 · 零资产门槛" },
    { k: "0%", v: "来自产品抽成与分佣" },
  ];

  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center pt-28 sm:pt-36 pb-16">
      <div className="mx-auto max-w-shell px-5 sm:px-8 w-full">
        {/*
          原为 "AAA" 三字母字标, 字号给到 clamp(72px,20vw,190px)。
          换成 "Astor Agent" 后有 11 个字符, 沿用原字号会横向溢出,
          因此单独下调一档并保持金色重音落在 "Agent" 上。
        */}
        <h1 className="font-display font-normal leading-[0.98] tracking-[0.01em] text-paper mb-4 sm:mb-5 text-[clamp(40px,8.6vw,104px)]">
          Astor <em className="em-gold not-italic">Agent</em>
        </h1>

        <h2 className="font-bold tracking-[-0.02em] text-paper leading-[1.14] mb-8 sm:mb-11 text-[clamp(30px,6.6vw,76px)] max-w-[14ch]">
          一个比你
          <br />
          <em className="em-gold">更懂你资产</em>的
          <br />
          智能体
        </h2>

        <p className="text-[15px] sm:text-[19px] leading-[2] text-paper/40 max-w-[46ch] mb-10 sm:mb-14">
          我们不在这里交易你的资产，
          <br />
          我们在帮你
          <em className="em-gold">透过资产理解自己</em>。
        </p>

        <div className="flex flex-wrap gap-3.5 mb-5">
          <Btn href="/match" solid lg>
            免费获取我的财富诊断
          </Btn>
          <Btn href="/agent" lg>
            了解 AstorAI 如何工作
          </Btn>
        </div>
        <div className="text-[12.5px] tracking-[0.04em] text-paper/20 mb-14 sm:mb-20">
          6 道题 · 约 2 分钟 · 无需注册
        </div>

        <div className="hair-t pt-7 sm:pt-10 flex flex-wrap gap-x-8 sm:gap-x-20 gap-y-6">
          {meta.map((m) => (
            <div key={m.k}>
              <div className="font-display text-[16px] sm:text-[24px] tracking-[0.08em] text-paper mb-1.5">
                {m.k.includes("Est") ? <em className="em-gold">{m.k}</em> : m.k}
              </div>
              <div className="text-[12px] tracking-[0.08em] text-paper/25">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
