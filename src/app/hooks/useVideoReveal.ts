// app/hooks/useVideoReveal.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { isSlowConnection } from "@/lib/network";
import { videoLoadQueue } from "@/lib/videoLoadQueue";

export function useVideoReveal(rootMargin = "150px") {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [skipVideo, setSkipVideo] = useState(false);

  useEffect(() => {
    // Slow connection / data-saver: never fetch the video, poster stays up permanently
    if (isSlowConnection()) {
      setSkipVideo(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let idleId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = () => {
            videoLoadQueue.enqueue(() => setLoadVideo(true));
          };
          if ("requestIdleCallback" in window) {
            idleId = (window as any).requestIdleCallback(start, { timeout: 1500 });
          } else {
            idleId = setTimeout(start, 300) as unknown as number;
          }
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (idleId !== undefined) {
        if ("cancelIdleCallback" in window) (window as any).cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
    };
  }, [rootMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;
    video.load();

    const markReady = () => {
      if (video.readyState >= 3) {
        setVideoReady(true);
        videoLoadQueue.done();
      }
    };
    video.addEventListener("canplaythrough", markReady);
    video.addEventListener("loadeddata", markReady);
    return () => {
      video.removeEventListener("canplaythrough", markReady);
      video.removeEventListener("loadeddata", markReady);
    };
  }, [loadVideo]);

  return { sectionRef, videoRef, loadVideo, videoReady, skipVideo };
}