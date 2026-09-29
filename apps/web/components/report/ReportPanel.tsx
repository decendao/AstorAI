"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
  RadialBarChart, RadialBar,
} from "recharts";
import {
  type PrimaryProfile,
  type SurveyAnswers,
  SURVEY_QUESTIONS,
} from "@/lib/survey-questions";

/**
 * 初级画像报告 —— Apple Health 风
 * - 浅色背景 (反差营造洞察感)
 * - 大数字 + 圆环 + 留白 + 圆润字体
 * - 信息分层: 顶部 Hero metric → 雷达 → 标签 → CTA
 */
export function ReportPanel({
  profile,
  answers,
  onClose,
}: {
  profile: PrimaryProfile;
  answers: SurveyAnswers;
  onClose: () => void;
}) {
  const radarData = Object.entries(profile.dim).map(([k, v]) => ({
    dim: k,
    value: Math.round(v * 100),
  }));

  // 综合得分 (五维加权)
  const overallScore = Math.round(
    Object.values(profile.dim).reduce((s, v) => s + v, 0) / 5 * 100,
  );

  const sectorLabel = profile.recommendedSector;
  const goalLabel = SURVEY_QUESTIONS.find(q => q.id === "goal")!
    .options.find(o => o.value === answers.goal)?.label;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background:
          "radial-gradient(ellipse at top, #fef9ed 0%, #f5f1e8 50%, #ebe5d6 100%)",
      }}
    >
      <div className="min-h-screen px-4 sm:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          {/* 顶部 Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start justify-between mb-8"
          >
            <div>
              <p className="text-xs tracking-[0.3em] text-amber-700 uppercase mb-2">
                Astor AI · 初级画像报告
              </p>
              <h1 className="text-3xl sm:text-4xl font-display text-stone-900 font-medium">
                您的投资画像
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                基于 6 题回答生成 · {new Date().toLocaleDateString("zh-CN")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 w-10 h-10 rounded-full bg-white/60 border border-stone-200 flex items-center justify-center transition"
              aria-label="关闭报告"
            >
              ✕
            </button>
          </motion.div>

          {/* Hero metric card —— 大数字 + 圆环 (Health 风核心) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-sm border border-stone-200/60 mb-6"
          >
            <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="text-xs tracking-widest text-stone-500 uppercase mb-3">
                  综合画像得分
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl sm:text-8xl font-display text-amber-600 font-light tabular-nums">
                    {overallScore}
                  </span>
                  <span className="text-2xl text-stone-400 font-light">/ 100</span>
                </div>
                <p className="mt-4 text-stone-700 leading-relaxed">
                  您是一位 <strong className="text-stone-900">{profile.headline}</strong>
                  , 关注 <strong className="text-stone-900">{sectorLabel}</strong>,
                  主要目标为 <strong className="text-stone-900">{goalLabel}</strong>。
                </p>

                {/* 风险等级 + 标签 */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <HealthBadge level={profile.riskLevel} />
                  {profile.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs bg-amber-50 border border-amber-200 text-amber-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 圆环 (Health 标志性视觉) */}
              <div className="relative">
                <ScoreRing score={overallScore} />
              </div>
            </div>
          </motion.div>

          {/* 五维雷达 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-stone-200/60 mb-6"
          >
            <h3 className="text-lg text-stone-900 mb-1 font-medium">五维画像分布</h3>
            <p className="text-xs text-stone-500 mb-6">
              基于您 6 题回答, 各维度标准化得分 (0-100)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e7e5e4" />
                <PolarAngleAxis
                  dataKey="dim"
                  tick={{ fill: "#78716c", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90} domain={[0, 100]}
                  tick={{ fill: "#a8a29e", fontSize: 10 }}
                  stroke="#e7e5e4"
                />
                <Radar
                  name="画像"
                  dataKey="value"
                  stroke="#d97706"
                  fill="#d97706"
                  fillOpacity={0.25}
                  animationDuration={1800}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* 维度数字 (Health 列表) */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {radarData.map(d => (
                <div key={d.dim} className="text-center py-2">
                  <div className="text-2xl font-light text-stone-900 tabular-nums">
                    {d.value}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">{d.dim}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 答卷概览 (Health 列表风) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-stone-200/60 mb-6"
          >
            <h3 className="text-lg text-stone-900 mb-4 font-medium">回答概览</h3>
            <div className="divide-y divide-stone-200/60">
              {SURVEY_QUESTIONS.map(q => {
                const v = q.options.find(o => o.value === answers[q.id as keyof SurveyAnswers]);
                return (
                  <div key={q.id} className="flex items-center justify-between py-3">
                    <span className="text-sm text-stone-500">{q.title.replace("?", "")}</span>
                    <span className="text-sm text-stone-900 font-medium">{v?.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 深度解锁 CTA —— Health 强提示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl p-8 sm:p-10 shadow-sm border border-amber-200/60 mb-6"
          >
            <p className="text-xs tracking-widest text-amber-700 uppercase mb-2">
              下一步
            </p>
            <h3 className="text-2xl sm:text-3xl text-stone-900 font-medium mb-4">
              解锁 <strong className="text-amber-700">36 题深度诊断</strong>
            </h3>

            <ul className="space-y-3 text-sm text-stone-700 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-lg leading-none">•</span>
                <span>基于您的赛道与周期, 推送 <strong>5 个个性化研究主题</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-lg leading-none">•</span>
                <span>AstorAgent 实时对话 (行情 / 政策 / 资金流向)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-lg leading-none">•</span>
                <span>组合管理 + 风险预警 + 周报</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 text-lg leading-none">•</span>
                <span><strong className="text-amber-700">7 天免费试用</strong>, 无需信用卡</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/register?trial=1&sector=${answers.sector}&goal=${answers.goal}`}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl px-6 py-4 text-center font-medium transition"
              >
                开始 7 天免费试用 →
              </Link>
              <Link
                href={`/login`}
                className="bg-white/70 hover:bg-white border border-stone-300 text-stone-900 rounded-2xl px-6 py-4 text-center font-medium transition"
              >
                已有账号 · 登录
              </Link>
            </div>
          </motion.div>

          {/* 合规 */}
          <p className="text-xs text-stone-500 text-center px-4 pb-8">
            * 本报告基于您提供的回答生成, 仅用于个性化推荐与研究参考,
            不构成任何投资建议或承诺。投资有风险, 决策需谨慎。
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- 综合得分圆环 (Health 标志) ---------------- */
function ScoreRing({ score }: { score: number }) {
  const data = [{ name: "score", value: score, fill: "#d97706" }];
  return (
    <div className="relative" style={{ width: 180, height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          innerRadius="80%"
          outerRadius="100%"
          startAngle={90}
          endAngle={90 - (score / 100) * 360}
        >
          <RadialBar
            background={{ fill: "#fef3c7" }}
            dataKey="value"
            cornerRadius={20}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-stone-500 uppercase tracking-widest">画像</span>
        <span className="text-5xl font-display text-amber-700 font-light tabular-nums mt-1">
          {score}
        </span>
      </div>
    </div>
  );
}

/* ---------------- 风险徽章 (浅色) ---------------- */
function HealthBadge({ level }: { level: PrimaryProfile["riskLevel"] }) {
  const map = {
    低: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    中: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    高: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  };
  const c = map[level];
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${c.bg} ${c.text} border ${c.border}`}>
      风险偏好 · {level}
    </span>
  );
}