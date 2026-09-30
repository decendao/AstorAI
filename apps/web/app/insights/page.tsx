import type { Metadata } from "next";
import Link from "next/link";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionMark } from "@/components/ui/Editorial";
import { POSTS, CATEGORIES, type Category } from "@/lib/posts";

export const metadata: Metadata = {
  title: "洞察 · AstorAI",
  description:
    "财富诊断、资产结构与圈层认知的深度内容。我们不写市场点评，只写需要想清楚才能回答的问题。",
  openGraph: {
    title: "洞察 · AstorAI",
    description: "我们不写市场点评，只写需要想清楚才能回答的问题。",
    type: "website",
  },
};

const FILTERS: (Category | "all")[] = [
  "all",
  "diagnosis",
  "structure",
  "circle",
  "trust",
];

function PostRow({ slug }: { slug: string }) {
  const p = POSTS.find((x) => x.slug === slug)!;
  return (
    <Link
      href={`/insights/${p.slug}`}
      className="hair-b block py-7 sm:py-11 px-1 hover:bg-gold-500/[0.03] hover:pl-4 transition-all duration-300"
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-3.5">
        <span className="font-display italic text-[12.5px] tracking-[0.2em] text-gold-500">
          {CATEGORIES[p.cat].en}
        </span>
        <span className="text-[11.5px] tracking-[0.08em] text-paper/20">{p.date}</span>
        <span className="text-[11.5px] tracking-[0.08em] text-paper/20 ml-auto">
          {p.read}
        </span>
      </div>
      <h2 className="font-normal text-paper leading-[1.45] tracking-[-0.003em] mb-3 text-[clamp(19px,2.5vw,28px)]">
        {p.title}
      </h2>
      <p className="text-[clamp(14px,1.65vw,16px)] leading-[1.9] text-paper/40 max-w-[82ch]">
        {p.lede}
      </p>
    </Link>
  );
}

export default function InsightsPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <section className="relative z-10 pt-28 sm:pt-36 pb-[clamp(110px,15vh,190px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Insights" cn="洞察" n="READING" />

          <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-6 sm:mb-8 text-[clamp(28px,5.4vw,60px)]">
            关于资产、判断，
            <br />
            以及<em className="em-gold">它们之间</em>的关系
          </h1>

          <p className="text-[clamp(15px,1.8vw,19px)] leading-[2.05] text-paper/40 max-w-[52ch] mb-10 sm:mb-14">
            我们不写市场点评，不写产品推荐。
            <br />
            我们写那些<em className="em-gold">需要想清楚</em>才能回答的问题。
          </p>

          {/* 分类筛选（静态分组，服务端渲染） */}
          <div className="hair-t hair-b flex flex-wrap gap-2 py-6 sm:py-7 mb-9 sm:mb-12">
            {FILTERS.map((f) => {
              const active = f === "all";
              const label = f === "all" ? "全部" : CATEGORIES[f].label;
              const count =
                f === "all" ? POSTS.length : POSTS.filter((p) => p.cat === f).length;
              if (f !== "all" && count === 0) return null;
              return (
                <span
                  key={f}
                  className={`px-4 sm:px-5 py-2.5 min-h-[40px] inline-flex items-center text-[12.5px] tracking-[0.08em] ${
                    active
                      ? "bg-gold-500 text-ink border border-gold-500"
                      : "border border-hair text-paper/25"
                  }`}
                >
                  {label}
                  <span className="ml-2 text-[10.5px] opacity-60">{count}</span>
                </span>
              );
            })}
          </div>

          <div className="hair-t">
            {POSTS.map((p) => (
              <PostRow key={p.slug} slug={p.slug} />
            ))}
          </div>

          <div className="mt-14 sm:mt-20 text-center">
            <Link
              href="/match"
              className="btn-line btn-line-solid px-9 sm:px-10 py-4 sm:py-[18px] text-[13px] sm:text-[15px] min-h-[52px] inline-flex"
            >
              <span className="relative z-[2]">免费做一次诊断 →</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
