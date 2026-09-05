import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Phone, ScreenHeader } from "@/components/kk/shell";
import { inquiries } from "@/lib/kalakart-data";

export const Route = createFileRoute("/_authenticated/inquiry")({
  head: () => ({
    meta: [
      { title: "Buyer Inquiries — KalaKart" },
      {
        name: "description",
        content:
          "Read buyer questions about your handicrafts and reply instantly, or let KalaKart AI draft a polite reply you can edit.",
      },
      { property: "og:title", content: "Buyer Inquiries — KalaKart" },
      {
        property: "og:description",
        content: "Answer buyer questions with help from KalaKart AI.",
      },
    ],
  }),
  component: InquiryPage,
});

function InquiryPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);

  const open = (id: string, text: string) => {
    setOpenId(id);
    setDraft(text);
  };

  const aiReply = (id: string, reply: string) => {
    setOpenId(id);
    setDraft("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setDraft(reply);
    }, 1100);
  };

  return (
    <Phone withNav>
      <ScreenHeader
        title="Buyer Inquiries"
        subtitle="Questions waiting for your answer"
        back={false}
      />
      <div className="space-y-3 px-5 py-5">
        {inquiries.map((q, i) => (
          <article
            key={q.id}
            className="rise rounded-3xl bg-card p-4 shadow-soft"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex gap-3">
              <img
                src={q.image}
                alt={q.product}
                loading="lazy"
                width={700}
                height={700}
                className="size-14 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {q.buyer}
                  </p>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-3" /> {q.time}
                  </span>
                </div>
                <p className="truncate text-[11px] text-primary">{q.product}</p>
                <p className="mt-1.5 rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-xs leading-snug text-secondary-foreground">
                  {q.message}
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => open(q.id, "")}
                className="tap flex-1 rounded-2xl bg-secondary py-2.5 text-xs font-semibold text-secondary-foreground"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => aiReply(q.id, q.aiReply)}
                className="tap flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-warm py-2.5 text-xs font-semibold text-primary-foreground"
              >
                <Sparkles className="size-3.5" /> Use AI Reply
              </button>
            </div>

            {openId === q.id ? (
              <div className="mt-3 rounded-3xl bg-beige/70 p-3">
                {thinking ? (
                  <p className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
                    <Sparkles className="size-4 animate-pulse text-primary" />
                    KalaKart AI is writing a polite reply…
                  </p>
                ) : (
                  <>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={4}
                      placeholder="Write your reply…"
                      className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-xs leading-relaxed outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      disabled={!draft.trim()}
                      onClick={() => {
                        setOpenId(null);
                        toast.success(`Reply sent to ${q.buyer}`);
                      }}
                      className="tap mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-maroon py-3 text-sm font-semibold text-maroon-foreground disabled:opacity-50"
                    >
                      <Send className="size-4" /> Send Reply
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Phone>
  );
}
