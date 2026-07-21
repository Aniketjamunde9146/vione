"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const INSTAGRAM_URL =
  "https://www.instagram.com/vione_experience?igsh=MWh2ZHE3Z3RjdHJrcw%3D%3D&utm_source=qr";

export default function SeoContent() {
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
    <section ref={ref} className={`vione-seo${inView ? " in-view" : ""}`}>
      <style>{CSS}</style>

      <div className="vione-seo-inner">
        <h2 className="vione-seo-heading">
          Delhi&rsquo;s Premier Luxury Banquet Hall &amp; Event Venue
        </h2>

        <div className="vione-seo-body">
          <p>
            Vione is a{" "}
            <strong className="vione-seo-strong">
              luxury banquet hall in Delhi
            </strong>{" "}
            designed for celebrations that deserve nothing less than
            perfection. From grand entrances to curated interiors, every
            corner of our venue is crafted to turn an occasion into an
            experience your guests will remember long after the evening ends.
          </p>

          <p>
            As a sought-after{" "}
            <Link href="/enquiry" className="vione-seo-link">
              wedding venue in Delhi
            </Link>
            , Vione brings together elegant banquet spaces, personalised
            décor, and dedicated event teams to host everything from intimate
            engagement ceremonies to full-scale wedding receptions. Our
            spaces are built to flex — whether you&rsquo;re planning a
            traditional baraat, a cocktail reception, or a destination-style
            wedding within the city.
          </p>

          <p>
            Beyond weddings, Vione is equally at home as a{" "}
            <Link href="/enquiry" className="vione-seo-link">
              corporate event space in Delhi
            </Link>
            . Product launches, annual conferences, business conclaves, and
            leadership summits all benefit from our combination of premium
            infrastructure, professional AV support, and hospitality that
            keeps every attendee comfortable from arrival to close.
          </p>

          <p>
            Looking for a{" "}
            <Link href="/enquiry" className="vione-seo-link">
              birthday party venue
            </Link>{" "}
            that feels effortlessly upscale? Vione&rsquo;s banquet halls
            adapt to celebrations of every size — from milestone birthdays
            and anniversaries to festive family gatherings — with in-house
            catering and décor teams handling the details so you don&rsquo;t
            have to.
          </p>

          <p>
            For engagement ceremonies and reception venues, Vione offers a
            refined backdrop that balances grandeur with warmth, making it a
            preferred choice for couples across Delhi NCR planning their
            engagement and reception functions together or separately.
          </p>

          <p>
            When it comes to{" "}
            <Link href="/enquiry" className="vione-seo-link">
              conference and business events
            </Link>
            , our venue is equipped to support seminars, board meetings, and
            multi-day conferences with reliable connectivity, seating
            configurations tailored to your agenda, and catering options
            suited to a professional setting.
          </p>

          <p>
            Explore our{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="vione-seo-link"
            >
              gallery
            </a>{" "}
            to see past events at Vione, or{" "}
            <Link href="/enquiry" className="vione-seo-link">
              get in touch
            </Link>{" "}
            with our team to check availability and start planning your event
            at Delhi&rsquo;s most versatile luxury venue.
          </p>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.vione-seo {
  position: relative;
  background: #0B1F17;
  border-top: 1px solid rgba(201,168,118,0.15);
  padding: 5rem 2rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  color: #A9A296;
}
.vione-seo *, .vione-seo *::before, .vione-seo *::after { box-sizing: border-box; }

.vione-seo-inner {
  max-width: 860px;
  margin: 0 auto;
}

.vione-seo-heading {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #E4CFA0;
  margin: 0 0 1.75rem;

  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(.16,.8,.24,1), transform 0.7s cubic-bezier(.16,.8,.24,1);
}
.vione-seo.in-view .vione-seo-heading { opacity: 1; transform: translateY(0); }

.vione-seo-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-size: 14px;
  line-height: 1.75;
  color: #A9A296;
}

.vione-seo-body p {
  margin: 0;

  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.65s cubic-bezier(.16,.8,.24,1), transform 0.65s cubic-bezier(.16,.8,.24,1);
}
.vione-seo.in-view .vione-seo-body p { opacity: 1; transform: translateY(0); }
.vione-seo.in-view .vione-seo-body p:nth-child(1) { transition-delay: 60ms; }
.vione-seo.in-view .vione-seo-body p:nth-child(2) { transition-delay: 120ms; }
.vione-seo.in-view .vione-seo-body p:nth-child(3) { transition-delay: 180ms; }
.vione-seo.in-view .vione-seo-body p:nth-child(4) { transition-delay: 240ms; }
.vione-seo.in-view .vione-seo-body p:nth-child(5) { transition-delay: 300ms; }
.vione-seo.in-view .vione-seo-body p:nth-child(6) { transition-delay: 360ms; }
.vione-seo.in-view .vione-seo-body p:nth-child(7) { transition-delay: 420ms; }

.vione-seo-strong {
  font-weight: 500;
  color: #E4CFA0;
}

.vione-seo-link {
  color: #C9A876;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.15s ease;
}
.vione-seo-link:hover { color: #EDE7D9; }

@media (prefers-reduced-motion: reduce) {
  .vione-seo-heading, .vione-seo-body p { opacity: 1; transform: none; transition: none; }
}

@media (max-width: 640px) {
  .vione-seo { padding: 3.5rem 1.25rem; }
  .vione-seo-heading { font-size: 1.3rem; letter-spacing: 0.18em; }
  .vione-seo-body { font-size: 13.5px; }
}
`;