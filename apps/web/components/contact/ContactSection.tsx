import { SectionMark } from "@/components/ui/Editorial";

/**
 * 联系方式区。
 *
 * ⚠️ 待填: CHANNELS 目前是空数组 —— 项目里至今没有任何邮箱 / 电话 /
 *    微信 / 表单。在填上真实联系方式之前, 这一块渲染为空状态,
 *    不会渲染出坏掉的图标或 "undefined"。
 *
 * 填法: 往 CHANNELS 里加一项即可, 例如
 *   { k: "EMAIL",  v: "hello@astorai.cn", href: "mailto:hello@astorai.cn" }
 *   { k: "WECHAT", v: "astor-ai",           href: "" }   // 留空则纯文本展示
 */
const CHANNELS: { k: string; v: string; href?: string }[] = [];

const BOUNDARY = [
  "不做推荐 —— 不荐股、不推产品",
  "不做交易 —— 不代客理财、不碰资金",
  "不承诺收益 —— 不对任何产品收益作保证",
  "不代客决策 —— 最终判断永远属于你",
];

/**
 * 联系我们 subpage 的主体。
 *
 * 单独成页的原因: 「联系我们」是导航里最容易被点、也最不该点空的入口。
 * 既然还没有联系方式, 就先把运营主体与业务边界讲清楚 ——
 * 这是访问者此刻真正需要知道的信息。
 */
export function ContactSection() {
  return (
    <section id="contact" className="relative z-10 hair-t py-[clamp(110px,15vh,190px)]">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-[1.15fr_1fr] items-start">
          {/* 左: 主体 + 渠道 */}
          <div>
            <SectionMark en="Contact" cn="联系我们" n="04" />

            {/*
              h1 而非 h2: 「联系我们」是导航里最容易被直接点进来的入口,
              作为独立落地页必须有一级标题, 否则整页只有 h2, 语义层级断层。
            */}
            <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.2] mb-6 sm:mb-7 text-[clamp(26px,4.6vw,46px)] max-w-[16ch]">
              来信我们，
              <br />
              哪怕只是<em className="em-gold">想先聊聊</em>。
            </h1>

            <p className="text-[15px] sm:text-[17px] leading-[2] text-paper/40 max-w-[46ch] mb-9 sm:mb-11">
              不推销、不催促。如果你只是想找个人聊聊自己的资产结构，
              我们同样欢迎。
            </p>

            {CHANNELS.length > 0 ? (
              <dl className="hair-t pt-7 sm:pt-9 grid gap-6 sm:gap-7">
                {CHANNELS.map((c) => (
                  <div key={c.k}>
                    <dt className="text-[11.5px] tracking-[0.22em] text-gold-500 mb-2">
                      {c.k}
                    </dt>
                    <dd className="text-[16px] sm:text-[19px] text-paper/80 leading-[1.7]">
                      {c.href ? (
                        <a
                          href={c.href}
                          className="hover:text-gold-300 transition-colors border-b border-gold-500/25 hover:border-gold-500/60"
                        >
                          {c.v}
                        </a>
                      ) : (
                        c.v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              // 空状态: 说实话, 不编造联系方式, 也不摆一个坏掉的图标。
              <div className="hair-t hair-b py-7">
                <div className="text-[11.5px] tracking-[0.22em] text-paper/20 mb-3">
                  CHANNEL OPENING SOON
                </div>
                <p className="text-[15px] leading-[1.95] text-paper/35 max-w-[42ch]">
                  正式联系渠道正在开通。期间可先浏览
                  <a href="/insights" className="text-gold-300 hover:text-gold-200 transition-colors">
                    洞察文章
                  </a>
                  ，或直接
                  <a href="/match" className="text-gold-300 hover:text-gold-200 transition-colors">
                    做一次免费诊断
                  </a>
                  。
                </p>
              </div>
            )}
          </div>

          {/* 右: 运营主体 + 业务边界 */}
          <div className="hair-t pt-9 lg:pt-0 lg:border-t-0">
            <div className="text-[11.5px] tracking-[0.22em] text-gold-500 mb-5">
              OPERATOR
            </div>
            <div className="text-[15px] leading-[2.1] text-paper/60 mb-10">
              AstorAI 财富智能体
              <br />
              3A Investors Alliance
              <br />
              上海 · 始于 2026
            </div>

            <div className="text-[11.5px] tracking-[0.22em] text-gold-500 mb-5">
              BOUNDARY
            </div>
            <ul className="text-[14.5px] leading-[2.1] text-paper/35">
              {BOUNDARY.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="text-gold-500/50 select-none">—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
