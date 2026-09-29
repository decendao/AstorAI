import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-12">
        <div className="grid sm:grid-cols-4 gap-8 text-sm">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-300 font-display">
                A
              </div>
              <span className="font-display text-lg">Astor AI</span>
            </div>
            <p className="text-zinc-500 leading-relaxed max-w-md">
              智能投研副驾, 让 AI 成为您下一个投资决策的协同者。
              由 3A 投资者联盟出品。
            </p>
          </div>

          <div>
            <p className="text-zinc-200 font-medium mb-3">产品</p>
            <ul className="space-y-2 text-zinc-500">
              <li><Link href="/agent" className="hover:text-zinc-300">AstorAgent</Link></li>
              <li><Link href="#survey-start" className="hover:text-zinc-300">画像诊断</Link></li>
              <li><Link href="#pricing" className="hover:text-zinc-300">价格</Link></li>
              <li><Link href="/docs" className="hover:text-zinc-300">API 文档</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-zinc-200 font-medium mb-3">合规</p>
            <ul className="space-y-2 text-zinc-500">
              <li><Link href="/terms" className="hover:text-zinc-300">用户协议</Link></li>
              <li><Link href="/privacy" className="hover:text-zinc-300">隐私政策</Link></li>
              <li><Link href="/compliance" className="hover:text-zinc-300">合规声明</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-zinc-600">
          <p>© 2026 Astor AI · 浙 ICP 备 20xxxxxxx 号 · 等保二级</p>
          <p>投资有风险, 决策需谨慎。本平台所有内容仅供参考, 不构成投资建议。</p>
        </div>
      </div>
    </footer>
  );
}