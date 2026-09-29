import type { ZodType } from "zod";
import type { AgentNameType } from "@astorai/api-types";
import { openAICompatProvider } from "./openai-compat";

export type AgentName = AgentNameType;

export type LLMRequest<T> = {
  agent: AgentName;
  system: string;
  user: string;
  schema: ZodType<T>;
  /** mock provider 直接返回该确定性结果 (各 Agent 自定义, 通常即规则引擎基线) */
  mock: () => T;
};

export type LLMResult<T> = {
  data: T;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCny: number;
  latencyMs: number;
};

export interface LLMProvider {
  readonly name: string;
  readonly model: string;
  complete<T>(req: LLMRequest<T>): Promise<LLMResult<T>>;
}

// ── 定价 (元 / 百万 tokens, 仅用于成本留痕, 可 env 覆盖) ──

type Pricing = { input: number; output: number };

export type ProviderKey = "zhipu" | "qwen" | "deepseek";

export interface ProviderConfig {
  baseUrl: string;
  defaultModel: string;
  keyEnv: string;
  pricing: Pricing;
  label: string;
}

export const PROVIDER_CONFIG: Record<ProviderKey, ProviderConfig> = {
  zhipu: {
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    defaultModel: "glm-4.6",
    keyEnv: "ZHIPU_API_KEY",
    pricing: { input: 4, output: 16 },
    label: "智谱 GLM",
  },
  qwen: {
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-max",
    keyEnv: "QWEN_API_KEY",
    pricing: { input: 2.4, output: 9.6 },
    label: "通义千问",
  },
  deepseek: {
    baseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    keyEnv: "DEEPSEEK_API_KEY",
    pricing: { input: 2, output: 8 },
    label: "DeepSeek",
  },
};

export function resolveProviderName(): "mock" | ProviderKey {
  const raw = (process.env.ASTOR_LLM_PROVIDER ?? "mock").toLowerCase();
  if (raw === "zhipu" || raw === "qwen" || raw === "deepseek") return raw;
  return "mock";
}

export function getProvider(): LLMProvider {
  const name = resolveProviderName();
  if (name === "mock") return mockProvider;
  return openAICompatProvider(name, PROVIDER_CONFIG[name]);
}

// ── Mock Provider (默认): 确定性、零成本、零延迟 ──

export const mockProvider: LLMProvider = {
  name: "mock",
  model: "mock-1",
  async complete<T>(req: LLMRequest<T>): Promise<LLMResult<T>> {
    const started = Date.now();
    const data = req.schema.parse(req.mock());
    const inputTokens = Math.ceil((req.system.length + req.user.length) / 3); // 中文粗估
    const outputTokens = Math.ceil(JSON.stringify(data).length / 3);
    return {
      data,
      provider: "mock",
      model: "mock-1",
      inputTokens,
      outputTokens,
      costCny: 0,
      latencyMs: Date.now() - started,
    };
  },
};