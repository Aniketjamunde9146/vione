"use client";

import { useEffect, useRef, useState } from "react";
import DiscoverButton from "@/app/components/DiscoverButton";

export default function HeroPage() {
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
    <section className="relative h-screen w-full overflow-hidden bg-vione-bg">
      {/* Poster shows instantly — swap in your real compressed poster jpg */}
      <img
        src="/images/heroposter.png"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/hero-poster.jpg"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${
          canPlay && videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/herobg.mp4" type="video/mp4" />
      </video>

      {/* Green-tinted overlay instead of flat black */}
      <div className="absolute inset-0 bg-gradient-to-b from-vione-bg/70 via-vione-green/40 to-vione-bg/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          className={`font-heading text-6xl font-medium uppercase tracking-[0.25em] text-vione-goldLight transition-all duration-1000 ease-out md:text-8xl ${
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

      <div
        className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-1000 delay-700 ${
          mounted ? "opacity-70" : "opacity-0"
        }`}
      >
        <div className="h-10 w-px bg-vione-gold/70 animate-scroll-line" />
      </div>
    </section>
  );
}