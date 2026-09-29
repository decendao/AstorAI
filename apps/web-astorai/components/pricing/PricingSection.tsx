"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PRICING, formatCents } from "@/lib/pricing";

/**
 * 定价区 —— 简洁双卡
 * ¥99/月 · ¥999/年 (限时)
 * 突出年付折扣 + 7 天免费试用 (无信用卡)
 */
export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] text-gold-300 uppercase mb-3">
            统一价 · 限时年付
          </p>
          <h2 className="text-4xl sm:text-5xl font-display text-gold-gradient font-medium">
            简单定价, 不玩套路
          </h2>
          <p className="mt-4 text-zinc-400">
            个人与企业统一 ¥99/月, 限时年付 <strong className="text-gold-300">¥999</strong> (省 ¥189)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 月度卡 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-7 flex flex-col"
          >
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-xl text-zinc-100 font-medium">月度订阅</h3>
              <span className="text-xs text-zinc-500">灵活</span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl text-gold-gradient font-display font-medium">
                {formatCents(PRICING.monthly.priceCents)}
              </span>
              <span className="text-zinc-500">/ 月</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">随时取消, 按月计费</p>

            <ul className="mt-6 space-y-3 flex-1">
              {PRICING.monthly.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="text-gold-300 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/register?trial=1&plan=monthly`}
              className="btn-ghost mt-8 rounded-xl px-6 py-3.5 text-center"
            >
              {PRICING.monthly.cta}
            </Link>
            <p className="mt-2 text-center text-xs text-zinc-600">
              7 天免费 · 无需信用卡
            </p>
          </motion.div>

          {/* 年度卡 (突出) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-strong rounded-2xl p-7 flex flex-col relative overflow-hidden"
          >
            {/* 角标 */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs bg-gold-500/20 border border-gold-500/40 text-gold-300">
                {PRICING.yearly.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-xl text-zinc-100 font-medium">年度订阅 · 限时</h3>
              <span className="text-xs text-gold-300">推荐</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl text-gold-gradient font-display font-medium">
                {formatCents(PRICING.yearly.priceCents)}
              </span>
              <span className="text-zinc-500">/ 年</span>
              <span className="text-sm text-zinc-500 line-through ml-2">
                {formatCents(PRICING.yearly.originalPriceCents)}
              </span>
            </div>
            <p className="mt-2 text-xs text-gold-300">
              立省 {formatCents(PRICING.yearly.savingCents)} · 折合 ¥83 / 月
            </p>

            <ul className="mt-6 space-y-3 flex-1">
              {PRICING.yearly.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="text-gold-300 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/register?trial=1&plan=yearly`}
              className="btn-gold mt-8 rounded-xl px-6 py-3.5 text-center"
            >
              {PRICING.yearly.cta} →
            </Link>
            <p className="mt-2 text-center text-xs text-zinc-500">
              含 7 天免费试用 · 到期前 3 天邮件提醒
            </p>
          </motion.div>
        </div>

        {/* FAQ 简化 */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4 text-sm text-zinc-400">
          <div className="glass rounded-xl p-4">
            <p className="text-zinc-200 font-medium mb-1">需要信用卡吗?</p>
            <p>不需要, 7 天试用结束后再选择是否付费。</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-zinc-200 font-medium mb-1">发票怎么开?</p>
            <p>注册后于个人中心申请, 我们提供电子发票。</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-zinc-200 font-medium mb-1">支持退款吗?</p>
            <p>订阅 7 天内未使用核心功能可全额退款。</p>
          </div>
        </div>
      </div>
    </section>
  );
}