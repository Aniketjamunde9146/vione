"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconList({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email ?? null);

      const { count, error } = await supabase
        .from("blogs")
        .select("*", { count: "exact", head: true });

      if (!error) setBlogCount(count ?? 0);
    }
    load();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="vione-ad">
      <style>{CSS}</style>

      <div className="vione-ad-glow" aria-hidden="true" />

      <div className="vione-ad-topbar">
        <div className="vione-ad-eyebrow">
          <span className="vione-ad-rule" />
          Vione Admin
          <span className="vione-ad-rule" />
        </div>
        <div className="vione-ad-topbar-right">
          {userEmail && (
            <span className="vione-ad-user">Signed in as {userEmail}</span>
          )}
          <button type="button" className="vione-ad-signout" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="vione-ad-body">
        <h1 className="vione-ad-title">Dashboard</h1>
        <p className="vione-ad-subtitle">
          Manage everything from here. Start by adding a new story.
        </p>

        <Link href="/admin/blogs" className="vione-ad-stat-card vione-ad-stat-card-link">
          <span className="vione-ad-stat-label">Total Blog Posts</span>
          <span className="vione-ad-stat-value">
            {blogCount === null ? "—" : blogCount}
          </span>
        </Link>

        <div className="vione-ad-actions">
          <Link href="/admin/blogs/new" className="vione-ad-add-btn">
            <IconPlus />
            Add Blog
          </Link>

          <Link href="/admin/blogs" className="vione-ad-manage-btn">
            <IconList />
            Manage Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}

const CSS = `
.vione-ad {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 2.5rem 1.25rem 4rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-ad *, .vione-ad *::before, .vione-ad *::after { box-sizing: border-box; }
@media (min-width: 640px) { .vione-ad { padding: 3rem 2rem 5rem; } }

.vione-ad-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-ad-glow::before {
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

.vione-ad-topbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 72rem;
  margin: 0 auto 3.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.vione-ad-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #C9A876;
}
.vione-ad-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }

.vione-ad-topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vione-ad-user {
  font-size: 12.5px;
  color: #A9A296;
}

.vione-ad-signout {
  border: 1px solid rgba(201,168,118,0.2);
  background: transparent;
  color: #A9A296;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vione-ad-signout:hover {
  border-color: rgba(201,168,118,0.5);
  color: #EDE7D9;
}

.vione-ad-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 34rem;
  margin: 0 auto;
  padding: 3.5rem 1rem;
}

.vione-ad-title {
  margin: 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2.4rem;
  font-weight: 500;
  color: #EDE7D9;
}
@media (min-width: 640px) { .vione-ad-title { font-size: 2.8rem; } }

.vione-ad-subtitle {
  margin: 1rem 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: #A9A296;
}

.vione-ad-stat-card {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 2.5rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(201,168,118,0.15);
  background: #0B1F17;
  text-decoration: none;
  transition: border-color 0.25s ease, transform 0.2s ease;
}
.vione-ad-stat-card-link:hover {
  border-color: rgba(201,168,118,0.4);
  transform: translateY(-2px);
}
.vione-ad-stat-label {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(201,168,118,0.75);
}
.vione-ad-stat-value {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2.2rem;
  font-weight: 500;
  color: #EDE7D9;
}

.vione-ad-actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.vione-ad-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  padding: 0.95rem 1.9rem;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.2s ease;
}
.vione-ad-add-btn:hover { transform: scale(1.03); }

.vione-ad-manage-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #EDE7D9;
  background: transparent;
  border: 1px solid rgba(201,168,118,0.25);
  padding: 0.95rem 1.9rem;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.vione-ad-manage-btn:hover {
  border-color: rgba(201,168,118,0.55);
  color: #E4CFA0;
}
`;