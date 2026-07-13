import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: true,
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
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
//           {
//             key: "Content-Security-Policy",
//             value: [
//               "default-src 'self'",
//               "img-src 'self' data: blob:",
//               `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
//               "style-src 'self' 'unsafe-inline'",
//               "require-trusted-types-for 'script'",
//             ].join("; "),
//           },
//         ],
//       },
//     ];
//   },
};

export default nextConfig;