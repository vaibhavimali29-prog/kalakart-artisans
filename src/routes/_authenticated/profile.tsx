import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Banknote,
  Briefcase,
  ChevronRight,
  HelpCircle,
  Languages,
  LogOut,
  Palette,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Phone, ScreenHeader, SectionTitle } from "@/components/kk/shell";
import { languages } from "@/lib/kalakart-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — KalaKart" },
      {
        name: "description",
        content:
          "Manage your artisan profile, choose from 11 Indian languages, and update business and payment information.",
      },
      { property: "og:title", content: "Profile & Settings — KalaKart" },
      {
        property: "og:description",
        content: "Artisan details, language and payment settings.",
      },
    ],
  }),
  component: Profile,
});

const rows = [
  { icon: UserRound, label: "My Profile" },
  { icon: Palette, label: "Artisan Details" },
  { icon: Briefcase, label: "Business Information" },
  { icon: Banknote, label: "Payment Information" },
  { icon: HelpCircle, label: "Help & Support" },
];

function Profile() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");

  return (
    <Phone>
      <ScreenHeader title="Profile & Settings" subtitle="Manage your artisan account" />

      <div className="px-5 py-5">
        <div className="flex items-center gap-4 rounded-3xl bg-gradient-hero p-5 shadow-card">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-ivory/15 text-ivory">
            <UserRound className="size-8" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-ivory">Sunita Devi</p>
            <p className="text-xs text-ivory/70">Terracotta artisan · Kutch, Gujarat</p>
            <p className="mt-1 text-[11px] font-semibold text-gold">
              6 products · 28 orders
            </p>
          </div>
        </div>

        <div className="mt-6">
          <SectionTitle title="Choose Your Language" subtitle="Voice and app language" />
          <div className="grid grid-cols-2 gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code);
                  toast.success(`Language set to ${l.label}`);
                }}
                className={cn(
                  "tap rounded-2xl px-4 py-3 text-left shadow-soft",
                  lang === l.code
                    ? "bg-gradient-warm text-primary-foreground"
                    : "bg-card",
                )}
              >
                <span className="block text-sm font-semibold">{l.native}</span>
                <span className="block text-[11px] opacity-75">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-soft">
          {rows.map(({ icon: Icon, label }, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => toast(label, { description: "Demo screen" })}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-4 text-left",
                idx > 0 && "border-t border-border/60",
              )}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-4.5" />
              </span>
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/onboarding" })}
          className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-sm font-semibold text-destructive"
        >
          <LogOut className="size-4" /> Logout
        </button>

        <button
          type="button"
          onClick={() => navigate({ to: "/onboarding" })}
          className="tap mt-2 w-full py-2 text-center text-xs font-semibold text-muted-foreground"
        >
          View onboarding again
        </button>
      </div>
    </Phone>
  );
}
