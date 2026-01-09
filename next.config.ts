import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'potrace'];
    return config;
  }
};

export default nextConfig;
