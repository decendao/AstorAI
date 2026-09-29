import type { AnalyzerOutput } from "@astorai/api-types";

/**
 * Analyzer 规则引擎 — 问卷答案 → 五维画像 + 事实 + 模板诊断摘要。
 *
 * 铁律: 每维必须带证据指向 (evidenceQ = 题目 label)，
 * 没证据的维度如实标 insufficient_data。LLM Analyzer 的 fallback 与评测基线。
 *
 * P0 问卷字段 (中文字段标签 + 英文 id), 与 apps/web/lib/survey-questions.ts 对齐:
 *   q1 行业从业 / q2 资产量级 / q3 可投时长 / q4 资源带入 / q5 期望服务 /
 *   q6 风险偏好 / q7 入会动机 / q8 推荐人
 */

export type Dimension = {
  value: string | string[];
  confidence: number; // 0-1
  evidenceQ: string[];
  note?: string;
};

export type RuleProfile = AnalyzerOutput;

type QuestionLike = { id: string; order: number; type: string; label: string; options?: unknown };
export type Answers = Record<string, string | string[] | number>;

const ALPHA_KEYWORDS: Array<[string[], string]> = [
  [["信息差", "alpha", "超额", "套利", "一级", "pre-ipo", "认知差"], "info_arbitrage"],
  [["人脉", "圈子", "交流", "认识", "链接", "资源互换"], "network_value"],
  [["学习", "成长", "认知", "开眼", "视野"], "learning"],
];

function findQ(qs: QuestionLike[], keyword: string): QuestionLike | undefined {
  return qs.find((q) => q.label.includes(keyword));
}

function asArray(v: string | string[] | number | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v.map(String) : [String(v)];
}

export function analyzeOnboarding(questions: QuestionLike[], answers: Answers): RuleProfile {
  const qIndustry = findQ(questions, "公司") ?? findQ(questions, "行业");
  const qAsset = findQ(questions, "资产量级");
  const qMotivation = findQ(questions, "为什么") ?? findQ(questions, "动机");
  const qResource = findQ(questions, "资源");
  const qService = findQ(questions, "期望的服务");
  const qReferrer = findQ(questions, "推荐人");

  const industry = qIndustry ? String(answers[qIndustry.id] ?? "").slice(0, 200) : undefined;
  const assetBand = qAsset ? String(answers[qAsset.id] ?? "") : undefined;
  const motivation = qMotivation ? String(answers[qMotivation.id] ?? "").slice(0, 300) : undefined;
  const resources = qResource ? asArray(answers[qResource.id]) : [];
  const services = qService ? asArray(answers[qService.id]) : [];
  const referredByRaw = qReferrer ? String(answers[qReferrer.id] ?? "").trim() : "";
  const referredBy = referredByRaw ? referredByRaw.slice(0, 100) : undefined;

  const riskPosture: Dimension = {
    value: "insufficient_data",
    confidence: 0.2,
    evidenceQ: [],
    note: "P0 入会问卷无风险偏好题，待补充或由 Astor 对话补全",
  };

  const alphaAppetite: Dimension = (() => {
    if (!motivation) {
      return { value: "unspecified", confidence: 0.3, evidenceQ: [] };
    }
    for (const [keywords, value] of ALPHA_KEYWORDS) {
      if (keywords.some((k) => motivation.toLowerCase().includes(k))) {
        return { value, confidence: 0.6, evidenceQ: [qMotivation?.label ?? "动机"] };
      }
    }
    return { value: "other", confidence: 0.4, evidenceQ: [qMotivation?.label ?? "动机"] };
  })();

  const resourceContribution: Dimension = {
    value: resources.map((r) =>
      r.includes("信息") ? "info" : r.includes("关系") ? "network" : r.includes("资产") ? "asset" : r,
    ),
    confidence: resources.length ? 0.9 : 0.3,
    evidenceQ: qResource ? [qResource.label] : [],
  };

  const networkPosition: Dimension = {
    value: referredBy ? "referred" : "cold_intake",
    confidence: qReferrer ? 0.8 : 0.3,
    evidenceQ: qReferrer ? [qReferrer.label] : [],
  };

  const serviceExpectation: Dimension = {
    value: services,
    confidence: services.length ? 0.9 : 0.3,
    evidenceQ: qService ? [qService.label] : [],
  };

  const dimensions = { riskPosture, alphaAppetite, resourceContribution, networkPosition, serviceExpectation };
  const all = Object.values(dimensions);
  const evidenced = all.filter((d) => d.evidenceQ.length > 0);
  const confidence = evidenced.length
    ? Number((evidenced.reduce((s, d) => s + d.confidence, 0) / all.length).toFixed(2))
    : 0.2;

  const tierHints: string[] = [];
  if (assetBand === "5000 万-1 亿" || assetBand === "1 亿以上") tierHints.push("资产量级达到 L3+ 评估区间");
  if (services.includes("资产共建")) tierHints.push("期望资产共建，L4+ 候选（须人工尽调）");
  if (resources.includes("资产")) tierHints.push("自带资产资源，跃迁通道候选");
  if (referredBy) tierHints.push("有推荐人，可交叉核验");

  const facts: Record<string, string> = {};
  if (assetBand) facts.assetBand = assetBand;
  if (industry) facts.industry = industry;
  if (motivation) facts.motivation = motivation;
  if (referredBy) facts.referredBy = referredBy;

  const lines = [
    "【画像摘要 · 规则引擎版】",
    `资产量级：${assetBand || "未填写"}`,
    `行业背景：${industry || "未填写"}`,
    `资源带入：${resources.join(" / ") || "未填写"}`,
    `期望服务：${services.join(" / ") || "未填写"}`,
    `来源渠道：${referredBy ? "推荐（" + referredBy + "）" : "自然流入"}`,
    `入会动机：${motivation ? "「" + motivation + "」" : "未填写"}`,
    "",
    `匹配参考（仅供审核，非准入结论）：${tierHints.length ? tierHints.join("；") : "暂无显著信号，建议补谈"}`,
    `风险提示：${riskPosture.note}`,
    `整体置信度：${(confidence * 100).toFixed(0)}%（P0 规则引擎，P1 升级 LLM 后重估）`,
  ];

  return {
    dimensions,
    facts,
    summary: lines.join("\n"),
    confidence,
  };
}