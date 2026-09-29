/**
 * 问卷域 — Onboarding Q1..Q12 输入与画像输出契约
 */

import { z } from "zod";

// ── 输入: Onboarding Q1..Q12 ──

export const IndustryDepth = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
export const Horizon = z.enum(["lt_3m", "3m_1y", "1y_3y", "gt_3y"]);
export const DrawdownTolerance = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
]);
export const TrackRecord = z.enum(["no", "self", "firm"]);
export const CapitalBand = z.enum(["lt_500k", "500k_2m", "2m_10m", "gt_10m"]);
export const IlliquidRatio = z.union([
  z.literal(0), z.literal(25), z.literal(50), z.literal(75), z.literal(100),
]);
export const LevAllowed = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);
export const ReferralSource = z.enum(["self", "friend", "media", "other"]);

export const IntakeAnswersSchema = z.object({
  q1_industry_depth: IndustryDepth,
  q2_horizon: Horizon,
  q3_drawdown_tolerance: DrawdownTolerance,
  q4_track_record: TrackRecord,
  q5_thesis_interest: z.array(z.string()).min(1).max(8),
  q6_capital_band: CapitalBand,
  q7_event_topic: z.string().min(2).max(200),
  q8_illiquid_ratio: IlliquidRatio,
  q9_lev_allowed: LevAllowed,
  q10_referral: ReferralSource,
  q11_open_note: z.string().max(500).optional(),
  q12_acknowledged: z.literal(true),
});

export type IntakeAnswers = z.infer<typeof IntakeAnswersSchema>;

// ── API 输入 ──

export const DraftIntakeInputSchema = z.object({
  memberId: z.string().min(1),
  answers: IntakeAnswersSchema.partial(),
});
export type DraftIntakeInput = z.infer<typeof DraftIntakeInputSchema>;

export const SubmitIntakeInputSchema = z.object({
  memberId: z.string().min(1),
  answers: IntakeAnswersSchema,
  confirmed: z.literal(true),
});
export type SubmitIntakeInput = z.infer<typeof SubmitIntakeInputSchema>;

// ── API 输出: 画像五维 + 标签 ──

export const InvestorProfileSchema = z.object({
  informationAsymmetry: z.number().min(0).max(1),
  riskAppetite: z.number().min(0).max(1),
  liquidityNeed: z.number().min(0).max(1),
  networkQuality: z.number().min(0).max(1),
  thesisFit: z.number().min(0).max(1),
  recommendedTags: z.array(z.string()),
});
export type InvestorProfile = z.infer<typeof InvestorProfileSchema>;

export const IntakeSubmitOutputSchema = z.object({
  ok: z.literal(true),
  submissionId: z.string(),
  profile: InvestorProfileSchema,
  createdAt: z.string(),
  complianceNote: z.string(),
});
export type IntakeSubmitOutput = z.infer<typeof IntakeSubmitOutputSchema>;