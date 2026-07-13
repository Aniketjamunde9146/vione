"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="vione-al">
      <style>{CSS}</style>

      <div className="vione-al-glow" aria-hidden="true" />

      <div className="vione-al-card">
        <div className="vione-al-eyebrow">
          <span className="vione-al-rule" />
          Vione Admin
          <span className="vione-al-rule" />
        </div>

        <h1 className="vione-al-title">Welcome Back</h1>
        <p className="vione-al-subtitle">
          Sign in to manage stories, halls, and enquiries.
        </p>

        <form className="vione-al-form" onSubmit={handleSubmit}>
          <label className="vione-al-field">
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vione.com"
            />
          </label>

          <label className="vione-al-field">
            <span>Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="vione-al-error">{error}</p>}

          <button type="submit" className="vione-al-submit" disabled={loading}>
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

const CSS = `
.vione-al {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #07130E;
  padding: 2rem 1.25rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}
.vione-al *, .vione-al *::before, .vione-al *::after { box-sizing: border-box; }

.vione-al-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-al-glow::before {
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

.vione-al-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.75rem 2.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(201,168,118,0.15);
  background: #0B1F17;
  box-shadow: 0 30px 80px -40px rgba(0,0,0,0.8);
}

.vione-al-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #C9A876;
}
.vione-al-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }

.vione-al-title {
  margin: 1rem 0 0;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.9rem;
  font-weight: 500;
  color: #EDE7D9;
}

.vione-al-subtitle {
  margin: 0.6rem 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #A9A296;
}

.vione-al-form {
  margin-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  text-align: left;
}

.vione-al-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.vione-al-field span {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(201,168,118,0.75);
}
.vione-al-field input {
  width: 100%;
  border-radius: 0.6rem;
  border: 1px solid rgba(201,168,118,0.2);
  background: rgba(237,231,217,0.03);
  color: #EDE7D9;
  padding: 0.75rem 0.9rem;
  font-size: 14px;
  font-family: var(--font-body, 'Manrope'), sans-serif;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.vione-al-field input::placeholder { color: rgba(169,162,150,0.5); }
.vione-al-field input:focus {
  border-color: rgba(201,168,118,0.6);
  background: rgba(237,231,217,0.05);
}

.vione-al-error {
  margin: 0;
  font-size: 13px;
  color: #E4A0A0;
  background: rgba(228,160,160,0.08);
  border: 1px solid rgba(228,160,160,0.25);
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
}

.vione-al-submit {
  margin-top: 0.5rem;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  padding: 0.85rem 1.35rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.vione-al-submit:hover { transform: scale(1.02); }
.vione-al-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;