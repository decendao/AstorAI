import { SectionMark } from "@/components/ui/Editorial";

const CAPS = [
  {
    k: "A · Diagnosis",
    t: "财富诊断",
    p: (
      <>
        五维画像：<em className="em-gold">alpha 偏好 / 资源贡献 / 人脉位置 / 风险姿态 / 服务期望</em>
        。把模糊的"资产状况"变成清晰、可审计的诊断报告。
      </>
    ),
  },
  {
    k: "B · Overview",
    t: "全景统筹",
    p: (
      <>
        把分散的账户、负债、家族目标放进<em className="em-gold">同一张图</em>。
        <b className="text-paper font-medium">不连接账户，不碰资金</b>，只做信息整理与视野统筹。
      </>
    ),
  },
  {
    k: "C · Companion",
    t: "陪伴型银行家",
    p: (
      <>
        季度复诊 + 对话飞轮。像私行家一样<em className="em-gold">持续在场</em>，但不推销任何产品。
        每次对话产生画像增量，<em className="em-gold">增量经人工审批后生效</em>。
      </>
    ),
  },
];

const NOTES = ["不推荐具体标的", "不执行交易", "不承诺收益", "不代客理财"];

const AUDIT = [
  { k: "01 · Dual Gate", t: "AI 草稿 / 人工审批双闸门", d: "AI 只出 DRAFT，人批准才生效。每一次结论发布前，都有人类签字。" },
  { k: "02 · Append Only", t: "只追加审计", d: "审计事件在数据库层物理禁改，只允许新增。历史无法被覆盖，也无法被抹去。" },
  { k: "03 · Versioned", t: "Prompt 版本化", d: "每次 LLM 调用留痕 —— 模型、tokens、成本、prompt 版本。每一个结论都能追到具体的那一次调用。" },
  { k: "04 · Self Hosted", t: "数据 100% 自持", d: "PII AES-256-GCM 加密 + 盲索引，境内备案模型白名单直连。你的数据不出我们的系统。" },
  { k: "05 · Red Line", t: "31 条合规红线扫描", d: "承诺性话术物理拦截，Reviewer 层自动执行。这不是免责声明，是我们产品的一部分。" },
];

/**
 * lead: 本页第一个区块时为 true —— 顶部用 pt 避开 fixed header,
 * 且不再叠一层外层"页面头"。详见 Manifesto 组件的同名 prop 注释。
 */
