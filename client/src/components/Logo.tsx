interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { icon: 32, gap: 8, text: "text-lg" },
  md: { icon: 44, gap: 10, text: "text-2xl" },
  lg: { icon: 64, gap: 14, text: "text-4xl" },
};

export default function Logo({ size = "md", showWordmark = true }: LogoProps) {
  const { icon, gap, text } = sizeMap[size];

  return (
    <div className="flex items-center" style={{ gap }}>
      <svg width={icon} height={icon} viewBox="0 0 120 120" role="img" aria-label="RideSync icon">
        <rect x="0" y="0" width="120" height="120" rx="28" fill="#6d28d9" />
        <circle cx="30" cy="35" r="7" fill="#f472b6" />
        <circle cx="30" cy="85" r="7" fill="#c4b5fd" />
        <path d="M 30 35 C 55 35 52 60 88 60" fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
        <path d="M 30 85 C 55 85 52 60 88 60" fill="none" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
        <circle cx="90" cy="60" r="8" fill="#ffffff" />
      </svg>

      {showWordmark && (
        <span className={`font-extrabold text-surface-900 dark:text-surface-50 ${text}`}>
          Ride<span className="text-accent-500">Sync</span>
        </span>
      )}
    </div>
  );
}