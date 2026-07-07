"use client";

import { useEffect, useRef, useState } from "react";
import DiscoverButton from "@/app/components/DiscoverButton";

export default function HallTwoPage() {
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
        src="/images/hall-two-poster.jpg"
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
        poster="/images/hallposter.png"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-out ${
          canPlay && videoLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      >
        <source src="/videos/hallbg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-vione-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-vione-bg/75 via-vione-green/45 to-vione-bg/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_45%,rgba(7,19,14,0.7),transparent_70%)]" />

      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-vione-bg via-vione-bg/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-vione-bg via-vione-bg/60 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-6xl text-center">
          <p
            className={`mb-5 font-heading text-[11px] uppercase tracking-[0.55em] text-vione-gold/90 transition-all duration-1000 ease-out motion-reduce:transition-none ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Curated Experiences
          </p>

          <h2
            className={`font-heading text-[56px] font-medium leading-tight tracking-[0.10em] text-vione-goldLight transition-all duration-1000 delay-150 ease-out motion-reduce:transition-none md:text-[92px] ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Moments That
            <br />
            Stay Forever.
          </h2>

          <p
            className={`mx-auto mt-8 max-w-3xl text-lg leading-8 text-vione-cream/90 transition-all duration-1000 delay-300 ease-out motion-reduce:transition-none ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Every event is carefully curated to create unforgettable memories.
            From breathtaking venues to exceptional hospitality, every detail
            reflects elegance, exclusivity, and timeless sophistication.
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