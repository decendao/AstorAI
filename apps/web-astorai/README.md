# Astor AI · 官网 (astorai.cn)

智能投研副驾 Astor AI 的官方落地页。

## 视觉风格

- **主色**: 深空黑 (`#05060a`) + 金 (`#d4a64a`), 沿用 3A 投资者联盟基调
- **漂浮感**: Gemini 风格粒子 + 浮动光晕, 营造科技感
- **问卷**: Typeform 全屏切换风, 一次一题, 快捷键 1-N 选择
- **报告**: Apple Health 浅色风, 大数字 + 圆环 + 留白, 反差营造"洞察感"

## 技术栈

- Next.js 15.1 (App Router) + React 19
- TypeScript 5.6
- Tailwind CSS 3.4
- Framer Motion 11 (动画)
- Recharts 2.13 (雷达图 / 圆环)
- Zod 3 (问卷答案校验)

## 模块

```
app/
├── page.tsx                 # 首页 (Hero + 能力 + Demo + 问卷 + 定价)
├── layout.tsx               # 根布局 + SEO
├── sitemap.ts / robots.ts   # SEO 路由
└── api/
    └── survey/submit/       # 问卷提交 API

components/
├── hero/HeroSection.tsx     # Hero + 漂浮粒子
├── survey/SurveyFlow.tsx    # 6 题 Typeform 风全屏切换
├── report/ReportPanel.tsx   # Apple Health 风初级报告
├── agent/
│   ├── AgentCapabilities.tsx  # 6 张能力卡
│   └── AgentDemo.tsx          # 实时对话 Demo (mock 流式)
├── pricing/PricingSection.tsx
├── site/{SiteHeader,SiteFooter}.tsx
└── ui/{FloatingParticles,GlassCard}.tsx

lib/
├── survey-questions.ts      # 6 题定义 + 计分 + 五维画像
├── pricing.ts               # 价格常量
└── cn.ts                    # className 合并

styles/globals.css           # Tailwind + 玻璃/粒子/按钮样式
```

## 核心交互流程

1. **Hero**: 用户进入页面, 看到主标题 + 漂浮粒子
2. **问卷**: 点击"开始 6 题画像诊断", 进入全屏切换问卷
   - 顶部进度条 + 百分比
   - 左侧实时信号面板 (每答一题增加一条)
   - 右侧 AstorAgent 状态 (漂浮卡)
   - 快捷键 1-N 快速选择
3. **报告**: 6 题完成 → Apple Health 风报告面板淡入
   - 大数字综合得分 + 圆环
   - 五维雷达图
   - 风险等级 + 标签
   - 答卷概览列表
   - "解锁 36 题深度诊断 + 7 天免费试用" CTA
4. **CTA**: 跳转 `/register?trial=1&sector=...&goal=...` (注册页待开发)

## 商业化

- 个人/企业统一价: **¥99/月**
- 年度订阅限时: **¥999/年** (省 ¥189, 折合 ¥83/月)
- 7 天免费试用, 无需信用卡
- 支付集成: 微信支付 / 支付宝 (待对接)

## 本地运行

```bash
pnpm install
pnpm dev          # http://localhost:3000

# 生产构建
pnpm build
pnpm start
```

## 部署

```bash
# Docker
docker build -t astorai-web .
docker run -p 3000:3000 astorai-web
```

环境变量:
```bash
NEXT_PUBLIC_SITE_URL=https://astorai.cn
# 后续接支付/数据库时:
# WECHAT_PAY_APP_ID / WECHAT_PAY_SECRET
# DATABASE_URL
```

## 合规

- 文案全程规避"稳赚/保本/承诺收益"等违规词
- 报告底部明确"不构成投资建议"
- 待办: ICP 备案号、算法备案、用户协议、隐私政策

## 路线图

- [ ] 注册/登录页
- [ ] 真实问卷提交落 DB (Prisma + PG16)
- [ ] 36 题深度问卷 (v2)
- [ ] 支付接入 (微信/支付宝)
- [ ] 微信小程序 Taro
- [ ] CRM 后台
- [ ] 数据后台 + 数据飞轮

---
© 2026 Astor AI · 3A 投资者联盟出品