import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  ImageIcon,
  Keyboard,
  Mic,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Phone, ScreenHeader } from "@/components/kk/shell";
import { images, inr } from "@/lib/kalakart-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/add-product")({
  head: () => ({
    meta: [
      { title: "Add Product — KalaKart AI Cataloging" },
      {
        name: "description",
        content:
          "Capture your craft, enhance the photo with the AI Product Studio, describe it by voice in your language and get a smart price suggestion.",
      },
      { property: "og:title", content: "Add Product — KalaKart" },
      {
        property: "og:description",
        content: "Photo to professional listing in four simple steps.",
      },
    ],
  }),
  component: AddProduct,
});

const steps = ["Capture", "Studio", "Describe", "Price"] as const;

const enhancements = [
  "Remove Background",
  "Improve Lighting",
  "Clean Image",
  "Enhance Product",
  "E-commerce Ready",
];

const GENERATED = {
  title: "Handmade Terracotta Flower Vase",
  description:
    "A beautifully hand-thrown terracotta flower vase, shaped on a traditional potter's wheel and finished with hand-etched floral motifs. Made from locally sourced river clay and slow-fired for strength, each piece carries the small variations that only handwork can give. Ideal as a centrepiece for fresh or dried flowers.",
  bullets: [
    "Material: natural river clay, food-safe inner seal",
    "Height 11 in · Width 6 in · Weight 1.2 kg",
    "Hand-etched motifs, no two pieces identical",
    "Care: wipe with a dry cloth, avoid harsh detergents",
  ],
};

