/**
 * Astor AI 价格常量
 * 商业策略:
 *   - 个人/企业统一口径 ¥99/月
 *   - 年度订阅限时 ¥999 (省 ¥189, 等同 8.3 折)
 *   - 7 天免费试用 (无需信用卡)
 */
export const PRICING = {
  monthly: {
    priceCents: 9900,
    currency: "CNY",
    periodLabel: "1 个月",
    features: [
      "AstorAgent 无限对话",
      "6 题画像 + 完整 36 题诊断",
      "实时行情 + 投研日报",
      "组合管理 (≤ 3 个)",
      "微信公众号推送",
    ],
    cta: "开始 7 天免费试用",
  },
  yearly: {
    priceCents: 99900,
    currency: "CNY",
    periodLabel: "12 个月",
    originalPriceCents: 118800, // 12 × 99
    savingCents: 18900,
    badge: "限时 · 立省 ¥189",
    features: [
      "包含月度版的全部权益",
      "私享会席位 9 折",
      "1 对 1 投研助理 1 次/月",
      "优先接入新模型 (DeepSeek / Qwen-Max)",
      "白皮书 + 内部研报订阅",
    ],
    cta: "锁定年度 ¥999",
  },
  trial: {
    days: 7,
    requireCreditCard: false,
    autoChargeAfterDays: 7,
    reminderDaysBefore: 3,
  },
} as const;

export function formatCents(cents: number): string {
  return `¥${(cents / 100).toFixed(0)}`;
}