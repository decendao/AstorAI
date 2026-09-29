import { z } from "zod";

/**
 * 审计事件 — append-only, 一旦写入不可改不可删。
 *
 * 调用方负责实际落库 (Prisma AuditEvent / DynamoDB / Mongo 等),
 * 本包只规定 schema 与便利构造器。
 *
 * Iron rule: 审计日志不记录明文敏感字段; actorId/role 用引用, 不带邮箱手机号。
 */

export const AuditAction = z.enum([
  "MEMBER_CREATE",
  "MEMBER_UPDATE",
  "MEMBER_DECRYPT",
  "DIAGNOSIS_DRAFT",
  "DIAGNOSIS_APPROVE",
  "DIAGNOSIS_REJECT",
  "DIAGNOSIS_PUBLISH",
  "PAYMENT_CREATE",
  "PAYMENT_PAID",
  "PAYMENT_REFUND",
  "RBAC_DENY",
  "REDLINE_BLOCK",
  "AUTH_LOGIN",
  "AUTH_LOGOUT",
]);

export const AuditEventInput = z.object({
  actorId: z.string().nullable(),
  actorRole: z.enum(["SYSTEM", "MEMBER", "ADMIN", "MASTER"]),
  action: AuditAction,
  target: z.string().nullable(),
  meta: z.record(z.unknown()).default({}),
  ip: z.string().optional(),
  ua: z.string().optional(),
});

export type AuditEvent = z.infer<typeof AuditEventInput>;

/**
 * 构造审计事件, 由调用方拿到后插入数据库。
 * 关键约束: meta 中不允许出现明文 email/phone/idCard。
 * 这里只做形状校验, 真正的"明文扫描"在调用层做。
 */
export function makeAuditEvent(input: z.infer<typeof AuditEventInput>): AuditEvent {
  return AuditEventInput.parse(input);
}

const FORBIDDEN_META_KEYS = ["email", "phone", "idCard", "realName", "password"];
export function assertNoSensitiveMeta(meta: Record<string, unknown>): void {
  for (const key of Object.keys(meta)) {
    if (FORBIDDEN_META_KEYS.includes(key)) {
      throw new Error(`[audit] meta 中禁止明文敏感字段: ${key}`);
    }
  }
}