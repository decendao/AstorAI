/**
 * AstorAI 五维评分引擎
 *
 * 评分逻辑说明：
 *  - 五个维度各自独立打分，区间 [22, 94]
 *  - 每个维度捕捉的是「画像特征」，不是「好/坏」
 *  - service 维度的语义是「服务期望的清晰度」，而非「想要多少服务」
 */
import {
  DIMS,
  DIM_ORDER,
  RISK_NARRATIVES,
  normalizeAnswers,
  type DimKey,
  type Profile,
  type RiskPosture,
  type SurveyAnswers,
} from "./survey-questions";

type Score = Record<DimKey, number>;

const one = (a: SurveyAnswers, k: keyof SurveyAnswers): string =>
  (a[k] as string[] | undefined)?.[0] ?? "";
const many = (a: SurveyAnswers, k: keyof SurveyAnswers): string[] =>
  (a[k] as string[] | undefined) ?? [];

export function scoreDims(input: SurveyAnswers): Score {
  const a = normalizeAnswers(input);
  let alpha = 50,
    asset = 50,
    social = 50,
    risk = 50,
    service = 50;

  /* Q1 → 主要卡点 */
  switch (one(a, "q1")) {
    case "asset":
      asset += 22;
      alpha -= 6;
      break;
    case "mixed":
      asset += 14;
      social += 6;
      break;
    case "alpha":
      alpha += 24;
      asset -= 4;
      break;
    case "start":
      service += 20;
      asset += 4;
      break;
  }

  /* Q2 → 敞口广度 */
  const s = many(a, "q2").filter((x) => x !== "none");
  if (s.includes("offshore")) {
    alpha += 14;
    risk += 8;
  }
  if (s.includes("pe")) {
    alpha += 16;
    risk += 6;
  }
  if (s.includes("equity")) {
    asset += 12;
    social += 6;
  }
  if (s.includes("trust")) {
    asset += 10;
    service += 6;
  }
  if (many(a, "q2").includes("none")) {
    service += 14;
    risk -= 6;
  }
  alpha += Math.min(10, s.length * 3);

  /* Q3 → 风险姿态 */
  switch (one(a, "q3")) {
    case "defense":
      risk -= 30;
      break;
    case "balance":
      risk += 6;
      break;
    case "growth":
      risk += 28;
      alpha += 6;
      break;
    case "flex":
      service -= 12;
      break;
  }

  /* Q4 → 分散度（表面分散 vs 结构可见） */
  switch (one(a, "q4")) {
    case "1":
      asset -= 22;
      break;
    case "2":
      asset += 2;
      break;
    case "3":
      asset += 16;
      break;
    case "many":
      asset += 28;
      service += 8;
      break;
  }

  /* Q5 → 服务期望（清晰度，不是数量） */
  switch (one(a, "q5")) {
    case "answer":
      service += 20;
      break;
    case "archive":
      asset += 12;
      service += 12;
      break;
    case "circle":
      social += 24;
      service += 10;
      break;
    case "all":
      service += 22;
      social += 10;
      asset += 6;
      break;
    default:
      service -= 10;
  }

  /* Q6 → 自由书写：具体的不确定 = 服务期望是活的 */
  const free = (a.q6_text ?? a.q6 ?? "").trim();
  if (free.length > 8) {
    service += 10;
    alpha += 4;
  } else if (free.length <= 8) {
    service -= 8;
  }

  const cl = (v: number, lo = 22, hi = 94) => Math.max(lo, Math.min(hi, Math.round(v)));
  return {
    alpha: cl(alpha),
    asset: cl(asset),
    social: cl(social),
    risk: cl(risk),
    service: cl(service),
  };
}

/** 结构健康指数：越均衡、离散越小，分越高 */
export function healthIndex(s: Score): number {
  const vals = DIM_ORDER.map((k) => s[k]);
  const spread = Math.max(...vals) - Math.min(...vals);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(Math.max(30, Math.min(96, avg * 0.78 + (100 - spread) * 0.22)));
}

export function riskPosture(v: number): RiskPosture {
  if (v >= 72) return "偏进取";
  if (v >= 55) return "中性偏稳";
  if (v >= 38) return "偏保守";
  return "高度防守";
}

const GAP_COPY: Record<
  DimKey,
  { title: string; detail: string; action: string }
> = {
  alpha: {
    title: "你的 Alpha 判断，缺少一个持续的记录机制",
    detail:
      "你做过判断，但没有被保存下来。每次决定都是一次性的，经验无法累积成能力。这是大多数高收入人群最隐蔽的漏损。",
    action: "建立对话记录 + 季度复诊机制，让每次判断都留下可回溯的痕迹。",
  },
  asset: {
    title: "你的资产结构，目前处在“不可见”状态",
    detail:
      "账户分散在不同地方，负债、目标、期限没有放在同一张图上。这导致任何一次调整都在凭直觉，而不是凭结构。",
    action: "先做全景统筹：不连接账户也能手工录入，把所有敞口放进同一张图。",
  },
  social: {
    title: "你缺的不是资源，是一张结构化的桌",
    detail:
      "值得深聊的人很多，但缺少一个稳定的、有质量的相遇机制。信息差、人脉撮合、本地议题，都停留在随机。",
    action: "进入带邀请制的圈层，按画像匹配同频的人与议题。",
  },
  risk: {
    title: "你的风险偏好，和你的真实承受力可能不一致",
    detail:
      "风险不是一个数字，是「如果发生这个波动，你会不会改变原来的计划」。多数人高估了自己的承受力，直到真正遇到那一次。",
    action: "把「跌多少你会想卖出」写下来，作为你的真实风险姿态基线。",
  },
  service: {
    title: "你对“服务”的期待，还没有落到具体形式上",
    detail:
      "想要被长期陪伴，但不知道该要什么。这会让每一次服务交付都变成重新开始，无法形成连续性。",
    action: "先定义你想要的沟通方式与节奏，再决定用什么工具承接。",
  },
};

export function computeProfile(input: SurveyAnswers): Profile {
  const a = normalizeAnswers(input);
  const s = scoreDims(a);
  const h = healthIndex(s);
  const posture = riskPosture(s.risk);

  const weakest = DIM_ORDER.reduce((lo, k) => (s[k] < s[lo] ? k : lo), DIM_ORDER[0]);

  return {
    health: h,
    dims: DIM_ORDER.map((k) => ({
      key: k,
      cn: DIMS[k].cn,
      en: DIMS[k].en,
      roman: DIMS[k].roman,
      score: s[k],
    })),
    riskPosture: posture,
    riskNarrative: RISK_NARRATIVES[posture],
    primaryGap: { key: weakest, ...GAP_COPY[weakest] },
    freeText: (a.q6_text ?? a.q6 ?? "").trim(),
  };
}

/** 保持旧 API 兼容（api/survey/submit/route.ts 调用） */
export { computeProfile as computePrimaryProfile };
