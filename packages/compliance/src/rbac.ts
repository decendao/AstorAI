/**
 * 5 级 RBAC — 服务端唯一权威判断点。
 *
 * 前端隐藏入口只是体验层, 所有 API route / Server Action 必须过这里。
 *
 * 解耦原则: 本包不知道 prisma/auth/next, 只接受一个 SessionLike 对象。
 * 调用方 (websitte / ops 后台) 自己拿 session 后传进来。
 */

export type MemberLevel = "L1" | "L2" | "L3" | "L4" | "L5";
export type OperatorRole = "MEMBER" | "ADMIN" | "MASTER";

export const LEVEL_ORDER: MemberLevel[] = ["L1", "L2", "L3", "L4", "L5"];

/** 调用方传入的最小 session 形状; 不绑 next-auth / auth.js */
export interface SessionLike {
  user?: {
    level?: MemberLevel | string;
    role?: OperatorRole | string;
    id?: string;
  };
}

export function levelAtLeast(actual: MemberLevel | string | undefined, required: MemberLevel): boolean {
  if (!actual) return false;
  const a = LEVEL_ORDER.indexOf(actual as MemberLevel);
  const r = LEVEL_ORDER.indexOf(required);
  return a >= 0 && r >= 0 && a >= r;
}

/** 返回 level 及以下所有等级 (用于内容可见性过滤); ADMIN/MASTER 返回全部 */
export function levelsUpTo(level: MemberLevel | string | undefined, role?: string): MemberLevel[] {
  if (role === "ADMIN" || role === "MASTER") return [...LEVEL_ORDER];
  if (!level) return [];
  const idx = LEVEL_ORDER.indexOf(level as MemberLevel);
  if (idx < 0) return [];
  return LEVEL_ORDER.slice(0, idx + 1);
}

export function isOperator(role?: string): boolean {
  return role === "ADMIN" || role === "MASTER";
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "权限不足") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "未登录") {
    super(message);
  }
}

/**
 * 同步检查: 给一个 session 对象, 判断是否满足等级要求。
 * 异步取 session 由调用方负责 (各 app 取法不同)。
 */
export function checkLevel(session: SessionLike | null | undefined, required: MemberLevel): void {
  if (!session?.user) throw new UnauthorizedError();
  const { level, role } = session.user;
  if (isOperator(role)) return;
  if (!levelAtLeast(level, required)) {
    throw new ForbiddenError(`需要 ${required} 及以上等级`);
  }
}

/** 同步检查: 要求运营角色 */
export function checkRole(session: SessionLike | null | undefined, ...roles: OperatorRole[]): void {
  if (!session?.user) throw new UnauthorizedError();
  if (!roles.includes(session.user.role as OperatorRole)) {
    throw new ForbiddenError();
  }
}