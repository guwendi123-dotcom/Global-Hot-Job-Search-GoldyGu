import Link from "next/link";

export default function GoldyLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={`goldy-logo ${className}`} aria-label="GoldyHire home">
      <svg className="goldy-logo-mark" viewBox="0 0 64 64" role="img" aria-label="咕">
        <circle cx="32" cy="32" r="30" fill="currentColor" />
        <g fill="none" stroke="#24211d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="11" y="22" width="16" height="25" rx="6.5" />
          <path d="M43.5 12v18M34 20h19" />
          <rect x="34" y="34" width="19" height="17" rx="6.5" />
        </g>
      </svg>
      {!compact && <span className="goldy-logo-word">GoldyHire</span>}
    </Link>
  );
}
