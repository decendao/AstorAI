"use client";

import Link from "next/link";
import { Btn } from "@/components/ui/Editorial";

const NAV = [
  { href: "#manifesto", label: "为什么" },
  { href: "#believe", label: "我们相信" },
  { href: "#diagnose", label: "诊断" },
  { href: "#audit", label: "可信" },
  { href: "#pricing", label: "定价" },
  { href: "/insights", label: "洞察" },
];

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

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative text-[12px] tracking-[0.1em] text-paper/35 hover:text-gold-300 transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="shrink-0">
          <Btn href="#diagnose" className="!px-5 !py-2.5 !text-[12px] !min-h-[40px]">
            免费诊断
          </Btn>
        </div>
      </div>
    </header>
  );
}
