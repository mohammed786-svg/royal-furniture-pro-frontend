type ModernMenuIconProps = {
  className?: string;
  open?: boolean;
};

/**
 * Contemporary menu toggle — rounded bars, balanced spacing (open = X).
 */
export function ModernMenuIcon({
  className = "h-6 w-6",
  open = false,
}: ModernMenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d={open ? "M7 7L17 17" : "M6 8H18"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d={open ? "M17 7L7 17" : "M6 12H18"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {!open && (
        <path
          d="M6 16H18"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
