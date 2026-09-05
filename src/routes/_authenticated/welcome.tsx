import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PartyPopper } from "lucide-react";
import { VerifiedBadge } from "@/components/kk/verified-badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to CraftLink AI" },
      {
        name: "description",
        content: "Your artisan account is ready. Start adding crafts, taking orders and replying to buyers.",
      },
      { property: "og:title", content: "Welcome to CraftLink AI" },
      { property: "og:description", content: "Your artisan account is ready." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { profile } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-beige">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col justify-center bg-gradient-surface px-6 text-center shadow-float">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-warm text-primary-foreground shadow-card">
          <PartyPopper className="size-10" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
          Welcome, {profile?.full_name?.split(" ")[0] ?? "Artisan"}!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("okRegister")}</p>
        <div className="mt-4 flex justify-center">
          <VerifiedBadge status={profile?.verification_status ?? "pending"} />
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard", replace: true })}
          className="tap mt-10 w-full rounded-2xl bg-gradient-warm py-4 text-base font-bold text-primary-foreground shadow-card"
        >
          Go to my shop
        </button>
      </div>
    </div>
  );
}
