import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import type { VerificationStatus } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  if (status === "verified") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-leaf/15 px-2.5 py-1 text-[11px] font-semibold text-leaf", className)}>
        <BadgeCheck className="size-3.5" /> Verified Artisan
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-destructive/12 px-2.5 py-1 text-[11px] font-semibold text-destructive", className)}>
        <ShieldAlert className="size-3.5" /> Verification failed
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-gold/25 px-2.5 py-1 text-[11px] font-semibold text-gold-foreground", className)}>
      <Clock className="size-3.5" /> Verification pending
    </span>
  );
}
