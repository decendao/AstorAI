/**
 * Demo seed · 插入几条示例数据, 方便演示 /admin/stats 有内容
 * 运行: pnpm --filter @astorai/web exec tsx prisma/seed.ts
 *      或 ./scripts/db.sh seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("▶ 清空旧 demo 数据…");
  await prisma.surveySubmission.deleteMany({});
  await prisma.astorChat.deleteMany({});
  await prisma.demoMember.deleteMany({});

  console.log("▶ 插入 3 个 demo Member…");
  await prisma.demoMember.createMany({
    data: [
      { displayName: "林雨晴", level: 4, surveyCount: 3 },
      { displayName: "周子涵", level: 3, surveyCount: 5 },
      { displayName: "陈思远", level: 5, surveyCount: 1 },
    ],
  });

  console.log("▶ 插入 5 条问卷…");
  const profiles = [
    { alpha: 0.82, asset: 0.45, social: 0.71, risk: 0.38, service: 0.66 },
    { alpha: 0.31, asset: 0.78, social: 0.55, risk: 0.21, service: 0.44 },
    { alpha: 0.66, asset: 0.62, social: 0.83, risk: 0.74, service: 0.51 },
    { alpha: 0.45, asset: 0.50, social: 0.42, risk: 0.55, service: 0.79 },
    { alpha: 0.91, asset: 0.33, social: 0.66, risk: 0.82, service: 0.58 },
  ];

  for (let i = 0; i < profiles.length; i++) {
    await prisma.surveySubmission.create({
      data: {
        sessionId: `seed_survey_${i + 1}`,
        answers: {
          q1: ["pe_alpha", "pe_alpha", "vc_alpha", "growth_alpha", "vc_alpha"][i],
          q2: ["real_estate", "private_equity", "secondary", "private_equity", "secondary"][i],
          q3: ["inner_circle", "open", "inner_circle", "topic_circle", "inner_circle"][i],
          q4: ["balanced", "conservative", "aggressive", "balanced", "aggressive"][i],
          q5: ["high_touch", "self_serve", "high_touch", "digital", "high_touch"][i],
          q6_text: ["种子轮 + Pre-A 项目", "不动产 LP 跟投", "跨境 S 份额转让", "数字资产研究", "新能源车产业链"][i],
        },
        profile: profiles[i],
      },
    });
  }

  console.log("▶ 插入 6 条 Astor 对话…");
  const conversations = [
    { q: "什么是红线?", preset: "红线" },
    { q: "权限怎么管?", preset: "RBAC" },
    { q: "Astor 介绍", preset: undefined },
    { q: "智能体流水线长什么样?", preset: "流水线" },
    { q: "支付如何切换?", preset: "支付" },
    { q: "我们公司估值怎么看?", preset: undefined },
  ];

  for (let i = 0; i < conversations.length; i++) {
    const { q, preset } = conversations[i];
    const sid = `seed_astor_${Math.floor(i / 2) + 1}`;
    await prisma.astorChat.create({
      data: { sessionId: sid, role: "user", content: q, preset },
    });
    await prisma.astorChat.create({
      data: { sessionId: sid, role: "assistant", content: `这是 seed 中的演示回复 #${i + 1}: 收到「${q}」。` },
    });
  }

  const counts = await Promise.all([
    prisma.surveySubmission.count(),
    prisma.astorChat.count(),
    prisma.demoMember.count(),
  ]);
  console.log(`✓ seed 完成: ${counts[0]} 问卷 / ${counts[1]} 对话 / ${counts[2]} Member`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());