function AddProduct() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [mode, setMode] = useState<"voice" | "type" | null>(null);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState("");
  const [generated, setGenerated] = useState(false);
  const [price, setPrice] = useState(1499);
  const [editingPrice, setEditingPrice] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const runAI = () => {
    setProcessing(true);
    later(() => {
      setProcessing(false);
      setGenerated(true);
    }, 1600);
  };

  if (done) {
    return (
      <Phone>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="rise grid size-24 place-items-center rounded-full bg-leaf/15 text-leaf">
            <Check className="size-12" strokeWidth={3} />
          </span>
          <h1 className="font-display text-2xl font-semibold">Product Published!</h1>
          <p className="text-sm text-muted-foreground">
            “{GENERATED.title}” is now live on your KalaKart storefront at {inr(price)}.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="tap mt-2 w-full rounded-2xl bg-gradient-warm py-4 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Back to My Products
          </button>
        </div>
      </Phone>
    );
  }

  return (
    <Phone>
      <ScreenHeader title="Add Product" subtitle={`Step ${step + 1} of 4`} />

      <div className="flex gap-2 px-5 pt-4">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-border",
              )}
            />
            <p
              className={cn(
                "mt-1.5 text-[10px] font-semibold",
                i <= step ? "text-primary" : "text-muted-foreground",
              )}
            >
              {s}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-6">
        {step === 0 ? (
          <section className="rise space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Capture Your Craft</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                One clear photo is enough — AI will do the rest.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { icon: Camera, label: "Take Photo", hint: "Use your camera" },
                {
                  icon: ImageIcon,
                  label: "Choose from Gallery",
                  hint: "Pick an existing photo",
                },
              ].map(({ icon: Icon, label, hint }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(1)}
                  className="tap flex items-center gap-4 rounded-3xl bg-card p-5 text-left shadow-soft"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-warm text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold">{label}</span>
                    <span className="block text-xs text-muted-foreground">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="rounded-3xl bg-accent/60 p-4 text-xs leading-relaxed text-accent-foreground">
              Tip: place your product on a plain cloth in daylight. The AI Product
              Studio will clean the background for you.
            </p>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="rise space-y-4">
            <div>
              <h2 className="text-xl font-semibold">AI Product Studio</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn a home photo into a marketplace-ready product image.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Before", img: images.wood, dim: true },
                { label: "After", img: images.vase, dim: false },
              ].map((v) => (
                <div key={v.label} className="overflow-hidden rounded-3xl bg-card shadow-soft">
                  <img
                    src={v.img}
                    alt={`${v.label} enhancement`}
                    loading="lazy"
                    width={700}
                    height={700}
                    className={cn(
                      "h-36 w-full object-cover transition-all duration-700",
                      v.dim && "contrast-75 saturate-50 brightness-90",
                      !v.dim && !enhanced && "blur-[2px] opacity-70",
                    )}
                  />
                  <p className="py-2 text-center text-[11px] font-semibold text-muted-foreground">
                    {v.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {enhancements.map((e) => (
                <span
                  key={e}
                  className={cn(
                    "rounded-full px-3 py-2 text-[11px] font-semibold transition-colors",
                    enhanced
                      ? "bg-leaf/15 text-leaf"
                      : "bg-card text-muted-foreground shadow-soft",
                  )}
                >
                  {enhanced ? "✓ " : ""}
                  {e}
                </span>
              ))}
            </div>
            {!enhanced ? (
              <button
                type="button"
                onClick={() => {
                  setEnhanced(true);
                  toast.success("Image enhanced by KalaKart AI");
                }}
                className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-warm py-4 text-sm font-semibold text-primary-foreground shadow-card"
              >
                <Wand2 className="size-4" /> Enhance Image
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="tap w-full rounded-2xl bg-maroon py-4 text-sm font-semibold text-maroon-foreground shadow-card"
              >
                Use Enhanced Image
              </button>
            )}
          </section>
        ) : null}

        {step === 2 ? (
          <section className="rise space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Tell Us About Your Product</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Speak in your own language, or type if you prefer.
              </p>
            </div>

            {!generated && !processing ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("voice");
                    setListening(true);
                    later(() => {
                      setListening(false);
                      setText("मी ही हाताने बनवलेली मातीची फुलदाणी बनवली आहे…");
                      runAI();
                    }, 2200);
                  }}
                  className={cn(
                    "tap rounded-3xl p-4 text-left shadow-soft",
                    mode === "voice"
                      ? "bg-gradient-warm text-primary-foreground"
                      : "bg-card",
                  )}
                >
                  <Mic className="size-6" />
                  <p className="mt-2 text-sm font-semibold">Voice Description</p>
                  <p className="text-[11px] opacity-80">Describe it in your language</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("type")}
                  className={cn(
                    "tap rounded-3xl p-4 text-left shadow-soft",
                    mode === "type" ? "bg-maroon text-maroon-foreground" : "bg-card",
                  )}
                >
                  <Keyboard className="size-6" />
                  <p className="mt-2 text-sm font-semibold">Type Description</p>
                  <p className="text-[11px] opacity-80">Write a few words</p>
                </button>
              </div>
            ) : null}

            {listening ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-8 shadow-soft">
                <span className="mic-pulse grid size-20 place-items-center rounded-full bg-gradient-warm text-primary-foreground">
                  <Mic className="size-8" />
                </span>
                <p className="text-sm font-semibold">Listening…</p>
                <p className="text-xs text-muted-foreground">Speak naturally</p>
              </div>
            ) : null}

            {mode === "type" && !generated && !processing ? (
              <div>
                <textarea
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Handmade clay flower vase with painted design…"
                  className="w-full resize-none rounded-3xl border border-border bg-card p-4 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  disabled={!text.trim()}
                  onClick={runAI}
                  className="tap mt-3 w-full rounded-2xl bg-gradient-warm py-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Generate with AI
                </button>
              </div>
            ) : null}

            {processing ? (
              <div className="space-y-2 rounded-3xl bg-card p-6 text-center shadow-soft">
                <Sparkles className="mx-auto size-8 animate-pulse text-primary" />
                <p className="text-sm font-semibold">KalaKart AI is understanding your craft…</p>
                <p className="text-xs text-muted-foreground">
                  Detecting language · Translating · Writing description
                </p>
              </div>
            ) : null}

            {generated ? (
              <div className="rise space-y-3">
                {mode === "voice" ? (
                  <div className="rounded-3xl bg-accent/60 p-4">
                    <p className="text-[10px] font-semibold tracking-widest text-accent-foreground">
                      DETECTED LANGUAGE
                    </p>
                    <p className="text-sm font-semibold">Marathi (मराठी)</p>
                    <p className="mt-2 text-xs text-muted-foreground">“{text}”</p>
                  </div>
                ) : null}
                <div className="rounded-3xl bg-card p-4 shadow-soft">
                  <p className="text-[10px] font-semibold tracking-widest text-primary">
                    GENERATED TITLE
                  </p>
                  <p className="text-base font-semibold">{GENERATED.title}</p>
                  <p className="mt-3 text-[10px] font-semibold tracking-widest text-primary">
                    DESCRIPTION
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {GENERATED.description}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {GENERATED.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-xs text-muted-foreground">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-leaf" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="tap w-full rounded-2xl bg-maroon py-4 text-sm font-semibold text-maroon-foreground shadow-card"
                >
                  Continue to Pricing
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        {step === 3 ? (
          <section className="rise space-y-4">
            <div>
              <h2 className="text-xl font-semibold">AI Suggested Price</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A fair price that respects your work.
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-hero p-6 text-center shadow-card">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-ivory/70">
                SUGGESTED
              </p>
              {editingPrice ? (
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="mt-2 w-40 rounded-2xl bg-ivory/15 py-2 text-center font-display text-3xl font-semibold text-ivory outline-none"
                />
              ) : (
                <p className="mt-1 font-display text-5xl font-semibold text-ivory">
                  {inr(price)}
                </p>
              )}
              <p className="mt-3 text-[11px] text-ivory/70">Recommended selling range</p>
              <p className="text-sm font-semibold text-gold">₹1,299 – ₹1,699</p>
            </div>
            <p className="rounded-3xl bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-soft">
              Based on product type, materials, craftsmanship and market trends.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingPrice((v) => !v)}
                className="tap flex-1 rounded-2xl bg-secondary py-4 text-sm font-semibold text-secondary-foreground"
              >
                {editingPrice ? "Save Price" : "Edit Price"}
              </button>
              <button
                type="button"
                onClick={() => setDone(true)}
                className="tap flex-1 rounded-2xl bg-gradient-warm py-4 text-sm font-semibold text-primary-foreground shadow-card"
              >
                Accept Price
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </Phone>
  );
}
