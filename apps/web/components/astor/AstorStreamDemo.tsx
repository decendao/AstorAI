"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_INTERVAL_MS, toFrames, type StreamFrame } from "@/lib/astor-reply";

const PRESETS = [
  { label: "合规红线", q: "合规红线怎么设计的" },
  { label: "权限体系", q: "RBAC 权限怎么分层" },
  { label: "流水线", q: "智能体流水线有哪几步" },
  { label: "支付", q: "支付怎么接" },
];

/**
 * 首帧看门狗 (ms)。
 *
 * 纯静态导出时 /api/astor/stream 不存在, 行为取决于托管方:
 *   - 直接 404        → EventSource 立刻 onerror, 快速回退
 *   - 回退到 index.html → 返回 200 + text/html, EventSource 会一直挂着等 SSE
 *     帧, 既不报错也不吐数据 (最难缠的一种)
 * 所以不能只依赖 onerror, 必须用超时兜底: 到点还没收到第一帧就判定"没有
 * 服务端", 转本地流式。
 */
const FIRST_FRAME_TIMEOUT_MS = 1500;

type Line = { id: number; text: string; role: "user" | "astor" };

export function AstorStreamDemo() {
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [cur, setCur] = useState("");
  const esRef = useRef<EventSource | null>(null);
  const idRef = useRef(0);
  const runRef = useRef(0);

  useEffect(() => () => esRef.current?.close(), []);

  function ask(question: string) {
    if (streaming) return;
    const text = question.trim();
    if (!text) return;

    // 每次提问一个自增 runId, 用来作废上一轮还在飞的定时器/连接
    const run = ++runRef.current;
    const alive = () => run === runRef.current;

    setQ("");
    setStreaming(true);
    setCur("");
    setLines((l) => [...l, { id: idRef.current++, text, role: "user" }]);
    setLines((l) => [...l, { id: idRef.current++, text: "", role: "astor" }]);

    let gotFrame = false;
    let settled = false;

    // accumulator: React state 在同一 tick 内连续 setCur 会丢中间值,
    // 这里用可变对象兜住, finish 时拿它落最终文本。
    const acc = { text: "" };

    const finish = () => {
      if (settled || !alive()) return;
      settled = true;
      window.clearTimeout(watchdog);
      esRef.current?.close();
      esRef.current = null;
      setCur("");
      setStreaming(false);
      setLines((l) => {
        if (!l.length) return l;
        const last = l[l.length - 1];
        if (last.role === "astor" && !last.text && acc.text) {
          return [...l.slice(0, -1), { ...last, text: acc.text }];
        }
        return l;
      });
    };

    const consume = (msg: StreamFrame) => {
      if (!alive()) return;
      if (msg.type === "token" && msg.data) {
        gotFrame = true;
        acc.text += msg.data;
        setCur(acc.text);
      } else if (msg.type === "done") {
        finish();
      }
    };

    /** 本地回退: 复用同一份帧切分 + 节奏, SSE 不可用时观感一致 */
    const runLocal = () => {
      if (!alive() || settled) return;
      const frames = toFrames(text);
      let i = 0;
      const tick = () => {
        if (!alive() || settled) return;
        const frame = frames[i++];
        if (!frame) return finish();
        consume(frame);
        if (i < frames.length) window.setTimeout(tick, FRAME_INTERVAL_MS);
      };
      tick();
    };

    const watchdog = window.setTimeout(() => {
      if (!gotFrame && alive() && !settled) {
        esRef.current?.close();
        esRef.current = null;
        runLocal();
      }
    }, FIRST_FRAME_TIMEOUT_MS);

    // ── 优先走真 SSE (有 server runtime 的部署: ECS / next start / Cloud IDE)
    try {
      const es = new EventSource(`/api/astor/stream?q=${encodeURIComponent(text)}`);
      esRef.current = es;

      es.onmessage = (ev) => {
        try {
          consume(JSON.parse(ev.data) as StreamFrame);
        } catch {
          /* 忽略坏帧 */
        }
      };

      es.onerror = () => {
        if (gotFrame) {
          // 已经开始吐字了 (真服务端中途断流) —— 就此打住, 不重复本地重放
          finish();
        } else {
          es.close();
          if (esRef.current === es) esRef.current = null;
          window.clearTimeout(watchdog);
          runLocal();
        }
      };
    } catch {
      // EventSource 构造本身失败 → 直接本地
      window.clearTimeout(watchdog);
      runLocal();
    }
  }

  return (
    <div className="hair-t hair-b">
      {/* log */}
      <div className="max-h-[420px] overflow-y-auto thin-scroll py-2">
        {lines.length === 0 && !streaming && (
          <p className="text-[14px] text-paper/20 py-6">
            提问试试 —— 下方是 mock 流式输出，真实环境由智谱 / 通义 / DeepSeek 驱动。
          </p>
        )}

        {lines.map((l) => {
          if (l.role === "astor" && !l.text) return null;
          return (
            <div key={l.id} className="py-3.5 hair-b">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-display italic text-[11.5px] tracking-[0.16em] text-gold-500 min-w-[42px]">
                  {l.role === "user" ? "YOU" : "ASTOR"}
                </span>
                <span className="text-[10.5px] text-paper/20">
                  {l.role === "user" ? "提问" : "流式输出"}
                </span>
              </div>
              <div
                className={`text-[14px] leading-[1.85] ${
                  l.role === "user" ? "text-paper/70" : "text-paper/40"
                }`}
              >
                {l.text}
              </div>
            </div>
          );
        })}

        {streaming && (
          <div className="py-3.5 hair-b">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="font-display italic text-[11.5px] tracking-[0.16em] text-gold-500">
                ASTOR
              </span>
              <span className="text-[10.5px] text-paper/20">生成中</span>
            </div>
            <div className="text-[14px] leading-[1.85] text-paper/40">
              {cur}
              <span className="inline-block w-[6px] h-[14px] bg-gold-500/60 ml-1 align-middle animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* presets */}
      <div className="flex flex-wrap gap-2 py-5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => ask(p.q)}
            disabled={streaming}
            className="px-4 py-2.5 min-h-[40px] border border-hair text-[12px] tracking-[0.06em] text-paper/35 hover:text-gold-300 hover:border-gold-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="hair-t flex gap-3 py-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(q);
          }}
          placeholder="问点什么…"
          disabled={streaming}
          className="flex-1 bg-transparent border-b border-gold-500/25 text-paper text-[15px] py-2.5 px-1 outline-none focus:border-gold-500 placeholder:text-paper/20 placeholder:italic placeholder:font-display disabled:opacity-40"
        />
        <button
          onClick={() => ask(q)}
          disabled={streaming || !q.trim()}
          className="btn-line px-6 py-2.5 text-[12px] min-h-[44px] shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="relative z-[2]">发送</span>
        </button>
      </div>
    </div>
  );
}
