"use client";

import { useEffect, useRef, useState } from "react";
import DiscoverButton from "@/app/components/DiscoverButton";

export default function HallTwoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [canPlay, setCanPlay] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Content fades in on its own — never gated behind video load state.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Lazy-load the video only once the section is about to enter view,
  // same pattern as the Hero — avoids downloading it on initial page load.
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
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/hall-two-poster.jpg"
        onCanPlayThrough={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${
          canPlay && videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/videos/herobg.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Top Gradient */}
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-black/60 to-transparent" />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div
          className={`max-w-6xl text-center text-white transition-all duration-1000 ease-out motion-reduce:transition-none ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="mb-5 text-[11px] uppercase tracking-[0.55em] text-white/60">
            Curated Experiences
          </p>

          <h2 className="text-[56px] leading-tight font-light tracking-[0.10em] md:text-[92px]">
            Moments That
            <br />
            Stay Forever.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/70">
            Every event is carefully curated to create unforgettable memories.
            From breathtaking venues to exceptional hospitality, every detail
            reflects elegance, exclusivity, and timeless sophistication.
          </p>
          <br />

          <div
            className={`mt-14 transition-all duration-1000 delay-300 ease-out motion-reduce:transition-none ${
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