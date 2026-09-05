import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, User } from "lucide-react";
import { toast } from "sonner";
import { Phone, ScreenHeader } from "@/components/kk/shell";
import { inr, orders, statusTone } from "@/lib/kalakart-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — KalaKart" },
      {
        name: "description",
        content:
          "Track every handicraft order: buyer, quantity, price and delivery status in one simple screen.",
      },
      { property: "og:title", content: "Your Orders — KalaKart" },
      {
        property: "og:description",
        content: "Simple order tracking for artisans selling on KalaKart.",
      },
    ],
  }),
  component: Orders,
});

function Orders() {
  return (
    <Phone withNav>
      <ScreenHeader
        title="Your Orders"
        subtitle={`${orders.length} orders from buyers`}
        back={false}
      />
      <div className="space-y-3 px-5 py-5">
        {orders.map((o, i) => (
          <article
            key={o.id}
            className="rise rounded-3xl bg-card p-4 shadow-soft"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex gap-3">
              <img
                src={o.image}
                alt={o.product}
                loading="lazy"
                width={700}
                height={700}
                className="size-20 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {o.product}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      statusTone[o.status],
                    )}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="size-3.5" /> {o.buyer} · Qty {o.qty}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CalendarDays className="size-3.5" /> {o.date} · #{o.id}
                </p>
                <p className="mt-1 text-base font-bold text-primary">{inr(o.price)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast(`Order #${o.id}`, { description: `${o.product} · ${o.buyer}` })}
              className="tap mt-3 w-full rounded-2xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground"
            >
              View Order Details
            </button>
          </article>
        ))}
      </div>
    </Phone>
  );
}
