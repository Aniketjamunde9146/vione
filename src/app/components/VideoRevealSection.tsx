"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

type VideoRevealSectionProps = {
  posterSrc: StaticImageData | string;
  videoSrc: string;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  priority?: boolean; // true only for above-the-fold sections (e.g. hero)
};

export default function VideoRevealSection({
  posterSrc,
  videoSrc,
  children,
  overlay,
  priority = false,
}: VideoRevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let idleId: number;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = () => setLoadVideo(true);
          if ("requestIdleCallback" in window) {
            idleId = (window as any).requestIdleCallback(start, { timeout: 1500 });
          } else {
            // window may be typed differently in some TS configs; cast to any to access setTimeout
            idleId = (window as any).setTimeout(start, 300) as number;
          }
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // start a little earlier since it's mid-page scroll
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if ("cancelIdleCallback" in window) (window as any).cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;
    video.load();

    const markReady = () => {
      if (video.readyState >= 3) setVideoReady(true);
    };
    video.addEventListener("canplaythrough", markReady);
    video.addEventListener("loadeddata", markReady);
    return () => {
      video.removeEventListener("canplaythrough", markReady);
      video.removeEventListener("loadeddata", markReady);
    };
  }, [loadVideo]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-vione-bg"
    >
      <Image
        src={posterSrc}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ease-out ${
          videoReady ? "opacity-0" : "opacity-100"
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
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-out ${
          videoReady ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      >
        {loadVideo && <source src={videoSrc} type="video/mp4" />}
      </video>

      {overlay}

      <div className="relative z-10">{children}</div>
    </section>
  );
}