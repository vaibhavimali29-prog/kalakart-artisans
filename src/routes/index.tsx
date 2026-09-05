import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { HeartHandshake, Languages, ShieldCheck, Sparkles } from "lucide-react";
import hero from "@/assets/hero-artisan.jpg";
import { LanguageSwitch, useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CraftLink AI — Empowering Artisans, Connecting Traditions" },
      {
        name: "description",
        content:
          "Sign in or register as an artisan to sell your handmade crafts with AI-powered cataloguing, pricing and buyer chat.",
      },
      { property: "og:title", content: "CraftLink AI — Empowering Artisans" },
      {
        property: "og:description",
        content: "A simple, secure marketplace account for craftspeople across India.",
      },
    ],
  }),
  component: AuthLanding,
});

function AuthLanding() {
  const { t } = useI18n();
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  const trust = [
    { icon: ShieldCheck, label: t("secureSimple") },
    { icon: Languages, label: t("multilingual") },
    { icon: HeartHandshake, label: t("designedForArtisans") },
  ];

  return (
    <div className="flex min-h-screen justify-center bg-beige">
      <div className="relative flex min-h-screen w-full max-w-[430px] flex-col bg-gradient-surface shadow-float">
        <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
          <img
            src={hero}
            alt="Indian artisan shaping a clay pot by hand"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2b1608]/90 via-[#2b1608]/35 to-transparent" />
          <div className="absolute right-4 top-4">
            <LanguageSwitch />
          </div>
          <div className="absolute bottom-5 left-5 right-5 rise">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 text-[11px] font-bold text-[#2b1608]">
              <Sparkles className="size-3.5" /> AI for Artisans
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ivory">
              {t("brand")}
            </h1>
            <p className="mt-1 text-sm text-ivory/80">{t("tagline")}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 py-6">
          <div className="grid grid-cols-3 gap-2">
            {trust.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl bg-card p-3 text-center shadow-soft"
              >
                <Icon className="mx-auto size-5 text-primary" />
                <p className="mt-1.5 text-[11px] font-semibold leading-tight text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-3 pt-8">
            <Link
              to="/login"
              className="tap flex w-full items-center justify-center rounded-2xl bg-gradient-warm py-4 text-base font-bold text-primary-foreground shadow-card"
            >
              {t("login")}
            </Link>
            <Link
              to="/register"
              className="tap flex w-full items-center justify-center rounded-2xl border border-primary/30 bg-card py-4 text-base font-bold text-primary"
            >
              {t("register")}
            </Link>
            <p className="pt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
              Prototype build. Identity checks run in a clearly labelled demo mode and
              are not connected to UIDAI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
