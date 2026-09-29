"use client";

import { useState } from "react";
import { IntakeAnswersSchema, type IntakeAnswers } from "@astorai/api-types";

/**
 * Onboarding 12 题表单 — 使用 @astorai/api-types 共享契约 IntakeAnswersSchema。
 *
 * 这里只是 UI 演示, 真实提交走 Server Action: 验签 + 写入 Survey 表 + 触发 Analyzer 流水线。
 */

const HORIZON_LABEL: Record<string, string> = {
  lt_3m: "< 3 个月",
  "3m_1y": "3 个月 - 1 年",
  "1y_3y": "1 - 3 年",
  gt_3y: "> 3 年",
};

const CAPITAL_LABEL: Record<string, string> = {
  lt_500k: "< 50 万",
  "500k_2m": "50 万 - 200 万",
  "2m_10m": "200 万 - 1000 万",
  gt_10m: "> 1000 万",
};

type Draft = Partial<IntakeAnswers>;

export default function OnboardingForm() {
  const [draft, setDraft] = useState<Draft>({});
  const [submitted, setSubmitted] = useState<IntakeAnswers | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof IntakeAnswers>(key: K, value: IntakeAnswers[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function submit() {
    setError(null);
    try {
      const parsed = IntakeAnswersSchema.parse({ ...draft, q12_acknowledged: true });
      setSubmitted(parsed);
    } catch (e) {
      setError((e as Error).message.slice(0, 200));
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/20 p-6">
        <h2 className="text-lg font-medium text-emerald-300 mb-2">已收到 · {Object.keys(submitted).length} 字段</h2>
        <pre className="text-xs bg-slate-900/60 p-3 rounded overflow-x-auto text-slate-300">
{JSON.stringify(submitted, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Field label="Q1 · 行业从业深度 (1-4)">
        <select
          value={draft.q1_industry_depth ?? ""}
          onChange={(e) => set("q1_industry_depth", Number(e.target.value) as 1 | 2 | 3 | 4)}
          className={inputClass}
        >
          <option value="">请选择</option>
          <option value="1">1 · 入门</option>
          <option value="2">2 · 1-3 年</option>
          <option value="3">3 · 3-7 年</option>
          <option value="4">4 · 7 年以上</option>
        </select>
      </Field>
      <Field label="Q2 · 投资周期">
        <select
          value={draft.q2_horizon ?? ""}
          onChange={(e) => set("q2_horizon", e.target.value as IntakeAnswers["q2_horizon"])}
          className={inputClass}
        >
          <option value="">请选择</option>
          {Object.entries(HORIZON_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </Field>
      <Field label="Q3 · 回撤容忍度 (1-5)">
        <input
          type="range" min={1} max={5}
          value={draft.q3_drawdown_tolerance ?? 3}
          onChange={(e) => set("q3_drawdown_tolerance", Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
        />
        <span className="text-sm text-slate-400 ml-2">{draft.q3_drawdown_tolerance ?? 3}/5</span>
      </Field>
      <Field label="Q4 · 过往业绩">
        <div className="flex gap-2">
          {(["no", "self", "firm"] as const).map((v) => (
            <button
              key={v}
              onClick={() => set("q4_track_record", v)}
              className={chipClass(draft.q4_track_record === v)}
            >
              {v === "no" ? "无" : v === "self" ? "个人可查" : "机构可查"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Q5 · 议题兴趣 (多选)">
        <div className="flex flex-wrap gap-2">
          {["信息差套利", "一级市场", "认知差", "网络节点", "资产共建", "跨境配置"].map((tag) => {
            const list = draft.q5_thesis_interest ?? [];
            const on = list.includes(tag);
            return (
              <button key={tag} onClick={() => {
                const next = on ? list.filter((t) => t !== tag) : [...list, tag];
                set("q5_thesis_interest", next);
              }} className={chipClass(on)}>
                {tag}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Q6 · 资金量级">
        <select
          value={draft.q6_capital_band ?? ""}
          onChange={(e) => set("q6_capital_band", e.target.value as IntakeAnswers["q6_capital_band"])}
          className={inputClass}
        >
          <option value="">请选择</option>
          {Object.entries(CAPITAL_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </Field>
      <Field label="Q7 · 期望参与的活动主题">
        <input
          value={draft.q7_event_topic ?? ""}
          onChange={(e) => set("q7_event_topic", e.target.value)}
          className={inputClass}
          placeholder="如: AI 半导体 / 出海 / 跨境支付"
        />
      </Field>
      <Field label="Q8 · 可承受非流动性占比">
        <div className="flex gap-2">
          {[0, 25, 50, 75, 100].map((v) => (
            <button key={v} onClick={() => set("q8_illiquid_ratio", v as 0 | 25 | 50 | 75 | 100)} className={chipClass(draft.q8_illiquid_ratio === v)}>
              {v}%
            </button>
          ))}
        </div>
      </Field>
      <Field label="Q9 · 杠杆上限 (x)">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((v) => (
            <button key={v} onClick={() => set("q9_lev_allowed", v as 0 | 1 | 2 | 3)} className={chipClass(draft.q9_lev_allowed === v)}>
              {v}x
            </button>
          ))}
        </div>
      </Field>
      <Field label="Q10 · 来源">
        <select
          value={draft.q10_referral ?? ""}
          onChange={(e) => set("q10_referral", e.target.value as IntakeAnswers["q10_referral"])}
          className={inputClass}
        >
          <option value="">请选择</option>
          <option value="self">自然搜索</option>
          <option value="friend">朋友推荐</option>
          <option value="media">媒体</option>
          <option value="other">其他</option>
        </select>
      </Field>
      <Field label="Q11 · 备注 (可选)">
        <textarea
          value={draft.q11_open_note ?? ""}
          onChange={(e) => set("q11_open_note", e.target.value)}
          maxLength={500}
          className={`${inputClass} min-h-[80px]`}
          placeholder="补充说明, 不超过 500 字"
        />
      </Field>

      {error && <div className="text-rose-300 text-sm">{error}</div>}

      <button onClick={submit} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium">
        提交问卷 (Q12 已确认)
      </button>
      <p className="text-xs text-slate-500">
        提交即触发 <code className="text-emerald-300">@astorai/agents</code> 流水线 (Analyzer → Reporter → Reviewer)。
      </p>
    </div>
  );
}

const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
function chipClass(on: boolean) {
  return `px-3 py-1.5 rounded-full text-xs border ${on ? "bg-emerald-700 border-emerald-500" : "bg-slate-800 border-slate-700 hover:border-slate-500"}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>
      {children}
    </div>
  );
}