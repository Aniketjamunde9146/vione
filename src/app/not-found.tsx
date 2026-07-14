"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [loaded, setLoaded] = useState(false);
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="vione-404">
      <style>{CSS}</style>

      {/* fine grain, matches the texture used across the site */}
      <div
        aria-hidden="true"
        className="vione-404-grain"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

    

      <div className={`vione-404-content${loaded ? " in-view" : ""}`}>
   
        <div className="vione-404-mark" aria-hidden="true">
          <span className="vione-404-line" />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="vione-404-diamond">
            <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" transform="rotate(45 5 5)" />
          </svg>
          <span className="vione-404-line" />
        </div>

       

        <h1 className="vione-404-heading">
          This Moment
          <br />
          Doesn&rsquo;t Exist
        </h1>

        {/* <p className="vione-404-body">
          The page you&rsquo;re looking for slipped away before the story
          reached it. Let&rsquo;s bring you back to where the celebration
          begins.
        </p> */}

        <div className="vione-404-actions">
          <Link
            href="/"
            onMouseEnter={() => setHoverPrimary(true)}
            onMouseLeave={() => setHoverPrimary(false)}
            className={`vione-404-btn vione-404-btn--primary${hoverPrimary ? " hover" : ""}`}
          >
            Back To Home
            <span className="vione-404-arrow">→</span>
          </Link>

          {/* <Link
            href="/"
            onMouseEnter={() => setHoverSecondary(true)}
            onMouseLeave={() => setHoverSecondary(false)}
            className={`vione-404-btn vione-404-btn--secondary${hoverSecondary ? " hover" : ""}`}
          >
            Explore Vione
          </Link> */}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.vione-404 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0D0C0A;
  padding: 6rem 6vw;
  font-family: 'Jost', ui-sans-serif, system-ui, sans-serif;
}

.vione-404-grain {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  pointer-events: none;
  background-size: 180px 180px;
}

.vione-404-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(198,162,93,0.14);
  transform: translate(-50%, -50%) scale(0.94);
  opacity: 0;
  animation: vione-404-ring-in 1.4s ease forwards;
}
.vione-404-ring--outer { width: 620px; height: 620px; animation-delay: 0.15s; }
.vione-404-ring--inner { width: 460px; height: 460px; border-color: rgba(198,162,93,0.1); animation-delay: 0.3s; }

@keyframes vione-404-ring-in {
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.vione-404-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
  text-align: center;
  color: #F4EFE6;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
}
.vione-404-content.in-view { opacity: 1; transform: translateY(0); }

.vione-404-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1.4rem;
  color: #C6A25D;
}
.vione-404-line {
  display: inline-block;
  height: 1px;
  width: 0;
  background: rgba(198,162,93,0.5);
  transition: width 0.9s cubic-bezier(.16,.8,.24,1) 0.3s;
}
.vione-404-content.in-view .vione-404-line { width: 42px; }
.vione-404-diamond { flex-shrink: 0; }

.vione-404-eyebrow {
  display: block;
  font-size: 1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C6A25D;
  margin-bottom: 1.5rem;
}

.vione-404-heading {
  font-family: 'Cormorant Garamond', ui-serif, Georgia, serif;
  font-weight: 500;
  font-size: clamp(2.6rem, 7vw, 5.5rem);
  line-height: 1.05;
  letter-spacing: 0.01em;
  margin: 0 0 1.5rem;
}

.vione-404-body {
  font-size: 1.05rem;
  line-height: 1.75;
  color: #9B9284;
  margin: 0 auto 2.75rem;
  max-width: 460px;
}

.vione-404-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.vione-404-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 2.2rem;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 999px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.vione-404-btn--primary {
  color: #150F06;
  background: linear-gradient(to bottom, #DFC17F, #B0873F);
  box-shadow: 0 0 0 rgba(0,0,0,0);
}
.vione-404-btn--primary.hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.35);
}

.vione-404-btn--secondary {
  color: #F4EFE6;
  background: transparent;
  border: 1px solid rgba(244,239,230,0.3);
}
.vione-404-btn--secondary.hover {
  border-color: #C6A25D;
  color: #C6A25D;
}

.vione-404-arrow {
  display: inline-block;
  transition: transform 0.25s ease;
}
.vione-404-btn--primary.hover .vione-404-arrow {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .vione-404-ring { animation: none; opacity: 1; transform: translate(-50%, -50%) scale(1); }
  .vione-404-content { transition: none; opacity: 1; transform: none; }
  .vione-404-line { transition: none; width: 42px; }
  .vione-404-btn { transition: none; }
}

@media (max-width: 480px) {
  .vione-404-ring--outer { width: 400px; height: 400px; }
  .vione-404-ring--inner { width: 300px; height: 300px; }
}
`;