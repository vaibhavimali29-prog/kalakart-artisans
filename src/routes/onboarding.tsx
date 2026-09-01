import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Sparkles, Store } from "lucide-react";
import { Phone } from "@/components/kk/shell";
import heroImg from "@/assets/hero-artisan.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to KalaKart — Start Selling Your Craft" },
      {
        name: "description",
        content:
          "Three quick steps: reach a bigger market, speak in your language, and let AI write descriptions, enhance photos and suggest prices.",
      },
      { property: "og:title", content: "Welcome to KalaKart" },
      {
        property: "og:description",
        content: "Your craft deserves a bigger market.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    icon: Store,
    title: "Your Craft Deserves a Bigger Market",
    body: "List your handmade products and reach buyers across India, right from your phone.",
  },
  {
    icon: Mic,
    title: "Speak in Your Language",
    body: "KalaKart turns your voice into professional product listings.",
  },
  {
    icon: Sparkles,
    title: "AI That Helps You Sell",
    body: "Get descriptions, image enhancement and smart price suggestions.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const slide = slides[i];
  const Icon = slide.icon;

  return (
    <Phone>
      <div className="flex min-h-screen flex-col">
        <div className="relative h-[46vh] overflow-hidden">
          <img
            src={heroImg}
            alt="Indian artisan at work"
            width={1200}
            height={912}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-70" />
          <p className="absolute top-8 left-6 font-display text-xl font-semibold tracking-[0.2em] text-ivory">
            KALAKART
          </p>
          <p className="absolute top-16 left-6 text-[11px] text-ivory/70">
            Empowering Artisans, Connecting Traditions
          </p>
        </div>

        <div className="-mt-8 flex flex-1 flex-col rounded-t-4xl bg-gradient-surface px-7 pt-8 pb-8">
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-card">
            <Icon className="size-7" />
          </span>
          <h1 key={slide.title} className="rise mt-5 font-display text-3xl leading-tight font-semibold">
            {slide.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {slide.body}
          </p>

          <div className="mt-auto">
            <div className="mb-5 flex gap-2">
              {slides.map((s, idx) => (
                <span
                  key={s.title}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === i ? "w-8 bg-primary" : "w-3 bg-border",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => (i < 2 ? setI(i + 1) : navigate({ to: "/" }))}
              className="tap w-full rounded-2xl bg-gradient-warm py-4 text-sm font-semibold text-primary-foreground shadow-card"
            >
              {i < 2 ? "Next" : "Start Selling"}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="tap mt-2 w-full py-2 text-xs font-semibold text-muted-foreground"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </Phone>
  );
}
