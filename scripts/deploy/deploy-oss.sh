#!/usr/bin/env bash
#
# AstorAI — 静态版部署到阿里云 OSS
#
# 适用: 纯静态 out/ 目录（问卷在浏览器本地计算，无需后端）
# 成本: OSS 9.9 元/年（+ 可选 CDN 流量费）
# 前提: 不需要 ICP 备案（除非用 CDN 加速境内节点）
#
# 用法:
#   bash scripts/deploy/deploy-oss.sh              # 交互式配置 + 首次部署
#   bash scripts/deploy/deploy-oss.sh --build      # 先构建静态版再上传
#   bash scripts/deploy/deploy-oss.sh --refresh    # 只刷新 CDN 缓存
#   bash scripts/deploy/deploy-oss.sh --rollback   # 回滚到上一版本
#   bash scripts/deploy/deploy-oss.sh --setup      # 仅生成配置文件
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
WEB_DIR="$REPO_DIR/apps/web"
OUT_DIR="$WEB_DIR/out"
CONF="$REPO_DIR/.oss-deploy.conf"
BACKUP_DIR="$REPO_DIR/.oss-backup"

MODE="${1:-setup}"
MODE="${MODE#--}"

c_ok()  { printf '\033[0;32m  ✓\033[0m %s\n' "$*"; }
c_warn(){ printf '\033[0;33m  !\033[0m %s\n' "$*"; }
c_err() { printf '\033[0;31m  ✗\033[0m %s\n' "$*"; }
c_step(){ printf '\n\033[0;36m▸ %s\033[0m\n' "$*"; }
die()   { c_err "$*"; exit 1; }

# ---------- 配置加载 ----------
load_conf() {
  [[ -f "$CONF" ]] || die "未找到 $CONF，请先运行：bash scripts/deploy/deploy-oss.sh --setup"
  # shellcheck disable=SC1090
  source "$CONF"
  [[ -n "${OSS_BUCKET:-}" ]] || die "配置缺少 OSS_BUCKET"
  [[ -n "${OSS_REGION:-}"  ]] || die "配置缺少 OSS_REGION"
}

# ---------- 安装 ossutil ----------
ensure_ossutil() {
  if command -v ossutil >/dev/null 2>&1; then
    c_ok "ossutil $(ossutil version 2>/dev/null | head -1)"
    return
  fi
  c_step "安装 ossutil"
  local bin
  if [[ "$(uname -m)" == "x86_64" ]]; then
    bin="ossutil64"
  else
    bin="ossutil"
  fi
  local tmp="/tmp/$bin"
  curl -fsSL -o "$tmp" "https://gosspublic.alicdn.com/ossutil/1.7.19/${bin}" \
    || die "ossutil 下载失败，请手动安装"
  chmod +x "$tmp"
  mv "$tmp" /usr/local/bin/ossutil
  c_ok "ossutil 安装完成"
}

oss_args() {
  if [[ -n "${OSS_ENDPOINT:-}" ]]; then
    echo "--endpoint ${OSS_ENDPOINT}"
  elif [[ -n "${OSS_ACCESS_KEY_ID:-}" ]]; then
    echo "--access-key-id ${OSS_ACCESS_KEY_ID} --access-key-secret ${OSS_ACCESS_KEY_SECRET}"
  else
    echo ""
  fi
}

# ---------- 交互式配置 ----------
setup_conf() {
  c_step "配置 OSS 部署"
  echo ""

  local bucket="" region="" cdn="" custom=""
  read -rp "  Bucket 名（不含域名，如 astorai-static）: " bucket
  [[ -n "$bucket" ]] || die "Bucket 名不能为空"

  read -rp "  Region（如 oss-cn-shanghai）[oss-cn-shanghai]: " region
  region="${region:-oss-cn-shanghai}"

  read -rp "  自定义域名（没有就回车跳过）: " custom

  read -rp "  是否开启 CDN 加速？[y/N] " use_cdn
  if [[ "$use_cdn" =~ ^[Yy]$ ]]; then
    cdn="y"
    read -rp "  CDN 域名（如 cdn.astorai.cn）: " cdn_domain
  fi

  cat > "$CONF" <<EOF
# ===== AstorAI OSS 部署配置 =====
# 由 deploy-oss.sh --setup 生成，勿提交到仓库

OSS_BUCKET="${bucket}"
OSS_REGION="${region}"

# 自定义域名（可留空）
OSS_CUSTOM_DOMAIN="${custom}"

# CDN
OSS_USE_CDN="${cdn:-n}"
OSS_CDN_DOMAIN="${cdn_domain:-}"

# 认证（二选一，优先用环境变量注入更安全）
OSS_ACCESS_KEY_ID="${OSS_ACCESS_KEY_ID:-}"
OSS_ACCESS_KEY_SECRET="${OSS_ACCESS_KEY_SECRET:-}"
# 或自定义 endpoint（如加速上传）
OSS_ENDPOINT="${OSS_ENDPOINT:-}"
EOF

  chmod 600 "$CONF"
  echo ""
  grep -q "oss-deploy.conf" "$REPO_DIR/.gitignore" 2>/dev/null || \
    echo -e "\n# OSS 部署配置\n.oss-deploy.conf\n.oss-backup/" >> "$REPO_DIR/.gitignore"

  c_ok "配置已写入 $CONF（权限 600）"
  c_warn "已加入 .gitignore，不会被提交"
}

