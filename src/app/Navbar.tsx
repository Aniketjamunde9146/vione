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

  // Lock body scroll while the menu overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
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

      <header className="vione-nav">
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
          <img src="/images/logo.png" alt="Vione" />
        </Link>

        <Link href="/enquiry" className="vione-nav-cta">
          Enquiry
        </Link>
      </header>

      <div className={`vione-nav-overlay${open ? " open" : ""}`} aria-hidden={!open}>
        <nav className="vione-nav-overlay-links">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="vione-nav-overlay-link"
              style={{ transitionDelay: open ? `${i * 45}ms` : "0ms" }}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span className="vione-nav-overlay-index">0{i + 1}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

const CSS = `
.vione-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1.5rem 2rem;
  background: transparent;
  pointer-events: none;
  font-family: 'Jost', ui-sans-serif, system-ui, sans-serif;
}
.vione-nav > * { pointer-events: auto; }

/* Entrance: burger, logo, and CTA fade + settle in on load, staggered. */
@keyframes vione-nav-in {
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.vione-nav-burger { animation: vione-nav-in 0.65s cubic-bezier(.16,.8,.24,1) both; }
.vione-nav-logo   { animation: vione-nav-in 0.65s cubic-bezier(.16,.8,.24,1) 0.1s both; }
.vione-nav-cta    { animation: vione-nav-in 0.65s cubic-bezier(.16,.8,.24,1) 0.2s both; }

@media (prefers-reduced-motion: reduce) {
  .vione-nav-burger, .vione-nav-logo, .vione-nav-cta { animation: none; }
  .vione-nav-overlay-link { transition: none; }
}

.vione-nav-burger {
  justify-self: start;
  width: 44px; height: 44px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px;
  background: rgba(11,10,8,0.25);
  border: 1px solid rgba(198,162,93,0.35);
  border-radius: 999px;
  cursor: pointer;
  z-index: 70;
  transition: border-color 0.2s, background 0.2s;
}
.vione-nav-burger:hover { border-color: rgba(198,162,93,0.7); }
.vione-nav-burger span {
  width: 18px; height: 1.5px; background: #F4EFE6;
  transition: transform 0.25s ease, opacity 0.2s ease, background 0.25s ease;
}
.vione-nav-burger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); background: #C6A25D; }
.vione-nav-burger.open span:nth-child(2) { opacity: 0; }
.vione-nav-burger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); background: #C6A25D; }

.vione-nav-logo {
  justify-self: center;
  display: flex; align-items: center;
  line-height: 0;
}
.vione-nav-logo img {
  height: 68px; width: auto; display: block;
  filter: drop-shadow(0 2px 10px rgba(0,0,0,0.45));
}

.vione-nav-cta {
  justify-self: end;
  display: inline-flex; align-items: center;
  padding: 0.65rem 1.5rem;
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 500;
  color: #150F06;
  background: linear-gradient(to bottom, #DFC17F, #B0873F);
  text-decoration: none;
  transition: transform 0.15s ease;
  white-space: nowrap;
}
.vione-nav-cta:hover { transform: scale(1.05); }

.vione-nav-overlay {
  position: fixed; inset: 0; z-index: 65;
  background: rgba(11,10,8,0.98);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s ease;
}
.vione-nav-overlay.open { opacity: 1; visibility: visible; }

.vione-nav-overlay-links { display: flex; flex-direction: column; gap: 1.25rem; text-align: center; }
.vione-nav-overlay-link {
  display: flex; align-items: baseline; justify-content: center; gap: 0.85rem;
  font-family: 'Cormorant Garamond', ui-serif, Georgia, serif;
  font-size: 2.4rem; font-weight: 500;
  color: #F4EFE6; text-decoration: none;
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.4s ease, transform 0.4s ease, color 0.2s ease;
}
.vione-nav-overlay.open .vione-nav-overlay-link { opacity: 1; transform: translateY(0); }
.vione-nav-overlay-link:hover { color: #C6A25D; }
.vione-nav-overlay-index {
  font-family: 'Jost', sans-serif; font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.15em; color: #C6A25D;
}

@media (max-width: 640px) {
  .vione-nav { padding: 1.1rem 1.25rem; }
  .vione-nav-logo img { height: 50px; }
  .vione-nav-cta { padding: 0.55rem 1.1rem; font-size: 0.7rem; }
  .vione-nav-overlay-link { font-size: 1.9rem; }
}
`;