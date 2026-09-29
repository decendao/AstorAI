/**
 * @astorai/agents — Analyzer / Reporter / Reviewer 流水线
 *
 * 流水线:
 *   1. Analyzer: 问卷答案 → AnalyzerOutput (五维画像 + 事实 + 置信度)
 *   2. Reporter: AnalyzerOutput → ReporterOutput (四节诊断报告)
 *   3. Reviewer: ReporterOutput → ReviewerOutput (合规判定 + flags)
 *   4. 规则扫描双保险: 与 Reviewer 输出合并去重
 *
 * 铁律:
 *  - AI 只产 DRAFT, zod 校验拒收幻觉字段, 失败回退规则引擎
 *  - 留痕: 每次 LLM 调用 → AgentRun (由调用方落库)
 *  - Prompt 版本通过 PromptVersion 加载, 改 prompt = 升 semver
 *  - 注入式: prisma / db / repository 由调用方提供, 本包无副作用
 */

export * from "./prompts";
export * from "./analyzer-rules";
export * from "./reviewer-rules";
export * from "./pipeline";