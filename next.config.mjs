/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.glsl/,
      exclude: /node_modules/,
      type: "asset/source",
    });
    return config;
  },

}

export default nextConfig;
