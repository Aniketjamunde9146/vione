"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DiscoverButton from "@/app/components/DiscoverButton";
import heroPoster from "@public/images/hero-poster.webp";

export default function HeroPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mounted, setMounted] = useState(false);       // triggers text/button entrance
  const [loadVideo, setLoadVideo] = useState(false);    // gate: inject <source> or not
  const [videoReady, setVideoReady] = useState(false);  // video can actually play smoothly

  // Text/button entrance — fire on next paint, no artificial delay
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Only start fetching the video once: (a) section is near viewport, AND (b) browser is idle
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let idleId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = () => setLoadVideo(true);
          if ("requestIdleCallback" in window) {
            idleId = (window as any).requestIdleCallback(start, { timeout: 1500 });
          } else {
            idleId = globalThis.setTimeout(start, 300) as unknown as number;
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (idleId !== undefined) {
        if ("cancelIdleCallback" in window) (window as any).cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
    };
  }, []);

  // Once source is injected, load it, and only crossfade in once it's genuinely playable
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;
    video.load();

    const markReady = () => {
      if (video.readyState >= 3) setVideoReady(true);
    };
    video.addEventListener("canplaythrough", markReady);
    video.addEventListener("loadeddata", markReady); // fallback for some mobile browsers
    return () => {
      video.removeEventListener("canplaythrough", markReady);
      video.removeEventListener("loadeddata", markReady);
    };
  }, [loadVideo]);

  const letters = "VIONE".split("");

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-vione-bg"
    >
      {/* Poster — this is your LCP element, loads first, highest priority */}
      <Image
        src={heroPoster}
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ease-out ${
          videoReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video — no source in DOM until loadVideo flips true */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {loadVideo && <source src="/videos/herobg.mp4" type="video/mp4" />}
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-vione-bg/70 via-vione-green/40 to-vione-bg/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Letter-by-letter cascade for VIONE */}
        <h1 className="font-heading text-6xl font-medium uppercase tracking-[0.25em] text-vione-goldLight md:text-8xl">
          {letters.map((letter, i) => (
            <span
              key={i}
              className={`inline-block transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <div
          className={`mt-10 transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "550ms" }}
        >
          <DiscoverButton />
        </div>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-1000 ${
          mounted ? "opacity-70" : "opacity-0"
        }`}
        style={{ transitionDelay: "900ms" }}
      >
        <div className="h-10 w-px bg-vione-gold/70 animate-scroll-line" />
      </div>
    </section>
  );
}