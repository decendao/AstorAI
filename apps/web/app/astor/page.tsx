import AstorDemoClient from "@/components/AstorDemoClient";

export const metadata = {
  title: "Astor 智能体 · Demo",
};

export default function AstorPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-3">Astor · 智能体演示</h1>
      <p className="text-slate-400 mb-8 text-sm">
        流式问答: 服务端走 <code className="text-emerald-300">@astorai/llm</code> + mock provider (默认), 通过 SSE 推送 token。
        生产环境: env <code>ASTOR_LLM_PROVIDER=zhipu|qwen|deepseek</code> 即生效。
      </p>
      <AstorDemoClient />
    </main>
  );
}