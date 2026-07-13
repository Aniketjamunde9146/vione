import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Full Archive | The Journal — VIONE",
  description:
    "Browse every story in the VIONE Journal — filter by design philosophy, craft, landscape, and behind-the-scenes features.",
  keywords: [
    "VIONE journal archive",
    "design articles",
    "luxury living blog",
    "architecture stories",
  ],
  alternates: {
    canonical: `${SITE_URL}/blogs/all`,
  },
  openGraph: {
    title: "Full Archive | The Journal — VIONE",
    description:
      "Browse every story in the VIONE Journal — filter by design philosophy, craft, landscape, and behind-the-scenes features.",
    url: `${SITE_URL}/blogs/all`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/logo.webp`,
        width: 1200,
        height: 630,
        alt: "VIONE Journal Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Archive | The Journal — VIONE",
    description:
      "Browse every story in the VIONE Journal — filter by design philosophy, craft, landscape, and behind-the-scenes features.",
    images: [`${SITE_URL}/images/logo.webp`],
  },
};

export default function BlogsAllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}