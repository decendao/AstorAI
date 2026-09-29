# Astor AI (astorai.cn)

终端用户产品线 —— 智能投研副驾 Astor AI 的官网、小程序、SDK、CRM、数据后台与数据飞轮。

## 仓库结构 (monorepo 初始化)

```
astor-ai/
├── apps/
│   └── web-astorai/        # 官网 (Next.js 15 + React 19)  ✅ 已开工
└── packages/               # 待建: sdk / ui / api-types / llm / compliance
```

## 当前进度 (P0 · 官网)

- [x] 项目骨架 (Next.js 15 + Tailwind + Framer Motion + Recharts)
- [x] 设计系统 (深空黑 + 金 · Glassmorphism · 漂浮粒子)
- [x] Hero (中央交互 + Gemini 风)
- [x] 6 题问卷 (Typeform 全屏切换)
- [x] 初级画像报告 (Apple Health 浅色面板)
- [x] AstorAgent 能力展示 (6 卡)
- [x] AstorAgent 实时 Demo (mock 流式)
- [x] 定价区 (¥99/月 · ¥999/年)
- [x] API 路由 (问卷提交)
- [x] SEO (sitemap/robots/OG/meta)

## 下一步

- [ ] 注册/登录页 (手机号 + 微信扫码)
- [ ] 微信支付 / 支付宝 接入
- [ ] 真实数据库 (Prisma + PG16)
- [ ] AstorAgent 真实对话 (接 zhipu/qwen/deepseek)
- [ ] 36 题深度问卷 (v2)
- [ ] Taro 微信小程序
- [ ] CRM 后台 (复用 Astor OS 视图)
- [ ] 数据后台 + 飞轮 pipeline

## 商业策略

- 统一价 ¥99/月, 年度限时 ¥999/年 (省 ¥189)
- 7 天免费试用, 无需信用卡
- 个人/企业同口径 (后续 enterprise tier 单独定价)

## 关联仓库

- 3A 投资者联盟 (cnb.cool/tripAinvestors/websitte): 内循环 CRM
- Astor AI (本仓): 终端用户产品