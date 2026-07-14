"use client";

import Image, { type StaticImageData } from "next/image";
import { useVideoReveal } from "@/app/hooks/useVideoReveal";

type VideoRevealSectionProps = {
  posterSrc: StaticImageData | string;
  videoSrc: string; // base path WITHOUT extension, e.g. "/videos/hallbg"
  children: React.ReactNode;
  overlay?: React.ReactNode;
  priority?: boolean;
};

export default function VideoRevealSection({
  posterSrc,
  videoSrc,
  children,
  overlay,
  priority = false,
}: VideoRevealSectionProps) {
  const { sectionRef, videoRef, loadVideo, videoReady, skipVideo } =
    useVideoReveal("150px");

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
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

      {!skipVideo && (
        <video
          ref={videoRef}
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-out ${
            videoReady ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {loadVideo && (
            <>
              <source src={`${videoSrc}.webm`} type="video/webm" />
              <source src={`${videoSrc}.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      )}

      {overlay}

      <div className="relative z-10">{children}</div>
    </section>
  );
}