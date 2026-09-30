import { prisma, dbEnabled } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * /admin/stats · 演示用实时面板
 *
 * 展示:
 *   - DB 连接状态
 *   - 问卷提交数 + 五维画像分布
 *   - Astor 对话留痕数 + 最近对话
 *
 * 演示给投资人: 这是后端真实在跑, 不是 mock。
 */
function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour12: false,
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}

export default async function AdminStatsPage() {
  if (!dbEnabled()) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-4">Astor · 实时数据</h1>
        <div className="rounded-xl border border-amber-700/40 bg-amber-950/30 p-6">
          <h2 className="text-amber-300 font-medium mb-2">⚠ 未连接数据库</h2>
          <p className="text-amber-100/80 text-sm leading-relaxed">
            当前演示使用 mock 模式。需要真实持久化请:
          </p>
          <ol className="list-decimal list-inside text-amber-100/80 text-sm mt-3 space-y-1">
            <li>去 <code className="text-amber-200">https://neon.tech</code> 创建免费 PostgreSQL 项目</li>
            <li>复制 Pooled 连接串到 <code className="text-amber-200">apps/web/.env</code> 的 <code>DATABASE_URL</code></li>
            <li>运行 <code className="text-amber-200">cd apps/web && npx prisma db push</code></li>
            <li>重启 dev 或在 Vercel 配环境变量后重新部署</li>
          </ol>
        </div>
      </main>
    );
  }

  try {
    const [surveyCount, astorCount, recentSurveys, recentChats] = await Promise.all([
      prisma.surveySubmission.count(),
      prisma.astorChat.count(),
      prisma.surveySubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, sessionId: true, profile: true, createdAt: true },
      }),
      prisma.astorChat.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
        select: { id: true, sessionId: true, role: true, content: true, preset: true, createdAt: true },
      }),
    ]);

    // 五维画像平均分
    const dimAvg: Record<string, number> = { alpha: 0, asset: 0, social: 0, risk: 0, service: 0 };
    let dimCount = 0;
    for (const s of recentSurveys) {
      const p = s.profile as Record<string, number>;
      if (p && typeof p === "object") {
        for (const k of Object.keys(dimAvg)) {
          if (typeof p[k] === "number") {
            dimAvg[k] = (dimAvg[k] * dimCount + p[k]) / (dimCount + 1);
          }
        }
        dimCount++;
      }
    }
    if (dimCount === 0) {
      for (const k of Object.keys(dimAvg)) dimAvg[k] = 0;
    }

    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-semibold">Astor · 实时数据</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 border border-emerald-700/40 text-emerald-300">
            ● Neon Postgres 已连接
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          本页面 SSR 直连 Neon, 演示给投资人: 数据真在跑, 不只是 mock。
        </p>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="问卷提交" value={surveyCount} accent="emerald" />
          <Stat label="Astor 对话" value={astorCount} accent="indigo" />
          <Stat label="活跃画像" value={dimCount} accent="amber" />
          <Stat label="展示窗口" value="近10次" accent="slate" />
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium mb-3">五维画像均值</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(dimAvg).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-slate-900/60 border border-slate-800 p-4">
                <div className="text-xs text-slate-500 uppercase">{k}</div>
                <div className="text-2xl font-mono mt-1">{(v * 100).toFixed(0)}<span className="text-sm text-slate-500">%</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${v * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-medium mb-3">最近问卷</h2>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-2">时间</th>
                  <th className="text-left px-4 py-2">Session</th>
                  <th className="text-left px-4 py-2">画像</th>
                </tr>
              </thead>
              <tbody>
                {recentSurveys.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                      还没有数据 — 去首页填一份问卷看看？
                    </td>
                  </tr>
                ) : (
                  recentSurveys.map((s) => {
                    const p = s.profile as Record<string, number>;
                    const top = Object.entries(p ?? {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 2)
                      .map(([k, v]) => `${k}:${(v * 100).toFixed(0)}%`)
                      .join(" · ");
                    return (
                      <tr key={s.id} className="border-t border-slate-800/60">
                        <td className="px-4 py-2 text-slate-400 text-xs">{fmtDate(s.createdAt)}</td>
                        <td className="px-4 py-2 font-mono text-xs text-slate-500">{s.sessionId.slice(-8)}</td>
                        <td className="px-4 py-2 text-emerald-300">{top || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-3">最近 Astor 对话</h2>
          <div className="space-y-2">
            {recentChats.length === 0 ? (
              <p className="text-slate-500 text-sm">暂无对话 — 去 /astor 试试智能体？</p>
            ) : (
              recentChats.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg border p-3 text-sm ${
                    c.role === "user"
                      ? "border-slate-800 bg-slate-900/40"
                      : "border-emerald-900/40 bg-emerald-950/20"
                  }`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-xs font-medium ${c.role === "user" ? "text-slate-300" : "text-emerald-400"}`}>
                      {c.role === "user" ? "你" : "Astor"}
                    </span>
                    {c.preset && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{c.preset}</span>
                    )}
                    <span className="text-xs text-slate-500 ml-auto">{fmtDate(c.createdAt)}</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">{c.content.slice(0, 200)}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    );
  } catch (e: any) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-4">Astor · 实时数据</h1>
        <div className="rounded-xl border border-rose-700/40 bg-rose-950/30 p-6 text-rose-200 text-sm">
          ✗ 数据库连接失败: {e?.message?.slice(0, 300)}
        </div>
      </main>
    );
  }
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  const accentMap: Record<string, string> = {
    emerald: "border-emerald-700/40 bg-emerald-950/30 text-emerald-300",
    indigo: "border-indigo-700/40 bg-indigo-950/30 text-indigo-300",
    amber: "border-amber-700/40 bg-amber-950/30 text-amber-300",
    slate: "border-slate-700/60 bg-slate-900/60 text-slate-300",
  };
  return (
    <div className={`rounded-lg border p-4 ${accentMap[accent] ?? accentMap.slate}`}>
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-3xl font-semibold mt-1 font-mono">{value}</div>
    </div>
  );
}