import type { CallbackPayload, CallbackResult, CreateOrderInput, CreateOrderResult, PaymentAdapter, QueryResult } from "./provider";

/**
 * 微信支付 V3 Native 扫码适配器。
 *
 * 关键依赖 (env):
 *   WECHAT_APP_ID, WECHAT_MCH_ID, WECHAT_API_V3_KEY (32 字节),
 *   WECHAT_CERT_SERIAL, WECHAT_PRIVATE_KEY (PEM)
 *
 * 签名: SHA256withRSA, 头: Authorization: WECHATPAY2-SHA256-RSA2048 mchid="...",nonce_str="...",timestamp="...",serial_no="...",signature="..."
 * 回调解密: APIv3 key AES-256-GCM
 *
 * 此处不引 crypto 库做实签, 调用方注入 sign/verify/decrypt 实现, 本包只规定
 * 形状与 HTTP 调用骨架, 避免密钥误落到仓库。
 */

export interface WechatSigner {
  sign(message: string): string;
}

export interface WechatDecrypter {
  decrypt(ciphertext: string, associatedData: string, nonce: string): string;
}

export interface WechatDeps {
  appId: string;
  mchId: string;
  apiV3Key: string;
  certSerial: string;
  baseUrl?: string;
  fetcher?: typeof fetch;
  signer: WechatSigner;
  decrypter: WechatDecrypter;
  now?: () => number;
  randomStr?: (len: number) => string;
}

export const wechatAdapter: (deps: WechatDeps) => PaymentAdapter = (deps) => {
  const baseUrl = deps.baseUrl ?? "https://api.mch.weixin.qq.com";
  const fetcher = deps.fetcher ?? fetch;
  const now = deps.now ?? (() => Math.floor(Date.now() / 1000));
  const randomStr = deps.randomStr ?? ((len: number) => Math.random().toString(36).slice(2, 2 + len));
  if (!deps.appId || !deps.mchId || !deps.apiV3Key || !deps.certSerial) {
    throw new Error("WeChat 适配器: 缺少必填配置 (appId/mchId/apiV3Key/certSerial)");
  }

  async function authHeader(method: string, path: string, body: string): Promise<Record<string, string>> {
    const nonce = randomStr(16);
    const ts = String(now());
    const message = `${method}\n${path}\n${ts}\n${nonce}\n${body}\n`;
    const signature = deps.signer.sign(message);
    return {
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${deps.mchId}",nonce_str="${nonce}",timestamp="${ts}",serial_no="${deps.certSerial}",signature="${signature}"`,
    };
  }

  return {
    name: "WECHAT",
    async createNativeQr(input: CreateOrderInput): Promise<CreateOrderResult> {
      const path = "/v3/pay/transactions/native";
      const body = JSON.stringify({
        appid: deps.appId,
        mchid: deps.mchId,
        description: input.description.slice(0, 127),
        out_trade_no: input.orderNo,
        time_expire: input.expiresAt.toISOString().replace(/\.\d{3}Z$/, "+08:00"),
        notify_url: `${input.notifyBaseUrl}/api/payments/wechat/notify`,
        amount: { total: input.amountCents, currency: "CNY" },
      });
      const headers = { "Content-Type": "application/json", ...(await authHeader("POST", path, body)) };
      const res = await fetcher(`${baseUrl}${path}`, { method: "POST", headers, body });
      const json = (await res.json()) as { code_url?: string };
      if (!res.ok || !json.code_url) throw new Error(`WeChat createNativeQr HTTP ${res.status}`);
      return { codeUrl: json.code_url, raw: json };
    },

    async queryOrder(orderNo: string): Promise<QueryResult> {
      const path = `/v3/pay/transactions/out-trade-no/${orderNo}?mchid=${deps.mchId}`;
      const headers = await authHeader("GET", path, "");
      const res = await fetcher(`${baseUrl}${path}`, { method: "GET", headers });
      const json = (await res.json()) as { trade_state?: string; transaction_id?: string; amount?: { total?: number } };
      const paid = json.trade_state === "SUCCESS";
      return {
        paid,
        transactionId: json.transaction_id,
        paidAmountCents: json.amount?.total,
        raw: json,
      };
    },

    async verifyCallback(payload: CallbackPayload): Promise<CallbackResult> {
      const timestamp = payload.headers["wechatpay-timestamp"] ?? payload.headers["Wechatpay-Timestamp"];
      const nonce = payload.headers["wechatpay-nonce"] ?? payload.headers["Wechatpay-Nonce"];
      const signature = payload.headers["wechatpay-signature"] ?? payload.headers["Wechatpay-Signature"];
      const serial = payload.headers["wechatpay-serial"] ?? payload.headers["Wechatpay-Serial"];
      if (!timestamp || !nonce || !signature || !serial) {
        return { verifyOk: false, raw: payload, reply: "missing signature headers", httpStatus: 400 };
      }
      const bodyStr = typeof payload.body === "string" ? payload.body : JSON.stringify(payload.body);
      const message = `${timestamp}\n${nonce}\n${bodyStr}\n`;
      const expected = deps.signer.sign(message);
      if (expected !== signature) {
        return { verifyOk: false, raw: payload, reply: "signature mismatch", httpStatus: 401 };
      }
      let parsed: { resource?: { ciphertext?: string; associated_data?: string; nonce?: string } };
      try {
        parsed = JSON.parse(bodyStr);
      } catch {
        return { verifyOk: false, raw: payload, reply: "invalid json", httpStatus: 400 };
      }
      const r = parsed.resource;
      if (!r?.ciphertext || !r.associated_data || !r.nonce) {
        return { verifyOk: false, raw: parsed, reply: "missing resource", httpStatus: 400 };
      }
      try {
        const plain = deps.decrypter.decrypt(r.ciphertext, r.associated_data, r.nonce);
        const data = JSON.parse(plain) as { out_trade_no?: string; transaction_id?: string; amount?: { total?: number } };
        return {
          verifyOk: true,
          orderNo: data.out_trade_no,
          transactionId: data.transaction_id,
          paid: true,
          paidAmountCents: data.amount?.total,
          raw: data,
          reply: JSON.stringify({ code: "SUCCESS", message: "成功" }),
          httpStatus: 200,
        };
      } catch (e) {
        return { verifyOk: false, raw: { error: String(e) }, reply: "decrypt failed", httpStatus: 500 };
      }
    },
  };
};

/** 类型仅供类型推导, 不构造实例 */
export type _WechatAdapterInstance = ReturnType<typeof wechatAdapter>;
export type WechatQueryResult = QueryResult;