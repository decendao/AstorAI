import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { SurveyAnswersSchema } from "@/lib/survey-questions";
import { computeProfile } from "@/lib/scoring";
import { prisma, dbEnabled } from "@/lib/db";

/**
 * POST /api/survey/submit
 *
 * Body: { q1, q2, q3, q4, q5, q6_text }
 * Flow: zod 校验 → 计算五维画像 → (可选) 写入 Neon Postgres
 *
 * 数据库策略:
 *   - env DATABASE_URL 设置 → 真实入库 (Neon 免费档够用)
 *   - 未设置 → 纯 mock 返回, 演示照常运行
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SurveyAnswersSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "INVALID_INPUT", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const profile = computeProfile(parsed.data);
    const sessionId = `survey_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ua = req.headers.get("user-agent") ?? undefined;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? req.headers.get("x-real-ip")
      ?? undefined;
    const ipHash = ip
      ? createHash("sha256").update(`${process.env.IP_HASH_SALT ?? "astor-demo"}${ip}`).digest("hex").slice(0, 16)
      : undefined;

    // 真实数据库写入 (优雅降级: 失败不影响返回)
    let persisted = false;
    let persistError: string | undefined;
    if (dbEnabled()) {
      try {
        await prisma.surveySubmission.create({
          data: {
            sessionId,
            answers: parsed.data,
            profile,
            userAgent: ua?.slice(0, 500),
            ipHash,
          },
        });
        persisted = true;
      } catch (e: any) {
        // DB 暂时不可用 (冷启动/Neon wake-up) → 不阻塞响应, 仅记录
        persistError = e?.message?.slice(0, 200);
        console.warn("[survey/submit] prisma write failed:", persistError);
      }
    }

    return NextResponse.json({
      ok: true,
      profile,
      nextQuestions: [],
      sessionId,
      persisted,
      ...(persistError ? { persistError } : {}),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: e?.message },
      { status: 500 },
    );
  }
}