/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  // Disable image optimization - we use native SVG from API routes
  images: {
    unoptimized: true,
  },
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
