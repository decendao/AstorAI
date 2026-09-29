import type { CallbackPayload, CallbackResult, CreateOrderInput, CreateOrderResult, PaymentAdapter, QueryResult } from "./provider";

/**
 * 支付宝当面付适配器 (precreate + qr_code + RSA2 签名)。
 *
 * 关键依赖 (env):
 *   ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY (应用私钥, 商户RSA2),
 *   ALIPAY_PUBLIC_KEY (支付宝公钥, 用于验签)
 *
 * 签名: SHA256withRSA (RSA2), 排序拼接 + sign 参数。
 * 验签: 同算法, 用支付宝公钥校验 out_trade_no / total_amount / seller_id 等关键字段。
 *
 * 与微信一致: 本包不引 crypto 库做实签, 调用方注入 sign/verify 实现。
 */

export interface AlipaySigner {
  sign(message: string): string;
}

export interface AlipayVerifier {
  verify(message: string, signature: string): boolean;
}

export interface AlipayDeps {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  baseUrl?: string;
  fetcher?: typeof fetch;
  signer: AlipaySigner;
  verifier: AlipayVerifier;
}

export const alipayAdapter: (deps: AlipayDeps) => PaymentAdapter = (deps) => {
  const baseUrl = deps.baseUrl ?? "https://openapi.alipay.com/gateway.do";
  const fetcher = deps.fetcher ?? fetch;
  if (!deps.appId || !deps.privateKey || !deps.alipayPublicKey) {
    throw new Error("Alipay 适配器: 缺少必填配置 (appId/privateKey/alipayPublicKey)");
  }

  async function invoke<T>(method: string, bizContent: Record<string, unknown>): Promise<T> {
    const params = new URLSearchParams();
    params.set("app_id", deps.appId);
    params.set("method", method);
    params.set("format", "JSON");
    params.set("charset", "utf-8");
    params.set("sign_type", "RSA2");
    params.set("timestamp", new Date().toISOString().replace(/\.\d{3}Z$/, "+08:00"));
    params.set("version", "1.0");
    params.set("biz_content", JSON.stringify(bizContent));
    const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
    const signSource = sorted.map(([k, v]) => `${k}=${v}`).join("&");
    const sign = deps.signer.sign(signSource);
    params.set("sign", sign);
    const res = await fetcher(baseUrl, { method: "POST", body: params });
    const json = (await res.json()) as { alipay_trade_precreate_response?: T & { code?: string; msg?: string } };
    const body = json.alipay_trade_precreate_response;
    if (!body || body.code !== "10000") throw new Error(`Alipay ${method} failed: ${body?.msg ?? res.status}`);
    return body;
  }

  function parseQuery(querystring: string): Record<string, string> {
    const out: Record<string, string> = {};
    new URLSearchParams(querystring).forEach((v, k) => (out[k] = v));
    return out;
  }

  return {
    name: "ALIPAY",
    async createNativeQr(input: CreateOrderInput): Promise<CreateOrderResult> {
      const body = await invoke<{ qr_code: string; out_trade_no: string }>("alipay.trade.precreate", {
        out_trade_no: input.orderNo,
        total_amount: (input.amountCents / 100).toFixed(2),
        subject: input.description.slice(0, 128),
        timeout_express: "30m",
        notify_url: `${input.notifyBaseUrl}/api/payments/alipay/notify`,
      });
      return { codeUrl: body.qr_code, raw: body };
    },

    async queryOrder(orderNo: string): Promise<QueryResult> {
      const body = await invoke<{ trade_status?: string; trade_no?: string; total_amount?: string }>(
        "alipay.trade.query",
        { out_trade_no: orderNo },
      );
      const paid = body.trade_status === "TRADE_SUCCESS" || body.trade_status === "TRADE_FINISHED";
      return {
        paid,
        transactionId: body.trade_no,
        paidAmountCents: body.total_amount ? Math.round(Number(body.total_amount) * 100) : undefined,
        raw: body,
      };
    },

    async verifyCallback(payload: CallbackPayload): Promise<CallbackResult> {
      const rawStr = typeof payload.body === "string" ? payload.body : JSON.stringify(payload.body);
      const params = parseQuery(rawStr);
      const sign = params.sign;
      if (!sign) return { verifyOk: false, raw: params, reply: "fail", httpStatus: 400 };
      const sorted = Object.entries(params)
        .filter(([k]) => k !== "sign" && k !== "sign_type")
        .sort(([a], [b]) => a.localeCompare(b));
      const source = sorted.map(([k, v]) => `${k}=${v}`).join("&");
      if (!deps.verifier.verify(source, sign)) {
        return { verifyOk: false, raw: params, reply: "fail", httpStatus: 401 };
      }
      return {
        verifyOk: true,
        orderNo: params.out_trade_no,
        transactionId: params.trade_no,
        paid: params.trade_status === "TRADE_SUCCESS" || params.trade_status === "TRADE_FINISHED",
        paidAmountCents: params.total_amount ? Math.round(Number(params.total_amount) * 100) : undefined,
        raw: params,
        reply: "success",
        httpStatus: 200,
      };
    },
  };
};