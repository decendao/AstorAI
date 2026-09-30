/**
 * AstorAI 五维画像 — A 套定义
 *
 * 维度选择依据：高净值圈层 + 陪伴型银行家定位
 * 五个维度回答「你是谁」，而不是「你该买什么」。
 */
import { z } from "zod";

export type DimKey = "alpha" | "asset" | "social" | "risk" | "service";

export const DIMS: Record<DimKey, { cn: string; en: string; roman: string }> = {
  alpha: { cn: "Alpha 偏好", en: "Alpha Preference", roman: "I" },
  asset: { cn: "资源贡献", en: "Resource Contribution", roman: "II" },
  social: { cn: "人脉位置", en: "Network Position", roman: "III" },
  risk: { cn: "风险姿态", en: "Risk Posture", roman: "IV" },
  service: { cn: "服务期望", en: "Service Expectation", roman: "V" },
};

export const DIM_ORDER: DimKey[] = ["alpha", "asset", "social", "risk", "service"];

/* ------------------------------------------------------------------
   6 题问卷
   ------------------------------------------------------------------ */

export type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6";

export interface SurveyOption {
  value: string;
  label: string;
  hint?: string;
}

export interface SurveyQuestion {
  id: QuestionId;
  n: string;
  title: string;
  subtitle: string;
  multi?: boolean;
  text?: boolean;
  placeholder?: string;
  options?: SurveyOption[];
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "q1",
    n: "Q01",
    title: "你现在最占用你精力的，是哪一件？",
    subtitle: "选一个最真实的。",
    options: [
      { value: "asset", label: "资产在变，但说不清变在了哪里" },
      { value: "mixed", label: "公司的钱和家里的钱，从来没分干净过" },
      { value: "alpha", label: "投了很多年，心里没有底" },
      { value: "start", label: "想开始，但不知道从哪一步开始" },
    ],
  },
  {
    id: "q2",
    n: "Q02",
    title: "过去一年里，你认真研究过的方向是？",
    subtitle: "选得越准，画像越准。",
    multi: true,
    options: [
      { value: "offshore", label: "海外资产与身份安排" },
      { value: "pe", label: "一级市场与私募" },
      { value: "equity", label: "公司股权与治理" },
      { value: "trust", label: "保险、信托与法律结构" },
      { value: "none", label: "其实没有，只是被动接受" },
    ],
  },
  {
    id: "q3",
    n: "Q03",
    title: "如果只能保住一样，你选哪个？",
    subtitle: "这决定你的风险姿态画像。",
    options: [
      { value: "defense", label: "确定性 — 宁可少赚，不要波动" },
      { value: "balance", label: "平衡 — 愿意承担一部分，换取长期空间" },
      { value: "growth", label: "进攻 — 波动是成本，机会才是收益" },
      { value: "flex", label: "看情况 — 不想提前锁死" },
    ],
  },
  {
    id: "q4",
    n: "Q04",
    title: "你的资产，现在分散在几个地方？",
    subtitle: "包括银行、券商、基金、保险、信托、境外。",
    options: [
      { value: "1", label: "基本在一处" },
      { value: "2", label: "两三处" },
      { value: "3", label: "三到五处" },
      { value: "many", label: "五处以上，自己也说不全" },
    ],
  },
  {
    id: "q5",
    n: "Q05",
    title: "你希望一年后，Astor 对你而言是——",
    subtitle: "这决定我们为你准备什么。",
    options: [
      { value: "answer", label: "一个随时能问的对象" },
      { value: "archive", label: "一份持续更新的资产档案" },
      { value: "circle", label: "一群值得深聊的人" },
      { value: "all", label: "以上都算" },
    ],
  },
  {
    id: "q6",
    n: "Q06",
    title: "用你自己的话说一句：你现在最不确定的是什么？",
    subtitle: "不限字数。这一段不会被转发。",
    text: true,
    placeholder: "写下你此刻最真实的不确定…",
  },
];

/* ------------------------------------------------------------------
   Schema
   ------------------------------------------------------------------ */

export const SurveyAnswersSchema = z.object({
  q1: z.array(z.string()).min(1),
  q2: z.array(z.string()).min(1),
  q3: z.array(z.string()).min(1),
  q4: z.array(z.string()).min(1),
  q5: z.array(z.string()).min(1),
  /** 兼容旧字段：q6 若是数组则取第一项 */
  q6: z.union([z.string(), z.array(z.string())]).optional().default(""),
  q6_text: z.string().optional(),
});

/** 归一化后的答案形态（数组 + 自由文本） */
export interface SurveyAnswers {
  q1: string[];
  q2: string[];
  q3: string[];
  q4: string[];
  q5: string[];
  q6?: string | string[];
  q6_text?: string;
}

/** 把任意来源（表单 / API）归一化成评分引擎可用的输入 */
export function normalizeAnswers(
  input: SurveyAnswers | Record<string, unknown>,
): Record<QuestionId, string[]> & { q6_text: string } {
  const g = (k: QuestionId): string[] => {
    const v = (input as Record<string, unknown>)[k];
    if (Array.isArray(v)) return v as string[];
    if (typeof v === "string" && v) return [v];
    return [""];
  };
  const raw = (input as Record<string, unknown>).q6_text;
  return {
    q1: g("q1"),
    q2: g("q2"),
    q3: g("q3"),
    q4: g("q4"),
    q5: g("q5"),
    q6: [""],
    q6_text: typeof raw === "string" ? raw : "",
  };
}

/* ------------------------------------------------------------------
   报告类型
   ------------------------------------------------------------------ */

export type RiskPosture = "偏保守" | "中性偏稳" | "偏进取" | "高度防守";

export interface DimensionScore {
  key: DimKey;
  cn: string;
  en: string;
  roman: string;
  score: number;
}

export interface Profile {
  health: number;
  dims: DimensionScore[];
  riskPosture: RiskPosture;
  riskNarrative: string;
  primaryGap: {
    key: DimKey;
    title: string;
    detail: string;
    action: string;
  };
  freeText: string;
}

export const RISK_NARRATIVES: Record<RiskPosture, string> = {
  高度防守:
    "结构上很安全。真正要问的是：这是主动选择，还是因为还没找到值得承担的风险？",
  偏保守:
    "你的防守意识是优势。但过度防守同样有成本 — 那部分没承担的风险，也是没拿到的回报。",
  中性偏稳:
    "你在收益与防守之间留了余量。接下来关键是把这部分余量用对地方。",
  偏进取:
    "你愿意为长期空间承担波动。重点不是降低风险，而是让波动与你的时间轴匹配。",
};
