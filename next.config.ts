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

  // Silence Next.js 16 Turbopack error when using custom webpack config
  turbopack: {},

  // Force Vercel to include the swisseph C binary and ephemeris files
  // in the Serverless Function bundle, since it can't auto-detect C file reads.
  experimental: {
    outputFileTracingIncludes: {
      '/api/calculate': ['./node_modules/swisseph/**/*'],
    },
  },
};

export default nextConfig;
