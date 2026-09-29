import type { PaymentAdapter } from "./provider";

/**
 * Mock 支付适配器 — codeUrl 为伪链接, 前端显示占位二维码;
 * 配合 apps/web 的 /api/payments/mock-pay 路由模拟支付。
 */
export const mockAdapter: PaymentAdapter = {
  name: "MOCK",
  async createNativeQr(input) {
    return {
      codeUrl: `mockpay://3a-alliance/${input.orderNo}?amount=${input.amountCents}`,
      raw: { mock: true, orderNo: input.orderNo },
    };
  },
  async queryOrder() {
    return { paid: false, raw: { mock: true } };
  },
  async verifyCallback() {
    return { verifyOk: false, raw: { mock: true }, reply: "mock provider has no callback", httpStatus: 400 };
  },
};