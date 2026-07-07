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

export const metadata: Metadata = {
  title: "Vione — Luxury Redefined",
  description: "A premium event venue for weddings, celebrations, and corporate experiences.",
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