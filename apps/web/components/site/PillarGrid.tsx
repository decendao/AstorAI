import Link from "next/link";

/**
 * landing page 的四个内容入口。
 *
 * landing 精简后, 深度内容全部下沉到 subpage; 首页只负责两件事:
 * 一屏说清我们是谁 (Hero), 以及把人送到对应的那一页。
 */
const PILLARS = [
  {
    href: "/vision",
    n: "01",
    en: "Vision",
    title: "Astor 愿景",
    desc: "我们不做推荐、不做交易、不承诺收益。我们只帮你透过资产理解自己。",
  },
  {
    href: "/agent",
    n: "02",
    en: "Agent",
    title: "AI 智能体",
    desc: "Analyzer → Reporter → Reviewer 三段流水线。AI 出草稿，人批准。",
  },
  {
    href: "/match",
    n: "03",
    en: "Match",
    title: "匹配你的 Astor",
    desc: "6 道题，约 2 分钟，无需注册。输出可审计的五维财富画像。",
  },
  {
    href: "/contact",
    n: "04",
    en: "Contact",
    title: "联系我们",
    desc: "运营主体、服务边界与联系渠道。哪怕只是想先聊聊。",
  },
];

export function PillarGrid() {
  return (
    <section
      id="pillars"
      className="relative z-10 hair-t py-[clamp(80px,11vh,140px)]"
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="grid gap-px bg-gold-500/[0.12] sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative bg-ink-900 px-6 sm:px-7 py-9 sm:py-11 flex flex-col transition-colors duration-300 hover:bg-ink-900/40"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-display text-[13px] tracking-[0.2em] text-gold-500">
                  {p.n}
                </span>
                <span className="text-[10.5px] tracking-[0.22em] text-paper/20 group-hover:text-gold-500/60 transition-colors">
                  {p.en}
                </span>
              </div>

              <div className="font-bold text-[19px] sm:text-[21px] leading-[1.3] text-paper mb-3.5 group-hover:text-gold-300 transition-colors duration-300">
                {p.title}
              </div>

              <p className="text-[14px] leading-[1.95] text-paper/35 mb-6 flex-1">
                {p.desc}
              </p>

              <span className="text-[11.5px] tracking-[0.16em] text-paper/25 group-hover:text-gold-300 transition-colors duration-300 inline-flex items-center gap-2">
                进入
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
