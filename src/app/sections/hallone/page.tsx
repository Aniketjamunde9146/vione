"use client";

import { useEffect, useRef, useState } from "react";
import DiscoverButton from "@/app/components/DiscoverButton";

export default function HallOnePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [canPlay, setCanPlay] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.load();
          setCanPlay(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-vione-bg">
      <img
        src="/images/hallposter.png"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <video
        ref={videoRef}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/hall-one-poster.jpg"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-out ${
          canPlay && videoLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      >
        <source src="/videos/hallbg.mp4" type="video/mp4" />
      </video>

      {/* Layer 1 — solid darkening base, needed for bright daytime footage */}
      <div className="absolute inset-0 bg-vione-bg/55" />

      {/* Layer 2 — green tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-vione-bg/70 via-vione-green/40 to-vione-bg/75" />

      {/* Layer 3 — focused vignette centered on the text block */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(7,19,14,0.7),transparent_70%)]" />

      {/* Top / bottom edge gradients */}
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-vione-bg via-vione-bg/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-vione-bg via-vione-bg/60 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-5xl text-center">
          <p
            className={`mb-5 font-heading text-[11px] uppercase tracking-[0.55em] text-vione-gold/90 transition-all duration-1000 ease-out motion-reduce:transition-none ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Luxury Redefined
          </p>

          <h2
            className={`font-heading text-5xl font-medium leading-tight tracking-[0.12em] text-vione-goldLight transition-all duration-1000 delay-150 ease-out motion-reduce:transition-none md:text-7xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Every Detail
            <br />
            Tells A Story.
          </h2>

          <p
            className={`mx-auto mt-8 max-w-2xl text-base leading-8 text-vione-cream/90 transition-all duration-1000 delay-300 ease-out motion-reduce:transition-none md:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Step into a world where luxury, elegance and unforgettable
            experiences come together. Crafted for those who appreciate
            timeless design and extraordinary moments.
          </p>
          <br />

          <div
            className={`mt-14 transition-all duration-1000 delay-500 ease-out motion-reduce:transition-none ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <DiscoverButton />
          </div>
        </div>
      </div>
    </section>
  );
}