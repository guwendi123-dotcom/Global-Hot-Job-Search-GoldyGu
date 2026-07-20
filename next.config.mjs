/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep server trace collection inside this repository. The old repository
  // lived at the user home directory, where Next.js could otherwise infer an
  // overly broad workspace root from the legacy package-lock.json.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
