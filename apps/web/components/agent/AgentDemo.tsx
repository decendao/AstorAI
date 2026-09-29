"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoTurn {
  role: "user" | "agent";
  text: string;
}

/**
 * AstorAgent 实时 Demo (mock 流式输出)
 * 用户输入 → 打字机效果输出 mock 回答
 * 用来展示产品体验 (后端接通后改为 fetch 流)
 */
const SUGGESTIONS = [
  "最近 AI 算力链怎么看?",
  "我的组合波动太大, 怎么平衡?",
  "美联储 12 月议息会议预期?",
  "梳理一下固态电池产业链",
];

const MOCK_REPLY = `基于您的画像 (资深 · AI/硬科技 · 长期), 我的建议:

1. **主线机会**: 算力链上游 (光模块 / PCB) Q4 业绩兑现度高于下游模型层
2. **风险点**: H100/B200 出货节奏可能延后, 关注 Q1 季报指引
3. **配置**: 您可考虑将 60% 仓位配置于算力上游 + 国产替代双主线
4. **时效**: 本结论基于近 30 日新闻 + 行业研报 137 份, 仅供参考

*投资建议由您独立判断, 本回复不构成承诺。*`;

export function AgentDemo() {
  const [turns, setTurns] = useState<DemoTurn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, streaming]);

  const send = (q?: string) => {
    const text = (q ?? input).trim();
    if (!text || streaming) return;
    setTurns(prev => [...prev, { role: "user", text }]);
    setInput("");
    setStreaming(true);

    // 打字机 mock
    let i = 0;
    let buf = "";
    const full = MOCK_REPLY;
    const id = setInterval(() => {
      if (i < full.length) {
        buf += full[i];
        i++;
        setTurns(prev => {
          const arr = [...prev];
          const last = arr[arr.length - 1];
          if (last?.role === "agent") {
            arr[arr.length - 1] = { role: "agent", text: buf };
          } else {
            arr.push({ role: "agent", text: buf });
          }
          return arr;
        });
      } else {
        clearInterval(id);
        setStreaming(false);
      }
    }, 18);
  };

  return (
    <section className="relative py-20 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-gold-300 uppercase mb-3">
            实时演示
          </p>
          <h2 className="text-3xl sm:text-4xl font-display text-gold-gradient font-medium">
            试试和 AstorAgent 对话
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            点击下方任一提示开始, 体验 <strong className="text-zinc-300">流式响应 + 个性化建议</strong>
          </p>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden flex flex-col" style={{ height: 520 }}>
          {/* 对话区 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {turns.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-2xl text-gold-300 mb-4 animate-glow">
                  ◎
                </div>
                <p className="text-zinc-400 max-w-sm">
                  您可以问关于行情、政策、组合、产业的一切问题, AstorAgent 会基于您的画像回答。
                </p>
              </div>
            )}

            <AnimatePresence>
              {turns.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      t.role === "user"
                        ? "bg-gold-500/15 border border-gold-500/30 text-zinc-100"
                        : "glass text-zinc-200"
                    }`}
                  >
                    {t.text}
                    {streaming && t.role === "agent" && i === turns.length - 1 && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-gold-300 animate-glow align-middle" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 推荐问题 */}
          {turns.length === 0 && (
            <div className="px-6 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-gold-500/50 hover:bg-gold-500/5 text-zinc-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 输入框 */}
          <div className="border-t border-white/5 p-3 flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              disabled={streaming}
              placeholder="向 AstorAgent 提问 (mock 演示)..."
              className="flex-1 bg-white/[0.03] rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none border border-white/5 focus:border-gold-500/40 transition disabled:opacity-50"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || streaming}
              className="btn-gold rounded-xl px-5 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              发送 →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}