import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 类名合并 — shadcn/ui 标准实现。
 * 用于所有需要 conditional class 的组件。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 日期格式化 — ISO 字符串 → 中文友好展示。
 */
export function formatDate(iso: string | Date, opts: { withTime?: boolean } = {}): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  if (!opts.withTime) return `${y}-${m}-${day}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

/** 分→元 */
export function centsToYuan(cents: number): number {
  return Math.round(cents) / 100;
}

/** 元→分 */
export function yuanToCents(yuan: number): number {
  return Math.round(yuan * 100);
}

/** 简单 mask: 13800138000 → 138****8000 */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone;
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}

/** 邮箱 mask: a@b.com → a***@b.com */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const head = user.slice(0, 1);
  return `${head}***@${domain}`;
}