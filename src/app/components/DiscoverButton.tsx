"use client";

const INSTAGRAM_URL =
  "https://www.instagram.com/vione_experience?igsh=MWh2ZHE3Z3RjdHJrcw%3D%3D&utm_source=qr";

type DiscoverButtonProps = {
  variant?: "gold" | "outline";
  label?: string;
};

export default function DiscoverButton({
  variant = "gold",
  label = "Discover More",
}: DiscoverButtonProps) {
  const isGold = variant === "gold";

  const pillClasses = `relative flex items-center justify-center h-[34px] w-[200px] hover:w-[255px] rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none motion-reduce:hover:w-[200px] shadow-badge ${
    isGold
      ? "bg-gradient-to-r from-vione-gold to-vione-goldLight"
      : "bg-transparent border border-vione-gold/70"
  }`;

  const textColor = isGold ? "text-vione-bg" : "text-vione-gold";
  const strokeColor = isGold ? "#07130E" : "#C9A876";

  const textClasses = `relative z-10 text-[12px] md:text-[13px] font-heading font-medium uppercase tracking-[0.28em] ${textColor} transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-x-5`;

  const arrowClasses =
    "absolute right-6 flex items-center justify-center opacity-0 translate-x-4 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100 group-hover:translate-x-0";

  return (
    <div className="relative inline-flex items-center justify-center p-4">
      {/* Soft glow behind the glass container — deep green bleeding out */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-vione-green/40 blur-2xl"
      />

      {/* Glass badge container — dark green liquid backing */}
      <div className="relative rounded-full border border-vione-gold/15 bg-vione-deep/30 px-3 py-2.5 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} — opens Vione on Instagram in a new tab`}
          className="group inline-block"
        >
          <div className={pillClasses}>
            <span className={textClasses}>{label.toUpperCase()}</span>
            <span className={arrowClasses}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H18" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M12 6L18 12L12 18"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}