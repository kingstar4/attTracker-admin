/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

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
<<<<<<< HEAD
};
=======
  // Avoid file-watch feedback loops in dev by using the default `.next` dir.
  // Use the custom export options only for production builds.
  ...(isProd
    ? { output: 'export', trailingSlash: true, distDir: 'dist' }
    : {}),
}
>>>>>>> 27b1654c0b7638702363ce27036efb1ee4b7161a

export default nextConfig;
