"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astor 智能体 Demo — 调 /api/astor/stream 拿 SSE 流, 真实接入走 @astorai/llm。
 *
 * 纯前端, 不依赖 server-only 包。
 */

type Preset = { label: string; q: string }[];
const PRESETS: Preset = [
  { label: "红线", q: "什么是红线?" },
  { label: "RBAC", q: "权限怎么管?" },
  { label: "流水线", q: "智能体流水线长什么样?" },
  { label: "支付", q: "支付如何切换?" },
];

export default function AstorDemoClient() {
  const [q, setQ] = useState("Astor 介绍");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function ask(question: string) {
    if (busy) return;
    setBusy(true);
    setAnswer("");
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch(`/api/astor/stream?q=${encodeURIComponent(question)}`, { signal: ac.signal });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("no reader");
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.replace(/^data: /, "");
          try {
            const evt = JSON.parse(data) as { type: string; data?: string };
            if (evt.type === "token" && evt.data) {
              setAnswer((a) => a + evt.data);
            } else if (evt.type === "done") {
              setBusy(false);
              return;
            }
          } catch {
            // 跳过非 JSON 行
          }
        }
      }
      setBusy(false);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setAnswer((a) => a + `\n[错误] ${(e as Error).message}`);
      }
      setBusy(false);
    }
  }

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setQ(p.q);
              ask(p.q);
            }}
            disabled={busy}
            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(q)}
          placeholder="问 Astor 任意问题…"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => ask(q)}
          disabled={busy}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {busy ? "生成中…" : "提问"}
        </button>
      </div>
      <div className="min-h-[160px] text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
        {answer || <span className="text-slate-500">回答将流式出现在此处。</span>}
      </div>
    </div>
  );
}