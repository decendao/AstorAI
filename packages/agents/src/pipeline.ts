import type {
  AgentNameType,
  AnalyzerOutput,
  DiagnosisReport,
  ReporterOutput,
  ReviewerOutput,
  RiskFlag,
} from "@astorai/api-types";
import { getProvider, type LLMProvider } from "@astorai/llm";
import { AnalyzerOutputSchema, ReporterOutputSchema, ReviewerOutputSchema } from "@astorai/api-types";
import { analyzeOnboarding } from "./analyzer-rules";
import { scanReportText, mergeFlags } from "./reviewer-rules";
import { PROMPT_V1 } from "./prompts";

/**
 * 主管线: Analyzer → Reporter → Reviewer → 规则双保险 → DiagnosisReport DRAFT。
 *
 * 副作用全部由 Sink 接管, 本函数纯函数化:
 *   - LLMProvider: 注入或默认 getProvider()
 *   - PromptLoader: 注入或默认从 PROMPT_V1 取 v1.0.0
 *   - Sink: 接收 AgentRun 与最终 Draft, 调用方落库
 *
 * 铁律: 任何 Agent zod 校验失败 → 回退规则引擎, 不抛错给上层。
 */

export interface PipelineSink {
  /** 每次 LLM 调用落库一条 AgentRun (用于成本/延迟/版本溯源) */
  recordAgentRun(input: AgentRunRecord): Promise<void>;
  /** 最终 DRAFT 落库到 DiagnosisReport 表, 返回 id */
  saveDraft(input: { partyId: string; version: number; sections: ReporterOutput; riskFlags: RiskFlag[]; sourceAgentRunId: string | null }): Promise<{ id: string }>;
}

export interface AgentRunRecord {
  agent: AgentNameType;
  promptVersionId: string | null;
  provider: string;
  model: string;
  inputTokens: number | null;
  outputTokens: number | null;
  costCny: number | null;
  latencyMs: number;
  status: "ok" | "fallback_rule_engine" | "error";
  error: string | null;
}

export interface PipelineInput {
  partyId: string;
  /** 上一版报告 version + 1; 第一版 = 1 */
  nextVersion: number;
  questions: Parameters<typeof analyzeOnboarding>[0];
  answers: Parameters<typeof analyzeOnboarding>[1];
  /** promptVersionIds 三选一, 不传则用 PROMPT_V1 内联版 */
  promptVersionIds?: { ANALYZER?: string; REPORTER?: string; REVIEWER?: string };
  provider?: LLMProvider;
}

export interface PipelineOutput {
  draft: Pick<DiagnosisReport, "sections" | "riskFlags" | "status" | "version" | "sourceAgentRunId"> & { id: string };
  analyzer: AnalyzerOutput;
  reviewer: ReviewerOutput;
  usedFallback: boolean;
}

/** 默认 mock provider, 在 Node 22 全局 fetch 不可用时 (测试环境) 自动降级 */
function defaultProvider(): LLMProvider {
  try {
    return getProvider();
  } catch {
    return {
      name: "noop",
      model: "noop",
      async complete<T>(req: { mock: () => T }): Promise<{ data: T; provider: string; model: string; inputTokens: number; outputTokens: number; costCny: number; latencyMs: number }> {
        const started = Date.now();
        const data = req.mock();
        return {
          data,
          provider: "noop",
          model: "noop",
          inputTokens: 0,
          outputTokens: 0,
          costCny: 0,
          latencyMs: Date.now() - started,
        };
      },
    };
  }
}

