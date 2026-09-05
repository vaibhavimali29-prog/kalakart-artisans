import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, MessageCircle, Package, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Phone-shaped viewport used by every KalaKart screen. */
export function Phone({
  children,
  withNav = false,
  className,
}: {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen justify-center bg-beige">
      <div
        className={cn(
          "relative flex min-h-screen w-full max-w-[430px] flex-col bg-gradient-surface shadow-float",
          className,
        )}
      >
        <div className={cn("flex-1", withNav && "pb-32")}>{children}</div>
        {withNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}

const tabs = [
  { to: "/dashboard", label: "Products", icon: ShoppingBag },
  { to: "/orders", label: "Your Orders", icon: Package },
  { to: "/inquiry", label: "Inquiry", icon: MessageCircle },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="pointer-events-none fixed bottom-0 z-40 w-full max-w-[430px] px-4 pb-5">
      <div className="pointer-events-auto flex items-center justify-between gap-1 rounded-4xl border border-border/60 bg-card/95 p-2 shadow-float backdrop-blur">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "tap flex flex-1 items-center justify-center gap-2 rounded-3xl px-3 py-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-gradient-warm text-primary-foreground shadow-card"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className={cn("truncate text-xs", !active && "hidden sm:inline")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  back = true,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-card/90 px-4 py-4 backdrop-blur">
      {back ? (
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate({ to: "/dashboard" })}
          className="tap grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </header>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
