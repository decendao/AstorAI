import { z } from "zod";

/**
 * 合规红线扫描器 — 投资类内容上架前必过。
 *
 * 红线类别 (与 websitte iron rules 对齐):
 *   - GUARANTEE   收益/保本/无风险承诺
 *   - ABSOLUTE    绝对化用语 (必涨/稳赚/100%)
 *   - INSIDER     内幕消息/荐股
 *   - PERSONAL    个人信息 (身份证/银行卡号)
 *
 * 返回 violations 数组, 严重程度 (high/medium/low)。
 * high 必须人工确认才能发布; medium/low 可自动改写或编辑驳回。
 */

export type ViolationSeverity = "high" | "medium" | "low";

export interface RedlineViolation {
  rule: string;
  category: "GUARANTEE" | "ABSOLUTE" | "INSIDER" | "PERSONAL";
  severity: ViolationSeverity;
  match: string;
  index: number;
  suggestion: string;
}

interface Rule {
  pattern: RegExp;
  category: RedlineViolation["category"];
  severity: ViolationSeverity;
  suggestion: string;
}

const RULES: Rule[] = [
  // 收益/保本/无风险承诺 — high
  { pattern: /(保本|稳赚不赔|零风险|无风险|保证收益|保证回报)/g, category: "GUARANTEE", severity: "high", suggestion: "删除绝对收益/保本表述, 改为'历史业绩不代表未来表现'" },
  { pattern: /(年化\s*\d{2,}\s*%\s*保)/g, category: "GUARANTEE", severity: "high", suggestion: "删除'保'字, 改为示例收益范围 + 风险提示" },

  // 绝对化用语 — medium
  { pattern: /(必涨|必跌|100\s*%会|稳赚|包赚|翻倍)/g, category: "ABSOLUTE", severity: "medium", suggestion: "改为'可能/概率较高/存在机会'等中性表述" },
  { pattern: /(一定|绝对|肯定)\s*(会|能|让)/g, category: "ABSOLUTE", severity: "medium", suggestion: "使用'可能/有望/预期'等表述" },

  // 内幕/荐股 — high
  { pattern: /(内幕消息|主力动向|庄家|建仓信号)/g, category: "INSIDER", severity: "high", suggestion: "删除任何形式的'内幕/庄家'表述" },
  { pattern: /(强烈推荐|必买|全仓)/g, category: "INSIDER", severity: "high", suggestion: "改为中性观点表述, 不做行动建议" },

  // 个人信息 — high
  { pattern: /\b\d{17}[\dXx]\b/g, category: "PERSONAL", severity: "high", suggestion: "删除身份证号" },
  { pattern: /\b\d{16,19}\b/g, category: "PERSONAL", severity: "high", suggestion: "疑似银行卡号, 请删除" },
  { pattern: /\b1[3-9]\d{9}\b/g, category: "PERSONAL", severity: "high", suggestion: "正文不应出现手机号, 改为联系页面入口" },
];

export function scanRedline(text: string): RedlineViolation[] {
  const violations: RedlineViolation[] = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.pattern.exec(text)) !== null) {
      violations.push({
        rule: rule.pattern.source,
        category: rule.category,
        severity: rule.severity,
        match: m[0],
        index: m.index,
        suggestion: rule.suggestion,
      });
    }
  }
  // 严重度排序 + 索引排序
  const sev = { high: 0, medium: 1, low: 2 } as const;
  return violations.sort((a, b) => sev[a.severity] - sev[b.severity] || a.index - b.index);
}

export function hasHighViolation(violations: RedlineViolation[]): boolean {
  return violations.some((v) => v.severity === "high");
}

export const RedlineScanInput = z.object({
  text: z.string().min(1).max(50_000),
});

export type RedlineScanRequest = z.infer<typeof RedlineScanInput>;
export type RedlineScanResponse = { violations: RedlineViolation[]; blocked: boolean };