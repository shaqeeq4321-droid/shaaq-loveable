import { Link } from "@tanstack/react-router";

import redLogo from "@/assets/shaaq-red-logo.png";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, className, sub = "Apparels", to = "/" }: { compact?: boolean; className?: string; sub?: string; to?: "/" | "/auto" }) {
  return (
    <Link to={to} className={cn("group inline-flex min-w-0 items-center gap-3", className)}>
      <span className="grid h-11 w-16 shrink-0 place-items-center" aria-hidden="true">
        <img src={redLogo} alt="" width={64} height={44} className="h-10 w-auto object-contain" />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block font-display text-[1.3rem] font-semibold italic text-primary">SHAAQ</span>
          <span className="mt-1 block text-[0.57rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{sub}</span>
        </span>
      )}
    </Link>
  );
}
