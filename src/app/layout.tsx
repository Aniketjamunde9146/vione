import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";
import "./globals.css";
import FloatingButtons from "./components/FloatingButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vione — Roasted Slow, Served Still",
  description: "A quiet, premium coffee house.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <Navbar />
  {children}
  <Footer />
  <FloatingButtons />
</body>
    </html>
  );
}