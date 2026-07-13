"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BlogForm, { BlogFormValues } from "../../BlogForm";

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

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();

  const [initialValues, setInitialValues] = useState<BlogFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setInitialValues(data as BlogFormValues);
      }
      setLoading(false);
    }
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className="vione-eb">
      <style>{CSS}</style>
      <div className="vione-eb-glow" aria-hidden="true" />

      <div className="vione-eb-header">
        <Link href="/admin/blogs" className="vione-eb-back">
          <IconArrowLeft />
          Back to Blogs
        </Link>

        <div className="vione-eb-eyebrow">
          <span className="vione-eb-rule" />
          Edit Story
          <span className="vione-eb-rule" />
        </div>
        <h1 className="vione-eb-title">Edit Blog</h1>
      </div>

      <div className="vione-eb-card">
        {loading && <p className="vione-eb-status">Loading…</p>}
        {!loading && error && (
          <p className="vione-eb-error">Couldn&apos;t load this post — {error}</p>
        )}
        {!loading && !error && initialValues && (
          <BlogForm mode="edit" initialValues={initialValues} />
        )}
      </div>
    </main>
  );
}

const CSS = `
.vione-eb {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 1.75rem 1.25rem 4rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-eb *, .vione-eb *::before, .vione-eb *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-eb { padding: 2.25rem 2rem 5rem; } }
@media (min-width: 1024px) { .vione-eb { padding: 2.5rem 3rem 6rem; } }

.vione-eb-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-eb-glow::before {
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

.vione-eb-header {
  position: relative;
  z-index: 1;
  max-width: 42rem;
  margin: 0 auto 2.5rem;
}

.vione-eb-back {
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
.vione-eb-back:hover { color: #E4CFA0; }

.vione-eb-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #C9A876;
}
.vione-eb-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }

.vione-eb-title {
  margin: 0.75rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2rem;
  font-weight: 500;
  color: #EDE7D9;
}
@media (min-width: 640px) { .vione-eb-title { font-size: 2.4rem; } }

.vione-eb-card {
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
@media (min-width: 640px) { .vione-eb-card { padding: 2.5rem; } }

.vione-eb-status {
  text-align: center;
  color: #A9A296;
  font-size: 14px;
}

.vione-eb-error {
  text-align: center;
  font-size: 13px;
  color: #E4A0A0;
}
`;