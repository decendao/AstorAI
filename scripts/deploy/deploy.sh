#!/usr/bin/env bash
#
# AstorAI 一键部署脚本
# 适用: Ubuntu 22.04 / Alibaba Cloud Linux 3 · Node 20+ · Nginx
#
# 用法:
#   bash scripts/deploy/deploy.sh            # 首次部署
#   bash scripts/deploy/deploy.sh --update   # 拉代码 + 重新构建 + 重启
#   bash scripts/deploy/deploy.sh --ssl      # 仅配置 Nginx + 申请 SSL
#
set -euo pipefail

# ---------- 配置 ----------
APP_DIR="${APP_DIR:-/var/www/astorai}"
REPO_URL="https://cnb.cool/AstorAIOS/AstorAI.git"
BRANCH="${BRANCH:-master}"
REPO_DIR="$APP_DIR/repo"
WEB_DIR="$REPO_DIR/apps/web"
PORT="${PORT:-3000}"
NODE_MAJOR=20
DOMAIN="${DOMAIN:-astorai.cn}"

MODE="${1:-initial}"
MODE="${MODE#--}"

# ---------- 输出 ----------
c_ok()  { printf '\033[0;32m  ✓\033[0m %s\n' "$*"; }
c_warn(){ printf '\033[0;33m  !\033[0m %s\n' "$*"; }
c_err() { printf '\033[0;31m  ✗\033[0m %s\n' "$*"; }
c_step(){ printf '\n\033[0;36m▸ %s\033[0m\n' "$*"; }
die()   { c_err "$*"; exit 1; }

need_root() {
  [[ "$(id -u)" -eq 0 ]] || die "需要 root 权限，用 sudo 运行"
}

# ---------- 系统准备 ----------
ensure_node() {
  if command -v node >/dev/null 2>&1; then
    local v; v="$(node -v | sed 's/v\([0-9]*\).*/\1/')"
    if [[ "$v" -ge "$NODE_MAJOR" ]]; then
      c_ok "Node $(node -v) 已就绪"
      return
    fi
    c_warn "Node 版本过低（当前 $(node -v)），升级中…"
  fi

  c_step "安装 Node ${NODE_MAJOR}.x"
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -qq
    apt-get install -y -qq curl ca-certificates gnupg
    mkdir -p /etc/apt/keyrings
    curl -fsSL "https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key" \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list
    apt-get update -qq
    apt-get install -y -qq nodejs
  elif command -v yum >/dev/null 2>&1; then
    yum install -y -q nodejs
  else
    die "不支持的包管理器，请手动安装 Node ${NODE_MAJOR}"
  fi
  c_ok "Node $(node -v) 安装完成"
}

ensure_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    c_ok "pnpm $(pnpm -v) 已就绪"
  else
    c_step "安装 pnpm"
    npm i -g pnpm@9.15.0 >/dev/null
    c_ok "pnpm $(pnpm -v) 安装完成"
  fi
}

ensure_nginx() {
  if command -v nginx >/dev/null 2>&1; then
    c_ok "nginx 已安装"
  else
    c_step "安装 nginx"
    if command -v apt-get >/dev/null 2>&1; then
      apt-get install -y -qq nginx
    else
      yum install -y -q nginx
    fi
    c_ok "nginx 安装完成"
  fi
}

# ---------- 拉代码 ----------
pull_code() {
  c_step "拉取代码（$BRANCH）"
  mkdir -p "$APP_DIR"
  if [[ -d "$REPO_DIR/.git" ]]; then
    cd "$REPO_DIR"
    git fetch --all --prune
    git checkout "$BRANCH"
    git pull --ff-only origin "$BRANCH"
  else
    cd "$APP_DIR"
    git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
  fi
  c_ok "代码已同步到 $BRANCH"
}

