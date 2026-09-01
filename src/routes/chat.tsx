import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import { Phone, ScreenHeader } from "@/components/kk/shell";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "KalaKart AI — Your Digital Business Assistant" },
      {
        name: "description",
        content:
          "Ask KalaKart AI about product descriptions, pricing, titles, translation and how to reply to buyers.",
      },
      { property: "og:title", content: "KalaKart AI Assistant" },
      {
        property: "og:description",
        content: "Pricing, descriptions and selling help for artisans.",
      },
    ],
  }),
  component: ChatScreen,
});

type Msg = { id: number; role: "user" | "ai"; text: string };

const seed: Msg[] = [
  {
    id: 1,
    role: "ai",
    text: "Namaste! I am KalaKart AI. I can write product descriptions, suggest prices, translate your words and help you reply to buyers. What would you like help with today?",
  },
  {
    id: 2,
    role: "user",
    text: "What price should I keep for this handmade basket?",
  },
  {
    id: 3,
    role: "ai",
    text: "Based on the material, craftsmanship and similar products, I suggest ₹650–₹850. Bamboo baskets of this weave sell fastest around ₹699 with free delivery.",
  },
];

const replies = [
  "Here is a polished description you can use: “Hand-woven from locally harvested bamboo, this basket takes two days of patient weaving and is finished with a natural, food-safe polish.”",
  "For that craft I would suggest ₹1,200–₹1,500. Buyers pay more when you mention the material, the hours of work and that each piece is one of a kind.",
  "A good title would be: “Handwoven Bamboo Storage Basket — Traditional Artisan Craft”. Short titles with the material and craft name rank better.",
  "I can translate that into Hindi and English for your listing, so buyers across India understand your craft.",
];

const suggestions = [
  "Write a description for my clay diya set",
  "What price for a Madhubani painting?",
  "Reply to a buyer asking for a bulk order",
];

function ChatScreen() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (value: string) => {
    const text = value.trim();
    if (!text) return;
    setMsgs((m) => [...m, { id: Date.now(), role: "user", text }]);
    setInput("");
    setTyping(true);
    timers.current.push(
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: "ai",
            text: replies[m.length % replies.length],
          },
        ]);
      }, 1300),
    );
  };

  return (
    <Phone>
      <ScreenHeader
        title="KalaKart AI"
        subtitle="Your digital business assistant"
        right={
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-warm text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
        }
      />

      <div className="space-y-3 px-4 py-5 pb-44">
        {msgs.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="rise flex justify-end">
              <p className="max-w-[80%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-soft">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="rise flex items-end gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-maroon text-maroon-foreground">
                <Sparkles className="size-4" />
              </span>
              <p className="max-w-[82%] rounded-3xl rounded-bl-md bg-card px-4 py-3 text-sm leading-relaxed text-foreground shadow-soft">
                {m.text}
              </p>
            </div>
          ),
        )}

        {typing ? (
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-maroon text-maroon-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="flex gap-1 rounded-3xl bg-card px-4 py-4 shadow-soft">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-2 animate-bounce rounded-full bg-primary/60"
                  style={{ animationDelay: `${i * 140}ms` }}
                />
              ))}
            </span>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 w-full max-w-[430px] bg-gradient-surface px-4 pb-5">
        <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="tap shrink-0 rounded-full bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground shadow-soft"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-4xl border border-border/60 bg-card p-2 shadow-float"
        >
          <button
            type="button"
            aria-label="Speak your question"
            onClick={() => send("मला या टोपलीची किंमत सांगा")}
            className="tap grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-primary"
          >
            <Mic className="size-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask KalaKart AI…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="tap grid size-11 shrink-0 place-items-center rounded-full bg-gradient-warm text-primary-foreground"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </Phone>
  );
}
