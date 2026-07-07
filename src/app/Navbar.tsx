"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Hero", href: "/sections/hero" },
  { label: "Hall One", href: "/sections/hallone" },
  { label: "Hall Two", href: "/sections/halltwo" },
  { label: "Explore", href: "/sections/explore" },
  { label: "Enquiry", href: "/enquiry" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <header className="vione-nav-wrap">
        <div className="vione-nav">
          <div className="vione-nav-glass" aria-hidden="true">
            <div className="vione-nav-glass-blob vione-nav-glass-blob-a" />
            <div className="vione-nav-glass-blob vione-nav-glass-blob-b" />
          </div>

          <button
            type="button"
            className={`vione-nav-burger${open ? " open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/" className="vione-nav-logo" onClick={() => setOpen(false)} aria-label="Vione — Home">
            <img src="/images/logo.webp" alt="Vione" />
          </Link>

          <Link href="/enquiry" className="vione-nav-cta">
            Enquiry
          </Link>
        </div>
      </header>

      <div
        className={`vione-nav-overlay${open ? " open" : ""}`}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="vione-blob vione-blob-a" aria-hidden="true" />
        <div className="vione-blob vione-blob-b" aria-hidden="true" />
        <div className="vione-blob vione-blob-c" aria-hidden="true" />

        <div className="vione-nav-panel">
          <button
            type="button"
            className="vione-nav-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          >
            <span />
            <span />
          </button>

          <nav className="vione-nav-overlay-links">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="vione-nav-overlay-link"
                style={{ transitionDelay: open ? `${i * 55}ms` : "0ms" }}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                <span className="vione-nav-overlay-index">0{i + 1}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

const CSS = `
.vione-nav-wrap {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  padding: 1.1rem 1.25rem 0;
  pointer-events: none;
}

.vione-nav {
  position: relative;
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
}
.vione-nav > * { pointer-events: auto; }

/* ---------- Liquid glass strip behind the navbar — 98% transparent ---------- */
.vione-nav-glass {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(11, 31, 23, 0.02);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(201,168,118,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.vione-nav-glass-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  pointer-events: none;
}
.vione-nav-glass-blob-a {
  width: 220px; height: 100px;
  top: -40px; left: 10%;
  background: radial-gradient(circle, rgba(28,74,50,0.9), transparent 70%);
  animation: vione-drift-a 16s ease-in-out infinite;
}
.vione-nav-glass-blob-b {
  width: 200px; height: 90px;
  top: -35px; right: 12%;
  background: radial-gradient(circle, rgba(201,168,118,0.4), transparent 70%);
  animation: vione-drift-b 20s ease-in-out infinite;
}

@keyframes vione-nav-in {
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.vione-nav-burger { animation: vione-nav-in 0.65s cubic-bezier(.16,.8,.24,1) both; }
.vione-nav-logo   { animation: vione-nav-in 0.65s cubic-bezier(.16,.8,.24,1) 0.1s both; }
.vione-nav-cta    { animation: vione-nav-in 0.65s cubic-bezier(.16,.8,.24,1) 0.2s both; }

@media (prefers-reduced-motion: reduce) {
  .vione-nav-burger, .vione-nav-logo, .vione-nav-cta { animation: none; }
  .vione-nav-overlay-link, .vione-nav-panel, .vione-blob, .vione-nav-glass-blob { transition: none !important; animation: none !important; }
}

.vione-nav-burger {
  justify-self: start;
  width: 42px; height: 42px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px;
  background: rgba(7,19,14,0.35);
  border: 1px solid rgba(201,168,118,0.3);
  border-radius: 999px;
  cursor: pointer;
  z-index: 70;
  backdrop-filter: blur(6px);
  transition: border-color 0.2s, background 0.2s;
}
.vione-nav-burger:hover { border-color: rgba(201,168,118,0.65); }
.vione-nav-burger span {
  width: 18px; height: 1.5px; background: #EDE7D9;
  transition: transform 0.25s ease, opacity 0.2s ease, background 0.25s ease;
}
.vione-nav-burger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); background: #C9A876; }
.vione-nav-burger.open span:nth-child(2) { opacity: 0; }
.vione-nav-burger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); background: #C9A876; }

.vione-nav-logo {
  justify-self: center;
  display: flex; align-items: center;
  line-height: 0;
}
.vione-nav-logo img {
  height: 56px; width: auto; display: block;
  filter: drop-shadow(0 2px 10px rgba(0,0,0,0.5));
}

.vione-nav-cta {
  justify-self: end;
  display: inline-flex; align-items: center;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-family: var(--font-heading), serif;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 500;
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  transition: transform 0.15s ease;
  white-space: nowrap;
}
.vione-nav-cta:hover { transform: scale(1.05); }

/* ---------- Liquid glass overlay (full-screen menu) ---------- */
.vione-nav-overlay {
  position: fixed; inset: 0; z-index: 65;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(120% 120% at 50% 0%, rgba(18,52,35,0.55), rgba(7,19,14,0.97));
  backdrop-filter: blur(2px);
  opacity: 0; visibility: hidden;
  transition: opacity 0.5s cubic-bezier(.16,.8,.24,1), visibility 0.5s;
  overflow: hidden;
}
.vione-nav-overlay.open { opacity: 1; visibility: visible; }

.vione-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0;
  transition: opacity 0.8s ease 0.1s;
  pointer-events: none;
}
.vione-nav-overlay.open .vione-blob { opacity: 0.55; }

.vione-blob-a {
  width: 480px; height: 480px;
  top: -140px; left: -120px;
  background: radial-gradient(circle, rgba(28,74,50,0.9), transparent 70%);
  animation: vione-drift-a 14s ease-in-out infinite;
}
.vione-blob-b {
  width: 420px; height: 420px;
  bottom: -160px; right: -100px;
  background: radial-gradient(circle, rgba(201,168,118,0.35), transparent 70%);
  animation: vione-drift-b 18s ease-in-out infinite;
}
.vione-blob-c {
  width: 360px; height: 360px;
  top: 30%; right: 10%;
  background: radial-gradient(circle, rgba(18,52,35,0.85), transparent 70%);
  animation: vione-drift-c 20s ease-in-out infinite;
}

@keyframes vione-drift-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 40px) scale(1.15); }
}
@keyframes vione-drift-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-50px, -30px) scale(1.1); }
}
@keyframes vione-drift-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 50px) scale(0.9); }
}

