import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    // ✅ C’est CE paramètre qui supprime la limite 10 MB sur les requêtes API/App Router
    proxyClientMaxBodySize: 4 * 1024 * 1024 * 1024, // 4 GB

    // ✅ Optionnel mais utile si tu utilises Server Actions ailleurs
    serverActions: {
      bodySizeLimit: "4gb",
    },
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
