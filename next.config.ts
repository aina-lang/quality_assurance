import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Ignore les erreurs TypeScript pendant la build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Ignore les erreurs ESLint pendant la build

  // ✅ Permet les gros fichiers (jusqu’à 4 Go)
  experimental: {
    proxyClientMaxBodySize: 4 * 1024 * 1024 * 1024, // 4 GB
    serverActions: { bodySizeLimit: "4gb" },
  },

  // ✅ Active Turbopack sans config spéciale
  turbopack: {},

  // ✅ Optionnel : empêche Next d'optimiser les images (utile en hébergement custom)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