.vione-nav-panel {
  position: relative;
  z-index: 2;
  width: min(90vw, 480px);
  padding: 3.5rem 2rem 3rem;
  border-radius: 32px;
  background: rgba(11,31,23,0.45);
  border: 1px solid rgba(201,168,118,0.25);
  box-shadow:
    0 30px 80px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.06);
  backdrop-filter: blur(22px) saturate(140%);
  transform: scale(0.94) translateY(16px);
  opacity: 0;
  transition: transform 0.55s cubic-bezier(.16,.8,.24,1), opacity 0.5s ease;
}
.vione-nav-overlay.open .vione-nav-panel {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.vione-nav-close {
  position: absolute;
  top: 1.25rem; right: 1.25rem;
  width: 36px; height: 36px;
  border-radius: 999px;
  background: rgba(7,19,14,0.5);
  border: 1px solid rgba(201,168,118,0.3);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}
.vione-nav-close:hover { border-color: rgba(201,168,118,0.7); transform: rotate(90deg); }
.vione-nav-close span {
  position: absolute;
  width: 16px; height: 1.5px; background: #E4CFA0;
}
.vione-nav-close span:first-child { transform: rotate(45deg); }
.vione-nav-close span:last-child { transform: rotate(-45deg); }

.vione-nav-overlay-links { display: flex; flex-direction: column; gap: 1.25rem; text-align: center; }
.vione-nav-overlay-link {
  display: flex; align-items: baseline; justify-content: center; gap: 0.85rem;
  font-family: var(--font-heading), ui-serif, Georgia, serif;
  font-size: 2rem; font-weight: 500;
  letter-spacing: 0.02em;
  color: #EDE7D9; text-decoration: none;
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.4s ease, transform 0.4s ease, color 0.2s ease;
}
.vione-nav-overlay.open .vione-nav-overlay-link { opacity: 1; transform: translateY(0); }
.vione-nav-overlay-link:hover { color: #C9A876; }
.vione-nav-overlay-index {
  font-family: var(--font-body), sans-serif; font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.15em; color: #C9A876;
}

@media (max-width: 640px) {
  .vione-nav-wrap { padding: 0.85rem 0.75rem 0; }
  .vione-nav { padding: 0.7rem 1rem; }
  .vione-nav-logo img { height: 44px; }
  .vione-nav-cta { padding: 0.5rem 1.1rem; font-size: 0.68rem; }
  .vione-nav-panel { padding: 3rem 1.5rem 2.5rem; }
  .vione-nav-overlay-link { font-size: 1.7rem; }
}
`;