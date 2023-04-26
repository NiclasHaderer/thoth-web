/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: "export",
  distDir: "dist",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