export function CapabilitySection({ lead = false }: { lead?: boolean }) {
  return (
    <section
      id="capability"
      className={
        lead
          ? "relative z-10 hair-t pt-28 sm:pt-36 pb-[clamp(40px,5vw,72px)]"
          : "relative z-10 hair-t py-[clamp(110px,15vh,190px)]"
      }
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="Agent" cn="AI 智能体" n="02" />

        {lead && (
          <>
            <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-5 sm:mb-6 text-[clamp(28px,5.4vw,60px)] max-w-[18ch]">
              AI 出草稿，
              <br />
              <em className="em-gold">人批准</em>才算数。
            </h1>
            <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch] mb-[clamp(28px,4vw,48px)]">
              每一段输出都是 DRAFT。发布前必须过 Reviewer 与人工审批闸门 —— 这是我们和"自动理财"之间最硬的一道线。
            </p>
          </>
        )}

        <h2 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-[clamp(44px,6vw,80px)] text-[clamp(28px,5.4vw,60px)]">
          三件事，
          <br />
          每一件都<em className="em-gold">做到底</em>
        </h2>

        <div className="hair-t grid md:grid-cols-3">
          {CAPS.map((c) => (
            <div
              key={c.k}
              className="hair-b py-[clamp(34px,4.5vw,56px)] px-5 md:px-8 md:hair-r hover:bg-gold-500/[0.03] transition-colors duration-300"
            >
              <div className="font-display italic text-[12.5px] tracking-[0.22em] text-gold-500 mb-5">
                {c.k}
              </div>
              <h3 className="font-normal text-[clamp(17px,2.2vw,24px)] text-paper leading-[1.45] mb-4">
                {c.t}
              </h3>
              <p className="text-[clamp(14px,1.7vw,16px)] leading-[1.95] text-paper/40">{c.p}</p>
            </div>
          ))}
        </div>

        {/* what we don't do */}
        <div className="mt-[clamp(60px,8vw,110px)]">
          <SectionMark en="What We Don't Do" cn="不做什么" n="06" />
          <h3 className="font-normal text-paper mb-6 tracking-[-0.005em] text-[clamp(20px,2.8vw,32px)]">
            这四条，是我们的<em className="em-gold">边界</em>
          </h3>
          <div className="hair-t">
            {NOTES.map((x) => (
              <div key={x} className="hair-b flex items-center gap-4 sm:gap-5 py-4 sm:py-5 px-1">
                <span className="font-display text-[19px] text-paper/20 w-5 text-center leading-none">
                  ×
                </span>
                <span className="text-[clamp(15px,1.8vw,18px)] text-paper/25">{x}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuditSection() {
  return (
    <section id="audit" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="Trust" cn="信任，来自可审计" n="07" />

        <h2 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-[clamp(44px,6vw,80px)] text-[clamp(28px,5.4vw,60px)]">
          在 AI 管钱这件事上，
          <br />
          <em className="em-gold">敢信</em>比<em className="em-gold">聪明</em>值钱十倍
        </h2>

        <div className="hair-t grid md:grid-cols-2">
          {AUDIT.map((a, i) => (
            <div
              key={a.k}
              className={`hair-b py-[clamp(26px,3.6vw,44px)] px-5 sm:px-9 hover:bg-gold-500/[0.03] transition-colors duration-300 ${
                i % 2 === 0 ? "md:hair-r" : ""
              } ${i === AUDIT.length - 1 ? "md:col-span-2" : ""}`}
            >
              <div className="font-display italic text-[12.5px] tracking-[0.22em] text-gold-500 mb-3.5">
                {a.k}
              </div>
              <div className="text-[clamp(16px,2vw,21px)] text-paper font-normal leading-[1.45] mb-2.5">
                {a.t}
              </div>
              <div className="text-[clamp(13.5px,1.6vw,15.5px)] leading-[1.9] text-paper/40">
                {a.d}
              </div>
            </div>
          ))}
        </div>

        {/* 100 / 0 */}
        <div className="hair-t hair-b grid lg:grid-cols-[1fr_auto_1fr] max-w-[1000px] mx-auto mt-[clamp(56px,8vw,100px)]">
          <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-10 text-center">
            <div className="font-display font-normal leading-none mb-4 sm:mb-5 tracking-[-0.02em] text-[clamp(52px,11vw,140px)] text-gold-500">
              100%
            </div>
            <div className="text-[12px] sm:text-[14px] tracking-[0.2em] text-gold-500 leading-[2]">
              收入来自
              <br />
              服务订阅费
            </div>
          </div>
          <div className="flex items-center justify-center py-6 lg:py-0 px-5 sm:px-8 hair-x font-display italic text-[clamp(12.5px,1.6vw,15px)] tracking-[0.16em] lg:writing-v text-gold-500 text-center leading-[1.8]">
            不是道德承诺
            <br />
            是制度设计
          </div>
          <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-10 text-center">
            <div className="font-display font-normal leading-none mb-4 sm:mb-5 tracking-[-0.03em] text-[clamp(52px,11vw,140px)] text-paper/[0.13]">
              0%
            </div>
            <div className="text-[12px] sm:text-[14px] tracking-[0.2em] text-paper/20 leading-[2]">
              来自产品
              <br />
              抽成与分佣
            </div>
          </div>
        </div>

        <p className="text-[clamp(19px,2.3vw,27px)] leading-[1.88] text-paper text-center max-w-[76ch] mx-auto mt-[clamp(30px,4vw,46px)]">
          主体是咨询公司，牌照上就<em className="em-gold">不能</em>做分销 ——
          <br />
          所以「不推荐产品」<em className="em-gold">不需要靠自律维持</em>。
        </p>
      </div>
    </section>
  );
}
