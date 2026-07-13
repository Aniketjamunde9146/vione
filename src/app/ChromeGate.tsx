"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";
import ScrollProgress from "@/app/components/ScrollProgress";
import FloatingButtons from "./components/FloatingButtons";

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      {children}
      <Footer />
      <FloatingButtons />
    </>
  );
}