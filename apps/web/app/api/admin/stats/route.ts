import { NextResponse } from "next/server";
import { prisma, dbEnabled } from "@/lib/db";

/**
 * GET /api/admin/stats
 *
 * 返回数据库统计 (demo 用, 仅展示最近 50 条)。
 * 真实部署需加 requireRole('ADMIN') 守护 — 见 packages/compliance/rbac.ts
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!dbEnabled()) {
    return NextResponse.json({
      ok: false,
      dbEnabled: false,
      hint: "未设置 DATABASE_URL, 当前为纯 mock 模式",
    });
  }

  try {
    const [surveyCount, astorCount, recentSurveys, recentChats] = await Promise.all([
      prisma.surveySubmission.count(),
      prisma.astorChat.count(),
      prisma.surveySubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          sessionId: true,
          profile: true,
          createdAt: true,
        },
      }),
      prisma.astorChat.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          sessionId: true,
          role: true,
          content: true,
          preset: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      dbEnabled: true,
      stats: { surveyCount, astorCount },
      recentSurveys,
      recentChats,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, dbEnabled: true, error: e?.message?.slice(0, 200) },
      { status: 500 },
    );
  }
}