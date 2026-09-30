"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/survey-questions";
import { Btn } from "@/components/ui/Editorial";

const R = 54;
const C = 2 * Math.PI * R;

const DEEP_MODULES = [
  { k: "需完整问卷", t: "资产集中度测算", d: "跨机构敞口 · 相关性 · 币种错配" },
  { k: "需季度复诊", t: "现金流压力测试", d: "负债 / 收入 / 支出 / 目标的时间轴匹配" },
  { k: "需 L2 邀请制", t: "管理人适配度分析", d: "按你的风险姿态与风格偏好匹配管理人" },
  { k: "需 L2 邀请制", t: "圈层议题匹配", d: "按画像匹配闭门议题局与私享会" },
];

export function ReportPanel({
  profile,
  onReset,
}: {
  profile: Profile;
  onReset: () => void;
}) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 120);
    return () => clearTimeout(t);
  }, []);

  const healthLabel =
    profile.health >= 75
      ? "结构扎实"
      : profile.health >= 55
        ? "有基础，待整合"
        : "存在明显缺口";

  return (
    <div className="animate-rise">
      {/* hero */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 text-center lg:text-left hair-b pb-10 sm:pb-16 mb-9 sm:mb-12">
        <div className="relative w-[140px] h-[140px] sm:w-[190px] sm:h-[190px] shrink-0">
          <svg viewBox="0 0 132 132" className="w-full h-full -rotate-90">
            <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(184,149,106,0.18)" strokeWidth="1" />
            <circle
              cx="66"
              cy="66"
              r={R}
              fill="none"
              stroke="#B8956A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={animate ? C * (1 - profile.health / 100) : C}
              style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="font-display font-normal text-[48px] sm:text-[80px] leading-none text-gold-500 tracking-[-0.01em]">
              {profile.health}
            </span>
            <span className="text-[10px] tracking-[0.24em] text-paper/25">HEALTH</span>
          </div>
        </div>

        <div className="lg:text-left min-w-0">
          <div className="text-[11.5px] tracking-[0.2em] text-paper/25 mb-2.5">
            Structure Health Index
          </div>
          <div className="text-[clamp(19px,2.4vw,26px)] text-paper mb-2.5">
            {healthLabel}
          </div>
          <div className="text-[13.5px] leading-[1.8] text-paper/25 max-w-[33ch]">
            基于 6 道题的自评。完整版需要 20 题问卷 + 季度复诊记录。
          </div>
        </div>
      </div>

      {/* five dimensions */}
      <div className="hair-t mb-[clamp(30px,4vw,48px)]">
        {profile.dims.map((d) => (
          <div
            key={d.key}
            className="hair-b grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(140px,1.1fr)_1fr_auto] gap-3 sm:gap-9 items-center py-5 px-1 hover:bg-gold-500/[0.035] hover:pl-4 transition-all duration-300"
          >
            <div className="flex items-baseline gap-3 sm:gap-4">
              <span className="font-display italic text-[13px] text-gold-500 w-5 shrink-0 tracking-[0.08em]">
                {d.roman}
              </span>
              <span className="text-[14px] sm:text-[17px] text-paper whitespace-nowrap">
                {d.cn}
              </span>
            </div>
            <div className="hidden sm:block h-px bg-gold-500/20 relative">
              <span
                className={`absolute left-0 top-0 h-px bg-gold-500 ${animate ? "animate-bar-fill" : "w-0"}`}
                style={animate ? { width: `${d.score}%` } : undefined}
              />
            </div>
            <span className="font-display text-[17px] sm:text-[22px] text-gold-500 sm:text-right min-w-[34px]">
              {d.score}
            </span>
          </div>
        ))}
      </div>

      {/* risk posture */}
      <div className="hair-t hair-b py-[clamp(30px,4.5vw,48px)] mb-[clamp(30px,4vw,48px)]">
        <div className="font-display italic text-[13px] tracking-[0.2em] text-gold-500 mb-4">
          Risk Posture
        </div>
        <div className="text-[clamp(22px,3.2vw,36px)] text-paper mb-4 sm:mb-5">
          {profile.riskPosture}
        </div>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[2] text-paper/40 max-w-[76ch]">
          {profile.riskNarrative}
        </p>
      </div>

      {/* primary gap */}
      <div className="hair-b pb-[clamp(34px,5vw,58px)] mb-[clamp(30px,4vw,48px)] pt-[clamp(34px,5vw,58px)]">
        <div className="font-display italic text-[13px] tracking-[0.2em] text-gold-500 mb-4 sm:mb-5">
          Primary Gap · 最需要先处理的一件事
        </div>
        <h3 className="font-normal tracking-[-0.005em] text-paper leading-[1.42] mb-5 sm:mb-6 text-[clamp(20px,3vw,34px)]">
          {profile.primaryGap.title}
        </h3>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[2.05] text-paper/40 max-w-[78ch] mb-7 sm:mb-8">
          {profile.primaryGap.detail}
        </p>
        <div className="border-t border-gold-500/30 pt-6 sm:pt-8">
          <div className="text-[11.5px] tracking-[0.2em] text-gold-500 mb-2.5">
            建议动作
          </div>
          <div className="text-[clamp(15px,1.9vw,19px)] leading-[1.85] text-paper max-w-[78ch]">
            {profile.primaryGap.action}
          </div>
        </div>
      </div>

      {/* locked deep panel */}
      <div className="hair-t hair-b relative overflow-hidden mb-[clamp(30px,4vw,48px)]">
        <div className="py-[clamp(26px,3.5vw,40px)] blur-[6px] opacity-50 pointer-events-none select-none">
          <div className="hair-t">
            {DEEP_MODULES.map((d) => (
              <div key={d.t} className="hair-b py-5 px-4 sm:px-7 grid sm:grid-cols-[1fr_auto] gap-3 sm:gap-6 items-center">
                <div>
                  <div className="text-[14.5px] text-paper mb-1">{d.t}</div>
                  <div className="text-[12px] text-paper/25 mt-1">{d.d}</div>
                </div>
                <div className="font-display italic text-[15px] text-gold-500">
                  {d.k}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 py-[clamp(34px,5vw,60px)] bg-gradient-to-b from-ink-900/75 to-ink-900/95">
          <div className="font-display text-[clamp(40px,6vw,62px)] leading-none text-gold-500 mb-6">
            ◎
          </div>
          <div className="text-[clamp(19px,2.8vw,30px)] text-paper leading-[1.5] mb-4">
            以上是初级版。
            <br />
            完整版需要一个<em className="em-gold">能记住你的</em> Agent。
          </div>
          <p className="text-[clamp(14px,1.7vw,17px)] leading-[2] text-paper/40 max-w-[56ch] mb-7 sm:mb-8">
            Astor 的完整能力包括 20 题深度画像、跨机构全景统筹、季度复诊与画像增量追踪。
            <br />
            7 天免费试用，不绑定支付方式，随时可停。
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-3.5">
            <Btn href="/contact" solid lg>
              免费注册 · 7 天试用
            </Btn>
            <Btn href="/agent#pricing" lg className="!border-gold-500/[0.18] !text-paper/35">
              先看定价
            </Btn>
          </div>
          <div className="text-[11.5px] tracking-[0.04em] text-paper/20">
            收入 100% 来自订阅 · 0% 来自产品分佣 —— 这决定了我们不会向你推荐任何产品
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="text-[12px] tracking-[0.12em] text-paper/25 hover:text-gold-300 transition-colors min-h-[40px] px-2"
        >
          重新做一次
        </button>
      </div>
    </div>
  );
}
