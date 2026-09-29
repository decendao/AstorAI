/**
 * @astorai/payments — 支付适配层
 *
 * 与 @astorai/llm 同模式:
 *  - mock 为默认 (零成本全链路, 内测/联调用)
 *  - env ASTOR_PAY_PROVIDER=wechat|alipay 切换, key 到位即生效
 *  - 境内 baseUrl 白名单硬编码, 密钥只从 env 读, 绝不入库
 *
 * 铁律: 本包不接触 prisma — ProviderEnum/MockAdapter 都是自有类型,
 * 调用方落库到自己的 PaymentOrder 表。
 */

export * from "./provider";
export * from "./wechat";
export * from "./alipay";
export * from "./mock";