"use client";

/**
 * EnquiryForm — The Zora
 * ------------------------------------------------------------
 * Same structure/fields as thezora.in/enquiry (enquiry type,
 * event type, budget, referral source, contact details) but
 * restyled with a premium dark + antique-gold identity instead
 * of the default WordPress theme colors.
 *
 * NOTE: This version uses plain, self-contained CSS (via a single
 * <style> tag scoped under .zora-enquiry) instead of Tailwind utility
 * classes, and inline SVGs instead of an icon package. That means it
 * renders correctly with zero build-config dependency — no Tailwind
 * content-glob setup, no lucide-react install required. Drop it into
 * any React project and it will look right immediately.
 *
 * Fonts: pair a serif display with a clean geometric sans.
 * Add to your root layout / <head> if not already present:
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link
 *     href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap"
 *     rel="stylesheet"
 *   />
 * (If you skip this, it falls back to system serif/sans and still works.)
 */

import { useMemo, useState, type FormEvent } from "react";

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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="zora-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

type EnquiryType = "social" | "corporate";

type FormState = {
  enquiryType: EnquiryType;
  eventType: string;
  budget: string;
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

const BUDGETS = ["50 to 74 Lakhs", "75 to 99 Lakhs", "1 Cr to 1.5 Cr", "Above 1.5 Cr"];

function getInitialEnquiryType(): EnquiryType {
  if (typeof window === "undefined") return "corporate";
  const param = new URLSearchParams(window.location.search).get("type");
  return param === "social" ? "social" : "corporate";
}

export default function EnquiryForm() {
  const [form, setForm] = useState<FormState>(() => ({
    enquiryType: getInitialEnquiryType(),
    eventType: "",
    budget: "",
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

    if (!form.eventType || !form.budget || !form.referral || !form.name || !form.email) {
      setError("Please fill in the required fields before sending your request.");
      return;
    }

    setSubmitting(true);
    try {
      // Replace with your actual endpoint.
      // await fetch("/api/enquiry", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      await new Promise((res) => setTimeout(res, 900));
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="zora-enquiry">
      <style>{CSS}</style>

      <div className="zora-glow" aria-hidden="true" />

      <div className="zora-wrap">
        {/* Header */}
        <div className="zora-header">
          <div className="zora-eyebrow">
            <span className="zora-rule" />
            Enquiry
            <span className="zora-rule" />
          </div>
          <h1 className="zora-title">
            Tell us about your <em>event brief.</em>
          </h1>
          <p className="zora-subtitle">
            Share your business goals, guest scale, and event requirements, and our
            team will come back with a tailored proposal.
          </p>
        </div>

        {submitted ? (
          <div className="zora-card zora-success">
            <IconDiamond size={22} />
            <h2 className="zora-success-title">Request received.</h2>
            <p className="zora-success-copy">
              Thank you — our team will review your brief and reach out shortly with
              a tailored proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="zora-card">
            {/* Enquiry Type */}
            <fieldset className="zora-field">
              <Legend>Enquiry Type</Legend>
              <div className="zora-toggle">
                {(["social", "corporate"] as EnquiryType[]).map((type) => {
                  const active = form.enquiryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={active}
                      onClick={() => switchEnquiryType(type)}
                      className={`zora-toggle-btn${active ? " active" : ""}`}
                    >
                      {type[0].toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Event Type */}
            <fieldset className="zora-field">
              <Legend required>Event Type</Legend>
              <BadgeGroup
                options={eventTypeOptions}
                value={form.eventType}
                onChange={(v) => update("eventType", v)}
              />
            </fieldset>

            {/* Budget */}
            <fieldset className="zora-field">
              <Legend required>Approx Budget</Legend>
              <BadgeGroup options={BUDGETS} value={form.budget} onChange={(v) => update("budget", v)} />
            </fieldset>

            {/* Referral */}
            <fieldset className="zora-field">
              <Legend required>How Did You Hear About Us?</Legend>
              <BadgeGroup
                options={referralOptions}
                value={form.referral}
                onChange={(v) => update("referral", v)}
              />
            </fieldset>

            {/* Contact details */}
            <div className="zora-grid">
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
              <div className="zora-span-2">
                <Field
                  label="Email Address"
                  required
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="you@company.com"
                  type="email"
                />
              </div>
              <div className="zora-span-2">
                <label className="zora-label">Additional Details</label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={3}
                  placeholder="Guest count, preferred dates, anything else we should know"
                  className="zora-textarea"
                />
              </div>
            </div>

            {error && <p className="zora-error">{error}</p>}

            <button type="submit" disabled={submitting} className="zora-submit">
              {submitting ? (
                <>
                  <IconSpinner /> Sending…
                </>
              ) : (
                "Send Request"
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
    <legend className="zora-legend">
      <IconDiamond />
      {children}
      {required && <span className="zora-gold">*</span>}
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
    <div className="zora-badges">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`zora-badge${active ? " active" : ""}`}
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
      <label className="zora-label">
        {label} {required && <span className="zora-gold">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="zora-input"
      />
    </div>
  );
}

const CSS = `
.zora-enquiry {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #0B0A08;
  padding: 4rem 1rem;
  font-family: 'Jost', ui-sans-serif, system-ui, sans-serif;
  box-sizing: border-box;
}
.zora-enquiry *, .zora-enquiry *::before, .zora-enquiry *::after { box-sizing: border-box; }
.zora-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.zora-glow::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 900px;
  height: 520px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(198,162,93,0.07);
  filter: blur(120px);
}
.zora-wrap { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; width: 100%; }
.zora-header { text-align: center; margin-bottom: 2.5rem; }
.zora-eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.35em;
  color: #C6A25D; margin-bottom: 1rem;
}
.zora-rule { height: 1px; width: 2rem; background: rgba(198,162,93,0.4); }
.zora-title {
  font-family: 'Cormorant Garamond', ui-serif, Georgia, serif;
  font-size: 2.1rem; line-height: 1.2; color: #F4EFE6; margin: 0;
  font-weight: 500;
}
.zora-title em { color: #C6A25D; font-style: normal; font-weight: 500; }
@media (min-width: 640px) { .zora-title { font-size: 2.6rem; } }
.zora-subtitle {
  max-width: 420px; margin: 1rem auto 0; font-size: 15px; line-height: 1.6; color: #9B9284;
}
.zora-card {
  border-radius: 1rem;
  border: 1px solid rgba(198,162,93,0.15);
  background: #151310;
  padding: 1.5rem;
  box-shadow: 0 30px 80px -40px rgba(0,0,0,0.8);
}
@media (min-width: 640px) { .zora-card { padding: 2.25rem; } }
.zora-success { text-align: center; padding: 3rem 2rem; color: #C6A25D; }
.zora-success-title {
  font-family: 'Cormorant Garamond', ui-serif, Georgia, serif;
  font-size: 1.5rem; color: #F4EFE6; margin: 1rem 0 0; font-weight: 500;
}
.zora-success-copy { max-width: 340px; margin: 0.75rem auto 0; font-size: 14px; line-height: 1.6; color: #9B9284; }
.zora-field { border: none; padding: 0; margin: 0 0 2rem; }
.zora-legend {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
  color: #9B9284; margin-bottom: 0.75rem; padding: 0;
}
.zora-legend svg { color: #C6A25D; flex-shrink: 0; }
.zora-gold { color: #C6A25D; }
.zora-toggle {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
  border-radius: 999px; border: 1px solid rgba(198,162,93,0.2);
  background: rgba(0,0,0,0.3); padding: 0.25rem;
}
.zora-toggle-btn {
  border-radius: 999px; padding: 0.65rem 1rem; font-size: 0.875rem; font-weight: 500;
  border: none; background: transparent; color: #9B9284; cursor: pointer;
  transition: color 0.15s, background 0.15s; font-family: inherit;
}
.zora-toggle-btn:hover { color: #F4EFE6; }
.zora-toggle-btn.active {
  background: linear-gradient(to bottom, #DFC17F, #B0873F);
  color: #150F06;
}
.zora-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.zora-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border-radius: 999px; border: 1px solid rgba(198,162,93,0.15);
  background: transparent; color: #9B9284; padding: 0.5rem 1rem; font-size: 13px;
  cursor: pointer; transition: border-color 0.15s, color 0.15s, background 0.15s;
  font-family: inherit;
}
.zora-badge:hover { border-color: rgba(198,162,93,0.5); color: #F4EFE6; }
.zora-badge.active {
  border-color: #C6A25D; background: rgba(198,162,93,0.15); color: #F4EFE6;
}
.zora-badge svg { color: #C6A25D; }
.zora-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
@media (min-width: 640px) { .zora-grid { grid-template-columns: 1fr 1fr; } }
.zora-span-2 { grid-column: 1 / -1; }
.zora-label {
  display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
  color: #9B9284; margin-bottom: 0.5rem;
}
.zora-input, .zora-textarea {
  width: 100%; border-radius: 0.5rem; border: 1px solid rgba(198,162,93,0.2);
  background: rgba(0,0,0,0.3); color: #F4EFE6; padding: 0.75rem 1rem; font-size: 14px;
  outline: none; transition: border-color 0.15s; font-family: inherit;
}
.zora-input::placeholder, .zora-textarea::placeholder { color: #645C50; }
.zora-input:focus, .zora-textarea:focus { border-color: rgba(198,162,93,0.7); }
.zora-textarea { resize: none; }
.zora-error {
  border-radius: 0.5rem; border: 1px solid rgba(224,164,153,0.3);
  background: rgba(224,164,153,0.1); color: #E0A499; padding: 0.75rem 1rem;
  font-size: 13px; margin: 0 0 1.5rem;
}
.zora-submit {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; border: none; border-radius: 999px; cursor: pointer;
  background: linear-gradient(to bottom, #DFC17F, #B0873F); color: #150F06;
  padding: 0.9rem 1.5rem; font-size: 14px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.15em;
  transition: transform 0.15s; font-family: inherit;
}
.zora-submit:hover:not(:disabled) { transform: scale(1.01); }
.zora-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.zora-spin { animation: zora-spin 0.8s linear infinite; }
@keyframes zora-spin { to { transform: rotate(360deg); } }
`;