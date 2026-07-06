"use client";

import { useEffect, useRef, useState } from "react";
import DiscoverButton from "@/app/components/DiscoverButton";

export default function HeroPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [canPlay, setCanPlay] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Content (headline, button, scroll indicator) should appear on its own
  // timer — it must never depend on whether the video has loaded.
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
      {
        rootMargin: "200px",
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${
          canPlay && videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/herobg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          className={`text-6xl font-light uppercase tracking-[0.25em] transition-all duration-1000 ease-out md:text-8xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          VIONE
        </h1>

        <div
          className={`mt-10 transition-all duration-1000 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <DiscoverButton />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-1000 delay-700 ${
          mounted ? "opacity-70" : "opacity-0"
        }`}
      >
        <div className="h-10 w-px bg-white/70 animate-scroll-line" />
      </div>
    </section>
  );
}