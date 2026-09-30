# AstorAI 部署手册

> 目标机器规格：**E 通用型 2vCPU 4GiB**（¥164/月）· Ubuntu 22.04 / Alibaba Cloud Linux 3

---

## 0. 买机器前先确认（会白花钱）

| 检查项 | 说明 |
|--------|------|
| **ICP 备案** | 🚨 **国内 ECS 没备案不能用 80/443**。备案周期 7–20 工作日。**没备案就先用 CNB preview 跑 demo** |
| 域名解析 | `astorai.cn` A 记录指向服务器公网 IP |
| 安全组 | 放行 `80` `443`；`22` **只放行你的办公 IP** |
| 地域 | 上海（主体所在地，延迟最低） |

---

## 1. 一键部署

```bash
# 首次
git clone https://cnb.cool/AstorAIOS/AstorAI.git
cd AstorAI
sudo bash scripts/deploy/deploy.sh

# 后续更新（拉代码 + 重新构建 + 重启）
sudo bash scripts/deploy/deploy.sh --update

# 单独申请 HTTPS
sudo bash scripts/deploy/deploy.sh --ssl
```

脚本会自动：装 Node 20 → 装 pnpm → 拉代码 → 装依赖 → build → 起 PM2 → 配 Nginx → 健康检查。

---

## 2. 目录约定

```
/var/www/astorai/
├── repo/                    # 代码
│   └── apps/web/
│       └── .env.local       # 环境变量（权限 600，gitignore）
├── logs/                    # PM2 日志
└── ecosystem.config.cjs     # 进程配置
```

日志实际位置：`/var/log/astorai/{out,error}.log`

---

## 3. 接真实模型

默认 `ASTOR_MODEL_PROVIDER=mock`，前端能跑但返回假数据。

**换成智谱**：

```bash
cd /var/www/astorai/repo/apps/web
nano .env.local
```

```ini
ASTOR_MODEL_PROVIDER=zhipu
ZHIPU_API_KEY=你的key
ASTOR_MODEL=glm-4-plus
```

```bash
pm2 restart astorai-web --update-env
```

**合规白名单**：`ASTOR_ALLOWED_MODELS` 是「境内备案模型」约束的代码化实现，不在列表内的模型运行时直接拒绝调用。**不要为了省事把它删掉。**

---

## 4. ⚠️ 三个会导致线上事故的配置

### 4.1 SSE 被缓冲 → 流式输出卡住

`nginx.conf.example` 里 `/api/astor/stream` 的这四个参数**不能删**：

```nginx
proxy_buffering off;
proxy_cache off;
chunked_transfer_encoding on;
add_header X-Accel-Buffering no always;
```

**症状**：点发送后等很久，然后内容一次性全出。
**原因**：Nginx 缓冲了整个响应。

**自测**：
```bash
curl -N https://astorai.cn/api/astor/stream?q=test
```
应看到内容**逐字吐出**，不是等几秒后一次性出现。

### 4.2 PM2 多实例 → SSE 被路由到别的进程

`ecosystem.config.cjs` 里 `instances: 1` **不能改大**。

**症状**：流式输出偶发中断、串行错乱。
**原因**：cluster 模式轮询，长连接被切到另一个进程。

当前流量单实例足够。真要横向扩展，**先把 SSE 端点拆成独立服务**。

### 4.3 build 时 OOM

2GiB 机器 build 会挂。脚本已设：

```bash
export NODE_OPTIONS="--max-old-space-size=2048"
```

如果你降到 2GiB 机器，**在 CI 里 build，只把 `.next` 产物推上去**，不要在服务器 build。

---

## 5. 日常运维

```bash
# 日志
pm2 logs astorai-web --lines 100
tail -f /var/log/astorai/error.log

# 进程
pm2 status
pm2 restart astorai-web
pm2 stop astorai-web

# Nginx
nginx -t                    # 校验配置
systemctl reload nginx
tail -f /var/log/nginx/error.log

# 端口占用
ss -tlnp | grep 3000

# 证书续期定时任务
systemctl list-timers | grep certbot
```

---

## 6. 升级流程

```bash
sudo bash scripts/deploy/deploy.sh --update
```

期间站点会有 10–30 秒不可用（PM2 重启）。**流量大时建议加 `pm2 reload`** 做零停机。

---

## 7. 故障速查

| 症状 | 排查 |
|------|------|
| 502 Bad Gateway | `pm2 status` 看进程是否活着；`pm2 logs` 看启动报错 |
| 流式输出一次性全出 | Nginx 缓冲没关，检查 `nginx.conf` 四个参数 |
| 流式输出偶发中断 | PM2 `instances > 1` |
| build 时 heap out of memory | 内存不足，降配到 CI build |
| 申请证书失败 | **国内服务器通常是备案没完成** |
| 修改 .env 后不生效 | `pm2 restart --update-env` |
| 静态资源 404 | build 产物没同步，`pm2 restart` 检查 `cwd` |

---

## 8. 成本参考

| 项 | 月成本 |
|----|--------|
| ECS E 2vCPU 4GiB（按量） | ¥164 |
| ECS E 2vCPU 4GiB（包年，估） | ≈¥115 |
| 域名 .cn | ¥35/年 |
| SSL（Let's Encrypt） | ¥0 |
| **合计** | **≈¥150–200/月** |

**降本路径**：CI build + 降到 2GiB → 约 ¥70/月。

---

## 9. 上线检查清单

- [ ] ICP 备案完成
- [ ] 域名解析正确
- [ ] `pm2 status` 进程在线
- [ ] `curl -N .../api/astor/stream?q=test` 流式正常
- [ ] HTTPS 生效，HTTP 自动跳转
- [ ] `pm2 startup` 已配置开机自启
- [ ] `/var/log/astorai/` 目录存在且有写权限
- [ ] 安全组 22 端口已限制来源 IP
- [ ] 证书续期定时任务存在
- [ ] `.env.local` 权限为 600

---

*AstorAI · 3A Investors Alliance · Est. MMXXVI*
