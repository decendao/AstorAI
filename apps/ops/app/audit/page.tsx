type AuditRow = {
  id: string;
  at: string;
  actorRole: "SYSTEM" | "MEMBER" | "ADMIN" | "MASTER";
  action: string;
  target: string;
  meta?: Record<string, unknown>;
};

const ROWS: AuditRow[] = [
  { id: "ev_001", at: "2026-09-30 02:01", actorRole: "ADMIN", action: "DIAGNOSIS_DRAFT", target: "rep_002" },
  { id: "ev_002", at: "2026-09-30 01:55", actorRole: "SYSTEM", action: "AGENT_RUN", target: "run_c3d4", meta: { provider: "mock", costCny: 0 } },
  { id: "ev_003", at: "2026-09-30 01:40", actorRole: "MEMBER", action: "MEMBER_DECRYPT", target: "m_alice", meta: { field: "phone" } },
  { id: "ev_004", at: "2026-09-30 01:12", actorRole: "MASTER", action: "DIAGNOSIS_PUBLISH", target: "rep_001" },
  { id: "ev_005", at: "2026-09-30 00:58", actorRole: "MEMBER", action: "PAYMENT_PAID", target: "ord_88" },
];

const ROLE_COLOR: Record<AuditRow["actorRole"], string> = {
  SYSTEM: "text-slate-400",
  MEMBER: "text-emerald-300",
  ADMIN: "text-amber-300",
  MASTER: "text-rose-300",
};

export default function AuditPage() {
  return (
    <main className="max-w-5xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">审计日志 · append-only</h1>
      <p className="text-xs text-slate-500 mb-6">
        铁律: 写入后不可改不可删。meta 中禁止明文 email/phone/idCard/realName/password (assertNoSensitiveMeta 断言)。
      </p>
      <table className="w-full text-sm">
        <thead className="text-left text-slate-400 border-b border-slate-800">
          <th className="py-2">时间</th>
          <th>角色</th>
          <th>动作</th>
          <th>对象</th>
          <th>元信息</th>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.id} className="border-b border-slate-900 align-top">
              <td className="py-3 font-mono text-xs text-slate-400">{r.at}</td>
              <td className={ROLE_COLOR[r.actorRole]}>{r.actorRole}</td>
              <td className="font-mono text-xs">{r.action}</td>
              <td className="font-mono text-xs">{r.target}</td>
              <td className="text-xs text-slate-400">
                {r.meta ? <code>{JSON.stringify(r.meta)}</code> : <span className="text-slate-600">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}