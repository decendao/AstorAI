import { NextResponse } from "next/server";
import { SurveyAnswersSchema, computePrimaryProfile } from "@/lib/survey-questions";

/**
 * POST /api/survey/submit
 * 接收 6 题答案 → 计算五维画像 → 返回 (mock, 实际项目接 DB)
 *
 * Body: { experience, risk, capital, sector, horizon, goal }
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

    const profile = computePrimaryProfile(parsed.data);

    // TODO: 真实项目 — 写 DB + 入 agent.run (与 Astor OS 复用)
    // const agentRun = await prisma.agentRun.create({...})

    return NextResponse.json({
      ok: true,
      profile,
      /** 推荐下一题 (36 题深度诊断 v2 才用) */
      nextQuestions: [],
      /** 跟踪 id, 用于后续提交 36 题完整问卷时关联 */
      sessionId: `survey_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: e?.message },
      { status: 500 },
    );
  }
}