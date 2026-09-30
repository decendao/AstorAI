import { SectionMark } from "@/components/ui/Editorial";

/**
 * lead: 该区块是否为本页第一个区块。
 *
 * 之前每个 subpage 都在组件外面套一层"页面头" (标题 + 副标题)，
 * 而组件自己又带 SectionMark 和大标题 —— 两层标题重复，且中间
 * 叠了 pb(110px) + py(190px) 近 300px 空白。点导航进来先撞见一个
 * 光秃秃的标题页头，要再滚一段才见正文。
 *
 * 现在: 去掉外层页面头, 由首个组件用 lead 领衔 —— 标题与正文
 * 连成一篇 (这本来就是这份文案的形态), 顶部用 pt 避开 fixed header。
 */
export function Manifesto({ lead = false }: { lead?: boolean }) {
  return (
    <section
      id="manifesto"
      className={
        lead
          ? "relative z-10 hair-t pt-28 sm:pt-36 pb-[clamp(40px,5vw,72px)]"
          : "relative z-10 hair-t py-[clamp(110px,15vh,190px)]"
      }
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <SectionMark en="Manifesto" cn="Astor AI 愿景哲学" n="01" />

        {lead && (
          <>
            <h1 className="font-bold tracking-[-0.012em] text-paper leading-[1.16] mb-5 sm:mb-6 text-[clamp(28px,5.4vw,60px)]">
              关于 AstorAI
            </h1>
            <p className="text-[15px] sm:text-[18px] leading-[2] text-paper/40 max-w-[54ch] mb-[clamp(28px,4vw,48px)]">
              比你更懂你的资产的财富智能体。
            </p>
          </>
        )}

        <div className="max-w-prose">
          <p className="font-bold tracking-[-0.01em] text-paper leading-[1.82] mb-[clamp(30px,4vw,48px)] text-[clamp(20px,2.8vw,34px)]">
            几十年来，最好的金融指引，
            <br />
            始终留给<em className="em-gold">最不需要它</em>的人。
          </p>

          <p className="text-[15px] sm:text-[18.5px] leading-[2.15] text-paper/40 mb-5 sm:mb-6">
            这些服务一直存在 —— 藏在七位数起步的门槛，和百分之一的费率背后。
            如果你尚未富有，大门紧闭。
          </p>

          <p className="text-[15px] sm:text-[18.5px] leading-[2.15] text-paper/40 mb-5 sm:mb-6">
            与此同时，高净值投资者也只能独自摸索。独自在复杂的资产结构里寻找方向。
            独自面对市场波动时，每一个本能都在尖叫"卖出"的时刻。
          </p>

          <p className="pull text-[clamp(17px,2.15vw,25px)] leading-[1.9] text-paper my-[clamp(30px,4vw,48px)]">
            这个行业给了你更多的产品货架，并称之为"专业"。
            <br />
            但一个产品货架的访问权，
            <em className="em-gold">并不等于理解的访问权</em>。
          </p>

          <p className="text-[15px] sm:text-[18.5px] leading-[2.15] text-paper/40 mb-5 sm:mb-6">
            AI 改变了这一切。第一次，个性化诊断可以规模化运作。
            一位家族办公室对亿万级资产负债表所用的同等深度的分析，
            如今可以持续地、私密地、<em className="em-gold">不带任何议程地</em>交付给每一位严肃的投资者。
          </p>

          <p className="text-[clamp(18px,2.3vw,27px)] leading-[1.88] text-gold-500">
            这就是 AstorAI 所做的。
            <br />
            <br />
            不是套了金融外壳的聊天机器人。一个真正的私人银行家智能体，
            理解资产背后的人，用平实的语言告诉你<em>什么才真正重要</em>。
          </p>

          {/*
            Manifesto 收尾三句 —— 独立成块, 因为这是整篇的落点:
            从"我们是什么"退回"我们不做什么", 再收到"为什么值得做"。
            放在金色段落之后, 用 hair-b 收边, 视觉上把长文收住。
          */}
          <div className="hair-t hair-b mt-[clamp(34px,5vw,64px)] pt-[clamp(26px,3.5vw,44px)]">
            <p className="font-bold tracking-[-0.01em] text-paper leading-[1.75] mb-6 text-[clamp(19px,2.5vw,30px)]">
              我们不是来交易你的资产。
              <br />
              我们在这里帮你<em className="em-gold">透过资产理解自己</em>。
            </p>

            <p className="text-[16px] sm:text-[20px] leading-[2.05] text-paper/45 max-w-[46ch]">
              因为自我认知会复利。
              <br />
              而每一位严肃的投资者，
              <br />
              都值得一面<em className="em-gold">诚实的镜子</em>。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
