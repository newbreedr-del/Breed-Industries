/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  env: {
    APP_ENV: process.env.NODE_ENV,
  },
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
