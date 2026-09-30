import type { NextConfig } from "next";

/**
 * 静态导出开关。
 *
 * ASTOR_STATIC_EXPORT=1  →  output: "export", 产出纯静态 out/ 目录,
 *                          可丢到任意 CDN / 对象存储 / 静态托管。
 *                          此时 /api/* route handler 不会被输出, 前端
 *                          AstorStreamDemo 自动回退到客户端实现。
 *
 * 不设 (默认)            →  常规 next start, 保留 SSE / 问卷提交接口,
 *                          适合 ECS 部署。
 *
 * 注意: 静态导出下 route handler 会被 Next.js 判为 unsupported 而报错,
 * 所以 build 时需要先把 app/api 移开 —— 见 scripts/build-static.sh。
 */
const staticExport = process.env.ASTOR_STATIC_EXPORT === "1";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["framer-motion", "recharts"] },
  ...(staticExport
    ? {
        output: "export" as const,
        // 目录式路由 (out/astor/index.html 而非 out/astor.html):
        // 静态托管对 .html 映射的支持参差不齐, 目录 + index.html 最通用。
        trailingSlash: true,
      }
    : {}),
};

export default config;
