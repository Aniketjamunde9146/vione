import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getAllTags } from "@/lib/blog-posts";

export async function generateMetadata(): Promise<Metadata> {
  const tags = await getAllTags();

  return {
    title: "The Journal | VIONE — Stories on Design, Craft & Living",
    description:
      "Notes from behind the scenes at VIONE — design philosophy, craft, materials, and the details that shape every occasion and residence.",
    keywords: [
      "VIONE journal",
      "luxury design blog",
      "quiet luxury",
      "interior design philosophy",
      ...tags,
    ],
    alternates: {
      canonical: `${SITE_URL}/blogs`,
    },
    openGraph: {
      title: "The Journal | VIONE",
      description:
        "Notes from behind the scenes at VIONE — design philosophy, craft, materials, and the details that shape every occasion and residence.",
      url: `${SITE_URL}/blogs`,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/images/logo.webp`,
          width: 1200,
          height: 630,
          alt: "VIONE Journal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Journal | VIONE",
      description:
        "Notes from behind the scenes at VIONE — design philosophy, craft, materials, and the details that shape every occasion and residence.",
      images: [`${SITE_URL}/images/logo.webp`],
    },
  };
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}