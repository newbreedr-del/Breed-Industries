/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  env: {
    APP_ENV: process.env.NODE_ENV,
  },
}

module.exports = nextConfig
