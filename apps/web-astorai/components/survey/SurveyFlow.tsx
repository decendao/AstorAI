"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SURVEY_QUESTIONS,
  extractSignals,
  type SurveyAnswers,
  type PrimaryProfile,
} from "@/lib/survey-questions";
import { ReportPanel } from "@/components/report/ReportPanel";

/**
 * 6 题问卷 —— Typeform 全屏切换风
 * - 一次一题, 占据视口
 * - 顶部进度条 (1/6)
 * - 左侧信号反馈粒子 (漂浮)
 * - 答完一题 → 0.5s 切下一题
 * - 6 题完成 → 自动滑出报告 (Apple Health 浅色面板)
 */
export function SurveyFlow() {
  const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<PrimaryProfile | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = SURVEY_QUESTIONS[currentIdx];
  const total = SURVEY_QUESTIONS.length;
  const progress = (Object.keys(answers).length / total) * 100;
  const signals = extractSignals(answers);

  const handleSelect = (value: string) => {
    if (completed) return;
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);
    // 600ms 后切到下一题 (让信号卡片先浮现)
    setTimeout(() => {
      if (currentIdx < total - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        // 全部答完, 计算画像 + 弹出报告
        // 用 setTimeout 推迟一帧, 确保最后一题的信号已浮现
        setTimeout(() => {
          import("@/lib/survey-questions").then(({ computePrimaryProfile }) => {
            const p = computePrimaryProfile(newAnswers as SurveyAnswers);
            setProfile(p);
            setCompleted(true);
          });
        }, 200);
      }
    }, 600);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) setCurrentIdx(i => i + 1);
  };

  const reset = useCallback(() => {
    setAnswers({});
    setCurrentIdx(0);
    setCompleted(false);
    setProfile(null);
  }, []);

  // 键盘导航: 1-4 数字键快速选择
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (completed) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= current.options.length) {
        handleSelect(current.options[num - 1].value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIdx, completed, current]);

  return (
    <section
      id="survey-start"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 px-4 sm:px-8"
    >
      {/* 背景漂浮粒子 (弱化, 让深色系漂浮感保留) */}
      <FloatingDots />

      {/* 顶部进度条 */}
      <div className="fixed top-16 left-0 right-0 z-20 px-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-2 text-xs text-zinc-400">
            <span>第 {Math.min(currentIdx + 1, total)} 题 / 共 {total} 题</span>
            <span className="text-gold-300">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #d4a64a 0%, #fde9b8 100%)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* 左侧信号反馈 (sticky, 漂浮卡) */}
      <aside className="hidden lg:block fixed left-8 top-32 w-64 z-10 pointer-events-none">
        <SignalPanel signals={signals} answeredCount={Object.keys(answers).length} total={total} />
      </aside>

      {/* 右侧浮动 meta (深空粒子区) */}
      <aside className="hidden lg:block fixed right-8 top-32 w-56 z-10 pointer-events-none">
        <MetaCard />
      </aside>

      {/* 中央题目区 */}
      <div className="relative z-10 w-full max-w-3xl">
        {!completed && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.45 }}
              className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            >
              {/* 角标: 题号 */}
              <div className="absolute top-6 right-6 text-xs tracking-widest text-zinc-600">
                {String(currentIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>

              <h2 className="text-3xl sm:text-4xl font-display text-zinc-100 font-medium leading-tight">
                {current.title}
              </h2>
              {current.subtitle && (
                <p className="mt-3 text-zinc-500 text-sm sm:text-base">{current.subtitle}</p>
              )}

              {/* 选项 */}
              <div className="mt-8 space-y-3">
                {current.options.map((opt, i) => {
                  const isSelected = answers[current.id] === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      onClick={() => handleSelect(opt.value)}
                      className={`opt-card w-full text-left rounded-xl px-5 py-4 border bg-white/[0.02] flex items-center gap-4 group ${
                        isSelected
                          ? "selected border-gold-500/70 bg-gold-500/10"
                          : "border-white/10 hover:border-gold-500/40"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-medium transition ${
                          isSelected
                            ? "border-gold-500 bg-gold-500/20 text-gold-300"
                            : "border-white/15 text-zinc-500 group-hover:border-gold-500/40"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-base ${isSelected ? "text-zinc-100" : "text-zinc-300"}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="text-gold-300"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* 快捷键提示 */}
              <div className="mt-8 flex items-center justify-between text-xs text-zinc-600">
                <span>
                  快捷键: 按 <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 mx-1">1</kbd>-
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 mx-1">{current.options.length}</kbd>
                  选择
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-30 hover:border-gold-500/40 transition"
                  >
                    ← 上一题
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!answers[current.id]}
                    className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-30 hover:border-gold-500/40 transition"
                  >
                    下一题 →
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 报告弹层 (Apple Health 风) */}
      <AnimatePresence>
        {completed && profile && (
          <ReportPanel
            profile={profile}
            answers={answers as SurveyAnswers}
            onClose={reset}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- 信号面板 (左侧) ---------------- */
function SignalPanel({
  signals,
  answeredCount,
  total,
}: { signals: string[]; answeredCount: number; total: number }) {
  return (
    <motion.div
      layout
      className="glass rounded-2xl p-5 pointer-events-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs tracking-widest text-gold-300 uppercase">实时信号</span>
        <span className="text-xs text-zinc-500">{answeredCount}/{total}</span>
      </div>
      <div className="space-y-2 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {signals.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-zinc-600 text-xs italic"
            >
              回答第一题, 实时捕捉您的投资信号...
            </motion.p>
          ) : (
            signals.slice(-5).map((s, i) => (
              <motion.div
                key={`${s}-${i}`}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="text-xs text-zinc-200 flex items-start gap-2"
              >
                <span className="w-1 h-1 mt-1.5 rounded-full bg-gold-300 animate-glow shrink-0" />
                <span>{s}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ---------------- Meta 卡 (右侧漂浮) ---------------- */
function MetaCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0, 8, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="glass rounded-2xl p-5 text-xs"
    >
      <p className="text-zinc-400 mb-2">Astor Agent 状态</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-glow" />
        <span className="text-zinc-200">在线 · 待命</span>
      </div>
      <p className="mt-3 text-zinc-500 leading-relaxed">
        每答一题, AstorAgent 都会更新对您的理解。
      </p>
    </motion.div>
  );
}

/* ---------------- 背景漂浮粒子 (CSS only) ---------------- */
function FloatingDots() {
  return (
    <div className="particle-canvas" aria-hidden>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            background: ["#d4a64a", "#7ee6e9", "#a78bfa", "#fb7185"][i % 4],
            opacity: 0.3 + Math.random() * 0.4,
          }}
          animate={{
            y: [0, -20 - Math.random() * 15, 0, 20 + Math.random() * 10, 0],
            x: [0, 15, 0, -15, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}