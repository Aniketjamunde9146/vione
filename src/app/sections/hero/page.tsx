"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DiscoverButton from "@/app/components/DiscoverButton";
import heroPoster from "@public/images/heroposter.webp";

export default function HeroPage() {
  const [mounted, setMounted] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [skipVideo, setSkipVideo] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Skip video for reduced-motion or data-saver users
  useEffect(() => {
    const connection = (navigator as any)?.connection;
    const saveData = connection?.saveData;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (saveData || prefersReducedMotion) {
      setSkipVideo(true);
    }
  }, []);

  // Start loading the video once the section nears the viewport
  useEffect(() => {
    if (skipVideo || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [skipVideo]);

  // Force the browser to pick up the newly-added <source> tags,
  // then try to play; fall back to the poster on failure/error
  useEffect(() => {
    if (!loadVideo || !videoRef.current) return;
    const video = videoRef.current;

    const handleCanPlay = () => {
      setVideoReady(true);
      video.play().catch(() => {
        setVideoReady(false);
      });
    };

    const handleError = () => {
      setSkipVideo(true);
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("error", handleError);

    video.load();

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [loadVideo]);

  const letters = "VIONE".split("");

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-vione-bg"
    >
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

      {!skipVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {loadVideo && (
            <>
              <source src="/videos/herobg.webm" type="video/webm" />
              <source src="/videos/herobg.mp4" type="video/mp4" />
            </>
          )}
        </video>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-vione-bg/70 via-vione-green/40 to-vione-bg/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
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