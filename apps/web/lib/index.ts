/**
 * apps/web 共享库 — 接入 workspace 包
 *
 * - cn/date/mask 等基础工具 → @astorai/utils
 * - 合规检查 (红线扫描) 服务端 → @astorai/compliance
 * - API 契约 schema → @astorai/api-types
 */

export { cn, formatDate, maskPhone, maskEmail, centsToYuan, yuanToCents } from "@astorai/utils";

// 注意: @astorai/compliance 的 encryption/rbac/redline 依赖 env 与服务端运行时,
// 严禁在 React Client Component 直接 import 整个包。
// 服务端使用示例 (在 app/api/.../route.ts 或 Server Action):
//   import { scanRedline, checkLevel } from "@astorai/compliance";
//   const violations = scanRedline(text);
export type { RedlineViolation } from "@astorai/compliance";

export {
  IntakeAnswersSchema,
  SubmitIntakeInputSchema,
  DraftIntakeInputSchema,
  DiagnosisReportSchema,
  ApproveReportInputSchema,
  RejectReportInputSchema,
  AnalyzerOutputSchema,
  ReporterOutputSchema,
  ReviewerOutputSchema,
  type IntakeAnswers,
  type InvestorProfile,
  type ReportSections,
  type DiagnosisReport,
  type AnalyzerOutput,
  type ReporterOutput,
  type ReviewerOutput,
} from "@astorai/api-types";