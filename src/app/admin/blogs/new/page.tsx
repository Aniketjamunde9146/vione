"use client";

import Link from "next/link";
import BlogForm from "../BlogForm";

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

export default function NewBlogPage() {
  return (
    <main className="vione-nb">
      <style>{CSS}</style>
      <div className="vione-nb-glow" aria-hidden="true" />

      <div className="vione-nb-header">
        <Link href="/admin/blogs" className="vione-nb-back">
          <IconArrowLeft />
          Back to Blogs
        </Link>

        <div className="vione-nb-eyebrow">
          <span className="vione-nb-rule" />
          New Story
          <span className="vione-nb-rule" />
        </div>
        <h1 className="vione-nb-title">Add a Blog</h1>
      </div>

      <div className="vione-nb-card">
        <BlogForm mode="create" />
      </div>
    </main>
  );
}

const CSS = `
.vione-nb {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 1.75rem 1.25rem 4rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-nb *, .vione-nb *::before, .vione-nb *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-nb { padding: 2.25rem 2rem 5rem; } }
@media (min-width: 1024px) { .vione-nb { padding: 2.5rem 3rem 6rem; } }

.vione-nb-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-nb-glow::before {
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

.vione-nb-header {
  position: relative;
  z-index: 1;
  max-width: 42rem;
  margin: 0 auto 2.5rem;
}

.vione-nb-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #A9A296;
  text-decoration: none;
  transition: color 0.3s ease;
}
.vione-nb-back:hover { color: #E4CFA0; }

.vione-nb-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #C9A876;
}
.vione-nb-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }

.vione-nb-title {
  margin: 0.75rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2rem;
  font-weight: 500;
  color: #EDE7D9;
}
@media (min-width: 640px) { .vione-nb-title { font-size: 2.4rem; } }

.vione-nb-card {
  position: relative;
  z-index: 1;
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(201,168,118,0.15);
  background: #0B1F17;
  box-shadow: 0 30px 80px -40px rgba(0,0,0,0.8);
}
@media (min-width: 640px) { .vione-nb-card { padding: 2.5rem; } }
`;