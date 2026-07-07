"use client";

import { useEffect, useState } from "react";

/**
 * Thin gold gradient line fixed at the very top of the viewport,
 * filling left-to-right as the user scrolls the page. A common
 * "premium site" touch — subtle, not a loading bar, just a quiet
 * sense of progress through the page.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="vione-scroll-track" aria-hidden="true">
      <div
        className="vione-scroll-fill"
        style={{ width: `${progress}%` }}
      />
      <style>{`
        .vione-scroll-track {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2.5px;
          z-index: 90;
          background: transparent;
          pointer-events: none;
        }
        .vione-scroll-fill {
          height: 100%;
          background: linear-gradient(to right, #123423, #C9A876, #E4CFA0);
          box-shadow: 0 0 8px rgba(201, 168, 118, 0.5);
          transition: width 0.1s linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .vione-scroll-fill { transition: none; }
        }
      `}</style>
    </div>
  );
}