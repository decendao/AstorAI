/**
 * Agent 演示回复生成 (纯函数, 无副作用)。
 *
 * 这份逻辑被两处共用:
 *   1. `app/api/astor/stream/route.ts` —— Next.js 服务端 (node runtime)
 *   2. `components/astor/AstorStreamDemo.tsx` —— 纯静态导出时的客户端回退
 *
 * 共用的原因: 静态导出 (output: 'export') 下没有 server runtime, EventSource
 * 打不到 /api/astor/stream。如果两边各写一份, 演示文案迟早会漂移。
 * 抽出来后, demo 在任何部署形态下讲的都是同一套话。
 *
 * 真接入 LLM 时: 服务端换成 getProvider() (packages/llm), 客户端回退保留
 * 同一份 SSE 帧协议 {type:"token"|"done", data} 即可无缝切换。
 */

export type StreamFrame =
  | { type: "token"; data: string }
  | { type: "done" }
  | { type: "error"; data: string };

/** 每个 token 帧的字符数 —— 跟原 route.ts 保持一致。 */
export const CHUNK_SIZE = 8;

/** 帧间隔 (ms) —— 保持原服务端节奏, 避免静态回退"秒出"失去流式观感。 */
export const FRAME_INTERVAL_MS = 30;

export function buildReply(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("红") || t.includes("red")) {
    return "合规红线: 任何收益/兜底承诺/绝对化表述都需重写为中性风险描述, 详见 packages/compliance/redline.ts";
  }
  if (t.includes("管") || t.includes("rbac") || t.includes("权限")) {
    return "RBAC 五级 L1-L5, ADMIN/MASTER 旁路。中间件位置: middleware.ts → requireRole。";
  }
  if (t.includes("阶") || t.includes("pipeline")) {
    return "智能体流水线: Analyzer → Reporter → Reviewer, zod 校验失败回退规则引擎, 留痕 AgentRun。";
  }
  if (t.includes("支") || t.includes("pay")) {
    return "支付: mock 默认, ASTOR_PAY_PROVIDER=wechat|alipay 切换, key 到位即生效。";
  }
  return `Astor OS · 收到问题「${q.slice(0, 80)}」。这是 mock 流式输出, 真实环境由智谱/通义/DeepSeek 驱动。`;
}

/** 把整段回复切成 SSE 帧序列 —— 服务端与客户端回退共用同一套切分逻辑。 */
export function toFrames(q: string): StreamFrame[] {
  const text = buildReply(q);
  const frames: StreamFrame[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    frames.push({ type: "token", data: text.slice(i, i + CHUNK_SIZE) });
  }
  frames.push({ type: "done" });
  return frames;
}

/** 帧序列 → `data: {...}\n\n` 文本, 供服务端直接 enqueue。 */
export function frameToSSE(frame: StreamFrame): string {
  return `data: ${JSON.stringify(frame)}\n\n`;
}
