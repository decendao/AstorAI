/**
 * @astorai/llm — 多 LLM 适配层
 *
 * 铁律:
 *  1. 模型无关 — 调用方只依赖 getProvider().complete(), 换供应商 = 换 env
 *  2. 境内合规 — baseUrl 白名单硬编码, 不接受 env 覆盖 (画像与问卷数据不出境)
 *  3. 结构化输出 — JSON + zod 运行时校验, 幻觉字段拒收重试一次
 *  4. Mock Provider 为默认 — 无 key 也能跑通全链路 (mock = 规则引擎基线)
 */

export * from "./provider";
export * from "./openai-compat";