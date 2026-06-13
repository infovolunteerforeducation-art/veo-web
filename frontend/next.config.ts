import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "archive.veo.com.vn",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/tours",
        destination: "/du-lich-tinh-nguyen",
        permanent: true,
      },
      {
        source: "/tours/:path*",
        destination: "/du-lich-tinh-nguyen/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
