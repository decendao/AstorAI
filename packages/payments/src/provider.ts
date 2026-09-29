export type ProviderEnum = "MOCK" | "WECHAT" | "ALIPAY";

export interface CreateOrderInput {
  orderNo: string;
  amountCents: number;
  description: string;
  expiresAt: Date;
  /** 形如 https://xxx.3a-alliance.cn — 用于构造回调 URL */
  notifyBaseUrl: string;
}

export interface CreateOrderResult {
  /** 微信 code_url / 支付宝 qr_code / mock 伪链接 */
  codeUrl: string;
  raw?: unknown;
}

export interface QueryResult {
  paid: boolean;
  transactionId?: string;
  paidAmountCents?: number;
  raw?: unknown;
}

export interface CallbackPayload {
  headers: Record<string, string>;
  body: string | Record<string, unknown>;
}

export interface CallbackResult {
  verifyOk: boolean;
  orderNo?: string;
  transactionId?: string;
  paid?: boolean;
  paidAmountCents?: number;
  raw: unknown;
  /** 返回给渠道的应答体 (微信 JSON / 支付宝纯文本 success) */
  reply: string;
  httpStatus: number;
}

export interface PaymentAdapter {
  readonly name: ProviderEnum;
  createNativeQr(input: CreateOrderInput): Promise<CreateOrderResult>;
  queryOrder(orderNo: string): Promise<QueryResult>;
  verifyCallback(payload: CallbackPayload): Promise<CallbackResult>;
}

export function resolvePayProviderName(): ProviderEnum {
  const v = (process.env.ASTOR_PAY_PROVIDER ?? "mock").toLowerCase();
  if (v === "wechat" || v === "wxpay") return "WECHAT";
  if (v === "alipay") return "ALIPAY";
  return "MOCK";
}

/**
 * 惰性加载真适配器 — 避免无 key 场景在 import 阶段就炸。
 * 调用方也可直接 import wechatAdapter / alipayAdapter 做显式注入。
 */
export async function getPayAdapter(): Promise<PaymentAdapter> {
  const { mockAdapter } = await import("./mock");
  const name = resolvePayProviderName();
  if (name === "MOCK") return mockAdapter;
  if (name === "WECHAT") {
    const { wechatAdapter } = await import("./wechat");
    return wechatAdapter;
  }
  const { alipayAdapter } = await import("./alipay");
  return alipayAdapter;
}