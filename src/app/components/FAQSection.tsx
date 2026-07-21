"use client";

import { useEffect, useRef, useState } from "react";

const FAQS = [
  {
    question: "What is the capacity of Vione?",
    answer:
      "Vione's banquet halls are designed to comfortably host events of varying sizes, from intimate gatherings to large-scale weddings and corporate functions. Contact our team with your guest count for an exact seating and floor plan.",
  },
  {
    question: "Do you host corporate events?",
    answer:
      "Yes. Vione regularly hosts corporate events including product launches, conferences, seminars, and business meetings, with AV support and flexible seating arrangements.",
  },
  {
    question: "Is catering available?",
    answer:
      "Yes, in-house catering is available at Vione, with customisable menus to suit weddings, corporate events, and private celebrations.",
  },
  {
    question: "Can I book Vione for weddings?",
    answer:
      "Absolutely. Vione is a premier wedding venue in Delhi, hosting engagement ceremonies, wedding functions, and receptions with dedicated event planning support.",
  },
  {
    question: "Is parking available?",
    answer:
      "Yes, on-site parking is available for guests attending events at Vione.",
  },
];

function IconDiamond() {
  return (
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="vione-faq-diamond">
      <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" transform="rotate(45 5 5)" />
    </svg>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only reveal once
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section ref={ref} className={`vione-faq${inView ? " in-view" : ""}`}>
      <style>{CSS}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="vione-faq-inner">
        <h2 className="vione-faq-heading">
          <IconDiamond /> Frequently Asked Questions
        </h2>

        <div className="vione-faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`vione-faq-item${isOpen ? " open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="vione-faq-question"
                >
                  <span>{faq.question}</span>
                  <span className="vione-faq-icon" aria-hidden="true">
                    +
                  </span>
                </button>
                <div className="vione-faq-answer-wrap">
                  <p className="vione-faq-answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.vione-faq {
  position: relative;
  background: #0B1F17;
  border-top: 1px solid rgba(201,168,118,0.15);
  padding: 5rem 2rem;
  font-family: var(--font-body, 'Manrope'), ui-sans-serif, system-ui, sans-serif;
  color: #A9A296;
}
.vione-faq *, .vione-faq *::before, .vione-faq *::after { box-sizing: border-box; }

.vione-faq-inner {
  max-width: 760px;
  margin: 0 auto;
}

.vione-faq-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: var(--font-heading, 'Cinzel'), ui-serif, Georgia, serif;
  font-size: 1.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #E4CFA0;
  text-align: center;
  margin: 0 0 3rem;

  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(.16,.8,.24,1), transform 0.7s cubic-bezier(.16,.8,.24,1);
}
.vione-faq.in-view .vione-faq-heading { opacity: 1; transform: translateY(0); }

.vione-faq-diamond { color: #C9A876; flex-shrink: 0; }

.vione-faq-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(201,168,118,0.15);
}

.vione-faq-item {
  border-bottom: 1px solid rgba(201,168,118,0.15);

  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s cubic-bezier(.16,.8,.24,1), transform 0.6s cubic-bezier(.16,.8,.24,1);
}
.vione-faq.in-view .vione-faq-item { opacity: 1; transform: translateY(0); }
.vione-faq.in-view .vione-faq-item:nth-child(1) { transition-delay: 0ms; }
.vione-faq.in-view .vione-faq-item:nth-child(2) { transition-delay: 70ms; }
.vione-faq.in-view .vione-faq-item:nth-child(3) { transition-delay: 140ms; }
.vione-faq.in-view .vione-faq-item:nth-child(4) { transition-delay: 210ms; }
.vione-faq.in-view .vione-faq-item:nth-child(5) { transition-delay: 280ms; }

.vione-faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body, 'Manrope'), sans-serif;
  font-size: 14px;
  color: #EDE7D9;
  transition: color 0.15s ease;
}
.vione-faq-question:hover { color: #E4CFA0; }

.vione-faq-icon {
  flex-shrink: 0;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 1.1rem;
  line-height: 1;
  color: #C9A876;
  transition: transform 0.3s ease;
}
.vione-faq-item.open .vione-faq-icon { transform: rotate(45deg); }

.vione-faq-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.35s ease, opacity 0.3s ease;
}
.vione-faq-item.open .vione-faq-answer-wrap {
  grid-template-rows: 1fr;
  opacity: 1;
}

.vione-faq-answer {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 0.25rem 1.35rem;
  font-size: 14px;
  line-height: 1.7;
  color: #A9A296;
}

@media (prefers-reduced-motion: reduce) {
  .vione-faq-heading, .vione-faq-item { opacity: 1; transform: none; transition: none; }
  .vione-faq-icon, .vione-faq-answer-wrap { transition: none; }
}

@media (max-width: 640px) {
  .vione-faq { padding: 3.5rem 1.25rem; }
  .vione-faq-heading { font-size: 1.3rem; letter-spacing: 0.18em; }
}
`;