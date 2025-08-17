import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'utils', 'components', 'lib', 'app', 'types'],
  },
};

export default nextConfig;
