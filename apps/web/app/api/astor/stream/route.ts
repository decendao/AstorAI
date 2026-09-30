import { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { FRAME_INTERVAL_MS, buildReply, frameToSSE } from "@/lib/astor-reply";
import { prisma, dbEnabled } from "@/lib/db";

/**
 * Agent 流式演示接口 (mock provider)。
 *
 * GET /api/astor/stream?q=...&sid=...&preset=...
 *   → text/event-stream, 每帧一个 JSON {type:"token"|"done"|"error", data}
 *   → 落库: 一次性写入 AstorChat(user) + AstorChat(assistant)
 *
 * 真接入时: 服务端用 getProvider() 替换 mock, 由前端用同一份 SSE 协议消费。
 * 此处 mock 保证无 key 也能联调前端。
 *
 * ⚠️ 本路由仅在有 server runtime 的部署 (next start / ECS / Cloud IDE) 下存在。
 *    纯静态导出 (output: 'export') 时 Next.js 不会输出 route handler, 前端
 *    AstorStreamDemo 会自动回退到 lib/astor-reply.ts 的客户端实现。
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "Astor 介绍";
  const sid = req.nextUrl.searchParams.get("sid") ?? `astor_${randomBytes(4).toString("hex")}`;
  const preset = req.nextUrl.searchParams.get("preset") ?? undefined;
  const reply = buildReply(q);

  // 入库 (fire-and-forget, 不阻塞流)
  if (dbEnabled()) {
    Promise.allSettled([
      prisma.astorChat.create({ data: { sessionId: sid, role: "user", content: q, preset } }),
      prisma.astorChat.create({ data: { sessionId: sid, role: "assistant", content: reply } }),
    ]).catch((e) => console.warn("[astor/stream] persist failed:", e?.message));
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chunkSize = 8;
      for (let i = 0; i < reply.length; i += chunkSize) {
        controller.enqueue(encoder.encode(frameToSSE({ type: "token", data: reply.slice(i, i + chunkSize) })));
        await new Promise((r) => setTimeout(r, FRAME_INTERVAL_MS));
      }
      controller.enqueue(encoder.encode(frameToSSE({ type: "done" })));
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
