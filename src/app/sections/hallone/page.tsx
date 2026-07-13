"use client";

import { useEffect, useState } from "react";
import DiscoverButton from "@/app/components/DiscoverButton";
import VideoRevealSection from "@/app/components/VideoRevealSection";
import hallTwoPoster from "@public/images/hall-two-poster.webp";

export default function HallTwoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <VideoRevealSection
      posterSrc={hallTwoPoster}
      videoSrc="/videos/hall1bg"
      overlay={
        <>
          <div className="absolute inset-0 bg-vione-bg/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-vione-bg/75 via-vione-green/45 to-vione-bg/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_45%,rgba(7,19,14,0.7),transparent_70%)]" />
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-vione-bg via-vione-bg/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-vione-bg via-vione-bg/60 to-transparent" />
        </>
      }
    >
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-6xl text-center">
          <p
            className={`mb-5 font-heading text-[11px] uppercase tracking-[0.55em] text-vione-gold/90 transition-all duration-1000 ease-out motion-reduce:transition-none ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Curated Living
          </p>

          <h2
            className={`font-heading text-[56px] font-medium leading-tight tracking-[0.10em] text-vione-goldLight transition-all duration-1000 ease-out motion-reduce:transition-none md:text-[92px] ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            Moments Eternal
          </h2>

          <div
            className={`mt-14 transition-all duration-1000 ease-out motion-reduce:transition-none ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <DiscoverButton />
          </div>
        </div>
      </div>
    </VideoRevealSection>
  );
}