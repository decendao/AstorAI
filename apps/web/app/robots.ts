import type { MetadataRoute } from "next";

/**
 * 纯静态资源, 允许在 output: "export" 下被预渲染。
 * (无 dynamic/revalidate 声明时 Next.js 静态导出会直接报错)
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astorai.cn";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}