# ---------- 构建 ----------
build_static() {
  c_step "构建静态版"
  if [[ ! -d "$OUT_DIR" ]]; then
    bash "$SCRIPT_DIR/build-static.sh"
  else
    c_ok "已有产物（--force 可强制重建）"
  fi
  [[ -f "$OUT_DIR/index.html" ]] || die "产物异常：缺少 $OUT_DIR/index.html"
}

# ---------- 上传前备份 ----------
backup_current() {
  c_step "备份当前线上版本"
  mkdir -p "$BACKUP_DIR"
  ossutil $(oss_args) cp -r "oss://${OSS_BUCKET}/" "$BACKUP_DIR/" \
    --update --jobs=8 --parallel=8 --force \
    >/dev/null 2>&1 && c_ok "已备份到 $BACKUP_DIR（可回滚）" || c_warn "备份失败，继续部署"
}

# ---------- 上传 ----------
deploy() {
  [[ -d "$OUT_DIR" ]] || build_static
  [[ -f "$OUT_DIR/index.html" ]] || die "产物异常"

  backup_current

  c_step "上传到 oss://${OSS_BUCKET}"
  ossutil $(oss_args) cp -r "$OUT_DIR/" "oss://${OSS_BUCKET}/" \
    --force --jobs=8 --parallel=8 --update \
    --exclude '.DS_Store' --exclude '*.map' \
    2>&1 | tail -3

  c_ok "上传完成"

  c_step "设置静态站点配置"
  local index="index.html"
  local error="404.html"
  [[ -f "$OUT_DIR/404.html" ]] && error="404.html"
  ossutil $(oss_args) bucket update --website "IndexDocument=${index},ErrorDocument=${error}" \
    "oss://${OSS_BUCKET}" >/dev/null 2>&1 \
    && c_ok "首页=${index} 404=${error}" || c_warn "静态站点配置失败，可手动在控制台设置"

  c_step "设置缓存策略"
  # 指纹资源长缓存，HTML 不缓存
  ossutil $(oss_args) bucket update \
    --file-index-config "SupportWebIndexFile=true,IndexDocument=${index},ErrorDocument=${error}" \
    "oss://${OSS_BUCKET}" >/dev/null 2>&1 || true
  c_ok "HTML 默认短缓存（每次刷新即生效）"

  print_urls
}

# ---------- 刷新 CDN ----------
refresh_cdn() {
  load_conf
  [[ "${OSS_USE_CDN:-n}" == "y" ]] || die "未开启 CDN"
  c_step "刷新 CDN 缓存：${OSS_CDN_DOMAIN}"
  if [[ -n "${OSS_ACCESS_KEY_ID:-}" ]]; then
    c_warn "CDN 刷新 API 需在阿里云控制台执行（CDN → 刷新预热 → URL 刷新）"
  fi
  cat <<EOF

  手动刷新路径：
    1. 登录阿里云控制台 → CDN → 域名管理 → 找到 ${OSS_CDN_DOMAIN}
    2. 刷新预热 → URL 刷新 → 填入 ${OSS_CDN_DOMAIN}/

  或用 API（需要 AccessKey）:
    aliyun cdn RefreshObjectCaches --ObjectPath "${OSS_CDN_DOMAIN}/" --ObjectType "Directory"

EOF
}

# ---------- 回滚 ----------
rollback() {
  load_conf
  [[ -d "$BACKUP_DIR" ]] || die "没有备份，无法回滚"
  c_step "从备份恢复：$BACKUP_DIR"
  ossutil $(oss_args) cp -r "$BACKUP_DIR/" "oss://${OSS_BUCKET}/" \
    --force --jobs=8 --parallel=8 2>&1 | tail -2
  c_ok "已回滚"
}

# ---------- 输出访问地址 ----------
print_urls() {
  local host="oss-${OSS_REGION}.aliyuncs.com"
  echo ""
  c_step "访问地址"
  if [[ "${OSS_USE_CDN:-n}" == "y" && -n "${OSS_CDN_DOMAIN:-}" ]]; then
    echo "    https://${OSS_CDN_DOMAIN}/"
  elif [[ -n "${OSS_CUSTOM_DOMAIN:-}" ]]; then
    echo "    https://${OSS_CUSTOM_DOMAIN}/"
  fi
  echo "    https://${OSS_BUCKET}.${host}/"
  echo ""
  c_warn "Bucket 若为私有读，需在控制台设置「公共读」或用签名 URL"
}

# ---------- 主流程 ----------
main() {
  case "$MODE" in
    setup)
      setup_conf
      echo ""
      c_warn "配置完成后运行：bash scripts/deploy/deploy-oss.sh --build"
      ;;
    build)
      load_conf; ensure_ossutil; build_static; deploy
      ;;
    refresh)
      refresh_cdn
      ;;
    rollback)
      load_conf; rollback
      ;;
    *)
      # 首次运行：引导配置
      if [[ ! -f "$CONF" ]]; then
        setup_conf
        echo ""
        c_warn "配置完成。运行 --build 开始部署"
        exit 0
      fi
      load_conf; ensure_ossutil; deploy
      ;;
  esac
}

main
