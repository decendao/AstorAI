import Link from "next/link";

/**
 * 顶部导航栏
 * - 品牌 + 主导航 + 试用 CTA
 * - 滚动时增加玻璃背景 (sticky)
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur-md bg-ink-950/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-300 font-display font-medium">
            A
          </div>
          <span className="font-display text-lg tracking-wide">
            Astor <span className="text-gold-300">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <Link href="#survey-start" className="link-gold">诊断</Link>
          <Link href="#capabilities" className="link-gold">能力</Link>
          <Link href="#demo" className="link-gold">体验</Link>
          <Link href="#pricing" className="link-gold">价格</Link>
          <Link href="/agent" className="link-gold">AstorAgent</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm text-zinc-400 hover:text-zinc-200 transition px-3 py-1.5"
          >
            登录
          </Link>
          <Link
            href="/register?trial=1"
            className="btn-gold rounded-lg px-4 py-2 text-sm"
          >
            免费试用
          </Link>
        </div>
      </div>
    </header>
  );
}