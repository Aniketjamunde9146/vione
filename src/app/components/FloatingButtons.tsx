"use client";



import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "+919971716056"; 
const DEFAULT_MESSAGE =
  "Hi Vione! I'd like to know more about your venue and available dates.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  DEFAULT_MESSAGE
)}`;

function IconWhatsApp() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.5 6.5a7.6 7.6 0 0 0-11.9 9.1L4.5 20l4.5-1.1a7.6 7.6 0 0 0 10.9-6.8c0-2-.8-3.9-2.4-5.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className={`vione-float${visible ? " in-view" : ""}`}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Vione on WhatsApp"
          className="vione-float-btn"
        >
          <span className="vione-float-ring" aria-hidden="true" />
          <span className="vione-float-tooltip">Chat with us</span>
          <IconWhatsApp />
        </a>
      </div>
    </>
  );
}

const CSS = `
.vione-float {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 80;
  opacity: 0;
  transform: translateY(14px) scale(0.9);
  transition: opacity 0.5s cubic-bezier(.16,.8,.24,1), transform 0.5s cubic-bezier(.16,.8,.24,1);
}
.vione-float.in-view { opacity: 1; transform: translateY(0) scale(1); }

.vione-float-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #0B1F17;
  border: 1px solid rgba(201,168,118,0.4);
  color: #EDE7D9;
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
  transition: transform 0.25s cubic-bezier(.16,.8,.24,1), border-color 0.25s ease, background 0.25s ease;
}
.vione-float-btn:hover {
  transform: translateY(-3px) scale(1.05);
  border-color: #C9A876;
  background: #123423;
}

.vione-float-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1px solid rgba(201,168,118,0.55);
  animation: vione-float-pulse 2.6s ease-out infinite;
}

@keyframes vione-float-pulse {
  0%   { transform: scale(1);    opacity: 0.7; }
  100% { transform: scale(1.55); opacity: 0; }
}

.vione-float-tooltip {
  position: absolute;
  right: calc(100% + 0.75rem);
  top: 50%;
  transform: translateY(-50%) translateX(6px);
  white-space: nowrap;
  background: #0B1F17;
  border: 1px solid rgba(201,168,118,0.3);
  color: #EDE7D9;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.vione-float-btn:hover .vione-float-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .vione-float { transition: none; opacity: 1; transform: none; }
  .vione-float-ring { animation: none; opacity: 0; }
  .vione-float-btn, .vione-float-tooltip { transition: none; }
}

@media (max-width: 640px) {
  .vione-float { right: 1rem; bottom: 1rem; }
  .vione-float-btn { width: 50px; height: 50px; }
  .vione-float-tooltip { display: none; }
}
`;