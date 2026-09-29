import { DiagnosisReportSchema, ApproveReportInputSchema, type DiagnosisReport } from "@astorai/api-types";
import { formatDate } from "@astorai/utils";

/**
 * 报告审批页 — mock 数据演示, 真实环境从 prisma 拉 DRAFT 报告。
 * 闸门: 调用 checkRole(session, "ADMIN", "MASTER") 在 Server Action 入口。
 */

const MOCK_DRAFTS: DiagnosisReport[] = [
  DiagnosisReportSchema.parse({
    id: "rep_001",
    partyId: "party_alice",
    version: 1,
    status: "DRAFT",
    sections: {
      summary: "L3 资产量级, 动机聚焦信息差套利, 期望资产共建。",
      match: "L3+ 评估区间, 需人工尽调动机真实性。",
      risks: "风险偏好未采集 (insufficient_data); 推荐人未交叉核验。",
      recommendation: "NEED_MORE_INFO。最终以人工审核为准。",
    },
    riskFlags: [
      { section: "match", type: "sensitive", severity: "medium", detail: "规则扫描命中「保本」(敏感词)" },
    ],
    sourceAgentRunId: "run_a1b2",
    reviewedById: null,
    reviewedAt: null,
    publishedAt: null,
    reviewNote: null,
  }),
  DiagnosisReportSchema.parse({
    id: "rep_002",
    partyId: "party_bob",
    version: 1,
    status: "DRAFT",
    sections: {
      summary: "L4 资产量级, 自带信息+网络资源。",
      match: "L4 候选, 推荐人已交叉核验。",
      risks: "资源贡献明细待补。",
      recommendation: "APPROVE (仅供人工参考)。最终以人工审核为准。",
    },
    riskFlags: [],
    sourceAgentRunId: "run_c3d4",
    reviewedById: null,
    reviewedAt: null,
    publishedAt: null,
    reviewNote: null,
  }),
];

export default function ReportsPage() {
  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">报告审批 · DRAFT</h1>
      <ul className="space-y-6">
        {MOCK_DRAFTS.map((r) => (
          <li key={r.id} className="border border-slate-800 rounded-lg p-5">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>{r.partyId} · v{r.version}</span>
              <span>{formatDate(new Date().toISOString(), { withTime: true })}</span>
            </div>
            <h2 className="text-lg font-medium mb-3">{r.sections.summary}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400 mb-1">匹配建议</div>
                <p>{r.sections.match}</p>
              </div>
              <div>
                <div className="text-slate-400 mb-1">风险</div>
                <p>{r.sections.risks}</p>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <span className="text-slate-400">倾向: </span>
              {r.sections.recommendation}
            </div>
            {r.riskFlags.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-slate-400 mb-1">风险标记 ({r.riskFlags.length})</div>
                <ul className="text-sm space-y-1">
                  {r.riskFlags.map((f, i) => (
                    <li key={i} className="text-amber-300">
                      [{f.severity}] {f.section}: {f.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium">
                批准发布
              </button>
              <button className="px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded text-sm font-medium">驳回</button>
            </div>
            <details className="mt-3 text-xs text-slate-500">
              <summary>契约: ApproveReportInputSchema 已就绪</summary>
              <pre className="mt-2 bg-slate-900 p-2 rounded overflow-x-auto">
{JSON.stringify(ApproveReportInputSchema._def, null, 2).slice(0, 200)}
              </pre>
            </details>
          </li>
        ))}
      </ul>
    </main>
  );
}