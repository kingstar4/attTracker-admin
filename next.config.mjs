/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [], // Add any external image domains you need
  },
  // Avoid file-watch feedback loops in dev by using the default `.next` dir.
  // Use the custom export options only for production builds.
  ...(isProd ? { output: "export", trailingSlash: true, distDir: "dist" } : {}),
};

export default nextConfig;
