import { NextRequest } from "next/server";

/**
 * Agent 流式演示接口 (mock provider)。
 *
 * GET /api/astor/stream?q=...
 *   → text/event-stream, 每帧一个 JSON {type:"token"|"done"|"error", data}
 *
 * 真接入时: 服务端用 getProvider() 替换 mock, 由前端用同一份 SSE 协议消费。
 * 此处 mock 保证无 key 也能联调前端。
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REPLY = (q: string): string => {
  const t = q.toLowerCase();
  if (t.includes("红") || t.includes("red")) {
    return "合规红线: 任何收益/保本/绝对化表述都需重写为中性风险描述, 详见 packages/compliance/redline.ts";
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
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "Astor 介绍";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const text = REPLY(q);
      const chunkSize = 8;
      for (let i = 0; i < text.length; i += chunkSize) {
        const slice = text.slice(i, i + chunkSize);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "token", data: slice })}\n\n`));
        await new Promise((r) => setTimeout(r, 30));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}