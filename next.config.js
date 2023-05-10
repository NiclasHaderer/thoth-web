const isProduction = process.env.NODE_ENV === "production"

/** @type {import('next').NextConfig} */
const devOptions = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://127.0.0.1:8080/api/:path*",
    },
  ],
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: isProduction ? "export" : "standalone",
  ...(!isProduction && devOptions),
  distDir: "dist",
}

module.exports = nextConfig
