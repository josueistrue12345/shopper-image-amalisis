import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BACKEND_URL + "/api/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
