"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function DirectEnquiry() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

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
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-vione-bg px-6 py-24 text-center"
    >
      {/* Heading */}
      <h2
        className={`bg-gradient-to-r from-vione-gold via-vione-goldLight to-vione-gold bg-clip-text font-heading text-4xl italic tracking-wide text-transparent transition-all duration-1000 ease-out md:text-6xl ${
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        Let Us Direct Your Enquiry
      </h2>
      <br />

      {/* Divider */}
      <div
        className={`mt-8 h-px w-16 bg-vione-gold/30 transition-all duration-1000 delay-200 ease-out ${
          inView ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />
      <br />

      {/* Buttons */}
      <div
        className={`mt-10 flex flex-wrap items-center justify-center gap-5 transition-all duration-1000 delay-300 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <Link
          href="/enquiry?type=social"
          className="group inline-flex h-[52px] w-[190px] items-center justify-center rounded-full bg-gradient-to-b from-vione-goldLight to-vione-gold font-heading text-[12px] font-medium uppercase tracking-[0.3em] text-vione-bg shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.04] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          Social
        </Link>

        <Link
          href="/enquiry?type=corporate"
          className="group inline-flex h-[52px] w-[190px] items-center justify-center rounded-full border border-vione-gold/50 bg-transparent font-heading text-[12px] font-medium uppercase tracking-[0.3em] text-vione-gold shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.04] hover:border-vione-gold hover:bg-vione-gold/10"
        >
          Corporate
        </Link>
      </div>
    </section>
  );
}