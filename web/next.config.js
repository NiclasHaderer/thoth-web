/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://127.0.0.1:8080/api/:path*",
    },
  ],
  output: "standalone",
  distDir: "dist",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
