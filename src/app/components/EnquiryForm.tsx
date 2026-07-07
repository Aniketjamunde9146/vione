"use client";



import { useMemo, useState, type FormEvent } from "react";

const WHATSAPP_NUMBER = "+919971716056";

function IconDiamond({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" transform="rotate(45 5 5)" />
    </svg>
  );
}

function IconCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSpinner({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="vione-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

type EnquiryType = "social" | "corporate";

type FormState = {
  enquiryType: EnquiryType;
  eventType: string;
  referral: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EVENT_TYPES: Record<EnquiryType, string[]> = {
  social: [
    "Wedding",
    "Engagement",
    "Private Dinner",
    "Birthday Celebration",
    "Other Social Event",
  ],
  corporate: [
    "Conference",
    "Brand Launch",
    "Award Night",
    "Team Offsite",
    "Other Corporate Event",
  ],
};

const REFERRAL_SOURCES: Record<EnquiryType, string[]> = {
  social: ["Instagram", "Google Search", "Personal Referral", "Visited an Event", "Other"],
  corporate: ["LinkedIn", "Google Search", "Business Referral", "Instagram", "Other"],
};

function getInitialEnquiryType(): EnquiryType {
  if (typeof window === "undefined") return "corporate";
  const param = new URLSearchParams(window.location.search).get("type");
  return param === "social" ? "social" : "corporate";
}

function buildWhatsAppMessage(form: FormState): string {
  const lines = [
    `*New Enquiry — Vione*`,
    ``,
    `*Type:* ${form.enquiryType === "social" ? "Social" : "Corporate"}`,
    `*Event Type:* ${form.eventType}`,
    `*Heard About Us Via:* ${form.referral}`,
    ``,
    `*Name:* ${form.name}`,
    `*Email:* ${form.email}`,
    form.phone ? `*Phone:* ${form.phone}` : null,
    form.message ? `` : null,
    form.message ? `*Additional Details:*` : null,
    form.message ? form.message : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export default function EnquiryForm() {
  const [form, setForm] = useState<FormState>(() => ({
    enquiryType: getInitialEnquiryType(),
    eventType: "",
    referral: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventTypeOptions = useMemo(() => EVENT_TYPES[form.enquiryType], [form.enquiryType]);
  const referralOptions = useMemo(() => REFERRAL_SOURCES[form.enquiryType], [form.enquiryType]);

  function switchEnquiryType(next: EnquiryType) {
    setForm((prev) => ({
      ...prev,
      enquiryType: next,
      eventType: "",
      referral: "",
    }));
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.eventType || !form.referral || !form.name || !form.email) {
      setError("Please fill in the required fields before sending your request.");
      return;
    }

    setSubmitting(true);
    try {
      const text = buildWhatsAppMessage(form);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setSubmitted(true);
    } catch {
      setError("Something went wrong opening WhatsApp. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vione-enquiry">
      <style>{CSS}</style>

      <div className="vione-glow" aria-hidden="true" />

      <div className="vione-wrap">
        {/* Header */}
        <div className="vione-header">
          <div className="vione-eyebrow">
            <span className="vione-rule" />
            Enquiry
            <span className="vione-rule" />
          </div>
          <h1 className="vione-title">
            Tell us about your <em>event brief.</em>
          </h1>
          <p className="vione-subtitle">
            Share your business goals, guest scale, and event requirements — we'll
            open WhatsApp with your details prefilled so our team can respond
            right away.
          </p>
        </div>

        {submitted ? (
          <div className="vione-card vione-success">
            <IconDiamond size={22} />
            <h2 className="vione-success-title">Request sent.</h2>
            <p className="vione-success-copy">
              We've opened WhatsApp with your details prefilled — just hit send
              there, and our team will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="vione-card">
            {/* Enquiry Type */}
            <fieldset className="vione-field">
              <Legend>Enquiry Type</Legend>
              <div className="vione-toggle">
                {(["social", "corporate"] as EnquiryType[]).map((type) => {
                  const active = form.enquiryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={active}
                      onClick={() => switchEnquiryType(type)}
                      className={`vione-toggle-btn${active ? " active" : ""}`}
                    >
                      {type[0].toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Event Type */}
            <fieldset className="vione-field">
              <Legend required>Event Type</Legend>
              <BadgeGroup
                options={eventTypeOptions}
                value={form.eventType}
                onChange={(v) => update("eventType", v)}
              />
            </fieldset>

            {/* Referral */}
            <fieldset className="vione-field">
              <Legend required>How Did You Hear About Us?</Legend>
              <BadgeGroup
                options={referralOptions}
                value={form.referral}
                onChange={(v) => update("referral", v)}
              />
            </fieldset>

            {/* Contact details */}
            <div className="vione-grid">
              <Field
                label="Full Name"
                required
                value={form.name}
                onChange={(v) => update("name", v)}
                placeholder="Your name"
              />
              <Field
                label="Phone Number"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                placeholder="+91"
                type="tel"
              />
              <div className="vione-span-2">
                <Field
                  label="Email Address"
                  required
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="you@company.com"
                  type="email"
                />
              </div>
              <div className="vione-span-2">
                <label className="vione-label">Additional Details</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={3}
                  placeholder="Guest count, preferred dates, anything else we should know"
                  className="vione-textarea"
                />
              </div>
            </div>

            {error && <p className="vione-error">{error}</p>}

            <button type="submit" disabled={submitting} className="vione-submit">
              {submitting ? (
                <>
                  <IconSpinner /> Opening WhatsApp…
                </>
              ) : (
                "Send via WhatsApp"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Legend({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <legend className="vione-legend">
      <IconDiamond />
      {children}
      {required && <span className="vione-gold">*</span>}
    </legend>
  );
}

function BadgeGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="vione-badges">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`vione-badge${active ? " active" : ""}`}
          >
            {active && <IconCheck />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="vione-label">
        {label} {required && <span className="vione-gold">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="vione-input"
      />
    </div>
  );
}

const CSS = `
.vione-enquiry {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #07130E;
  padding: 4rem 1rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  box-sizing: border-box;
}
.vione-enquiry *, .vione-enquiry *::before, .vione-enquiry *::after { box-sizing: border-box; }
.vione-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.vione-glow::before {
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
.vione-wrap { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; width: 100%; }
.vione-header { text-align: center; margin-bottom: 2.5rem; }
.vione-eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.35em;
  color: #C9A876; margin-bottom: 1rem;
}
.vione-rule { height: 1px; width: 2rem; background: rgba(201,168,118,0.4); }
.vione-title {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 2.1rem; line-height: 1.2; color: #EDE7D9; margin: 0;
  font-weight: 500;
}
.vione-title em { color: #E4CFA0; font-style: normal; font-weight: 500; }
@media (min-width: 640px) { .vione-title { font-size: 2.6rem; } }
.vione-subtitle {
  max-width: 420px; margin: 1rem auto 0; font-size: 15px; line-height: 1.6; color: #A9A296;
}
.vione-card {
  border-radius: 1rem;
  border: 1px solid rgba(201,168,118,0.15);
  background: #0B1F17;
  padding: 1.5rem;
  box-shadow: 0 30px 80px -40px rgba(0,0,0,0.8);
}
@media (min-width: 640px) { .vione-card { padding: 2.25rem; } }
.vione-success { text-align: center; padding: 3rem 2rem; color: #C9A876; }
.vione-success-title {
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.5rem; color: #EDE7D9; margin: 1rem 0 0; font-weight: 500;
}
.vione-success-copy { max-width: 340px; margin: 0.75rem auto 0; font-size: 14px; line-height: 1.6; color: #A9A296; }
.vione-field { border: none; padding: 0; margin: 0 0 2rem; }
.vione-legend {
  display: flex; align-items: center; gap: 0.5rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
  color: #A9A296; margin-bottom: 0.75rem; padding: 0;
}
.vione-legend svg { color: #C9A876; flex-shrink: 0; }
.vione-gold { color: #C9A876; }
.vione-toggle {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
  border-radius: 999px; border: 1px solid rgba(201,168,118,0.2);
  background: rgba(0,0,0,0.3); padding: 0.25rem;
}
.vione-toggle-btn {
  border-radius: 999px; padding: 0.65rem 1rem; font-size: 0.875rem; font-weight: 500;
  border: none; background: transparent; color: #A9A296; cursor: pointer;
  transition: color 0.15s, background 0.15s; font-family: inherit;
}
.vione-toggle-btn:hover { color: #EDE7D9; }
.vione-toggle-btn.active {
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  color: #07130E;
}
.vione-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.vione-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border-radius: 999px; border: 1px solid rgba(201,168,118,0.15);
  background: transparent; color: #A9A296; padding: 0.5rem 1rem; font-size: 13px;
  cursor: pointer; transition: border-color 0.15s, color 0.15s, background 0.15s;
  font-family: inherit;
}
.vione-badge:hover { border-color: rgba(201,168,118,0.5); color: #EDE7D9; }
.vione-badge.active {
  border-color: #C9A876; background: rgba(201,168,118,0.15); color: #EDE7D9;
}
.vione-badge svg { color: #C9A876; }
.vione-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
@media (min-width: 640px) { .vione-grid { grid-template-columns: 1fr 1fr; } }
.vione-span-2 { grid-column: 1 / -1; }
.vione-label {
  display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
  color: #A9A296; margin-bottom: 0.5rem;
}
.vione-input, .vione-textarea {
  width: 100%; border-radius: 0.5rem; border: 1px solid rgba(201,168,118,0.2);
  background: rgba(0,0,0,0.3); color: #EDE7D9; padding: 0.75rem 1rem; font-size: 14px;
  outline: none; transition: border-color 0.15s; font-family: inherit;
}
.vione-input::placeholder, .vione-textarea::placeholder { color: #5C6A61; }
.vione-input:focus, .vione-textarea:focus { border-color: rgba(201,168,118,0.7); }
.vione-textarea { resize: none; }
.vione-error {
  border-radius: 0.5rem; border: 1px solid rgba(224,164,153,0.3);
  background: rgba(224,164,153,0.1); color: #E0A499; padding: 0.75rem 1rem;
  font-size: 13px; margin: 0 0 1.5rem;
}
.vione-submit {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; border: none; border-radius: 999px; cursor: pointer;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876); color: #07130E;
  padding: 0.9rem 1.5rem; font-size: 14px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.15em;
  transition: transform 0.15s; font-family: inherit;
}
.vione-submit:hover:not(:disabled) { transform: scale(1.01); }
.vione-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.vione-spin { animation: vione-spin 0.8s linear infinite; }
@keyframes vione-spin { to { transform: rotate(360deg); } }
`;