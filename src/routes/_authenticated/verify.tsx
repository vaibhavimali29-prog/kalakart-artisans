import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Phone, ScreenHeader } from "@/components/kk/shell";
import { VerificationPanel } from "@/components/kk/verification-panel";
import { VerifiedBadge } from "@/components/kk/verified-badge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/verify")({
  head: () => ({
    meta: [
      { title: "Identity Verification — CraftLink AI" },
      {
        name: "description",
        content:
          "Run the clearly labelled demo identity check to earn a Verified Artisan badge on your CraftLink AI shop.",
      },
      { property: "og:title", content: "Identity Verification — CraftLink AI" },
      { property: "og:description", content: "Demo identity check for artisans." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <Phone>
      <ScreenHeader title="Identity Verification" subtitle="Demo / test mode" />
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-soft">
          <span className="text-sm font-semibold">Current status</span>
          <VerifiedBadge status={profile?.verification_status ?? "pending"} />
        </div>
        <VerificationPanel
          onDone={() => navigate({ to: "/profile" })}
          onSkip={() => navigate({ to: "/profile" })}
        />
      </div>
    </Phone>
  );
}
