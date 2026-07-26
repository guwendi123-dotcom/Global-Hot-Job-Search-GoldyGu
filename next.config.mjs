/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Next.js route tracing inside this project. A legacy lockfile in the
  // user directory otherwise makes dynamic company/job routes resolve against
  // the wrong application root when building for Cloudflare.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
