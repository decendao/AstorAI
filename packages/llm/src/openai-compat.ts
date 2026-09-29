import type { LLMProvider, LLMRequest, LLMResult } from "./provider";
import type { ProviderKey, ProviderConfig } from "./provider";

/**
 * OpenAI 兼容协议适配器 — 智谱 GLM / 通义千问 (DashScope compatible-mode) / DeepSeek 共用。
 * baseUrl 白名单由 provider.ts 硬编码传入, 不接受 env 覆盖 (数据出境合规)。
 */

const TIMEOUT_MS = 90_000;
const MAX_ATTEMPTS = 2; // 首次 + zod/JSON 校验失败重试一次

export function openAICompatProvider(name: ProviderKey, config: ProviderConfig): LLMProvider {
  const model = process.env.ASTOR_LLM_MODEL?.trim() || config.defaultModel;

  async function callOnce(req: { system: string; user: string }, fixHint?: string) {
    const apiKey = process.env[config.keyEnv];
    if (!apiKey) {
      throw new Error(`环境变量 ${config.keyEnv} 未配置 (供应商 ${config.label})`);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: fixHint ? `${req.user}\n\n${fixHint}` : req.user },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`LLM HTTP ${res.status}: ${body.slice(0, 300)}`);
      }
      return (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    name,
    model,
    async complete<T>(req: LLMRequest<T>): Promise<LLMResult<T>> {
      const started = Date.now();
      let lastError: unknown = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const fixHint =
          attempt > 1
            ? `上一次输出未通过 schema 校验: ${String(lastError).slice(0, 300)}。请严格只输出符合要求的 JSON 对象, 不要多余字段, 不要 markdown 代码块。`
            : undefined;
        try {
          const res = await callOnce({ system: req.system, user: req.user }, fixHint);
          const content = res.choices?.[0]?.message?.content ?? "";
          const parsed = parseJson(content);
          const data = req.schema.parse(parsed);
          const inputTokens = res.usage?.prompt_tokens ?? estimateTokens(req.system + req.user);
          const outputTokens = res.usage?.completion_tokens ?? estimateTokens(content);
          return {
            data,
            provider: name,
            model,
            inputTokens,
            outputTokens,
            costCny: round4(
              (inputTokens / 1_000_000) * config.pricing.input +
                (outputTokens / 1_000_000) * config.pricing.output,
            ),
            latencyMs: Date.now() - started,
          };
        } catch (e) {
          lastError = e;
        }
      }
      throw lastError instanceof Error ? lastError : new Error(String(lastError));
    },
  };
}

function parseJson(content: string): unknown {
  let text = content.trim();
  // 容错: 剥掉 ```json ... ``` 围栏
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start > 0 || (end !== -1 && end < text.length - 1)) text = text.slice(start, end + 1);
  return JSON.parse(text);
}

function estimateTokens(s: string): number {
  return Math.ceil(s.length / 3);
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}