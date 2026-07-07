import { setupHooks } from "@cloudflare/next-on-pages/hooks";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 支持
  experimental: {
    cloudflare: {
      proxyFunctions: true,
    },
  },
  // 静态导出配置（可选，如果不需要动态 API 可以启用）
  // output: 'export',
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;

// 如果需要使用 Cloudflare 的 hooks
setupHooks(nextConfig);