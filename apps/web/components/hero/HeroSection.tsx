"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FloatingParticles, FloatingOrb } from "@/components/ui/FloatingParticles";

/**
 * Hero 区 —— 大标题 + 漂浮粒子 + CTA + 双入口
 * 视觉参考: Gemini chat landing 的"中央交互区 + 周围信息漂浮"
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* 背景粒子 */}
      <FloatingParticles count={70} density={1.5} />

      {/* 漂浮光晕 */}
      <FloatingOrb size={420} color="rgba(212,166,74,0.22)" className="top-20 -left-32" />
      <FloatingOrb size={360} color="rgba(126,230,233,0.18)" className="bottom-10 right-0" delay={3} />
      <FloatingOrb size={280} color="rgba(167,139,250,0.15)" className="top-1/3 right-1/4" delay={6} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center">
        {/* 顶部小标 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold-300 animate-glow" />
          <span className="text-xs text-zinc-300">
            智能投研副驾 · 限时年付 ¥999
          </span>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight"
        >
          <span className="block text-gold-gradient">Astor AI</span>
          <span className="block text-zinc-100 mt-2 text-3xl sm:text-5xl lg:text-6xl">
            您的智能
            <span className="text-gold-gradient">投研副驾</span>
          </span>
        </motion.h1>

        {/* 副标 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          60 秒画像 · 36 题深度诊断 · AstorAgent 实时对话 · 投研日报 ·
          组合管理 · 风险预警。让 AI 成为您下一个投资决策的协同者。
        </motion.p>

        {/* 双 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#survey-start"
            className="btn-gold rounded-xl px-7 py-3.5 text-base"
          >
            开始 6 题画像诊断 →
          </Link>
          <Link
            href="/agent"
            className="btn-ghost rounded-xl px-7 py-3.5 text-base"
          >
            了解 AstorAgent
          </Link>
        </motion.div>

        {/* 信任栏 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-zinc-500"
        >
          <span>合规 · 投资建议由您独立判断</span>
          <span className="hidden sm:inline">·</span>
          <span>备案 · 浙 ICP 备 20xxxxxxx 号</span>
          <span className="hidden sm:inline">·</span>
          <span>数据 · 多模型路由 (zhipu/qwen/deepseek)</span>
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-16 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-zinc-600 text-sm"
          >
            ↓ 下滑开始诊断
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}