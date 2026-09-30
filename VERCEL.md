# ─── Astor OS · Vercel 部署配置 ─────────────────────────────
# Vercel Project Root: apps/web
# Build Command:      pnpm --filter @astorai/web build (默认)
# Install Command:    pnpm install --frozen-lockfile (默认)
# Output:             apps/web/.next
#
# 国内访问: Vercel 国内直连慢 (200-500ms), 但 Next.js 体验最好。
# 折中方案: 国内 CDN 走阿里云 OSS/CDN, 海外演示走 Vercel, 两套并行。
#
# 用法:
#   1. vercel.com → New Project → Import Git Repository
#      选 github.com/decendao/AstorAI (镜像仓)
#   2. Root Directory: apps/web
#   3. Framework Preset: Next.js (自动检测)
#   4. Build/Install 命令留空 (用默认)
#   5. 环境变量 (Production):
#        NEXT_PUBLIC_BASE_URL = https://astorai.vercel.app
#        ASTOR_PAY_PROVIDER  = mock        (先用 mock, 上线再切)
#        ASTOR_LLM_PROVIDER  = mock
#        DATABASE_URL        = (Vercel Postgres / Neon 连接串)
#   6. Deploy
#
# 持续部署: push master → Vercel 自动构建 (GitHub App 钩子)
# 预览部署: PR → 自动起 preview URL (https://astorai-git-<branch>.vercel.app)
#
# 国内加速: 后续可加自定义域名 + Cloudflare CDN 反代 Vercel origin