# ---------- 依赖 + 构建 ----------
build_app() {
  c_step "安装依赖"
  cd "$REPO_DIR"
  if [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile
  else
    c_warn "无 lock 文件，使用普通 install"
    pnpm install
  fi
  c_ok "依赖安装完成"

  c_step "构建 apps/web"
  cd "$WEB_DIR"
  # build 阶段内存放开（2GiB 机器也能 build）
  export NODE_OPTIONS="--max-old-space-size=2048"
  pnpm build
  c_ok "构建完成"
}

# ---------- 环境变量 ----------
setup_env() {
  local env_file="$WEB_DIR/.env.local"
  if [[ -f "$env_file" ]]; then
    c_ok ".env.local 已存在，跳过（不覆盖现有配置）"
    return
  fi

  c_step "创建 .env.local"
  cat > "$env_file" <<'EOF'
# ===== 站点 =====
NEXT_PUBLIC_SITE_URL=https://astorai.cn

# ===== Agent 模型 provider =====
# 可选: zhipu | deepseek | openai | mock
ASTOR_MODEL_PROVIDER=mock

# ===== 智谱 GLM =====
ZHIPU_API_KEY=
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
ASTOR_MODEL=glm-4-plus

# ===== DeepSeek =====
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com

# ===== LLM 合规白名单（境内备案模型）=====
# 逗号分隔，provider 不在白名单内则拒绝调用
ASTOR_ALLOWED_MODELS=glm-4-plus,glm-4-air,deepseek-chat,deepseek-reasoner

# ===== 支付（后期接入）=====
ASTOR_PAY_PROVIDER=mock
WECHAT_PAY_MCH_ID=
EOF
  chmod 600 "$env_file"
  c_ok ".env.local 已创建（权限 600）"
  c_warn "记得填入 ZHIPU_API_KEY，provider 改成 zhipu"
}

# ---------- PM2 ----------
setup_pm2() {
  c_step "配置 PM2 守护"
  if ! command -v pm2 >/dev/null 2>&1; then
    npm i -g pm2 >/dev/null
  fi

  pm2 delete astorai-web >/dev/null 2>&1 || true

  # SSE 需要 PM2 禁用负载均衡，否则流式响应会被缓冲
  if [[ -f "$APP_DIR/ecosystem.config.cjs" ]]; then
    pm2 start "$APP_DIR/ecosystem.config.cjs" --update-env
  else
    pm2 start pnpm --name astorai-web --cwd "$WEB_DIR" \
      -- start -p "$PORT"
  fi

  pm2 save
  pm2 startup systemd -u "$(whoami)" --hp "$HOME" >/dev/null 2>&1 || true
  c_ok "PM2 已启动（开机自启已配置）"
  pm2 list | grep astorai-web || c_warn "PM2 状态异常，请手动检查 pm2 logs"
}

# ---------- Nginx ----------
setup_nginx() {
  local domain="$DOMAIN"
  c_step "配置 Nginx（$domain）"

  local conf="/etc/nginx/conf.d/astorai.conf"
  if [[ -f "$REPO_DIR/scripts/deploy/nginx.conf.example" ]]; then
    sed "s/__DOMAIN__/$domain/g" "$REPO_DIR/scripts/deploy/nginx.conf.example" > "$conf"
    c_ok "Nginx 配置已写入 $conf"
  else
    c_warn "未找到模板，跳过（请手动配置）"
    return
  fi

  if nginx -t 2>/dev/null; then
    nginx -s reload
    c_ok "Nginx 已重载"
  else
    c_err "Nginx 配置校验失败："
    nginx -t
    die "请修正配置后重试"
  fi
}

setup_ssl() {
  local domain="$DOMAIN"
  c_step "申请 SSL 证书（$domain）"

  if [[ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]]; then
    c_ok "证书已存在"
    return
  fi

  if ! command -v certbot >/dev/null 2>&1; then
    c_step "安装 certbot"
    apt-get install -y -qq certbot python3-certbot-nginx 2>/dev/null \
      || yum install -y -q certbot
  fi

  c_warn "开始申请证书。请确保："
  c_warn "  1. 域名已解析到本机公网 IP"
  c_warn "  2. 安全组已开放 80 / 443"
  c_warn "  3. ICP 备案已完成（国内服务器强制要求）"

  read -rp "  继续申请？[y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { c_warn "已跳过证书申请"; return; }

  certbot --nginx -d "$domain" --non-interactive --agree-tos \
    -m "admin@$domain" --redirect || c_err "证书申请失败（备案未完成时属正常现象）"
}

# ---------- 验证 ----------
verify() {
  c_step "健康检查"
  sleep 3
  local ok=0
  for path in / /insights /astor; do
    local code
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$path" -m 15 || echo 000)"
    if [[ "$code" == "200" ]]; then
      c_ok "  $path → $code"
      ok=$((ok+1))
    else
      c_err "  $path → $code"
    fi
  done

  if [[ $ok -eq 3 ]]; then
    printf '\n\033[0;32m%s\033[0m\n' "  部署完成 ✓"
  else
    c_err "部分检查未通过，执行 pm2 logs astorai-web 查看日志"
  fi

  cat <<EOF

  常用命令：
    pm2 logs astorai-web          查看日志
    pm2 restart astorai-web       重启
    systemctl reload nginx        重载 Nginx
    ss -tlnp | grep $PORT          查看端口

EOF
}

# ---------- 主流程 ----------
main() {
  need_root
  printf '\n\033[0;35m  AstorAI Deploy\033[0m  —  mode: $MODE\n'

  case "$MODE" in
    ssl)
      setup_nginx
      setup_ssl
      ;;
    update)
      ensure_node; ensure_pnpm
      pull_code
      build_app
      setup_pm2
      verify
      ;;
    initial|*)
      ensure_node
      ensure_pnpm
      ensure_nginx
      pull_code
      setup_env
      build_app
      setup_pm2
      setup_nginx
      verify
      printf '\n  下一步：bash scripts/deploy/deploy.sh --ssl  申请 HTTPS 证书\n\n'
      ;;
  esac
}

main "$@"
