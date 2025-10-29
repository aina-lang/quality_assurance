import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },

  experimental: {
    proxyClientMaxBodySize: 4 * 1024 * 1024 * 1024, // 4 GB
    serverActions: { bodySizeLimit: "4gb" },
  },

  // ❌ supprime cette section pour Turbopack :
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ["@svgr/webpack"],
  //   });
  //   return config;
  // },

  // ✅ Ajoute à la place :
  turbopack: {},
};

export default nextConfig;
