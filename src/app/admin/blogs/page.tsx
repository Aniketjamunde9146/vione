"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read_time: string;
  image: string;
  tags: string[];
};

function IconPlus({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminBlogsListPage() {
  const supabase = createClient();

  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts(data ?? []);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This can't be undone.`);
    if (!confirmed) return;

    setDeletingId(id);
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      alert(`Failed to delete: ${error.message}`);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="vione-bl">
      <style>{CSS}</style>
      <div className="vione-bl-glow" aria-hidden="true" />

      <div className="vione-bl-header">
        <Link href="/admin/dashboard" className="vione-bl-back">
          <IconArrowLeft />
          Back to Dashboard
        </Link>

        <div className="vione-bl-heading-row">
          <div>
            <div className="vione-bl-eyebrow">
              <span className="vione-bl-rule" />
              Manage Blogs
              <span className="vione-bl-rule" />
            </div>
            <h1 className="vione-bl-title">All Stories</h1>
          </div>

          <Link href="/admin/blogs/new" className="vione-bl-add-btn">
            <IconPlus />
            Add Blog
          </Link>
        </div>
      </div>

      {loading && <p className="vione-bl-status">Loading…</p>}

      {!loading && error && (
        <p className="vione-bl-error">
          Couldn&apos;t load blogs — {error}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="vione-bl-status">No blog posts yet. Add your first one.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="vione-bl-grid">
          {posts.map((post) => (
            <div key={post.id} className="vione-bl-card">
              <div className="vione-bl-card-image">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="vione-bl-card-body">
                <span className="vione-bl-category">{post.category}</span>
                <h3 className="vione-bl-card-title" title={post.title}>
                  {post.title}
                </h3>
                <p className="vione-bl-card-excerpt">{post.excerpt}</p>

                <div className="vione-bl-meta">
                  <span>{formatDate(post.date)}</span>
                  <span className="vione-bl-dot" />
                  <span>{post.read_time}</span>
                </div>

                <div className="vione-bl-card-actions">
                  <Link href={`/admin/blogs/${post.id}/edit`} className="vione-bl-edit-btn">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="vione-bl-delete-btn"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const CSS = `
.vione-bl {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 1.75rem 1.25rem 4rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-bl *, .vione-bl *::before, .vione-bl *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-bl { padding: 2.25rem 2rem 5rem; } }
@media (min-width: 1024px) { .vione-bl { padding: 2.5rem 3rem 6rem; } }

.vione-bl-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-bl-glow::before {
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

.vione-bl-header {
  position: relative;
  z-index: 1;
  max-width: 78rem;
  margin: 0 auto 2.5rem;
}

.vione-bl-back {
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
.vione-bl-back:hover { color: #E4CFA0; }

.vione-bl-heading-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.vione-bl-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #C9A876;
}
.vione-bl-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }

.vione-bl-title {
  margin: 0.75rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2rem;
  font-weight: 500;
  color: #EDE7D9;
}
@media (min-width: 640px) { .vione-bl-title { font-size: 2.4rem; } }

.vione-bl-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  padding: 0.8rem 1.5rem;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s ease;
}
.vione-bl-add-btn:hover { transform: scale(1.03); }

.vione-bl-status {
  position: relative;
  z-index: 1;
  max-width: 78rem;
  margin: 2rem auto 0;
  text-align: center;
  color: #A9A296;
  font-size: 14px;
}

.vione-bl-error {
  position: relative;
  z-index: 1;
  max-width: 78rem;
  margin: 2rem auto 0;
  text-align: center;
  font-size: 13px;
  color: #E4A0A0;
}

.vione-bl-grid {
  position: relative;
  z-index: 1;
  display: grid;
  max-width: 78rem;
  margin: 0 auto;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) { .vione-bl-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .vione-bl-grid { grid-template-columns: 1fr 1fr 1fr; } }

.vione-bl-card {
  border-radius: 0.85rem;
  overflow: hidden;
  border: 1px solid rgba(201,168,118,0.12);
  background: #0B1F17;
}

.vione-bl-card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.vione-bl-card-body { padding: 1.25rem 1.35rem 1.5rem; }

.vione-bl-category {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #C9A876;
}

.vione-bl-card-title {
  margin: 0.6rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.4;
  color: #EDE7D9;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.vione-bl-card-excerpt {
  margin-top: 0.5rem;
  font-size: 13px;
  line-height: 1.6;
  color: #A9A296;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.vione-bl-meta {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(201,168,118,0.6);
}
.vione-bl-dot { height: 3px; width: 3px; border-radius: 999px; background: rgba(201,168,118,0.5); }

.vione-bl-card-actions {
  margin-top: 1.25rem;
  display: flex;
  gap: 0.75rem;
}

.vione-bl-edit-btn {
  flex: 1;
  text-align: center;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #EDE7D9;
  border: 1px solid rgba(201,168,118,0.25);
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.vione-bl-edit-btn:hover {
  border-color: rgba(201,168,118,0.5);
  color: #E4CFA0;
}

.vione-bl-delete-btn {
  flex: 1;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #E4A0A0;
  background: transparent;
  border: 1px solid rgba(228,160,160,0.25);
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vione-bl-delete-btn:hover {
  border-color: rgba(228,160,160,0.6);
  background: rgba(228,160,160,0.08);
}
.vione-bl-delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
`;