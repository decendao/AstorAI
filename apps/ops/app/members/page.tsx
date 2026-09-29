type MemberRow = {
  id: string;
  level: "L1" | "L2" | "L3" | "L4" | "L5";
  role: "MEMBER" | "ADMIN" | "MASTER";
  tag: string;
  joinedAt: string;
};

const ROWS: MemberRow[] = [
  { id: "m_alice", level: "L3", role: "MEMBER", tag: "信息差套利", joinedAt: "2026-09-12" },
  { id: "m_bob", level: "L4", role: "MEMBER", tag: "资产共建", joinedAt: "2026-08-30" },
  { id: "m_carol", level: "L5", role: "MEMBER", tag: "网络节点", joinedAt: "2026-07-15" },
  { id: "m_dave", level: "L2", role: "ADMIN", tag: "运营", joinedAt: "2026-01-04" },
  { id: "m_erin", level: "L5", role: "MASTER", tag: "主理人", joinedAt: "2025-11-01" },
];

const LEVEL_STYLE: Record<MemberRow["level"], string> = {
  L1: "bg-slate-700",
  L2: "bg-sky-700",
  L3: "bg-emerald-700",
  L4: "bg-amber-700",
  L5: "bg-rose-700",
};

export default function MembersPage() {
  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">成员列表</h1>
      <table className="w-full text-sm">
        <thead className="text-left text-slate-400 border-b border-slate-800">
          <th className="py-2">ID</th>
          <th>等级</th>
          <th>角色</th>
          <th>标签</th>
          <th>加入时间</th>
        </thead>
        <tbody>
          {ROWS.map((m) => (
            <tr key={m.id} className="border-b border-slate-900">
              <td className="py-3 font-mono">{m.id}</td>
              <td>
                <span className={`px-2 py-0.5 rounded text-xs ${LEVEL_STYLE[m.level]}`}>{m.level}</span>
              </td>
              <td className={m.role === "MASTER" ? "text-rose-300" : m.role === "ADMIN" ? "text-amber-300" : ""}>{m.role}</td>
              <td>{m.tag}</td>
              <td className="text-slate-400">{m.joinedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-4">闸门: 服务端用 checkRole(session, &quot;ADMIN&quot;, &quot;MASTER&quot;) 守护所有 mutate 路由。</p>
    </main>
  );
}