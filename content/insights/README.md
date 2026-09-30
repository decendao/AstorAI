# 洞察内容存档（Insights Archive）

> 状态：**已存档，暂未上线**
> 建档日期：2026-09-30

---

## 这是什么

4 篇 AstorAI 洞察文章的**静态 HTML 版本**，加上内容生产规划文档。

在 `apps/web`（Next.js 主站）视觉重写之前，先做的**静态原型**。
视觉语言（编辑排版体系）与 `apps/web` 现在用的是同一套，但实现方式不同。

---

## 为什么是存档而不是直接上线

| 原因 | 说明 |
|------|------|
| **技术栈不同** | 这里是无构建的原生 HTML；`apps/web` 是 Next.js 15 + React 19 + Tailwind |
| **路径会失效** | 存档的 HTML 依赖 `../../assets/core.css`（那是静态站 `/workspace/astorai.cn/` 的相对路径），在仓库里是死链 |
| **组件未对齐** | `apps/web` 的组件体系（`SectionMark` / `Btn` / 问卷流）已经重构，静态版没有跟上 |

**结论**：这些文件的价值是**内容本身**，不是那套 HTML 结构。

---

## 目录结构

```
content/insights/
├── index.html              洞察列表页（含 4 分类筛选）
├── CONTENT-PLAN.md         12 周选题库 + 生产 SOP + 标题钩子公式
├── README.md               本文件
└── posts/
    ├── shelf-vs-understanding.html   产品货架的访问权，不等于理解的访问权
    ├── audit-first.html             敢信比聪明值钱十倍
    ├── family-office-ai.html         同样是家办的深度，成本差了三个数量级
    └── first-examination.html        没有体检报告的治疗，都是碰运气
```

---

## 内容清单

| # | 标题 | 栏目 | 字数 | 状态 |
|---|------|------|------|------|
| D1 | 产品货架的访问权，不等于理解的访问权 | 财富诊断 | ~2000 | ✅ 已写 |
| S1 | 同样是家办的深度，为什么成本差了三个数量级 | 资产结构 | ~2200 | ✅ 已写 |
| A1 | 在 AI 管钱这件事上，敢信比聪明值钱十倍 | 可审计 | ~1900 | ✅ 已写 |
| D4 | 没有体检报告的治疗，都是碰运气 | 财富诊断 | ~1200 | ✅ 已写 |

**待补 8 篇**：见 `CONTENT-PLAN.md` §10

---

## 上线时要做什么

如果要把这些内容挂进 `apps/web`，需要：

1. **建路由** `app/insights/page.tsx` + `app/insights/[slug]/page.tsx`
2. **内容数据化** — 把 4 篇文章正文抽成 MD 或 MDX，用 `next-mdx` 或 `gray-matter` 读取
3. **样式复用** `apps/web` 的 editorial 体系已经覆盖了文章排版需求（`.smark-*` / `.pull` / `.callout` / `.hair-*`），直接套用即可
4. **补 SEO** — `app/sitemap.ts` 加 `/insights/*` 条目
5. **串内部链接** — 文章 → `#diagnose`（当前是 `../../index.html#diagnose`）

**预估工作量**：4 篇文章数据化 + 路由 ≈ 半天；含后续 8 篇的模板化 ≈ 1 天。

---

## 内容原则（不可违背）

摘自 `CONTENT-PLAN.md`，存档于此以便后续迁移时对齐：

- ✅ 只写**资产结构 / 财富诊断 / 可审计 / 圈层认知**
- ❌ 不写市场行情、不写产品推荐、不写收益预期
- ❌ 不出现具体产品名（基金/券商/保险）
- ✅ 公域分发时去品牌化，站内保留完整品牌

---

*AstorAI · 3A Investors Alliance · Est. MMXXVI*
