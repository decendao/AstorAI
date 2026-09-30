import type { Block } from "@/lib/posts";

/**
 * 洞察正文渲染器
 * 把结构化 block 渲染成 editorial 排版，复用 apps/web 现成的发丝线 / 金色斜体体系。
 */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-prose">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h2":
            return (
              <h2
                key={i}
                className="font-normal text-paper leading-[1.5] tracking-[-0.004em] mt-12 sm:mt-16 mb-5 sm:mb-6 text-[clamp(21px,2.9vw,32px)]"
              >
                {b.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                className="font-normal text-paper mt-8 sm:mt-10 mb-4 text-[clamp(17px,2.2vw,22px)]"
              >
                {b.text}
              </h3>
            );

          case "p":
            return (
              <p
                key={i}
                className="text-[clamp(15.5px,1.8vw,18px)] leading-[2.15] text-paper/40 mb-5 sm:mb-6"
              >
                {b.text}
              </p>
            );

          case "pull":
            return (
              <p
                key={i}
                className="pull text-paper my-8 sm:my-10 text-[clamp(17px,2.15vw,25px)] leading-[1.9]"
              >
                {b.text}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="callout my-8 sm:my-10 py-7 sm:py-9 text-[clamp(17px,2.15vw,24px)] leading-[1.85] text-paper"
              >
                {b.text}
              </blockquote>
            );

          case "callout":
            return (
              <div key={i} className="callout my-8 sm:my-10 py-7 sm:py-9">
                {b.k && (
                  <div className="font-display italic text-[12.5px] tracking-[0.22em] text-gold-500 mb-4">
                    {b.k}
                  </div>
                )}
                <p className="text-[clamp(15px,1.8vw,18px)] leading-[2.05] text-paper/50 m-0">
                  {b.text}
                </p>
              </div>
            );

          case "ol":
            return (
              <ol key={i} className="my-6 sm:my-7">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="relative pl-9 sm:pl-10 py-2.5 text-[clamp(15.5px,1.8vw,18px)] leading-[1.95] text-paper/40"
                  >
                    <span className="absolute left-0 top-1 font-display italic text-[14px] text-gold-500">
                      {j + 1}
                    </span>
                    {it}
                  </li>
                ))}
              </ol>
            );

          case "ul":
            return (
              <ul key={i} className="my-6 sm:my-7">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="relative pl-6 py-2.5 text-[clamp(15.5px,1.8vw,18px)] leading-[1.95] text-paper/40"
                  >
                    <span className="absolute left-0 top-[15px] w-[5px] h-[5px] bg-gold-500 rotate-45" />
                    {it}
                  </li>
                ))}
              </ul>
            );

          case "table":
            return (
              <div key={i} className="thin-scroll overflow-x-auto my-8 sm:my-10">
                <table className="w-full min-w-[560px] border-collapse">
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 hair-b text-[11.5px] tracking-[0.1em] text-gold-500 font-normal whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td
                            key={ci}
                            className={`py-3 px-4 hair-b text-[clamp(13.5px,1.55vw,15px)] leading-[1.7] align-top ${
                              ci === 0 ? "text-paper whitespace-nowrap" : "text-paper/40"
                            }`}
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
