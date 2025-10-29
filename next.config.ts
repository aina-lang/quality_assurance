import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true // Ignores all TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true // Optionally ignore ESLint errors (see below)
  },
  experimental: {

    serverActions: {
      bodySizeLimit: '4gb',

    },
  },

  api: {
    bodyParser: {
      sizeLimit: '4gb' // pour accepter de gros fichiers
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
