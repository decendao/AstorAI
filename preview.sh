#!/bin/bash
# Astor AI 预览启动器
# 用法: chmod +x preview.sh && ./preview.sh

set -e
echo "═══ Astor AI 预览启动器 ═══"
echo ""

# 检查 python
if ! command -v python3 &> /dev/null; then
  echo "❌ 需要 python3 (内置或 brew install python)"
  exit 1
fi

# 检查 cloudflared
if ! command -v cloudflared &> /dev/null; then
  echo "⚠️  未安装 cloudflared, 安装中..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install cloudflared
  else
    echo "请手动安装: https://github.com/cloudflare/cloudflared/releases"
    echo "Linux: sudo apt install cloudflared"
    exit 1
  fi
fi

# 在脚本所在目录起服务
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

PORT=8080
echo "▶ 启动本地服务: http://localhost:$PORT"
python3 -m http.server $PORT &
SERVER_PID=$!

sleep 1
echo ""
echo "▶ 启动 cloudflare 隧道 (无账号, 临时域名)..."
echo "  按 Ctrl+C 关闭"
echo ""

# Ctrl+C 时清理
trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM

cloudflared tunnel --url http://localhost:$PORT

# 不会到这里, 除非 ctrl+c
kill $SERVER_PID 2>/dev/null