import Link from "next/link";

export default function GoldyLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={`goldy-logo ${className}`} aria-label="GoldyHire home">
      <img className="goldy-logo-mark" src="/goldy-mark.png" alt="咕" />
      {!compact && <span className="goldy-logo-word">GoldyHire</span>}
    </Link>
  );
}
