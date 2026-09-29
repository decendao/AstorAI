/**
 * 报告域 — DiagnosisReport 状态机与 sections
 *
 * 状态机: DRAFT → PUBLISHED / REJECTED, 单向不可逆 (除显式 admin reset)。
 */

import { z } from "zod";

export const ReportStatus = z.enum(["DRAFT", "PUBLISHED", "REJECTED"]);
export type ReportStatusType = z.infer<typeof ReportStatus>;

export const ReportSectionsSchema = z.object({
  summary: z.string().min(1),
  match: z.string().min(1),
  risks: z.string().min(1),
  recommendation: z.string().min(1),
});
export type ReportSections = z.infer<typeof ReportSectionsSchema>;

export const RiskFlagSchema = z.object({
  section: z.string(),
  type: z.enum(["exaggeration", "overreach", "fabrication", "sensitive"]),
  severity: z.enum(["high", "medium", "low"]),
  detail: z.string(),
});
export type RiskFlag = z.infer<typeof RiskFlagSchema>;

export const DiagnosisReportSchema = z.object({
  id: z.string(),
  partyId: z.string(),
  version: z.number().int().min(1),
  status: ReportStatus,
  sections: ReportSectionsSchema,
  riskFlags: z.array(RiskFlagSchema).default([]),
  sourceAgentRunId: z.string().nullable(),
  reviewedById: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  publishedAt: z.string().nullable(),
  reviewNote: z.string().nullable(),
});
export type DiagnosisReport = z.infer<typeof DiagnosisReportSchema>;

// ── 审批 API ──

export const ApproveReportInputSchema = z.object({
  reportId: z.string().min(1),
  reviewerMemberId: z.string().min(1),
  note: z.string().max(2000).optional(),
});
export type ApproveReportInput = z.infer<typeof ApproveReportInputSchema>;

export const RejectReportInputSchema = z.object({
  reportId: z.string().min(1),
  reviewerMemberId: z.string().min(1),
  note: z.string().min(1).max(2000),
});
export type RejectReportInput = z.infer<typeof RejectReportInputSchema>;