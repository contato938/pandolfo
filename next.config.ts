import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    // Evita o warning de múltiplos lockfiles fora do repo (Turbopack root inference)
    root: process.cwd(),
  },
  /* config options here */
};

export default nextConfig;