export async function runDiagnosisPipeline(input: PipelineInput, sink: PipelineSink): Promise<PipelineOutput> {
  const provider = input.provider ?? defaultProvider();
  const pvIds = input.promptVersionIds ?? {};

  // ── 1. Analyzer ──
  let analyzer: AnalyzerOutput;
  let usedFallback = false;
  let analyzerRunId: string | null = null;
  const analyzerPrompt = PROMPT_V1.ANALYZER.template;

  try {
    const r = await provider.complete({
      agent: "ANALYZER",
      system: analyzerPrompt,
      user: JSON.stringify({ questions: input.questions, answers: input.answers }),
      schema: AnalyzerOutputSchema,
      mock: () => analyzeOnboarding(input.questions, input.answers),
    });
    analyzer = r.data;
    const run = await sink.recordAgentRun({
      agent: "ANALYZER",
      promptVersionId: pvIds.ANALYZER ?? null,
      provider: r.provider,
      model: r.model,
      inputTokens: r.inputTokens,
      outputTokens: r.outputTokens,
      costCny: r.costCny,
      latencyMs: r.latencyMs,
      status: "ok",
      error: null,
    });
    analyzerRunId = run.id;
  } catch (e) {
    usedFallback = true;
    analyzer = analyzeOnboarding(input.questions, input.answers);
    await sink.recordAgentRun({
      agent: "ANALYZER",
      promptVersionId: pvIds.ANALYZER ?? null,
      provider: "rule-engine",
      model: "v1",
      inputTokens: null,
      outputTokens: null,
      costCny: 0,
      latencyMs: 0,
      status: "fallback_rule_engine",
      error: String(e).slice(0, 500),
    });
  }

  // ── 2. Reporter ──
  let reporter: ReporterOutput;
  const reporterPrompt = PROMPT_V1.REPORTER.template;
  try {
    const r = await provider.complete({
      agent: "REPORTER",
      system: reporterPrompt,
      user: JSON.stringify({ analyzer }),
      schema: ReporterOutputSchema,
      mock: () => buildReporterFromAnalyzer(analyzer),
    });
    reporter = r.data;
    await sink.recordAgentRun({
      agent: "REPORTER",
      promptVersionId: pvIds.REPORTER ?? null,
      provider: r.provider,
      model: r.model,
      inputTokens: r.inputTokens,
      outputTokens: r.outputTokens,
      costCny: r.costCny,
      latencyMs: r.latencyMs,
      status: "ok",
      error: null,
    });
  } catch (e) {
    usedFallback = true;
    reporter = buildReporterFromAnalyzer(analyzer);
    await sink.recordAgentRun({
      agent: "REPORTER",
      promptVersionId: pvIds.REPORTER ?? null,
      provider: "rule-engine",
      model: "v1",
      inputTokens: null,
      outputTokens: null,
      costCny: 0,
      latencyMs: 0,
      status: "fallback_rule_engine",
      error: String(e).slice(0, 500),
    });
  }

  // ── 3. Reviewer (LLM) + 规则扫描 双保险 ──
  let reviewer: ReviewerOutput;
  const reviewerPrompt = PROMPT_V1.REVIEWER.template;
  try {
    const r = await provider.complete({
      agent: "REVIEWER",
      system: reviewerPrompt,
      user: JSON.stringify({ reporter }),
      schema: ReviewerOutputSchema,
      mock: () => ({ verdict: "pass" as const, flags: scanReportText(reporter) }),
    });
    reviewer = r.data;
    await sink.recordAgentRun({
      agent: "REVIEWER",
      promptVersionId: pvIds.REVIEWER ?? null,
      provider: r.provider,
      model: r.model,
      inputTokens: r.inputTokens,
      outputTokens: r.outputTokens,
      costCny: r.costCny,
      latencyMs: r.latencyMs,
      status: "ok",
      error: null,
    });
  } catch (e) {
    usedFallback = true;
    reviewer = { verdict: "pass", flags: scanReportText(reporter) };
    await sink.recordAgentRun({
      agent: "REVIEWER",
      promptVersionId: pvIds.REVIEWER ?? null,
      provider: "rule-engine",
      model: "v1",
      inputTokens: null,
      outputTokens: null,
      costCny: 0,
      latencyMs: 0,
      status: "fallback_rule_engine",
      error: String(e).slice(0, 500),
    });
  }

  const finalFlags = mergeFlags(scanReportText(reporter), reviewer.flags);

  const saved = await sink.saveDraft({
    partyId: input.partyId,
    version: input.nextVersion,
    sections: reporter,
    riskFlags: finalFlags,
    sourceAgentRunId: analyzerRunId,
  });

  return {
    draft: {
      id: saved.id,
      sections: reporter,
      riskFlags: finalFlags,
      status: "DRAFT",
      version: input.nextVersion,
      sourceAgentRunId: analyzerRunId,
    },
    analyzer,
    reviewer,
    usedFallback,
  };
}

/** Reporter 规则回退: 把 Analyzer 五维拼成四节骨架, 描述性不越权 */
export function buildReporterFromAnalyzer(a: AnalyzerOutput): ReporterOutput {
  const dimLines = (Object.entries(a.dimensions) as Array<[string, { value: string | string[]; confidence: number; evidenceQ: string[] }]>)
    .map(([k, d]) => {
      const v = Array.isArray(d.value) ? d.value.join(" / ") : d.value;
      return `· ${k}: ${v} (conf ${d.confidence.toFixed(2)}, 证据: ${d.evidenceQ.join("; ") || "无"})`;
    })
    .join("\n");
  return {
    summary: `【规则引擎版 · 画像】整体置信度 ${(a.confidence * 100).toFixed(0)}%。\n${dimLines}`,
    match: `匹配参考（仅供审核，非准入结论）: ${a.facts.assetBand && a.facts.assetBand.includes("亿") ? "资产量级达到 L3+ 评估区间" : "暂无显著资产信号"}；动机: ${a.facts.motivation ? "「" + a.facts.motivation.slice(0, 60) + "」" : "未填写"}。`,
    risks: `信息不足维度: ${Object.entries(a.dimensions).filter(([, d]) => d.evidenceQ.length === 0).map(([k]) => k).join(", ") || "无"}。规则引擎不替代人工尽调。`,
    recommendation: `仅供人工参考: NEED_MORE_INFO。最终以人工审核为准。`,
  };
}