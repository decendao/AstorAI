#!/usr/bin/env bash
#
# AstorAI — 通过 Workbench CLI 部署到 ECS（无需公网 IP）
#
# 适用场景：ICP 备案未完成,但想先把站点跑起来
#   - ECS 不绑公网 IP，安全组不开 22 端口
#   - 通过阿里云 Workbench Agent 通道远程部署
#
# 前提：
#   - 已安装 workbench CLI
#     curl -fsSL https://workbench-cli.oss-cn-hangzhou.aliyuncs.com/install.sh | bash
#   - 已配置凭据
#     workbench config
#   - 已有 ECS 实例
#     workbench list
#
# 用法：
#   bash scripts/deploy/deploy-workbench.sh              # 交互式完整部署
#   bash scripts/deploy/deploy-workbench.sh --check       # 只做环境自检
#   bash scripts/deploy/deploy-workbench.sh --restart     # 只重启服务
#   bash scripts/deploy/deploy-workbench.sh --logs        # 看远程日志
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
WEB_DIR="$REPO_DIR/apps/web"
OUT_DIR="$WEB_DIR/out"
WB_CONF="$HOME/.workbench/config.json"

# 远程路径（不用公网时仍走内网，不冲突）
REMOTE_ROOT="/var/www/astorai"
REMOTE_REPO="$REMOTE_ROOT/repo"
REMOTE_LOGS="/var/log/astorai"

INSTANCE_ID="${ASTOR_INSTANCE_ID:-}"
REGION="${ASTOR_REGION:-cn-hangzhou}"
USER_NAME="${ASTOR_USER:-root}"
NODE_MAJOR=20

MODE="${1:-deploy}"
MODE="${MODE#--}"

c_ok()  { printf '\033[0;32m  ✓\033[0m %s\n' "$*"; }
c_warn(){ printf '\033[0;33m  !\033[0m %s\n' "$*"; }
c_err() { printf '\033[0;31m  ✗\033[0m %s\n' "$*"; }
c_step(){ printf '\n\033[0;36m▸ %s\033[0m\n' "$*"; }
die()   { c_err "$*"; exit 1; }

# ---------- 远程执行 ----------
# 注意：workbench exec 每次是独立 shell，状态不保留，
#      所以跨步骤的命令必须用 && 串在同一次调用里。
wb() {
  workbench exec \
    --instance-id "$INSTANCE_ID" \
    --region "$REGION" \
    --user-name "$USER_NAME" \
    --timeout "${WB_TIMEOUT:-300}" \
    --command "$1"
}

# ---------- 环境检查 ----------
preflight() {
  c_step "环境自检"

  command -v workbench >/dev/null 2>&1 \
    || die "未安装 workbench CLI，执行：curl -fsSL https://workbench-cli.oss-cn-hangzhou.aliyuncs.com/install.sh | bash"

  c_ok "workbench $(workbench version 2>/dev/null | head -1)"

  [[ -f "$WB_CONF" ]] \
    || die "凭据未配置，执行：workbench config"

  c_ok "凭据已配置（$WB_CONF）"

  # 选实例
  if [[ -z "$INSTANCE_ID" ]]; then
    c_step "可用 ECS 实例"
    workbench list --region "$REGION" || die "拉取实例列表失败，检查 --region 是否正确"
    echo ""
    read -rp "  输入实例 ID（如 i-xxxx）: " INSTANCE_ID
  fi
  [[ -n "$INSTANCE_ID" ]] || die "未指定实例 ID"
  export ASTOR_INSTANCE_ID="$INSTANCE_ID"

  c_ok "目标实例：$INSTANCE_ID（$REGION）"

  c_step "探测远程环境"
  wb 'echo "  OS: $(. /etc/os-release 2>/dev/null && echo $PRETTY_NAME || uname -s)"; echo "  ARCH: $(uname -m)"; echo "  MEM: $(free -m 2>/dev/null | awk "/^Mem:/{print \$2\" MiB\"}")"; echo "  DISK: $(df -h / | awk "NR==2{print \$2\" total, \"\$4\" avail\"}")"; echo "  NODE: $(node -v 2>/dev/null || echo none)"; echo "  NET: $(curl -s -o /dev/null -w "%{http_code}" -m 8 https://registry.npmjs.org/ || echo offline)"' \
    || die "远程探测失败，检查实例状态与 --auth-type"
}

# ---------- 打包产物 ----------
pack_artifact() {
  c_step "打包静态产物"
  [[ -d "$OUT_DIR" ]] || { c_warn "无静态产物，先构建"; bash "$SCRIPT_DIR/build-static.sh"; }

  local tarball="/tmp/astorai-out-$(date +%Y%m%d%H%M%S).tar.gz"
  tar czf "$tarball" -C "$OUT_DIR" . 2>/dev/null
  c_ok "产物 $(du -h "$tarball" | cut -f1) → $tarball"
  echo "$tarball"
}

