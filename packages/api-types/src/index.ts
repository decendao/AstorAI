/**
 * @astorai/api-types — 前后端共享契约
 *
 * 三个核心域:
 *   - survey   问卷输入/提交/画像输出
 *   - report   诊断报告 sections / 状态流转
 *   - agent    Analyzer/Reporter/Reviewer 结构化输出
 *
 * 设计原则:
 * - 纯 zod schema + 推导类型, 无副作用, 无运行时依赖 (除 zod)
 * - 任何字段拼写漂移由 zod 在边界处拦截
 * - 服务端 (websitte) 与 ops 后台共用同一份 schema
 */

export * from "./survey";
export * from "./report";
export * from "./agent";