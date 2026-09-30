#!/usr/bin/env bash
# ─── Astor Web 数据库脚本 ────────────────────────────────────────
# 用法:
#   ./scripts/db.sh init     # 首次: 生成 client + 推 schema 到 Neon
#   ./scripts/db.sh studio   # 启动 Prisma Studio (本地查看数据)
#   ./scripts/db.sh reset    # 警告: 删全部表, 演示用
#   ./scripts/db.sh seed     # 插入几条 demo 数据
#
# 前置: 复制 apps/web/.env.example → .env, 填 DATABASE_URL

set -euo pipefail
cd "$(git rev-parse --show-toplevel)/apps/web"

if [[ ! -f ".env" ]]; then
  echo "✗ .env 不存在。复制 .env.example 并填 DATABASE_URL:"
  echo "    cp .env.example .env && vim .env"
  exit 1
fi

cmd="${1:-help}"

case "$cmd" in
  init)
    echo "▶ pnpm install"
    pnpm install --silent
    echo "▶ prisma generate"
    pnpm exec prisma generate
    echo "▶ prisma db push (非破坏式, 增量更新)"
    pnpm exec prisma db push --skip-generate
    echo ""
    echo "✓ 数据库已就绪。表: SurveySubmission / AstorChat / DemoMember"
    echo "  验证: pnpm dev → 提交一次问卷 → 检查 /admin/stats"
    ;;
  studio)
    pnpm exec prisma studio
    ;;
  reset)
    echo "⚠  即将删除全部表, 3 秒后开始… (Ctrl+C 取消)"
    sleep 3
    pnpm exec prisma db push --force-reset --skip-generate
    ;;
  seed)
    pnpm exec tsx prisma/seed.ts
    ;;
  *)
    echo "用法: $0 {init|studio|reset|seed}"
    exit 1
    ;;
esac