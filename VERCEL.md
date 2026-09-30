# ─── Astor OS · Vercel 部署配置 ─────────────────────────────
# 独立 GitHub 仓部署 (从 monorepo 分离, 解决 Vercel 框架检测与 pnpm workspace 冲突)
#
# GitHub:    github.com/decendao/astor-web
# Vercel:    Import this repo (NOT the monorepo AstorAI)
# Framework: Next.js (自动检测)
#
# 用法:
#   1. vercel.com → New Project → Import github.com/decendao/astor-web
#   2. Root Directory: 留空 (仓根 = 项目根)
#   3. Framework Preset: Next.js (默认即可)
#   4. Build/Install/Output: 全部留空用默认
#   5. 环境变量 (Production + Preview):
#        DATABASE_URL        = Neon Pooled connection string
#        DATABASE_DIRECT_URL = Neon Direct connection string
#        IP_HASH_SALT        = 随机字符串 (survey 入库时 SHA256 加盐用)
#   6. Deploy → 拿到 https://astor-web.vercel.app
#
# 持续部署:
#   - push 到 astor-web master → Vercel 自动构建 (30 秒)
#   - PR → 自动起 preview URL
#
# 与 monorepo 同步:
#   - monorepo 仓 (.github/workflows/sync-astor-web.yml) push master 时
#     自动 rsync apps/web → decendao/astor-web
#   - 反向不自动 (astor-web 仓的改动不回 monorepo, 避免冲突)
#
# 国内加速:
#   - 给项目绑自定义域名 → Cloudflare 反代 Vercel origin (国内 < 200ms)
#   - 或部署到阿里云 OSS/CDN (走 scripts/deploy/deploy-oss.sh)