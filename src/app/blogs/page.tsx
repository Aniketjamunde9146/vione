"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLatestPost, getOtherPosts, type BlogPost } from "@/lib/blog-posts";
import DiscoverButton from "../components/DiscoverButton";

function IconAlert({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconArrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="vione-bp-arrow">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostImage({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    setStatus("loading");
    const timer = setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, 3000);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        className="vione-bp-img"
        style={{ opacity: status === "loaded" ? 1 : 0 }}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {status === "loading" && (
        <div className="vione-bp-img-state">
          <span className="vione-bp-spinner" />
        </div>
      )}
      {status === "error" && (
        <div className="vione-bp-img-state vione-bp-img-error">
          <IconAlert />
        </div>
      )}
    </>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export default function BlogPage() {
  const { ref: headerRef, inView: headerInView } = useReveal();

  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const latest = await getLatestPost();
      if (!cancelled) {
        setFeatured(latest);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="vione-bp">
      <style>{CSS}</style>

      <div className="vione-bp-glow" aria-hidden="true" />

      {/* Header */}
      <section
        ref={headerRef as React.RefObject<HTMLElement>}
        className={`vione-bp-hero${headerInView ? " in-view" : ""}`}
      >
        <div className="vione-bp-eyebrow">
          <span className="vione-bp-rule" />
          The Journal
          <span className="vione-bp-rule" />
        </div>
        <h1 className="vione-bp-title">Stories Worth Staying For</h1>
        <p className="vione-bp-subtitle">
          Notes from behind the scenes — the evenings, the details, and the
          people that shape every Vione occasion.
        </p>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="vione-bp-loading">
          <span className="vione-bp-spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !featured && (
        <div className="vione-bp-loading">
          <p style={{ color: "#A9A296", fontSize: "14px" }}>
            No stories published yet — check back soon.
          </p>
        </div>
      )}

      {/* Featured post */}
      {!loading && featured && (
        <section
          className={`vione-bp-featured${headerInView ? " in-view" : ""}`}
        >
          <Link href={`/blogs/${featured.slug}`} className="vione-bp-featured-image">
            <PostImage src={featured.image} alt={featured.title} />
            <div className="vione-bp-featured-overlay" />
            <div className="vione-bp-latest-tag">
              <span>Latest</span>
            </div>
          </Link>

          <div className="vione-bp-featured-body">
            <span className="vione-bp-category">{featured.category}</span>
            <Link href={`/blogs/${featured.slug}`} className="vione-bp-title-link">
              <h2 className="vione-bp-featured-title" title={featured.title}>
                {featured.title}
              </h2>
            </Link>
            <p className="vione-bp-excerpt" title={featured.excerpt}>
              {featured.excerpt}
            </p>
            <div className="vione-bp-meta">
              <span>{formatDate(featured.date)}</span>
              <span className="vione-bp-dot" />
              <span>{featured.readTime}</span>
            </div>

            {featured.tags.length > 0 && (
              <div className="vione-bp-tags">
                {featured.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="vione-bp-tag">
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            )}

            <div className="vione-bp-actions">
              <Link href={`/blogs/${featured.slug}`} className="vione-bp-readmore">
                Read Story
                <IconArrow />
              </Link>

              <Link href="/blogs/all" className="vione-bp-viewall">
                View All
                <IconArrow />
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center justify-center gap-4">
        <DiscoverButton />
      </div>
    </main>
  );
}

const CSS = `
.vione-bp {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 5rem 1.25rem 6rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-bp *, .vione-bp *::before, .vione-bp *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-bp { padding: 6rem 2rem 7rem; } }
@media (min-width: 1024px) { .vione-bp { padding: 7rem 3rem 8rem; } }

.vione-bp-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-bp-glow::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 900px;
  height: 520px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(18,52,35,0.35);
  filter: blur(120px);
}

.vione-bp-loading {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.vione-bp-hero {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 42rem;
  margin: 0 auto 3.5rem;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.vione-bp-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #C9A876;
  opacity: 0;
  transform: translateY(1rem);
  transition: all 0.9s ease-out;
}
.vione-bp-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }
.vione-bp-title {
  margin: 1rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2.2rem;
  font-weight: 500;
  color: #EDE7D9;
  opacity: 0;
  transform: translateY(1.25rem);
  transition: all 0.9s ease-out 0.1s;
}
@media (min-width: 640px) { .vione-bp-title { font-size: 2.8rem; } }
.vione-bp-subtitle {
  margin: 1rem 0 0;
  max-width: 32rem;
  font-size: 15px;
  line-height: 1.7;
  color: #A9A296;
  opacity: 0;
  transform: translateY(1.25rem);
  transition: all 0.9s ease-out 0.2s;
}
.in-view.vione-bp-hero .vione-bp-eyebrow,
.in-view.vione-bp-hero .vione-bp-title,
.in-view.vione-bp-hero .vione-bp-subtitle {
  opacity: 1;
  transform: translateY(0);
}

.vione-bp-featured {
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto 5rem;
  grid-template-columns: 1fr;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgba(201,168,118,0.15);
  background: #0B1F17;
  box-shadow: 0 30px 80px -40px rgba(0,0,0,0.8);
  opacity: 0;
  transform: translateY(2rem);
  transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
}
.vione-bp-featured.in-view { opacity: 1; transform: translateY(0); }
@media (min-width: 768px) {
  .vione-bp-featured { grid-template-columns: 1.1fr 1fr; }
}

.vione-bp-featured-image {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
@media (min-width: 768px) { .vione-bp-featured-image { aspect-ratio: auto; } }
.vione-bp-featured-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(7,19,14,0.75), transparent 60%);
}
.vione-bp-latest-tag {
  position: absolute;
  left: 0.9rem;
  top: 0.9rem;
  border-radius: 999px;
  background: rgba(7,19,14,0.6);
  border: 1px solid rgba(201,168,118,0.25);
  padding: 0.3rem 0.75rem;
  backdrop-filter: blur(6px);
}
.vione-bp-latest-tag span {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #EDE7D9;
}

.vione-bp-featured-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  min-width: 0;
}
@media (min-width: 1024px) { .vione-bp-featured-body { padding: 2.5rem; } }

.vione-bp-category {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #C9A876;
}
.vione-bp-title-link { margin-top: 0.75rem; text-decoration: none; display: block; min-width: 0; }

.vione-bp-featured-title {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.35;
  color: #EDE7D9;
  margin: 0.75rem 0 0;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
.vione-bp-title-link:hover .vione-bp-featured-title { color: #E4CFA0; }
@media (min-width: 768px) { .vione-bp-featured-title { font-size: 1.75rem; } }

.vione-bp-excerpt {
  margin-top: 0.85rem;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #A9A296;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.vione-bp-meta {
  margin-top: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(201,168,118,0.6);
}
.vione-bp-dot { height: 3px; width: 3px; border-radius: 999px; background: rgba(201,168,118,0.5); }

.vione-bp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.1rem;
}
.vione-bp-tag {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: #C9A876;
  background: rgba(201,168,118,0.08);
  border: 1px solid rgba(201,168,118,0.2);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
}

.vione-bp-actions {
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
}

.vione-bp-readmore {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  padding: 0.75rem 1.35rem;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.2s ease;
}
.vione-bp-readmore:hover { transform: scale(1.03); }

.vione-bp-grid-section {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
}
.vione-bp-grid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.vione-bp-grid-title {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.3rem;
  font-weight: 500;
  color: #EDE7D9;
  margin: 0;
}
.vione-bp-viewall {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #A9A296;
  text-decoration: none;
  transition: color 0.3s ease;
}
.vione-bp-viewall:hover { color: #E4CFA0; }
.vione-bp-arrow { transition: transform 0.3s ease; }
.vione-bp-viewall:hover .vione-bp-arrow,
.vione-bp-readmore:hover .vione-bp-arrow { transform: translateX(0.25rem); }

.vione-bp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) { .vione-bp-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .vione-bp-grid { grid-template-columns: 1fr 1fr 1fr; } }

.vione-bp-card {
  display: block;
  border-radius: 0.85rem;
  overflow: hidden;
  border: 1px solid rgba(201,168,118,0.12);
  background: #0B1F17;
  text-decoration: none;
  opacity: 0;
  transform: translateY(1.75rem);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}
.vione-bp-card.in-view { opacity: 1; transform: translateY(0); }
.vione-bp-card:hover {
  border-color: rgba(201,168,118,0.35);
  box-shadow: 0 20px 50px -25px rgba(0,0,0,0.7);
}

.vione-bp-card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.vione-bp-card-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(7,19,14,0.65), transparent 55%);
}
.vione-bp-card-body { padding: 1.25rem 1.35rem 1.5rem; }
.vione-bp-card-title {
  margin: 0.6rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.4;
  color: #EDE7D9;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vione-bp-card:hover .vione-bp-card-title { color: #E4CFA0; }

.vione-bp-img {
  object-fit: cover;
  transition: transform 0.6s ease-out, opacity 0.4s ease-out;
}
.vione-bp-card:hover .vione-bp-img { transform: scale(1.06); }

.vione-bp-img-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B1F17;
  color: rgba(237,231,217,0.5);
}
.vione-bp-img-error { color: rgba(237,231,217,0.55); }
.vione-bp-spinner {
  height: 20px;
  width: 20px;
  border-radius: 999px;
  border: 2px solid rgba(201,168,118,0.25);
  border-top-color: rgba(201,168,118,0.9);
  animation: vione-bp-spin 0.8s linear infinite;
}
@keyframes vione-bp-spin { to { transform: rotate(360deg); } }
`;