/**
 * 6 题问卷定义 —— 用于官网落地页 (landing)
 * 与 Astor OS 的 12 题完整问卷 (P3) 区分
 * 这里只做轻量画像, 用于触发"免费初级报告 + 注册引导"
 */
import { z } from "zod";

export type QuestionId =
  | "experience"      // 投资经验
  | "risk"            // 风险偏好
  | "capital"         // 资金规模
  | "sector"          // 关注赛道 (单选, 单赛道)
  | "horizon"         // 持有周期
  | "goal";           // 主要目标

export interface SurveyOption {
  value: string;
  label: string;
  /** 对五维画像的影响 */
  weights: Partial<Record<DimKey, number>>;
}

export interface SurveyQuestion {
  id: QuestionId;
  title: string;
  subtitle?: string;
  options: SurveyOption[];
  multi?: boolean;
}

export type DimKey =
  | "信息差"          // information asymmetry
  | "风险偏好"        // risk
  | "流动性需求"      // liquidity
  | "圈层质量"        // network
  | "议题契合";      // thesis fit

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "experience",
    title: "您的投资经验?",
    subtitle: "不同阶段的投资者适配不同的策略组合",
    options: [
      { value: "novice",       label: "新手 (< 1 年)",   weights: { 信息差: 0.3, 议题契合: 0.2 } },
      { value: "intermediate", label: "有经验 (1-3 年)", weights: { 信息差: 0.5, 议题契合: 0.5, 圈层质量: 0.3 } },
      { value: "advanced",     label: "资深 (3-5 年)",  weights: { 信息差: 0.7, 议题契合: 0.7, 圈层质量: 0.5 } },
      { value: "pro",          label: "专业 (5 年+)",   weights: { 信息差: 0.9, 议题契合: 0.9, 圈层质量: 0.8 } },
    ],
  },
  {
    id: "risk",
    title: "您能接受的最大回撤?",
    subtitle: "用于匹配资产配置中的股债比例",
    options: [
      { value: "conservative", label: "< 5% (保守)",     weights: { 风险偏好: 0.2, 流动性需求: 0.4 } },
      { value: "moderate",    label: "5-15% (稳健)",    weights: { 风险偏好: 0.5, 流动性需求: 0.5 } },
      { value: "aggressive",  label: "15-30% (积极)",   weights: { 风险偏好: 0.75, 流动性需求: 0.6 } },
      { value: "speculative", label: "> 30% (激进)",   weights: { 风险偏好: 0.95, 流动性需求: 0.8 } },
    ],
  },
  {
    id: "capital",
    title: "可投资资产规模?",
    subtitle: "规模决定策略的颗粒度与定制深度",
    options: [
      { value: "lt100k",  label: "< 10 万",         weights: { 圈层质量: 0.2, 流动性需求: 0.6 } },
      { value: "100k_500k", label: "10-50 万",     weights: { 圈层质量: 0.4, 流动性需求: 0.5 } },
      { value: "500k_2m", label: "50-200 万",      weights: { 圈层质量: 0.6, 流动性需求: 0.4 } },
      { value: "gt2m",    label: "200 万+",         weights: { 圈层质量: 0.9, 流动性需求: 0.3, 议题契合: 0.6 } },
    ],
  },
  {
    id: "sector",
    title: "当前最关注的赛道?",
    subtitle: "决定 AstorAgent 推送给您的研究主题",
    options: [
      { value: "ai_tech",  label: "AI / 硬科技",      weights: { 议题契合: 0.9, 信息差: 0.5 } },
      { value: "finance",  label: "金融 / 量化",      weights: { 议题契合: 0.9, 信息差: 0.7 } },
      { value: "consumer", label: "消费 / 新能源",    weights: { 议题契合: 0.7, 信息差: 0.5 } },
      { value: "global",   label: "海外 / 跨境配置",  weights: { 议题契合: 0.8, 圈层质量: 0.8, 信息差: 0.7 } },
    ],
  },
  {
    id: "horizon",
    title: "计划持有周期?",
    subtitle: "策略再平衡与止盈规则的依据",
    options: [
      { value: "lt_3m",   label: "< 3 个月",         weights: { 流动性需求: 0.95 } },
      { value: "3m_1y",   label: "3-12 个月",        weights: { 流动性需求: 0.7 } },
      { value: "1y_3y",   label: "1-3 年",           weights: { 流动性需求: 0.4, 议题契合: 0.4 } },
      { value: "gt_3y",   label: "3 年+",            weights: { 流动性需求: 0.2, 议题契合: 0.7 } },
    ],
  },
  {
    id: "goal",
    title: "您使用 Astor AI 的主要目标?",
    options: [
      { value: "research",  label: "深度研究 + 标的扫描",     weights: { 信息差: 0.9, 议题契合: 0.9 } },
      { value: "allocation",label: "资产配置 + 组合管理",     weights: { 风险偏好: 0.7, 流动性需求: 0.5 } },
      { value: "execution", label: "交易执行 + 复盘",         weights: { 信息差: 0.6, 风险偏好: 0.5 } },
      { value: "learning",  label: "学习 + 投资框架升级",     weights: { 议题契合: 0.8, 信息差: 0.6 } },
    ],
  },
];

