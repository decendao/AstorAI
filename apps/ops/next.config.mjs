/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@astorai/api-types", "@astorai/compliance", "@astorai/utils"],
  experimental: { typedRoutes: true },
};
export default nextConfig;