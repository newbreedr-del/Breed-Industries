/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  env: {
    APP_ENV: process.env.NODE_ENV,
  },
  serverExternalPackages: ['@sparticuz/chrome-aws-lambda', 'puppeteer-core', 'puppeteer'],
  turbopack: {
    root: __dirname,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const originalExternals = Array.isArray(config.externals)
        ? config.externals
        : [config.externals].filter(Boolean);

      config.externals = [
        function ({ request }, callback) {
          if (request === '@sparticuz/chrome-aws-lambda') {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
        ...originalExternals,
      ];
    }

    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@sparticuz/chrome-aws-lambda': false,
      };
    }

    return config;
  },
}

module.exports = nextConfig
