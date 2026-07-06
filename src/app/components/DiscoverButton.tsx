"use client";

const INSTAGRAM_URL =
  "https://www.instagram.com/vione_experience?igsh=MWh2ZHE3Z3RjdHJrcw%3D%3D&utm_source=qr";

type DiscoverButtonProps = {
  /** "light" = white pill, black text (for dark/video backgrounds).
   *  "dark"  = black pill, white text (for light backgrounds). */
  variant?: "light" | "dark";
  label?: string;
};

export default function DiscoverButton({
  variant = "light",
  label = "Discover More",
}: DiscoverButtonProps) {
  const isLight = variant === "light";

  const pillBg = isLight ? "bg-white" : "bg-black";
  const textColor = isLight ? "text-black" : "text-white";
  const strokeColor = isLight ? "black" : "white";

  const pillClasses = `relative flex items-center justify-center h-[32px] w-[200px] hover:w-[255px] rounded-full ${pillBg} overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none motion-reduce:hover:w-[200px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]`;

  const textClasses = `relative z-10 text-[12px] md:text-[13px] font-medium uppercase tracking-[0.28em] ${textColor} transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 group-hover:-translate-x-5`;

  const arrowClasses =
    "absolute right-6 flex items-center justify-center opacity-0 translate-x-4 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none group-hover:opacity-100 group-hover:translate-x-0";

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — opens Vione on Instagram in a new tab`}
      className="group inline-block"
    >
      <div className={pillClasses}>
        {/* Text */}
        <span className={textClasses}>{label.toUpperCase()}</span>

        {/* Arrow */}
        <span className={arrowClasses}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  );
}