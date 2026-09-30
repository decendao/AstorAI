#!/usr/bin/env bash
# 纯静态导出构建 —— 产出 apps/web/out/ 目录, 可直接丢静态托管/CDN。
#
# 为什么需要这个脚本:
#   Next.js 的 output: "export" 不支持 route handler (app/api/**/route.ts),
#   只要 app/api 存在, build 就会报 "unsupported" 直接失败。
#   但这些接口在 next start / ECS 部署下是真实要用的, 不能从仓库里删。
#   所以: build 期间把 app/api 临时移开, 结束后无论成败都还原。
#
# 副作用说明:
#   - 构建产物 out/ 里不含 /api/*, 前端会自动回退到客户端实现
#     (见 components/astor/AstorStreamDemo.tsx 与 lib/astor-reply.ts)
#   - app/api 目录结构在构建后原样恢复, 可用 git status 验证
#
# 用法:
#   ./scripts/build-static.sh
#   → 产物在 apps/web/out/

set -euo pipefail

WEB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../apps/web" && pwd)"
API_DIR="$WEB_DIR/app/api"
# ⚠️ 必须放到 app/ 目录之外。
#    放 app/ 之外 (apps/web/.api-static-build-backup) 的话 Next.js 仍会把它当路由扫描,
#    报 "force-dynamic cannot be used with output: export"。
BACKUP_DIR="$WEB_DIR/.api-static-build-backup"

restore() {
  if [ -d "$BACKUP_DIR" ]; then
    rm -rf "$API_DIR"
    mv "$BACKUP_DIR" "$API_DIR"
    echo "[build-static] 已还原 app/api"
  fi
}
# 无论成功/失败/中断都还原
trap restore EXIT INT TERM

if [ -d "$BACKUP_DIR" ]; then
  echo "[build-static] 存在上次残留的 $BACKUP_DIR, 先清理" >&2
  rm -rf "$BACKUP_DIR"
fi

if [ -d "$API_DIR" ]; then
  echo "[build-static] 临时移开 app/api → app/ 之外 (apps/web/.api-static-build-backup)"
  mv "$API_DIR" "$BACKUP_DIR"
else
  echo "[build-static] app/api 不存在, 跳过移开 (可能已处于静态模式)"
fi

echo "[build-static] 开始 next build (ASTOR_STATIC_EXPORT=1)"
cd "$WEB_DIR"
ASTOR_STATIC_EXPORT=1 pnpm exec next build

echo ""
echo "[build-static] 完成 ✅"
echo "[build-static] 产物目录: $WEB_DIR/out"
echo "[build-static] 本地验证: cd '$WEB_DIR/out' && python3 -m http.server 8080"
