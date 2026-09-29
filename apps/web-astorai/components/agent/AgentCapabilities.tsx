"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Capability {
  icon: string;
  title: string;
  desc: string;
  metric: string;
  color: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: "◎",
    title: "实时对话投研",
    desc: "AstorAgent 7×24 在线, 行情 / 政策 / 资金流向 / 行业事件一触即达。",
    metric: "< 800ms 首响",
    color: "rgba(212,166,74,0.25)",
  },
  {
    icon: "◈",
    title: "36 题深度诊断",
    desc: "基于 200 个细分赛道的画像引擎, 输出可执行的研究主题与策略建议。",
    metric: "200+ 子赛道",
    color: "rgba(126,230,233,0.25)",
  },
  {
    icon: "◊",
    title: "多模型智能路由",
    desc: "zhipu GLM-4 / qwen-max / deepseek 自动匹配, 速度与深度双优。",
    metric: "3 模型协同",
    color: "rgba(167,139,250,0.25)",
  },
  {
    icon: "◆",
    title: "组合 + 风险管理",
    desc: "≤ 3 个组合管理 / 自动再平衡 / 风险预警 / 周报推送。",
    metric: "实时监控",
    color: "rgba(251,113,133,0.25)",
  },
  {
    icon: "▣",
    title: "数据飞轮自学习",
    desc: "每次对话沉淀反馈, 周级 LoRA 微调, 模型越用越准。",
    metric: "周级迭代",
    color: "rgba(212,166,74,0.2)",
  },
  {
    icon: "▤",
    title: "合规 + 隐私",
    desc: "红线扫描 · 加密存储 · 审计可追溯。投资建议由您独立判断。",
    metric: "等保二级",
    color: "rgba(126,230,233,0.2)",
  },
];

/**
 * AstorAgent 完整能力 —— 6 张浮动卡
 * 鼠标悬停聚焦 (scale + glow)
 */
export function AgentCapabilities() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] text-gold-300 uppercase mb-3">
            AstorAgent · 完整能力
          </p>
          <h2 className="text-4xl sm:text-5xl font-display text-gold-gradient font-medium">
            一个 AI 副驾, 顶一个研究团队
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            从画像到组合, 从对话到执行 —— AstorAgent
            在您的投资决策链路上提供<strong className="text-zinc-200">协同而非替代</strong>。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              onHoverStart={() => setHover(i)}
              onHoverEnd={() => setHover(null)}
              animate={{
                scale: hover === i ? 1.03 : 1,
              }}
              className="glass rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
              style={{
                borderColor: hover === i ? "rgba(212,166,74,0.5)" : undefined,
              }}
            >
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: c.color }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl text-gold-300">{c.icon}</span>
                  <span className="text-xs text-zinc-500 px-2 py-0.5 rounded-full border border-white/10">
                    {c.metric}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-zinc-100">{c.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}