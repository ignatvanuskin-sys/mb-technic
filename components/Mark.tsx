/**
 * MB TECHNIC brand mark — an original three-spoke star form (Mercedes-inspired geometry,
 * not a reproduction of any trademarked logo asset).
 */
export function Mark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <path d="M32 10.5V51" />
        <path d="M32 51 14.5 15.5" />
        <path d="M32 51 49.5 15.5" />
      </g>
      <circle cx="32" cy="18" r="3.6" fill="#2F62FF" />
    </svg>
  );
}
