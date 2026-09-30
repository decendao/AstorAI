"use client";

import Link from "next/link";
import { Btn } from "@/components/ui/Editorial";

/**
 * 导航项。
 *
 * 全部使用绝对路径（/#section），否则在 /insights、/astor 等子页面上
 * 相对锚点会失效（见 commit 2ac9bbd 修的就是这个）。
 *
 * 四项各自对应一个 subpage（landing 精简后，深度内容已下沉）：
 *   Astor 愿景     → /vision   Manifesto + 我们相信 + 旧方式对比
 *   AI 智能体      → /agent    能力 + 审计可信 + 定价
 *   匹配你的 Astor  → /match    6 题问卷 → 五维画像
 *   联系我们       → /contact  运营主体 + 服务边界
 *
 * 注意: /contact 目前仍无邮箱/电话/表单（站内无任何联系方式），
 * 见 components/contact/ContactSection.tsx 的 CHANNELS 配置。
 */
const NAV = [
  { href: "/vision", label: "Astor愿景" },
  { href: "/agent", label: "AI 智能体" },
  { href: "/match", label: "匹配你的Astor" },
  { href: "/contact", label: "联系我们" },
];

/** 导航项的统一样式：hover 变金 + 下划线从左展开 */
const linkCls =
  "relative text-[12px] tracking-[0.1em] text-paper/35 hover:text-gold-300 transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-900/55 backdrop-blur-[22px] border-b border-gold-500/[0.14]">
      <div className="mx-auto max-w-shell px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-5">
        <Link href="/" className="flex items-baseline gap-2.5 min-w-0 shrink-0">
          <span className="font-display text-[17px] tracking-[0.1em] text-gold-500 whitespace-nowrap">
            Astor Agent
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
          <Btn href="/match" className="!px-5 !py-2.5 !text-[12px] !min-h-[40px]">
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
