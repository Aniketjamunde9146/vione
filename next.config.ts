import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  allowedDevOrigins: ["192.168.1.9"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wnookpllxkazcenehvyi.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
     
    ];
  },
};

export default nextConfig;