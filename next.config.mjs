/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  // Include assets directory in Vercel deployments for font loading
  outputFileTracingIncludes: {
    '/recent': ['./assets/**/*'],
    '/repo': ['./assets/**/*'],
    '/top': ['./assets/**/*'],
    '/user': ['./assets/**/*'],
    '/wakatime': ['./assets/**/*'],
  },
};

export default nextConfig;
