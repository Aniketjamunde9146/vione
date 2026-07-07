"use client";

/**
 * Footer — Vione
 * ------------------------------------------------------------
 * Brand + tagline, nav links (same routes as Navbar), venue/contact
 * info, and a bottom bar. Self-contained: plain scoped CSS, inline
 * SVG icons — nothing depends on Tailwind or an icon package.
 *
 * Animation: columns fade + rise into place, staggered, the moment
 * the footer enters the viewport (IntersectionObserver), rather than
 * animating on page load where the user wouldn't see it yet.
 *
 * Usage:
 *   import Footer from "@/components/Footer";
 *   ...
 *   <Footer />
 *
 * Replace the placeholder address / phone with your real details
 * before shipping.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Hero", href: "/sections/hero" },
  { label: "Hall One", href: "/sections/hallone" },
  { label: "Hall Two", href: "/sections/halltwo" },
  { label: "Explore", href: "/sections/explore" },
  { label: "Enquiry", href: "/enquiry" },
];

const INSTAGRAM_URL =
  "https://www.instagram.com/vione_experience?igsh=MWh2ZHE3Z3RjdHJrcw%3D%3D&utm_source=qr";
const FACEBOOK_URL =
  "https://www.facebook.com/people/Vione/61575096081743/";
// Clean destination pulled out of the Instagram share-link wrapper —
// the wrapper carries Instagram's own click-tracking params, which
// only make sense for bio-link clicks, not a direct site embed.
const DIRECTIONS_URL = "https://maps.app.goo.gl/Bk3V76HDXZG3YCQd7";

function IconDiamond() {
  return (
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="vione-footer-diamond">
      <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" transform="rotate(45 5 5)" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 8.5h2.2V5.2h-2.2c-2.3 0-4 1.8-4 4.2v1.8H8v3.2h2v6.6h3.3v-6.6h2.4l.5-3.2h-2.9V9.4c0-.6.4-.9 1.2-.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 6L18 12L12 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only reveal once
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className={`vione-footer${inView ? " in-view" : ""}`}>
      <style>{CSS}</style>

      <div className="vione-footer-top">
        <div className="vione-footer-brand">
          <img src="/images/logo.png" alt="Vione" className="vione-footer-logo" />
          <p className="vione-footer-tagline">Where celebrations become legacy.</p>
        </div>

        <div className="vione-footer-col">
          <h4 className="vione-footer-heading">
            <IconDiamond /> Navigate
          </h4>
          <ul className="vione-footer-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="vione-footer-col">
          <h4 className="vione-footer-heading">
            <IconDiamond /> Visit
          </h4>
          <p className="vione-footer-text">
            Gate No.7, CWG Stadium, Akshardham Rd, Commonwealth Games Village, Pandav Nagar
            <br />
            New Delhi, Delhi, 110092
          </p>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="vione-footer-directions"
          >
            Get Directions <IconArrow />
          </a>
        </div>

        <div className="vione-footer-col">
          <h4 className="vione-footer-heading">
            <IconDiamond /> Connect
          </h4>
          <p className="vione-footer-text">
            <a href="mailto:socialmedia.vione@gmail.com">socialmedia.vione@gmail.com</a>
          </p>
          <p className="vione-footer-text">
            <a href="tel:+919971716056">+91 9971716056</a>
          </p>
          <div className="vione-footer-social-row">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vione on Instagram"
              className="vione-footer-social"
            >
              <IconInstagram />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vione on Facebook"
              className="vione-footer-social"
            >
              <IconFacebook />
            </a>
          </div>
        </div>
      </div>

      <div className="vione-footer-bottom">
        <span className="vione-footer-rule" />
        <div className="vione-footer-bottom-row">
          <p>© {year} Vione. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
}

const CSS = `
.vione-footer {
  position: relative;
  background: #0B1F17;
  border-top: 1px solid rgba(201,168,118,0.15);
  padding: 4rem 2rem 2rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  color: #A9A296;
}
.vione-footer *, .vione-footer *::before, .vione-footer *::after { box-sizing: border-box; }

.vione-footer-top {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 3rem;
}

.vione-footer-top > * {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.7s cubic-bezier(.16,.8,.24,1), transform 0.7s cubic-bezier(.16,.8,.24,1);
}
.vione-footer.in-view .vione-footer-top > *  { opacity: 1; transform: translateY(0); }
.vione-footer.in-view .vione-footer-top > *:nth-child(1) { transition-delay: 0ms; }
.vione-footer.in-view .vione-footer-top > *:nth-child(2) { transition-delay: 90ms; }
.vione-footer.in-view .vione-footer-top > *:nth-child(3) { transition-delay: 180ms; }
.vione-footer.in-view .vione-footer-top > *:nth-child(4) { transition-delay: 270ms; }

.vione-footer-bottom {
  opacity: 0;
  transition: opacity 0.8s ease 0.4s;
}
.vione-footer.in-view .vione-footer-bottom { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .vione-footer-top > *, .vione-footer-bottom { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) {
  .vione-footer-top { grid-template-columns: 1fr 1fr; row-gap: 2.5rem; }
}
@media (max-width: 520px) {
  .vione-footer-top { grid-template-columns: 1fr; }
}

.vione-footer-brand { display: flex; flex-direction: column; gap: 0.9rem; }
.vione-footer-logo { height: 56px; width: 60px; }
.vione-footer-tagline {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-style: italic;
  font-size: 1.05rem;
  color: #EDE7D9;
  max-width: 220px;
  line-height: 1.4;
  margin: 0;
}

.vione-footer-heading {
  display: flex; align-items: center; gap: 0.55rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
  color: #C9A876; margin: 0 0 1.1rem;
}
.vione-footer-diamond { color: #C9A876; flex-shrink: 0; }

.vione-footer-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; }
.vione-footer-links a {
  color: #A9A296; text-decoration: none; font-size: 14px;
  transition: color 0.15s ease;
}
.vione-footer-links a:hover { color: #EDE7D9; }

.vione-footer-text { font-size: 14px; line-height: 1.7; margin: 0 0 0.5rem; }
.vione-footer-text a { color: #A9A296; text-decoration: none; transition: color 0.15s ease; }
.vione-footer-text a:hover { color: #EDE7D9; }

.vione-footer-directions {
  display: inline-flex; align-items: center; gap: 0.4rem;
  margin-top: 0.4rem;
  font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 500;
  color: #C9A876; text-decoration: none;
  border-bottom: 1px solid rgba(201,168,118,0.35);
  padding-bottom: 2px;
  transition: color 0.15s ease, border-color 0.15s ease, gap 0.15s ease;
}
.vione-footer-directions:hover { color: #EDE7D9; border-color: rgba(237,231,217,0.5); gap: 0.6rem; }

.vione-footer-social-row { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.5rem; }
.vione-footer-social {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  border: 1px solid rgba(201,168,118,0.3); border-radius: 999px;
  color: #C9A876; transition: border-color 0.15s ease, color 0.15s ease;
}
.vione-footer-social:hover { border-color: #C9A876; color: #EDE7D9; }

.vione-footer-bottom { max-width: 1100px; margin: 0 auto; }
.vione-footer-rule { display: block; height: 1px; width: 100%; background: rgba(201,168,118,0.15); }
.vione-footer-bottom-row {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  gap: 0.5rem; padding-top: 1.5rem; font-size: 12px; color: #5C6A61;
}
.vione-footer-bottom-row p { margin: 0; }
`;