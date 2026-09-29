#!/usr/bin/env bash
# ─── CNB Preview 触发脚本 ────────────────────────────
# CNB 的"稳定链接"通过 preview 分支自动跑 preview-serve stage 实现。
# 本脚本只是把分支推上去, 让 CNB Web UI 自己起 build;
# 真正拿 URL 需要在 https://cnb.cool/{slug}/-/pipelines 页面看。

set -euo pipefail
BRANCH="${1:-preview/landing-demo}"
MSG="${2:-chore: 触发 preview build}"

cd "$(git rev-parse --show-toplevel)"

if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  echo "✓ 分支已存在: $BRANCH"
else
  echo "▶ 创建空提交触发 $BRANCH"
  git checkout -b "$BRANCH" master
  git commit --allow-empty -m "$MSG"
fi

echo "▶ 推送到 origin"
git push -u origin "$BRANCH" --force-with-lease

echo ""
echo "════════════════════════════════════════════════════════"
echo "  下一步 (浏览器):"
echo ""
echo "  1. 打开 https://cnb.cool/AstorAIOS/AstorAI/-/pipelines"
echo "  2. 找到 ref=preview/landing-demo 的 build (状态 Running → Success)"
echo "  3. 点 build id → 右栏附件/preview 拿到 *.cnb.run URL"
echo ""
echo "  如果没有自动触发, 在 Pipeline 页右上点 'Run Pipeline' /"
echo "  '触发构建', 选择分支 $BRANCH 即可。"
echo "════════════════════════════════════════════════════════"