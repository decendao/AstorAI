/**
 * @astorai/compliance — 合规三件套
 *
 * 1. encryption  AES-256-GCM + HMAC-SHA256 blind index (会员敏感字段)
 * 2. rbac        L1-L5 等级 + ADMIN/MASTER 角色 (服务端唯一权威)
 * 3. redline     合规扫描器 (投资承诺/收益保证/绝对化用语等)
 *
 * 设计原则:
 * - 不绑 prisma/auth/next — 调用方注入 session 与 schema
 * - 密钥只在 env; 日志零明文; 泄露即轮换
 * - 任何处理会员敏感数据的应用必引
 */

export * from "./encryption";
export * from "./rbac";
export * from "./redline";
export * from "./audit";