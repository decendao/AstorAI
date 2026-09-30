# 通过 Workbench 部署（无公网 IP）

> 适用场景:**ICP 备案未完成,但想先把站点跑起来**
> ECS 不绑公网 IP、不开安全组 22 端口,依然能远程部署

---

## 为什么需要这个

国内 ECS 有个硬约束:**没 ICP 备案就不能用 80/443 对外服务**。但这不代表机器只能吃灰。

阿里云 Workbench CLI 提供了一条**不需要公网 IP 的 Agent 通道**：

```
备案没下来
  ↓
ECS 用内网 IP（不绑公网）
  ↓
workbench exec/upload  ← 走阿里云内部通道
  ↓
产物部署到服务器
  ↓
备案完成
  ↓
再绑公网 IP + 域名
```

**备案期间不用干等。**

---

## 前置准备

### 1. 安装 workbench CLI

```bash
curl -fsSL https://workbench-cli.oss-cn-hangzhou.aliyuncs.com/install.sh | bash
```

> ⚠️ 建议分步执行（先下载、读一遍、再手动跑），别直接管道。

### 2. 配置凭据

```bash
workbench config
```

**建议用 RAM 子账号**，只给 ECS 相关权限，别用主账号 AccessKey。

### 3. 看实例

```bash
workbench list --region cn-hangzhou
```

记下实例 ID（`i-xxx`）。

---

## 买 ECS 时注意

| 项 | 建议 |
|---|------|
| **公网 IP** | **不绑定**（或买完就解绑）← 关键 |
| 安全组 22 | **不开**（走 workbench 通道） |
| 规格 | E 通用型 2vCPU 4GiB |
| 系统 | Alibaba Cloud Linux 3 / Ubuntu 22.04 |

---

## 三步部署

```bash
cd AstorAI

# 1️⃣ 环境自检（会提示你输入实例 ID）
bash scripts/deploy/deploy-workbench.sh --check

# 2️⃣ 完整部署（自检 + 打包 + 上传 + 远程解包 + 健康检查）
bash scripts/deploy/deploy-workbench.sh

# 3️⃣ 按脚本提示预览
```

也可以用环境变量免交互：

```bash
export ASTOR_INSTANCE_ID=i-xxxx
export ASTOR_REGION=cn-hangzhou
bash scripts/deploy/deploy-workbench.sh
```

---

## 常用命令

| 命令 | 作用 |
|------|------|
| `--check` | 环境自检（workbench/凭据/实例/远程 OS） |
| （默认） | 完整部署 |
| `--logs` | 看远程日志 |
| `--restart` | 重启 Node 服务（server 模式） |
| `--server` | 部署源码+产物（为将来切 Node 预留） |

---

## ⚠️ 一个关键约束

**`workbench exec` 每次是独立 shell，`cd` / `export` 不会保留。**

所以脚本把所有跨步骤命令用 `&&` 串在**同一次调用**里：

```bash
wb "set -e
    mkdir -p /var/www/astorai
    tar xzf /tmp/pkg.tar.gz -C /var/www/astorai
    test -f /var/www/astorai/index.html
    echo 'ok'"
```

如果你手动调 `workbench exec`，**必须这样串**，否则会出现"上一步 cd 了，这一步又回到 /"。

---

## 部署完怎么预览

产物在服务器上，但还没对外服务。两个办法：

### ① workbench 交互式连进去

```bash
workbench connect --instance-id i-xxx --region cn-hangzhou
```

进去后起个临时服务：

```bash
cd /var/www/astorai/repo && python3 -m http.server 8080
```

**只能你自己看**（会话在 workbench 里，不是公网）。

### ② 走 OSS 静态托管（推荐）

```bash
bash scripts/deploy/deploy-oss.sh --build
```

**9.9 元/年，备案都不用等，直接公网可访问。** 这才是备案期间真正能给合作方看的方案。

---

## 备案完成后

```bash
# 1. 给 ECS 绑公网 IP
# 2. 安全组开 80 / 443
# 3. 跑常规部署
sudo bash scripts/deploy/deploy.sh --update
```

workbench 通道可以继续留着 —— 出问题时它是最方便的救生通道（不用 SSH、不用开 22）。

---

## 故障速查

| 症状 | 原因 | 解决 |
|------|------|------|
| `config file not found` | 没配凭据 | `workbench config` |
| 拉不到实例 | region 错 | `workbench list --region <实际地域>` |
| 上传失败 | 实例没运行 / 凭据无权限 | 检查实例状态、RAM 权限 |
| exec 超时 | 远程命令太慢 | `--timeout` 调大（脚本已设 300） |
| 解包后没 index.html | 产物不对 | 先跑 `build-static.sh` |
| 每次 exec 都在 `/` 目录 | 正常！独立 shell 不保留 cd | 用 `&&` 串联 |

---

## 成本

| 方案 | 月成本 | 备案 |
|------|--------|------|
| **OSS 静态** | **¥0.8** | ❌ 不用 |
| ECS + workbench 部署 | ¥164 | ❌ 不用（但无公网） |
| ECS + 公网 + 域名 | ¥164 + 域名 | ✅ 需要 |

**结论**:备案期间用 ECS + workbench 验证，**同时用 OSS 对外**。备案下来再切。

---

*AstorAI · 3A Investors Alliance · Est. MMXXVI*
