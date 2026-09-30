import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Btn } from "@/components/ui/Editorial";
import { POSTS, CATEGORIES, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const p = getPost(slug);
    if (!p) return { title: "未找到 · AstorAI" };
    return {
      title: `${p.title} · AstorAI`,
      description: p.lede,
      openGraph: {
        title: p.title,
        description: p.lede,
        type: "article",
        publishedTime: p.date,
      },
    };
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = post.related
    .map((s) => getPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />

      <article className="relative z-10 pt-28 sm:pt-36 pb-[clamp(60px,8vw,100px)]">
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <div className="max-w-prose mx-auto">
            {/* head */}
            <header className="mb-9 sm:mb-14">
              <Link
                href="/insights"
                className="font-display italic text-[12.5px] tracking-[0.2em] text-gold-500 hover:underline inline-block mb-5 sm:mb-6"
              >
                Insight · {CATEGORIES[post.cat].label}
              </Link>

              <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.22] mb-6 sm:mb-7 text-[clamp(28px,4.6vw,52px)]">
                {post.title}
              </h1>

              <p className="text-[clamp(16px,2vw,20px)] leading-[1.95] text-paper/40 max-w-[72ch] mb-7 sm:mb-8">
                {post.lede}
              </p>

              <div className="hair-t hair-b flex flex-wrap gap-x-6 gap-y-2 py-4 text-[11.5px] tracking-[0.1em] text-paper/20">
                <span>{post.date}</span>
                <span>{post.read} read</span>
                <span>By AstorAI Research</span>
              </div>
            </header>

            {/* body */}
            <ArticleBody blocks={post.blocks} />

            {/* inline CTA */}
            <div className="border-y border-gold-500 text-center py-9 sm:py-12 my-10 sm:my-14">
              <div className="text-[clamp(18px,2.3vw,26px)] text-paper mb-2.5">
                先诊断，<em className="em-gold">再配置</em>
              </div>
              <div className="text-[14.5px] text-paper/40 leading-[1.85] mb-6 sm:mb-7">
                6 道题，2 分钟。你会知道现在最该处理的是哪一件事。
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Btn href="/match" solid>
                  免费获取我的财富诊断
                </Btn>
                <Btn href="/agent#pricing">先看定价</Btn>
              </div>
            </div>

            {/* related */}
            {related.length > 0 && (
              <div className="mt-10 sm:mt-14 pt-7 sm:pt-9 hair-t">
                <div className="font-display italic text-[12.5px] tracking-[0.22em] text-gold-500 mb-2">
                  Related
                </div>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/insights/${r.slug}`}
                    className="hair-b flex items-baseline justify-between gap-5 py-4 sm:py-5 px-1 text-paper/40 hover:text-gold-300 hover:pl-4 transition-all duration-300"
                  >
                    <span className="text-[clamp(15px,1.8vw,18px)]">{r.title}</span>
                    <span className="font-display text-paper/20 shrink-0">→</span>
                  </Link>
                ))}
              </div>
            )}

            {/* disclaimer */}
            <div className="hair-t pt-7 sm:pt-9 mt-8 sm:mt-10 text-[11.5px] leading-[2] text-paper/[0.22]">
              <div className="block text-paper/35 tracking-[0.22em] mb-3">DISCLAIMER</div>
              本文为 AstorAI 研究观点与一般性信息，不构成投资建议、要约或承诺，不构成对任何产品收益的保证。
              任何投资决策请咨询具备相应资质的持牌机构。市场有风险，投资需谨慎。
            </div>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
