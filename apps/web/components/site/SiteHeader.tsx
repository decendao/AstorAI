"use client";

import Link from "next/link";
import { Btn } from "@/components/ui/Editorial";

/**
 * 导航项。
 *
 * 全部使用绝对路径（/#section），否则在 /insights、/astor 等子页面上
 * 相对锚点会失效（见 commit 2ac9bbd 修的就是这个）。
 *
 * 落点说明 —— 四项都指向首页真实存在的 section id，不做假链接：
 *   Astor 愿景    → #manifesto   Manifesto 宣言
 *   AI 智能体     → #capability  智能体能力（含边界声明）
 *   匹配你的 Astor → #diagnose    6 题问卷 → 五维画像
 *   联系我们      → #cta         页面底部行动区
 *
 * 注意: #cta 目前没有任何联系方式（无邮箱/电话/表单），
 * 详见 NAV 下方 TODO 注释。
 */
const NAV = [
  { href: "/#manifesto", label: "Astor愿景" },
  { href: "/#capability", label: "AI 智能体" },
  { href: "/#diagnose", label: "匹配你的Astor" },
  { href: "/#cta", label: "联系我们" },
];

/** 导航项的统一样式：hover 变金 + 下划线从左展开 */
const linkCls =
  "relative text-[12px] tracking-[0.1em] text-paper/35 hover:text-gold-300 transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-900/55 backdrop-blur-[22px] border-b border-gold-500/[0.14]">
      <div className="mx-auto max-w-shell px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-5">
        <Link href="/" className="flex items-baseline gap-3 min-w-0 shrink-0">
          <span className="font-display text-[17px] tracking-[0.15em] text-gold-500">AAA</span>
          <span className="text-[13.5px] tracking-[0.14em] text-paper whitespace-nowrap">
            AstorAI
          </span>
        </Link>

        {/* 桌面端: 四项横排 */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={linkCls}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="shrink-0">
          <Btn href="/#diagnose" className="!px-5 !py-2.5 !text-[12px] !min-h-[40px]">
            免费诊断
          </Btn>
        </div>
      </div>

      {/*
        移动端: 原来 lg 以下完全没有导航, 只能靠按钮跳转。
        现在四项标签都变长了, 横排会挤, 所以改成 logo 行下方一条
        横向可滚动的导航条 —— 触摸端横向滑动是自然手势, 比汉堡
        菜单少一次点击。
        lg 以上隐藏, 避免和桌面端横排重复。
      */}
      <nav className="lg:hidden border-t border-gold-500/[0.08]">
        <div className="mx-auto max-w-shell px-5 sm:px-8 flex items-center gap-7 overflow-x-auto thin-scroll py-3">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={linkCls}>
              {n.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
