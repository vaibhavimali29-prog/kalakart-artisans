import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Phone, ScreenHeader } from "@/components/kk/shell";
import { inr } from "@/lib/kalakart-data";

export const Route = createFileRoute("/_authenticated/voice")({
  head: () => ({
    meta: [
      { title: "Voice Command — Speak Your Craft | KalaKart" },
      {
        name: "description",
        content:
          "Describe your handicraft in Hindi, Marathi, Tamil or any Indian language. KalaKart AI detects the language and writes a professional listing.",
      },
      { property: "og:title", content: "Voice Command — KalaKart" },
      {
        property: "og:description",
        content: "Speak naturally in your language; AI creates the listing.",
      },
    ],
  }),
  component: VoiceScreen,
});

type Phase = "idle" | "listening" | "processing" | "result";

function VoiceScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    setPhase("listening");
    timers.current.push(setTimeout(() => setPhase("processing"), 2400));
    timers.current.push(setTimeout(() => setPhase("result"), 4000));
  };

  return (
    <Phone>
      <ScreenHeader title="Voice Command" subtitle="Speak in your own language" />

      <div className="flex flex-col items-center px-6 py-10 text-center">
        <button
          type="button"
          onClick={start}
          aria-label="Start speaking"
          className={`tap grid size-40 place-items-center rounded-full bg-gradient-warm text-primary-foreground shadow-float ${
            phase === "listening" ? "mic-pulse" : ""
          }`}
        >
          <Mic className="size-16" strokeWidth={1.8} />
        </button>

        <h1 className="mt-7 font-display text-2xl font-semibold">
          {phase === "listening" ? "Listening…" : "Speak Naturally"}
        </h1>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Describe your product in your own language.
        </p>

        {phase !== "idle" ? (
          <p className="rise mt-6 w-full rounded-3xl bg-card p-4 text-sm leading-relaxed shadow-soft">
            “मी ही हाताने बनवलेली मातीची फुलदाणी बनवली आहे…”
          </p>
        ) : (
          <p className="mt-6 w-full rounded-3xl bg-accent/50 p-4 text-xs leading-relaxed text-accent-foreground">
            Example: “मी ही हाताने बनवलेली मातीची फुलदाणी बनवली आहे…”
            <br />
            Hindi · Marathi · Tamil · Telugu · Bengali · Gujarati · Punjabi · Kannada ·
            Malayalam · Odia
          </p>
        )}

        {phase === "processing" ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 animate-pulse text-primary" /> Understanding
            your craft…
          </p>
        ) : null}

        {phase === "result" ? (
          <div className="rise mt-5 w-full space-y-3 text-left">
            <Field label="DETECTED LANGUAGE" value="Marathi (मराठी)" />
            <Field label="AI UNDERSTANDING" value="Handmade terracotta flower vase" />
            <div className="rounded-3xl bg-card p-4 shadow-soft">
              <p className="text-[10px] font-semibold tracking-widest text-primary">
                GENERATED DESCRIPTION
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                A hand-thrown terracotta flower vase made on a traditional potter's
                wheel, finished with hand-etched floral motifs and slow-fired for
                strength. Perfect as a warm, earthy centrepiece.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                हाथ से बनी मिट्टी की फूलदानी, पारंपरिक चाक पर बनाई गई और हाथ से उकेरी गई
                नक्काशी के साथ।
              </p>
            </div>
            <div className="flex items-center justify-between rounded-3xl bg-gradient-hero p-5">
              <span className="text-xs text-ivory/70">Suggested Price</span>
              <span className="font-display text-3xl font-semibold text-ivory">
                {inr(850)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhase("idle")}
                className="tap flex-1 rounded-2xl bg-secondary py-3.5 text-xs font-semibold text-secondary-foreground"
              >
                Speak Again
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/add-product" })}
                className="tap flex-1 rounded-2xl bg-secondary py-3.5 text-xs font-semibold text-secondary-foreground"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Added to your catalog");
                  navigate({ to: "/dashboard" });
                }}
                className="tap flex-[1.4] rounded-2xl bg-gradient-warm py-3.5 text-xs font-semibold text-primary-foreground shadow-card"
              >
                Add to Catalog
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Phone>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft">
      <p className="text-[10px] font-semibold tracking-widest text-primary">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
