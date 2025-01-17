/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.externals.push((context, request, callback) => {
      if (/@oaklean/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    });
    config.devtool = "source-map";
    return config;
  },
};

export default nextConfig;
