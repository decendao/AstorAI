import { SectionMark, Btn } from "@/components/ui/Editorial";

const L1 = [
  { t: "五维画像", d: "认知 / 资源 / 圈层 / 风险 / 服务" },
  { t: "标准化研究输出", d: "宏观、行业、配置框架" },
  { t: "条款深度解读", d: "上传说明书，输出结构与风险点" },
  { t: "每日早报", d: "与你的持仓逻辑关联" },
  { t: "联盟社区", d: "讨论、提问、同频交流" },
  { t: "公开议题局名额", d: "定期开放部分席位" },
];

const L2 = [
  { t: "L1 全部权益", d: "不限次数的深度对话与研究", hi: false },
  { t: "季度深度复诊", d: "重新校准画像与配置思路", hi: false },
  { t: "闭门议题局", d: "每月一场，仅限受邀，不公开录播", hi: false },
  { t: "闭门私享会", d: "与同量级参与者的深度交流", hi: false },
  { t: "专业资源优先对接", d: "律师 / 税务师（仅信息引荐）", hi: false },
  { t: "前沿议题参与权", d: "国际智库与头部投资机构闭门交流", hi: true },
  { t: "跨境与全球视角", d: "海外资产与身份议题专门场", hi: true },
];

function Plan({
  tag,
  name,
  price,
  sub,
  feats,
  cta,
  hot,
}: {
  tag: string;
  name: string;
  price: string;
  sub: string;
  feats: { t: string; d: string; hi?: boolean }[];
  cta: string;
  hot?: boolean;
}) {
  return (
    <div className={`pt-[clamp(30px,4vw,48px)] ${hot ? "border-t border-gold-500" : "border-t border-hair"}`}>
      <div className={`font-display italic text-[12.5px] tracking-[0.22em] mb-4 ${hot ? "text-gold-500" : "text-paper/25"}`}>
        {tag}
      </div>
      <div className="text-[clamp(21px,2.8vw,30px)] text-paper font-normal mb-[clamp(20px,2.5vw,28px)]">
        {name}
      </div>
      <div className="flex items-baseline gap-2 mb-2.5">
        <span className="font-display font-normal text-[clamp(46px,8vw,88px)] leading-none text-gold-500 tracking-[-0.02em]">
          {price}
        </span>
        <span className="text-[13px] tracking-[0.08em] text-paper/25">/ 月</span>
      </div>
      <div className="text-[13.5px] leading-[1.8] text-paper/25 pb-[clamp(22px,3vw,30px)] hair-b mb-[clamp(22px,3vw,30px)]">
        {sub}
      </div>
      <div className="mb-[clamp(26px,3.5vw,36px)]">
        {feats.map((f) => (
          <div
            key={f.t}
            className="hair-b py-3 pl-6 relative text-[clamp(14px,1.7vw,16px)] leading-[1.75] text-paper/40"
          >
            <span className="absolute left-0 top-[19px] w-[5px] h-[5px] bg-gold-500 rotate-45" />
            <span className={f.hi ? "text-gold-500 font-medium" : "text-paper font-medium"}>
              {f.t}
            </span>{" "}
            — {f.d}
          </div>
        ))}
      </div>
      {/* 绝对路径：问卷在 /match 页（#diagnose 锚点在此），本页无此锚点 */}
      <Btn href={hot ? "/contact" : "/match#diagnose"} solid={hot} className="w-full">
        {cta}
      </Btn>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="Pricing" cn="两级订阅" n="08" />

        <h2 className="font-bold tracking-[-0.012em] text-paper leading-[1.14] mb-[clamp(48px,7vw,90px)] text-[clamp(28px,5.4vw,60px)]">
          想系统提升认知的人，
          <br />
          应该能<em className="em-gold">轻松进来</em>。
          <br />
          需要圈层的人，应当拿到<em className="em-gold">真正稀缺</em>的入口。
        </h2>

        <div className="grid md:grid-cols-2 gap-[clamp(30px,4vw,48px)] max-w-[1080px] mx-auto">
          <Plan tag="L1 · 开放申请" name="会员" price="¥100" sub="零资产门槛，无最低消费，随时可停" feats={L1} cta="免费诊断 →" />
          <Plan tag="L2 · 邀请制" name="核心会员" price="¥1,000" sub="可投资资产 600 万以上 · 需身份与资质审核" feats={L2} cta="申请 L2 资格" hot />
        </div>

        {/* boundary */}
        <div className="border-y border-gold-500/30 max-w-[900px] mx-auto mt-[clamp(40px,6vw,70px)] py-[clamp(28px,4vw,44px)] text-center">
          <div className="font-display italic text-[12.5px] tracking-[0.22em] text-gold-500 mb-5">
            Service Boundary · 服务边界
          </div>
          <p className="text-[clamp(14px,1.7vw,16.5px)] leading-[2.05] text-paper/40 max-w-[76ch] mx-auto">
            AstorAI 定位为<b className="text-paper font-medium">投资者画像诊断与圈层信息服务</b>，不构成投资建议，
            不涉及产品分销、代客理财与资产管理。
            <br />
            任何投资决策请咨询具备相应资质的持牌机构。
          </p>
        </div>

        {/* insights entry */}
        <div className="mt-[clamp(60px,8vw,100px)]">
          <SectionMark en="Insights" cn="洞察" n="READ" />
          <h3 className="font-normal text-paper mb-6 tracking-[-0.005em] text-[clamp(20px,2.8vw,32px)]">
            我们不写市场点评，
            <br />
            只写那些<em className="em-gold">需要想清楚</em>才能回答的问题。
          </h3>
          <Btn href="/insights" lg className="mb-[clamp(40px,5vw,60px)]">
            阅读全部洞察 →
          </Btn>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section id="cta" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="max-w-[840px] mx-auto text-center py-[clamp(50px,8vw,110px)]">
          <div className="font-display text-[clamp(48px,8vw,88px)] leading-none text-gold-500 mb-7 sm:mb-8">
            ◎
          </div>
          <h2 className="font-bold tracking-[-0.012em] text-paper leading-[1.2] mb-6 sm:mb-7 text-[clamp(28px,5.4vw,60px)]">
            先诊断，<em className="em-gold">再配置</em>
          </h2>
          <p className="text-[clamp(15px,1.8vw,19px)] leading-[1.95] text-paper/40 max-w-[52ch] mx-auto mb-8 sm:mb-10">
            因为自我认知会复利。
            <br />
            而每一位严肃的投资者，都值得一面诚实的镜子。
          </p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <Btn href="/match" solid lg>
              免费获取我的财富诊断
            </Btn>
            <Btn href="/agent" lg>
              了解 AstorAI 如何工作
            </Btn>
          </div>
          <div className="mt-5 text-[12px] tracking-[0.04em] text-paper/20">
            7 天试用不绑定支付方式 · 随时可停
          </div>
        </div>
      </div>
    </section>
  );
}
