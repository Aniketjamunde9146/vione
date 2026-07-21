import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";
import ChromeGate from "./ChromeGate";

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

const siteUrl = "https://www.vione.cc";
const siteName = "Vione";
const title = "Luxury Banquet Hall & Event Venue in Delhi | Vione";
const description =
  "Experience luxury events at Vione, Delhi's premium banquet and event venue. Perfect for weddings, corporate events, receptions, conferences, and private celebrations. Book your event today.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Vione",
  },
  description,
  keywords: [
    "luxury banquet hall Delhi",
    "wedding venue Delhi",
    "corporate event space Delhi",
    "birthday party venue Delhi",
    "engagement reception venue",
    "conference venue Delhi",
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
        alt: "Vione — Luxury Banquet Hall & Event Venue in Delhi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/logo.webp"],
  },

  icons: {
    icon: "/images/logo.webp",
    shortcut: "/images/logo.webp",
    apple: "/images/logo.webp",
  },

  manifest: "/site.webmanifest",

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
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}