# ---------- 上传 ----------
upload_artifact() {
  local tarball="$1"
  c_step "上传到实例（经 OSS 中转）"
  workbench upload "$tarball" /tmp/ \
    --instance-id "$INSTANCE_ID" --region "$REGION" --user-name "$USER_NAME" --force \
    || die "上传失败"
  c_ok "已上传 /tmp/$(basename "$tarball")"
}

# ---------- 远程部署 ----------
remote_deploy() {
  local tarball_name; tarball_name="$(basename "$1")"

  c_step "远程部署"

  # 全部串成一条（独立 shell，状态不保留）
  wb "set -e
      mkdir -p ${REMOTE_ROOT} ${REMOTE_LOGS}
      rm -rf ${REMOTE_REPO}
      mkdir -p ${REMOTE_REPO}
      tar xzf /tmp/${tarball_name} -C ${REMOTE_REPO}
      test -f ${REMOTE_REPO}/index.html
      echo '  ✓ 产物已解包到 ${REMOTE_REPO}'
      echo '  ✓ index.html 存在'
     " || die "远程解包失败"

  c_ok "远程解包完成"

  # Node 服务：把源码也传上去（需要 /api 的场景）
  if [[ "${DEPLOY_MODE:-static}" == "server" ]]; then
    c_step "上传源码并启动 Node 服务"

    local src_tarball="/tmp/astorai-src-$(date +%Y%m%d%H%M%S).tar.gz"
    tar czf "$src_tarball" -C "$REPO_DIR" \
      --exclude='.git' --exclude='node_modules' \
      --exclude='apps/web/out' --exclude='apps/web/.next' \
      apps package.json pnpm-lock.yaml pnpm-workspace.yaml 2>/dev/null || true

    workbench upload "$src_tarball" /tmp/ \
      --instance-id "$INSTANCE_ID" --region "$REGION" --user-name "$USER_NAME" --force \
      || die "源码上传失败"

    wb "set -e
        mkdir -p ${REMOTE_ROOT}
        tar xzf /tmp/$(basename "$src_tarball") -C ${REMOTE_ROOT}
        cd ${REMOTE_ROOT}
        echo '  ✓ 源码已解包'
        echo '  ⚠ 依赖安装与 build 请按 scripts/deploy/README.md 手动执行（或在有公网后切 ECS 模式）'
       " || die "源码解包失败"
  fi
}

# ---------- 健康检查 ----------
health_check() {
  c_step "健康检查"
  wb "set -e
      test -f ${REMOTE_REPO}/index.html || { echo '  ✗ 缺少 index.html'; exit 1; }
      n=\$(find ${REMOTE_REPO} -name 'index.html' | wc -l)
      echo \"  ✓ 页面数: \$n\"
      echo \"  ✓ 产物大小: \$(du -sh ${REMOTE_REPO} | cut -f1)\"
     " || { c_err "健康检查失败"; return 1; }

  c_ok "远程文件就绪"
  cat <<EOF

  ⚠️  静态产物已在服务器上，但还没对外提供服务。
      备案完成后二选一：

      ① 用 workbench 做临时预览（无需公网）
         workbench connect --instance-id ${INSTANCE_ID} --region ${REGION}
         然后在你本机跑：
           python3 -m http.server 8080 --directory ${REMOTE_REPO}

      ② 走 OSS 静态托管（推荐，9.9 元/年）
         bash scripts/deploy/deploy-oss.sh --build

EOF
}

# ---------- 完整流程 ----------
do_deploy() {
  preflight
  local tarball
  tarball="$(pack_artifact | tail -1)"
  upload_artifact "$tarball"
  remote_deploy "$tarball"
  health_check
}

do_check()  { preflight; }
do_logs()  {
  [[ -n "$INSTANCE_ID" ]] || die "请先设置 ASTOR_INSTANCE_ID"
  wb 'ls -la /var/log/astorai/ 2>/dev/null; tail -50 /var/log/astorai/*.log 2>/dev/null || echo "(暂无日志)"'
}
do_restart() {
  [[ -n "$INSTANCE_ID" ]] || die "请先设置 ASTOR_INSTANCE_ID"
  c_step "重启 Node 服务"
  wb 'pm2 restart astorai-web --update-env 2>/dev/null && pm2 list || echo "PM2 未运行（静态模式不需要）"'
}

# ---------- 主流程 ----------
main() {
  printf '\n\033[0;35m  AstorAI × Workbench Deploy\033[0m  —  mode: %s\n' "$MODE"
  case "$MODE" in
    check)   do_check ;;
    logs)    do_logs ;;
    restart) do_restart ;;
    server)  DEPLOY_MODE=server; do_deploy ;;
    *)       do_deploy ;;
  esac
}

main
