# Astor AI Monorepo

投资者联盟 (3A Investor Alliance) 的核心代码仓库 —— Next.js 15 + React 19 + TypeScript, pnpm workspaces 单仓多包架构。

## 结构

```
astor-ai/
├── apps/                  # 部署单元 (5)
│   ├── web/               # @astorai/web        — 官网+会员后台 (Next.js App Router)
│   ├── mobile/            # @astorai/mobile     — 移动端 H5 (待建)
│   ├── docs/              # @astorai/docs       — 文档站 (待建)
│   ├── ops/               # @astorai/ops        — 运营后台 (待建)
│   └── tools/             # @astorai/tools      — 内部脚本与数据迁移 (待建)
└── packages/              # 共享代码 (11)
    ├── ui/                # @astorai/ui          — 设计系统、组件库
    ├── compliance/        # @astorai/compliance  — 加密/RBAC/红线扫描 (核心复用)
    ├── api-types/         # @astorai/api-types   — Survey/Report/Agent zod schemas
    ├── llm/               # @astorai/llm         — 多 LLM 适配器 (zhipu/qwen/deepseek)
    ├── agents/            # @astorai/agents      — Analyzer→Reporter→Reviewer 流水线
    ├── payments/          # @astorai/payments    — 微信/支付宝/模拟支付
    ├── storage/           # @astorai/storage     — OSS/本地存储抽象
    ├── notifications/     # @astorai/notifications — 短信/邮件/推送
    ├── integrations/      # @astorai/integrations — 第三方 CRM/数据源
    ├── config/            # @astorai/config      — 共享 ESLint/TS/Tailwind 配置
    └── utils/             # @astorai/utils       — 通用工具 (cn/date/format)
```

## 复用原则

- **合规三件套** (`@astorai/compliance`): encryption (AES-256-GCM + HMAC-SHA256 blind index)、rbac (L1-L5 权限)、redline (合规扫描) —— 从 websitte 抽离, 任何需要处理会员敏感数据的应用都必须引用。
- **API 类型契约** (`@astorai/api-types`): Survey/Report/Agent 三个核心实体的 zod schema, 前后端共享, 杜绝字段拼写漂移。
- **业务不动, 包装先稳**: 这次重构不改业务逻辑, 只搬骨架 + 抽合规包; 业务迁移下一轮做。

## 快速开始

```bash
pnpm install
pnpm dev          # 启动 @astorai/web
pnpm --filter @astorai/web build
pnpm --filter @astorai/compliance test   # 合规包单元测试
```

## 路线图

- [x] P0: monorepo 骨架 + apps/web 官网
- [ ] P1: 抽 packages/compliance 复用 websitte 加密/RBAC/红线
- [ ] P1: 建 packages/api-types (Survey/Report/Agent zod)
- [ ] P2: apps/ops 运营后台 (含 AuditEvent 查看)
- [ ] P2: apps/mobile 移动端 (Next.js H5)
- [ ] P3: packages/integrations 接第三方 CRM

## 许可

Apache-2.0