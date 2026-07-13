"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, type BlogPost } from "@/lib/blog-posts";

function IconAlert({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconArrowLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M11 6l-6 6 6 6"
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
        className="vione-ba-img"
        style={{ opacity: status === "loaded" ? 1 : 0 }}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {status === "loading" && (
        <div className="vione-ba-img-state">
          <span className="vione-ba-spinner" />
        </div>
      )}
      {status === "error" && (
        <div className="vione-ba-img-state vione-ba-img-error">
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

export default function BlogAllPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const posts = await getAllPosts();
      if (!cancelled) {
        setAllPosts(posts);
        setDataLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(
    () =>
      [...allPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [allPosts]
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  useEffect(() => {
    if (dataLoading) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [dataLoading]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory]
  );

  return (
    <main className="vione-ba">
      <style>{CSS}</style>

      <div className="vione-ba-glow" aria-hidden="true" />

      <div className={`vione-ba-header${mounted ? " in-view" : ""}`} ref={headerRef}>
        <br /><br />
        <Link href="/" className="vione-ba-back">
          <IconArrowLeft />
          Back To The Journal
        </Link>

        <div className="vione-ba-eyebrow">
          <span className="vione-ba-rule" />
          Full Archive
          <span className="vione-ba-rule" />
        </div>
        <h1 className="vione-ba-title">Every Story, All In One Place</h1>

        {!dataLoading && posts.length > 0 && (
          <div className="vione-ba-filters">
            {categories.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={`vione-ba-filter${active ? " active" : ""}`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {dataLoading ? (
        <div className="vione-ba-empty in-view">
          <span className="vione-ba-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`vione-ba-empty${mounted ? " in-view" : ""}`}>
          <p>No stories in this category yet — check back soon.</p>
        </div>
      ) : (
        <div className="vione-ba-grid">
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              style={{ transitionDelay: mounted ? `${Math.min(i, 8) * 80}ms` : "0ms" }}
              className={`vione-ba-card${mounted ? " in-view" : ""}`}
            >
              <div className="vione-ba-card-image">
                <PostImage src={post.image} alt={post.title} />
                <div className="vione-ba-card-overlay" />
              </div>
              <div className="vione-ba-card-body">
                <span className="vione-ba-category">{post.category}</span>
                <h3 className="vione-ba-card-title">{post.title}</h3>
                <p className="vione-ba-card-excerpt">{post.excerpt}</p>
                <div className="vione-ba-meta">
                  <span>{formatDate(post.date)}</span>
                  <span className="vione-ba-dot" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

const CSS = `
.vione-ba {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 9rem 2.25rem 9rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-ba *, .vione-ba *::before, .vione-ba *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-ba { padding: 6rem 2rem 7rem; } }
@media (min-width: 1024px) { .vione-ba { padding: 7rem 3rem 8rem; } }

.vione-ba-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-ba-glow::before {
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

.vione-ba-header {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 42rem;
  margin: 0 auto 3.5rem;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.vione-ba-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 12px;
  margin-bottom: 2rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #A9A296;
  text-decoration: none;
  opacity: 0;
  transform: translateY(0.75rem);
  transition: all 0.8s ease-out, color 0.3s ease;
}
.vione-ba-back:hover { color: #E4CFA0; }
.in-view .vione-ba-back { opacity: 1; transform: translateY(0); }

.vione-ba-eyebrow {
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
  transition: all 0.9s ease-out 0.1s;
}
.vione-ba-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }
.in-view .vione-ba-eyebrow { opacity: 1; transform: translateY(0); }

.vione-ba-title {
  margin: 1rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2.1rem;
  font-weight: 500;
  color: #EDE7D9;
  opacity: 0;
  transform: translateY(1.25rem);
  transition: all 0.9s ease-out 0.2s;
}
@media (min-width: 640px) { .vione-ba-title { font-size: 2.6rem; } }
.in-view .vione-ba-title { opacity: 1; transform: translateY(0); }

.vione-ba-filters {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  opacity: 0;
  transform: translateY(1.25rem);
  transition: all 0.9s ease-out 0.3s;
}
.in-view .vione-ba-filters { opacity: 1; transform: translateY(0); }

.vione-ba-filter {
  border-radius: 999px;
  border: 1px solid rgba(201,168,118,0.2);
  background: transparent;
  color: #A9A296;
  padding: 0.5rem 1.1rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vione-ba-filter:hover { border-color: rgba(201,168,118,0.5); color: #EDE7D9; }
.vione-ba-filter.active {
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  border-color: transparent;
  color: #07130E;
}

.vione-ba-empty {
  position: relative;
  z-index: 1;
  max-width: 30rem;
  margin: 4rem auto 0;
  text-align: center;
  color: #A9A296;
  font-size: 14px;
  opacity: 0;
  display: flex;
  justify-content: center;
  transition: opacity 0.8s ease-out 0.35s;
}
.vione-ba-empty.in-view { opacity: 1; }

.vione-ba-grid {
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  max-width: 78rem;
  margin: 0 auto;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}
@media (min-width: 640px) { .vione-ba-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .vione-ba-grid { grid-template-columns: 1fr 1fr 1fr; } }

.vione-ba-card {
  display: block;
  border-radius: 0.9rem;
  overflow: hidden;
  border: 1px solid rgba(201,168,118,0.12);
  background: #0B1F17;
  text-decoration: none;
  opacity: 0;
  transform: translateY(1.75rem);
  transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}
.vione-ba-card.in-view { opacity: 1; transform: translateY(0); }
.vione-ba-card:hover {
  border-color: rgba(201,168,118,0.35);
  box-shadow: 0 20px 50px -25px rgba(0,0,0,0.7);
}

.vione-ba-card-image { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
.vione-ba-card-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(7,19,14,0.65), transparent 55%);
}
.vione-ba-card-body { padding: 1.35rem 1.4rem 1.6rem; }

.vione-ba-category {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #C9A876;
}
.vione-ba-card-title {
  margin: 0.6rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.4;
  color: #EDE7D9;
  transition: color 0.3s ease;
}
.vione-ba-card:hover .vione-ba-card-title { color: #E4CFA0; }
.vione-ba-card-excerpt {
  margin-top: 0.5rem;
  font-size: 13.5px;
  line-height: 1.6;
  color: #A9A296;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vione-ba-meta {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(201,168,118,0.6);
}
.vione-ba-dot { height: 3px; width: 3px; border-radius: 999px; background: rgba(201,168,118,0.5); }

.vione-ba-img {
  object-fit: cover;
  transition: transform 0.6s ease-out, opacity 0.4s ease-out;
}
.vione-ba-card:hover .vione-ba-img { transform: scale(1.06); }

.vione-ba-img-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B1F17;
  color: rgba(237,231,217,0.5);
}
.vione-ba-img-error { color: rgba(237,231,217,0.55); }
.vione-ba-spinner {
  height: 20px;
  width: 20px;
  border-radius: 999px;
  border: 2px solid rgba(201,168,118,0.25);
  border-top-color: rgba(201,168,118,0.9);
  animation: vione-ba-spin 0.8s linear infinite;
}
@keyframes vione-ba-spin { to { transform: rotate(360deg); } }
`;