#!/usr/bin/env bash
# ─── Astor OS · 一键开发预览 ──────────────────────────────
# 三种模式:
#   1) ./scripts/preview.sh dev        → 起 monorepo 双 dev 服务 (本地)
#   2) ./scripts/preview.sh tunnel     → 同上 + cloudflared 公网隧道 (本地分享)
#   3) ./scripts/preview.sh cnb        → 打印在 CNB Cloud IDE 里手动起的命令
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ACTION="${1:-dev}"

case "$ACTION" in
  dev)
    echo "▶ install (pnpm)"
    pnpm install --frozen-lockfile
    echo "▶ 并行启动 apps/web (3000) + apps/ops (3010)"
    exec pnpm --parallel \
      --filter @astorai/web dev -- \
      --hostname 0.0.0.0 --port 3000 \
      --filter @astorai/ops dev -- \
      --hostname 0.0.0.0 --port 3010
    ;;

  tunnel)
    if ! command -v cloudflared >/dev/null 2>&1; then
      echo "❌ cloudflared 未安装: https://github.com/cloudflare/cloudflared/releases"
      echo "   macOS: brew install cloudflared"
      echo "   Linux: curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared"
      exit 1
    fi
    echo "▶ 起 dev 后台"
    pnpm install --frozen-lockfile >/dev/null
    nohup pnpm --filter @astorai/web dev -- --hostname 0.0.0.0 --port 3000 >/tmp/astor-web.log 2>&1 &
    WEB_PID=$!
    nohup pnpm --filter @astorai/ops dev -- --hostname 0.0.0.0 --port 3010 >/tmp/astor-ops.log 2>&1 &
    OPS_PID=$!
    trap "kill $WEB_PID $OPS_PID 2>/dev/null || true" EXIT
    sleep 5

    echo "▶ 起 cloudflared 隧道 (两条 quick-tunnel URL)"
    cloudflared tunnel --url http://localhost:3000 >/tmp/astor-tunnel-web.log 2>&1 &
    cloudflared tunnel --url http://localhost:3010 >/tmp/astor-tunnel-ops.log 2>&1 &
    TUNNEL_WEB=$!
    TUNNEL_OPS=$!
    trap "kill $WEB_PID $OPS_PID $TUNNEL_WEB $TUNNEL_OPS 2>/dev/null || true" EXIT

    sleep 8
    WEB_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/astor-tunnel-web.log | head -1)
    OPS_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/astor-tunnel-ops.log | head -1)

    echo ""
    echo "════════════════════════════════════════════════════"
    echo "  Web (marketing + astor demo):  $WEB_URL"
    echo "  Ops Console (reports/audit):   $OPS_URL"
    echo "════════════════════════════════════════════════════"
    echo "  Ctrl+C 结束 (日志: /tmp/astor-*.log)"
    echo ""
    wait
    ;;

  cnb)
    cat <<'EOF'
CNB Cloud IDE 实时预览 — 步骤:

1. 在仓库页点 "Cloud IDE" / "Web IDE" → 选择 dev 环境
2. 容器启动后, 终端里依次:
     npm i -g pnpm@9.15.0
     pnpm install --frozen-lockfile
     pnpm --filter @astorai/web dev -- --hostname 0.0.0.0 --port 3000
   另一终端:
     pnpm --filter @astorai/ops dev -- --hostname 0.0.0.0 --port 3010
3. 右侧 "Ports" 面板把 3000 / 3010 点 "Open" → 公网 URL
4. 编辑源文件保存 → Next.js HMR 自动推送, 浏览器秒级刷新
5. PR preview: 推送 preview/* 分支 → CI 自动构建 + 独立 preview URL (详见 .cnb.yml)

EOF
    ;;

  *)
    echo "用法: $0 {dev|tunnel|cnb}"
    exit 2
    ;;
esac