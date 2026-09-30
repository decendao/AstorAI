"use client";

import { useState } from "react";
import {
  SURVEY_QUESTIONS,
  type QuestionId,
  type SurveyAnswers,
} from "@/lib/survey-questions";
import { computeProfile } from "@/lib/scoring";
import { ReportPanel } from "@/components/report/ReportPanel";
import { SectionMark, Btn } from "@/components/ui/Editorial";

type Answers = Record<QuestionId, string[]>;
const EMPTY: Answers = { q1: [], q2: [], q3: [], q4: [], q5: [], q6: [] };

/**
 * lead: 本页第一个区块时为 true —— 顶部用 pt 避开 fixed header,
 * 且不再叠一层外层"页面头"。详见 Manifesto 组件的同名 prop 注释。
 */
export function SurveyFlow({ lead = false }: { lead?: boolean }) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<Answers>(EMPTY);
  const [free, setFree] = useState("");
  const [report, setReport] = useState<ReturnType<typeof computeProfile> | null>(null);

  const q = SURVEY_QUESTIONS[idx];
  const done = report !== null;

  function pick(v: string) {
    if (q.multi) {
      setAns((a) => {
        const cur = a[q.id];
        return { ...a, [q.id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
      });
    } else {
      setAns((a) => ({ ...a, [q.id]: [v] }));
      setTimeout(next, 240);
    }
  }

  function next() {
    if (q.text) {
      if (idx < SURVEY_QUESTIONS.length - 1) {
        setIdx(idx + 1);
      } else {
        finish();
      }
      return;
    }
    if (ans[q.id].length === 0) return;
    if (idx < SURVEY_QUESTIONS.length - 1) setIdx(idx + 1);
    else finish();
  }

  function back() {
    setIdx(Math.max(0, idx - 1));
  }

  function finish() {
    const payload = { ...ans, q6_text: free };
    setReport(computeProfile(payload));
  }

  function reset() {
    setReport(null);
    setStarted(false);
    setIdx(0);
    setAns(EMPTY);
    setFree("");
  }

  if (done && report) {
    return (
      <div
        id="diagnose"
        className={
          lead
            ? "relative z-10 hair-t pt-28 sm:pt-36 pb-[clamp(40px,5vw,72px)]"
            : "relative z-10 hair-t py-[clamp(110px,15vh,190px)]"
        }
      >
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <SectionMark en="Initial Report" cn="初级诊断报告" n="GEN" />
          <ReportPanel profile={report} onReset={reset} />
        </div>
      </div>
    );
  }

  return (
    <section
      id="diagnose"
      className={
        lead
          ? "relative z-10 hair-t pt-28 sm:pt-36 pb-[clamp(40px,5vw,72px)]"
          : "relative z-10 hair-t py-[clamp(110px,15vh,190px)]"
      }
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="Match" cn="匹配你的 Astor" n="03" />

        {lead && (
          <>
            <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-5 sm:mb-6 text-[clamp(28px,5.4vw,60px)] max-w-[18ch]">
              先认识自己，
              <br />
              再谈<em className="em-gold">资产配置</em>。
            </h1>
            <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch] mb-[clamp(28px,4vw,48px)]">
              6 道题 · 约 2 分钟 · 无需注册。全部在浏览器本地计算，不上传你的任何答案。
            </p>
          </>
        )}

        <h2 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-[clamp(20px,3vw,32px)] text-[clamp(28px,5.4vw,60px)]">
          先看看，
          <br />
          你到底<em className="em-gold">处在什么位置</em>
        </h2>
        <p className="text-[15px] sm:text-[19px] leading-[2.05] text-paper/40 max-w-[52ch] mb-[clamp(48px,7vw,86px)]">
          多数高收入家庭的资产状况，从未被系统看过一次。
          <br />
          6 道题，2 分钟 —— 包括你最该先处理的那一件事。
        </p>

        {!started ? (
          <div className="hair-t hair-b max-w-[820px] mx-auto py-[clamp(50px,8vw,100px)] px-6 sm:px-14 text-center">
            <div className="font-display text-[clamp(52px,9vw,96px)] leading-none text-gold-500 mb-6 sm:mb-9 animate-pulse-soft">
              ◎
            </div>
            <h3 className="text-[clamp(20px,3vw,30px)] text-paper font-normal mb-4 sm:mb-6">
              你的第一次资产体检
            </h3>
            <p className="text-[15px] sm:text-[19px] leading-[1.8] text-paper/40 max-w-[52ch] mx-auto mb-7 sm:mb-9">
              6 道题，覆盖{" "}
              <em className="em-gold">Alpha 偏好 / 资源贡献 / 人脉位置 / 风险姿态 / 服务期望</em> 五个维度。
            </p>
            <button
              onClick={() => setStarted(true)}
              className="btn-line btn-line-solid px-9 sm:px-10 py-4 sm:py-[18px] text-[13px] sm:text-[15px] min-h-[52px]"
            >
              <span className="relative z-[2]">开始诊断</span>
            </button>
            <div className="mt-5 text-[12px] tracking-[0.04em] text-paper/20">
              无需注册 · 不收集身份信息 · 报告不会被转发
            </div>
          </div>
        ) : (
          <div className="max-w-[820px] mx-auto">
            {/* progress */}
            <div className="flex items-center justify-between gap-5 pb-4 hair-b mb-[clamp(34px,5vw,56px)]">
              <span className="font-display italic text-[13px] tracking-[0.2em] text-paper/25 whitespace-nowrap">
                QUESTION {q.n}
              </span>
              <div className="flex-1 min-w-[60px] flex gap-1">
                {SURVEY_QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 h-px transition-colors duration-500 ${
                      i <= idx ? "bg-gold-500" : "bg-gold-500/20"
                    }`}
                  />
                ))}
              </div>
              <span className="font-display italic text-[13px] tracking-[0.2em] text-paper/25 whitespace-nowrap">
                {String(idx + 1).padStart(2, "0")} / 06
              </span>
            </div>

            <div className="min-h-[440px] flex flex-col">
              <div className="font-display italic text-[clamp(26px,4.4vw,44px)] leading-none text-gold-500 tracking-[0.06em] mb-5 sm:mb-7">
                {q.n}
              </div>
              <h3 className="font-normal tracking-[-0.005em] text-paper leading-[1.5] mb-3 text-[clamp(21px,3.4vw,34px)]">
                {q.title}
              </h3>
              <div className="text-[13px] sm:text-[15px] text-paper/25 mb-7 sm:mb-11">
                {q.subtitle}
                {q.multi && <span className="ml-2">（可多选）</span>}
              </div>

              {q.text ? (
                <textarea
                  value={free}
                  onChange={(e) => setFree(e.target.value)}
                  placeholder={q.placeholder}
                  rows={5}
                  className="w-full bg-transparent border-b border-gold-500/30 text-paper text-[16px] sm:text-[20px] leading-[1.85] py-3.5 px-0.5 resize-none outline-none focus:border-gold-500 min-h-[170px] placeholder:text-paper/20 placeholder:italic placeholder:font-display"
                />
              ) : (
                <div className="hair-t">
                  {q.options?.map((o) => {
                    const on = ans[q.id].includes(o.value);
                    return (
                      <button
                        key={o.value}
                        onClick={() => pick(o.value)}
                        className={`hair-b w-full text-left flex items-center gap-4 sm:gap-5 py-4 sm:py-5 px-1 min-h-[56px] sm:min-h-[60px] transition-all duration-300 ${
                          on ? "text-gold-300 pl-4 sm:pl-[18px]" : "text-paper/40 hover:text-paper hover:pl-4 sm:hover:pl-[18px]"
                        }`}
                      >
                        <span
                          className={`w-[15px] h-[15px] shrink-0 relative border transition-all duration-300 ${
                            q.multi ? "rounded-[2px]" : "rounded-full"
                          } ${on ? "border-gold-500 shadow-[0_0_0_4px_rgba(184,149,106,0.1)]" : "border-gold-500/30"}`}
                        >
                          <span
                            className={`absolute inset-[3px] bg-gold-500 transition-transform duration-300 ${
                              q.multi ? "rounded-[1px]" : "rounded-full"
                            } ${on ? "scale-100" : "scale-0"}`}
                          />
                        </span>
                        <span className="text-[15px] sm:text-[18px] leading-[1.6]">{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="hair-t mt-[clamp(30px,4vw,48px)] pt-[clamp(20px,3vw,30px)] flex items-center justify-between gap-4 flex-wrap">
                <button
                  onClick={back}
                  className="text-[12px] tracking-[0.12em] text-paper/25 hover:text-gold-300 transition-colors min-h-[40px] px-1"
                >
                  {idx > 0 ? "上一题" : "返回"}
                </button>
                {!q.text && ans[q.id].length > 0 && q.multi && (
                  <span className="text-[12px] tracking-[0.12em] text-paper/20">
                    {ans[q.id].length} 项已选
                  </span>
                )}
                <button
                  onClick={next}
                  className="btn-line px-6 py-2.5 text-[12px] min-h-[42px]"
                >
                  <span className="relative z-[2]">
                    {idx === SURVEY_QUESTIONS.length - 1 ? "完成诊断" : "下一题"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
