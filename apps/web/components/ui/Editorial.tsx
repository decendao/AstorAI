import Link from "next/link";

/** 章节标记 — THE PROBLEM · 问题 ____ 01 */
export function SectionMark({
  en,
  cn,
  n,
}: {
  en: string;
  cn: string;
  n: string;
}) {
  return (
    <div className="flex items-center gap-4 sm:gap-5 mb-10 sm:mb-16 flex-wrap">
      <span className="smark-en">{en}</span>
      <span className="smark-cn">{cn}</span>
      <span className="flex-1 min-w-[40px] h-px bg-gold-500/20" />
      <span className="smark-n">{n}</span>
    </div>
  );
}

/** 描边按钮 + 翻转 */
export function Btn({
  children,
  href,
  solid = false,
  lg = false,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  solid?: boolean;
  lg?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`btn-line ${solid ? "btn-line-solid" : ""} ${
        lg ? "px-9 sm:px-10 py-4 sm:py-[18px] text-[13px] sm:text-[14.5px] min-h-[52px]" : "px-7 py-3 text-[13px] min-h-[46px]"
      } ${className}`}
    >
      <span className="relative z-[2]">{children}</span>
    </Link>
  );
}
