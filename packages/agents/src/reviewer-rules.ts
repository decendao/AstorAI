import type { RiskFlag } from "@astorai/api-types";

/**
 * Reviewer 规则版风险扫描 — 与 LLM Reviewer 双保险。
 * 设计文档 4.1: "先用现有红线扫描器规则 + LLM 双保险"。
 * 关键词命中不依赖模型，LLM 漏报时兜底。
 */

const PATTERNS: Array<{
  re: RegExp;
  type: RiskFlag["type"];
  severity: RiskFlag["severity"];
  label: string;
}> = [
  { re: /保本|保证收益|稳赚|稳赢|无风险(?!偏好)|包赚|躺赚/i, type: "exaggeration", severity: "high", label: "承诺性表述" },
  { re: /翻倍|十倍|年化\s*\d+\s*%/i, type: "exaggeration", severity: "medium", label: "收益暗示" },
  { re: /内幕|老鼠仓|代持|避税|马甲/i, type: "sensitive", severity: "high", label: "敏感词" },
  { re: /建议直接批准|直接通过入会|确认批准/i, type: "overreach", severity: "medium", label: "替人下准入结论" },
];

export function scanReportText(sections: Record<string, string>): RiskFlag[] {
  const flags: RiskFlag[] = [];
  for (const [section, text] of Object.entries(sections)) {
    if (typeof text !== "string") continue;
    for (const p of PATTERNS) {
      const m = text.match(p.re);
      if (m) {
        flags.push({
          section,
          type: p.type,
          severity: p.severity,
          detail: `规则扫描命中「${m[0]}」(${p.label})`,
        });
      }
    }
  }
  return flags;
}

/** 规则 flags 与 LLM flags 合并去重 (同 section+type 只保留一个) */
export function mergeFlags(a: RiskFlag[], b: RiskFlag[]): RiskFlag[] {
  const seen = new Set<string>();
  const out: RiskFlag[] = [];
  for (const f of [...a, ...b]) {
    const key = `${f.section}|${f.type}|${f.detail.slice(0, 24)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}