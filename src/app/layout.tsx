import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";
import ScrollProgress from "@/app/components/ScrollProgress";
import "./globals.css";
import FloatingButtons from "./components/FloatingButtons";

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://www.vione.com"; // TODO: replace with your real production domain
const siteName = "Vione";
const title = "Vione — Luxury Redefined";
const description =
  "A premium event venue for weddings, celebrations, and corporate experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Vione",
  },
  description,
  keywords: [
    "luxury event venue",
    "wedding venue",
    "corporate events",
    "premium celebrations",
    "Vione",
  ],
  applicationName: siteName,
  authors: [{ name: "Vione" }],
  creator: "Vione",
  publisher: "Vione",
  category: "Event Venue",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title,
    description,
    locale: "en_US",
    images: [
      {
        url: "/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Vione — Luxury Redefined",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/logo.webp"],
    // site: "@vione", // TODO: add if you have a Twitter/X handle
  },

  icons: {
    icon: "/images/logo.webp",
    shortcut: "/images/logo.webp",
    apple: "/images/logo.webp",
  },

  manifest: "/site.webmanifest", // optional — only if you add one

  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-vione-bg text-vione-cream font-body">
        <ScrollProgress />
        <Navbar />
        {children}
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}