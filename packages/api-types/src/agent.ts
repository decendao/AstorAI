/**
 * Agent 域 — Analyzer / Reporter / Reviewer 三段流水线结构化输出
 *
 * 铁律: AI 只产 DRAFT, zod 校验拒收幻觉字段, 失败回退规则引擎。
 */

import { z } from "zod";

export const AgentName = z.enum(["ANALYZER", "REPORTER", "REVIEWER"]);
export type AgentNameType = z.infer<typeof AgentName>;

// ── Analyzer: 问卷 → 画像 (5 维 + 置信度 + 事实) ──

const DimensionZ = z.object({
  value: z.union([z.string(), z.array(z.string())]),
  confidence: z.number().min(0).max(1),
  evidenceQ: z.array(z.string()),
  note: z.string().optional(),
});

export const AnalyzerOutputSchema = z.object({
  dimensions: z.object({
    riskPosture: DimensionZ,
    alphaAppetite: DimensionZ,
    resourceContribution: DimensionZ,
    networkPosition: DimensionZ,
    serviceExpectation: DimensionZ,
  }),
  facts: z.record(z.string()),
  summary: z.string(),
  confidence: z.number().min(0).max(1),
});
export type AnalyzerOutput = z.infer<typeof AnalyzerOutputSchema>;

// ── Reporter: 画像 → 报告 (4 段) ──

export const ReporterOutputSchema = z.object({
  summary: z.string().min(1),
  match: z.string().min(1),
  risks: z.string().min(1),
  recommendation: z.string().min(1),
});
export type ReporterOutput = z.infer<typeof ReporterOutputSchema>;

// ── Reviewer: 报告 → 合规判定 ──

export const ReviewerFlagSchema = z.object({
  section: z.string(),
  type: z.enum(["exaggeration", "overreach", "fabrication", "sensitive"]),
  severity: z.enum(["high", "medium", "low"]),
  detail: z.string(),
});

export const ReviewerOutputSchema = z.object({
  verdict: z.enum(["pass", "needs_attention"]),
  flags: z.array(ReviewerFlagSchema),
});
export type ReviewerOutput = z.infer<typeof ReviewerOutputSchema>;

// ── Prompt 版本契约 ──

export const PromptVersionSchema = z.object({
  id: z.string(),
  agent: AgentName,
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // semver
  template: z.string().min(1),
  active: z.boolean(),
  createdAt: z.string(),
});
export type PromptVersion = z.infer<typeof PromptVersionSchema>;

// ── AgentRun 留痕契约 ──

export const AgentRunSchema = z.object({
  id: z.string(),
  agent: AgentName,
  promptVersionId: z.string(),
  provider: z.string(),
  model: z.string(),
  inputTokens: z.number().int().nullable(),
  outputTokens: z.number().int().nullable(),
  costCny: z.number().nullable(),
  latencyMs: z.number().int(),
  status: z.enum(["ok", "fallback_rule_engine", "error"]),
  error: z.string().nullable(),
});
export type AgentRun = z.infer<typeof AgentRunSchema>;