"use client";

import { useEffect, useRef, useState } from "react";

const REELS = [
  { id: 1, src: "/videos/reel1.mp4", label: "THE VIONE" },
  { id: 2, src: "/videos/reel2.mp4", label: "THE VIONE" },
  { id: 3, src: "/videos/reel3.mp4", label: "THE VIONE" },
  { id: 4, src: "/videos/reel4.mp4", label: "THE VIONE" },
];

function ReelCard({
  reel,
  index,
  show,
  onOpen,
}: {
  reel: (typeof REELS)[number];
  index: number;
  show: boolean;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canPlay, setCanPlay] = useState(false);

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
    <button
      onClick={onOpen}
      style={{ transitionDelay: show ? `${index * 120}ms` : "0ms" }}
      className={`group relative aspect-[3/5] w-[calc(50%-0.5rem)] shrink-0 overflow-hidden rounded-2xl bg-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.55)] sm:w-[calc(25%-1.125rem)] ${
        show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay={canPlay}
        preload="none"
        className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
          canPlay ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={reel.src} type="video/mp4" />
      </video>

      {/* Gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 transition-opacity duration-500 group-hover:from-black/30 group-hover:to-black/70" />

      {/* Subtle border ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 transition-all duration-500 group-hover:ring-white/20" />

      {/* Top-left label */}
      <div className="absolute left-3 top-3 z-10">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">
          {reel.label}
        </span>
      </div>

      {/* Top-right badge */}
      <div className="absolute right-3 top-3 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform duration-500 group-hover:scale-110">
        <span className="text-[9px] font-semibold uppercase tracking-tighter text-black">
          VIONE
        </span>
      </div>
    </button>
  );
}

export default function ExploreFurther() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full flex-col items-center bg-black px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* Heading — perfectly centered */}
      <div className="mb-14 flex w-full max-w-3xl flex-col items-center text-center">
        <h2
          className={`text-2xl font-light uppercase tracking-[0.3em] text-white transition-all duration-1000 ease-out md:text-3xl ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Explore Further
        </h2>
        <br />
        <p
          className={`mt-4 text-[11px] uppercase tracking-[0.4em] text-white/50 transition-all duration-1000 delay-150 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Follow The Journey
        </p>
        <div
          className={`mt-6 h-px w-16 bg-white/20 transition-all duration-1000 delay-300 ease-out ${
            inView ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`}
        />
      </div>
    
      <br />

      {/* Cards — flex-wrap keeps them centered as a group on any width */}
      <div className="flex w-full max-w-6xl flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
        {REELS.map((reel, i) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            index={i}
            show={inView}
            onOpen={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {activeIndex !== null && (
        <ReelModal
          reel={REELS[activeIndex]}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}

function ReelModal({
  reel,
  onClose,
}: {
  reel: (typeof REELS)[number];
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500 ease-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative aspect-[9/16] h-[85vh] max-h-[850px] overflow-hidden rounded-2xl bg-black shadow-[0_20px_80px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <video
          src={reel.src}
          autoPlay
          loop
          playsInline
          className="h-full w-full object-cover"
        />

        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}