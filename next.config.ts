import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚠️  Do NOT use output: "export" — this app uses server-side API routes
  // (swisseph native module via /api/calculate). Capacitor will connect to
  // the deployed Next.js server via a URL, not bundle the app statically.

  // Externalize swisseph native module — it uses C bindings via node-gyp
  // and cannot be bundled by webpack/turbopack
  serverExternalPackages: ["swisseph"],

  // Disable source maps in production to cut memory usage by ~40-50%
  productionBrowserSourceMaps: false,

  // Webpack memory optimisations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Limit parallelism so webpack doesn't spin up too many workers at once
      config.parallelism = 1;

      // Use filesystem cache to avoid re-processing unchanged modules
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    return config;
  },
};

export default nextConfig;
