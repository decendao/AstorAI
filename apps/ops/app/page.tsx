import Link from "next/link";

const SECTIONS = [
  { href: "/reports", title: "报告审批", desc: "诊断报告 DRAFT → PUBLISHED / REJECTED" },
  { href: "/members", title: "成员列表", desc: "L1-L5 + ADMIN/MASTER, 风险标记" },
  { href: "/audit", title: "审计日志", desc: "append-only, 不可改不可删" },
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-semibold mb-2">Astor OS · Ops Console</h1>
      <p className="text-slate-400 mb-10">运营后台, ADMIN/MASTER 专属。所有 API 入口均经 checkLevel + checkRole 闸门。</p>
      <ul className="space-y-4">
        {SECTIONS.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="block p-5 rounded-lg border border-slate-800 hover:border-slate-600 transition">
              <div className="text-lg font-medium">{s.title}</div>
              <div className="text-sm text-slate-400 mt-1">{s.desc}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}