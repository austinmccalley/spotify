/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.scdn.co'],
  },
  webpack: (config, options) => {
    return {
      ...config,
      experiments: {
        ...config.experiments,
        asyncWebAssembly: true,
      }
    }
  },
};

module.exports = nextConfig;
