/**
 * Prisma client singleton
 *
 * Vercel serverless 环境注意事项:
 *  - 全局缓存避免每个请求重建 client (冷启动优化)
 *  - hot reload 时 next dev 会复用 globalThis.prisma
 *  - 生产环境直接 new PrismaClient() 即可
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * 检查是否启用真实数据库
 * - DATABASE_URL 缺失时 fallback 到 mock (master 当前行为)
 * - 配合 next.config.ts 的 ASTOR_STATIC_EXPORT: 静态导出时不会走到这个 client
 */
export function dbEnabled(): boolean {
  return !!process.env.DATABASE_URL && process.env.DISABLE_DB !== "1";
}