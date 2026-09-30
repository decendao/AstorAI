export function SiteFooter() {
  const cols = [
    { k: "PRODUCT", l: ["免费诊断", "财富诊断", "全景统筹", "陪伴服务"] },
    { k: "ALLIANCE", l: ["3A 投资者联盟", "闭门议题局", "闭门私享会", "L2 邀请申请"] },
    { k: "BOUNDARY", l: ["不荐股", "不交易", "不承诺收益", "不代客理财"] },
  ];

  return (
    <footer className="hair-t relative z-10">
      <div className="mx-auto max-w-shell px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid gap-8 sm:gap-12 grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
          <div>
            <div className="font-display text-[22px] tracking-[0.1em] text-gold-500 mb-3">
              AAA
            </div>
            <div className="text-[13.5px] leading-[2.1] text-paper/25">
              AstorAI 财富智能体
              <br />
              3A Investors Alliance
              <br />
              Est. MMXXVI · Shanghai
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.k}>
              <div className="text-[11.5px] tracking-[0.22em] text-gold-500 mb-4">
                {c.k}
              </div>
              <div className="text-[13.5px] leading-[2.1] text-paper/25">
                {c.l.map((x) => (
                  <div key={x}>{x}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hair-t pt-7 sm:pt-9 text-[11.5px] leading-[2] text-paper/[0.22]">
          <div className="block text-paper/35 tracking-[0.22em] mb-3">DISCLAIMER</div>
          AstorAI 为信息咨询与投资者教育服务提供方，运营主体不具备任何证券投资咨询、基金销售、资产管理等业务资质。本网站所载内容均为研究观点与一般性信息，不构成投资建议、要约或承诺，不构成对任何产品收益的保证。
          <br />
          <br />
          任何涉及投资决策的判断，请咨询具备相应资质的持牌机构。任何投资行为前，请充分了解相关产品的风险特征，并根据自身风险承受能力审慎决策。市场有风险，投资需谨慎。
        </div>
      </div>
    </footer>
  );
}