export const SurveyAnswersSchema = z.object({
  experience: z.string(),
  risk: z.string(),
  capital: z.string(),
  sector: z.string(),
  horizon: z.string(),
  goal: z.string(),
});
export type SurveyAnswers = z.infer<typeof SurveyAnswersSchema>;

/** 五维画像 (0-1 标准化) */
export interface PrimaryProfile {
  dim: Record<DimKey, number>;
  tags: string[];
  matchedOption: { question: string; value: string; label: string };
  /** 主要建议标签 (用于报告卡片文案) */
  headline: string;
  /** 风险等级: low/medium/high */
  riskLevel: "低" | "中" | "高";
  /** 推荐的关注赛道 (用于注册后默认推送) */
  recommendedSector: string;
}

/** 计算五维画像 */
export function computePrimaryProfile(answers: SurveyAnswers): PrimaryProfile {
  const dim: Record<DimKey, number> = {
    信息差: 0, 风险偏好: 0, 流动性需求: 0, 圈层质量: 0, 议题契合: 0,
  };

  let count: Record<DimKey, number> = {
    信息差: 0, 风险偏好: 0, 流动性需求: 0, 圈层质量: 0, 议题契合: 0,
  };

  let matchedOption = { question: "experience", value: "", label: "" };

  for (const q of SURVEY_QUESTIONS) {
    const ans = answers[q.id];
    const opt = q.options.find(o => o.value === ans);
    if (!opt) continue;
    matchedOption = { question: q.id, value: opt.value, label: opt.label };
    for (const [k, v] of Object.entries(opt.weights)) {
      const key = k as DimKey;
      dim[key] += v ?? 0;
      count[key] += 1;
    }
  }

  // 标准化 (除以命中维度的题目数, 让 0-1)
  for (const k of Object.keys(dim) as DimKey[]) {
    dim[k] = count[k] === 0 ? 0 : Math.min(1, dim[k] / count[k]);
  }

  // 风险等级
  const r = dim.风险偏好;
  const riskLevel = r < 0.35 ? "低" : r < 0.7 ? "中" : "高";

  // 标签 (按维度强弱排序取前 3)
  const tags = (Object.entries(dim) as [DimKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${k}${v > 0.7 ? "·强" : v > 0.4 ? "·中" : "·弱"}`);

  // headline 文案
  const sectorOpt = SURVEY_QUESTIONS.find(q => q.id === "sector")!
    .options.find(o => o.value === answers.sector);
  const recommendedSector = sectorOpt?.label ?? "综合";
  const headlineMap: Record<string, string> = {
    research:   "深度研究型 — 适合用 AstorAgent 跑主线 + 标的扫描",
    allocation: "配置型 — 重点用组合管理与再平衡",
    execution:  "执行型 — 复盘与信号跟踪优先",
    learning:   "学习型 — 框架升级 + 案例复盘推荐",
  };
  const goalOpt = SURVEY_QUESTIONS.find(q => q.id === "goal")!
    .options.find(o => o.value === answers.goal);
  const headline = headlineMap[answers.goal] ?? headlineMap[goalOpt?.value ?? "research"];

  return { dim, tags, matchedOption: matchedOption as any, headline, riskLevel: riskLevel as any, recommendedSector };
}

/**
 * 给用户的"信号反馈" —— 答完 1 题就出现 1 条
 * (前端 UI 漂浮显示已捕捉到的信号)
 */
export function extractSignals(answers: Partial<SurveyAnswers>): string[] {
  const signals: string[] = [];
  if (answers.experience) {
    const m: Record<string, string> = {
      novice: "已捕捉: 新手, 需基础概念铺垫",
      intermediate: "已捕捉: 中阶, 推荐中等深度研究",
      advanced: "已捕捉: 资深, 可推送高阶议题",
      pro: "已捕捉: 专业级, 启用机构级数据",
    };
    if (m[answers.experience]) signals.push(m[answers.experience]);
  }
  if (answers.risk) {
    const m: Record<string, string> = {
      conservative: "信号: 风险厌恶, 配保守组合",
      moderate: "信号: 风险中性, 推荐平衡策略",
      aggressive: "信号: 风险偏好高, 关注成长标的",
      speculative: "信号: 激进, 需关注止盈止损",
    };
    if (m[answers.risk]) signals.push(m[answers.risk]);
  }
  if (answers.capital) {
    const m: Record<string, string> = {
      lt100k: "信号: 流动性优先",
      "100k_500k": "信号: 标准策略池",
      "500k_2m": "信号: 进阶策略 + 个性化建议",
      gt2m: "信号: 私享路径匹配",
    };
    if (m[answers.capital]) signals.push(m[answers.capital]);
  }
  if (answers.sector) {
    signals.push(`已聚焦: ${SURVEY_QUESTIONS[3].options.find(o => o.value === answers.sector)?.label}`);
  }
  if (answers.horizon) {
    const m: Record<string, string> = {
      lt_3m: "信号: 短线策略池",
      "3m_1y": "信号: 中周期波段",
      "1y_3y": "信号: 中长期价值",
      gt_3y: "信号: 长期复利",
    };
    if (m[answers.horizon]) signals.push(m[answers.horizon]);
  }
  return signals;
}