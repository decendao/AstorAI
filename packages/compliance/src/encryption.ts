import crypto from "node:crypto";

/**
 * 会员敏感字段加密方案 (加密列 + HMAC 盲索引双写)
 *
 * - 存储: AES-256-GCM, 格式 base64(iv).base64(tag).base64(ciphertext)
 * - 查找/唯一性: HMAC-SHA256 盲索引 (hex), 永不反解
 *
 * 密钥来自 env:
 *   MEMBER_ENCRYPTION_KEY  32 bytes base64
 *   MEMBER_HASH_KEY        任意长度 base64
 *
 * 纪律: 密钥只在 env; 日志零明文; 泄露即轮换。
 */

const ALGO = "aes-256-gcm";
const IV_LEN = 12;

function readKey(name: string, expectedLen?: number): Buffer {
  const raw = process.env[name];
  if (!raw) {
    throw new Error(`[encryption] 缺少环境变量 ${name}`);
  }
  const buf = Buffer.from(raw, "base64");
  if (expectedLen && buf.length !== expectedLen) {
    throw new Error(`[encryption] ${name} 解码后应为 ${expectedLen} 字节, 实际 ${buf.length}`);
  }
  return buf;
}

export function encrypt(plain: string): string {
  const key = readKey("MEMBER_ENCRYPTION_KEY", 32);
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), ct.toString("base64")].join(".");
}

export function decrypt(payload: string): string {
  const key = readKey("MEMBER_ENCRYPTION_KEY", 32);
  const [ivB64, tagB64, ctB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !ctB64) {
    throw new Error("[encryption] 密文格式非法");
  }
  const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(ctB64, "base64")), decipher.final()]).toString("utf8");
}

/** 盲索引: 登录/查重/邀请匹配只查这个值 */
export function blindIndex(value: string): string {
  const key = readKey("MEMBER_HASH_KEY");
  return crypto.createHmac("sha256", key).update(value.trim().toLowerCase(), "utf8").digest("hex");
}

/** 写入辅助: 明文 -> 加密列 + 盲索引 */
export function toMemberSecretFields(input: { realName: string; phone: string; email: string }) {
  return {
    realNameEnc: encrypt(input.realName),
    phoneEnc: encrypt(input.phone),
    phoneHash: blindIndex(input.phone),
    emailEnc: encrypt(input.email),
    emailHash: blindIndex(input.email),
  };
}

/** 读取辅助: 加密列 -> 明文 (仅服务端调用, 禁止打进日志) */
export function fromMemberSecretFields<T extends { realNameEnc: string; phoneEnc: string; emailEnc: string }>(
  row: T,
): T & { realName: string; phone: string; email: string } {
  return {
    ...row,
    realName: decrypt(row.realNameEnc),
    phone: decrypt(row.phoneEnc),
    email: decrypt(row.emailEnc),
  };
}

/**
 * 通用加密 (非会员字段也可用, 比如 CRM 备注里夹带的电话)
 * 与会员加密共用同一把 MEMBER_ENCRYPTION_KEY。
 */
export function encryptField(plain: string): string {
  return encrypt(plain);
}

export function decryptField(payload: string): string {
  return decrypt(payload);
}