/**
 * PM2 进程配置 — AstorAI Web
 *
 * ⚠️ 为什么 instances 必须是 1：
 * PM2 cluster 模式会多开进程轮询，SSE 长连接会被路由到不同进程，
 * 表现为「流式输出卡住 / 中断」。Next.js 单实例足够支撑当前量级。
 *
 * ⚠️ 为什么 NODE_OPTIONS 里加 --max-old-space-size：
 * 限制 V8 堆上限，避免内存被吃满后被 OOM Killer 干掉。
 * 2GiB 机器请保持 1536 以下。
 */

const path = require("path");

const WEB_DIR = process.env.ASTOR_WEB_DIR || "/var/www/astorai/repo/apps/web";
const PORT = parseInt(process.env.PORT || "3000", 10);

// 依据机器内存自动调整堆大小
const heapMB = (() => {
  const totalMB = require("os").totalmem() / (1024 * 1024);
  if (totalMB <= 2048) return 1536;
  if (totalMB <= 4096) return 2048;
  return 3072;
})();

module.exports = {
  apps: [
    {
      name: "astorai-web",
      script: "pnpm",
      args: "start",
      interpreter: "none",
      cwd: WEB_DIR,
      instances: 1, // ← SSE 必须单实例
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "20s",
      restart_delay: 2000,
      max_memory_restart: `${Math.floor(heapMB * 0.85)}M`,

      env: {
        NODE_ENV: "production",
        PORT: String(PORT),
        HOSTNAME: "127.0.0.1",
        NODE_OPTIONS: `--max-old-space-size=${heapMB}`,
      },

      out_file: "/var/log/astorai/out.log",
      error_file: "/var/log/astorai/error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
