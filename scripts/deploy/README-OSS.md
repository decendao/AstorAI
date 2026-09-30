# AstorAI — 静态部署到 OSS/CDN

> 成本:**9.9 元/年** · 无需 ICP 备案 · 适合当前阶段

---

## 什么时候用这个

| 场景 | 用 OSS 静态 |
|------|-----------|
| 只是想让网站能访问 | ✅ |
| 备案还没下来 | ✅ |
| 问卷在浏览器算完直接出结果 | ✅ |
| 要存问卷答案 / 接真实模型 / 登录支付 | ❌ 切 ECS 动态 |

**当前项目状态**：问卷纯前端计算（`SurveyFlow` 没有任何 `fetch`），所以静态版**功能完整**。

---

## 前置准备

### 1. 开通 OSS

阿里云控制台 → 对象存储 OSS → 创建 Bucket

| 设置 | 建议值 |
|------|-------|
| 地域 | `oss-cn-shanghai`（离你近） |
| 读写权限 | **公共读**（静态网站必须，否则匿名访问 403） |
| 版本控制 | 建议开启（可回滚） |
| 加密 | 不用（纯公开内容） |

### 2. 拿 AccessKey

控制台右上角 → AccessKey 管理 → 创建。

**⚠️ 安全建议**：用子账号 + 最小权限，别用主账号密钥。

```bash
# 或者不写进配置文件，直接用环境变量
export OSS_ACCESS_KEY_ID="你的ID"
export OSS_ACCESS_KEY_SECRET="你的Secret"
```

---

## 三步部署

```bash
cd AstorAI

# 1️⃣ 交互式配置（Bucket / Region / 域名 / CDN）
bash scripts/deploy/deploy-oss.sh

# 2️⃣ 构建 + 上传
bash scripts/deploy/deploy-oss.sh --build

# 3️⃣ 打开打印出来的地址，用手机看
```

配置会写入 `.oss-deploy.conf`（权限 600，已加入 `.gitignore`）。

---

## 常用命令

| 命令 | 作用 |
|------|------|
| `--build` | 构建静态版 + 上传（每次发版用这个） |
| `--refresh` | 刷新 CDN 缓存 |
| `--rollback` | 回滚到上一版本 |
| `--setup` | 重新配置 |

---

## 发版流程

```bash
# 1. 改代码
# 2. 提交推送
git push

# 3. 本地拉取并重新部署
git pull && bash scripts/deploy/deploy-oss.sh --build
```

**每次上传前会自动备份当前线上版本**到 `.oss-backup/`，出问题可 `--rollback`。

---

## 缓存策略

脚本已配好：

| 文件类型 | 缓存 | 说明 |
|---------|------|------|
| `/index.html` 等 HTML | 短缓存 | 每次刷新即生效 |
| `/_next/static/*`（带 hash） | **永久缓存** | 文件名含指纹，改了就换名 |

**如果发现改完没生效**：大概率是 CDN 缓存。跑 `--refresh`。

---

## 接 CDN（可选）

配置时会问要不要开。开的话需要：

1. 在 CDN 控制台添加加速域名
2. 回源配置指向 `oss-cn-shanghai.aliyuncs.com`
3. 把 CDN 域名填进配置文件

**注意**：CDN 境内加速节点**需要备案**。没备案就用 OSS 默认域名，或选香港/海外节点。

---

## 私有 Bucket 方案

如果不想开「公共读」：

```bash
# 用签名 URL 访问
ossutil sign "oss://bucket/index.html" --expires-in 3600
```

⚠️ 签名 URL 过期就失效，**不适合对外分享**。做公开站建议直接公共读。

---

## 故障速查

| 症状 | 原因 | 解决 |
|------|------|------|
| 访问 403 | Bucket 是私有读 | 控制台改「公共读」 |
| 首页 404 | 静态站点没配 | 跑一次 `--build` 会自动配 |
| 样式全丢 | CSS 没上传成功 | 检查 `_next/static/` 是否完整 |
| 改完没生效 | CDN 缓存 | `--refresh` |
| 404 页面不对 | 缺 `404.html` | 跑一次 `--build` |
| `command not found: ossutil` | 没装 | 脚本会自动装，或手动装 ossutil |
| 403 AccessDenied | 密钥无效或没权限 | 检查 AccessKey 区域是否匹配 Bucket |

---

## 切到 ECS 动态版的时机

当出现这些需求时切：

- [ ] 要存问卷答案（算转化率、发报告邮件）
- [ ] 要接真实模型（API Key 不能暴露在浏览器）
- [ ] 要做登录 / L2 会员权限
- [ ] 要接支付

**切换成本很低**：改一个环境变量。

```bash
# 静态 → 动态
unset ASTOR_STATIC_EXPORT
sudo bash scripts/deploy/deploy.sh --update
```

---

## 成本对比

| 方案 | 月成本 | 备案要求 | 能收数据 |
|------|--------|---------|---------|
| **OSS 静态** | **¥0.8/月**(9.9/年) | ❌ | ❌ |
| ECS 2GiB 动态 | ¥69 | ✅ | ✅ |
| ECS 4GiB 动态 | ¥164 | ✅ | ✅ |

**建议**：先用 OSS 把站跑通，验证内容和流量后，备案下来再切 ECS。

---

*AstorAI · 3A Investors Alliance · Est. MMXXVI*
