import { useState } from "react";
import { BadgeCheck, FlaskConical, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import {
  skipVerification,
  startVerification,
  type VerificationResult,
} from "@/lib/identity-verification.functions";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DEMO_IDS = ["DEMO-ARTISAN-001", "DEMO-ARTISAN-002", "DEMO-ARTISAN-003"];

export function VerificationPanel({
  onDone,
  onSkip,
}: {
  onDone: (result: VerificationResult) => void;
  onSkip?: () => void;
}) {
  const { t } = useI18n();
  const { refreshProfile } = useAuth();
  const verify = useServerFn(startVerification);
  const skip = useServerFn(skipVerification);
  const [consent, setConsent] = useState(false);
  const [testId, setTestId] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  async function run() {
    if (!consent) return toast.error("Please give your consent to continue.");
    if (!testId.trim()) return toast.error("Please choose a demo verification ID.");
    setBusy(true);
    try {
      const res = await verify({ data: { testId, consent: true } });
      setResult(res);
      await refreshProfile();
      if (res.status === "verified") {
        toast.success("Identity verified (demo)");
        onDone(res);
      } else {
        toast.error(res.reason ?? t("errService"));
      }
    } catch {
      toast.error(t("errService"));
    }
    setBusy(false);
  }

  if (result?.status === "verified") {
    return (
      <div className="rounded-3xl bg-card p-6 text-center shadow-card rise">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-leaf/15 text-leaf">
          <BadgeCheck className="size-9" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold">{t("verified")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference {result.referenceId} · {result.method}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl bg-gold/20 px-4 py-3">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-[#5b3a12]" />
        <p className="text-xs leading-relaxed text-[#5b3a12]">
          <b>Demo / Test verification.</b> This prototype is not connected to UIDAI. Never
          enter a real Aadhaar number — we do not accept or store Aadhaar numbers, images,
          OTPs or biometric data. Only the verification status and time are saved.
        </p>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4 text-primary" /> Choose a demo ID to test
        </p>
        <div className="mt-3 grid gap-2">
          {DEMO_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTestId(id)}
              className={cn(
                "tap rounded-2xl px-4 py-3 text-left text-sm font-semibold",
                testId === id ? "bg-gradient-warm text-primary-foreground" : "bg-secondary",
              )}
            >
              {id} <span className="text-[11px] font-normal opacity-75">· succeeds</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTestId("DEMO-FAIL-000")}
            className={cn(
              "tap rounded-2xl px-4 py-3 text-left text-sm font-semibold",
              testId === "DEMO-FAIL-000" ? "bg-destructive/12 text-destructive" : "bg-secondary",
            )}
          >
            DEMO-FAIL-000 <span className="text-[11px] font-normal opacity-75">· shows failure</span>
          </button>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-soft">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--color-primary)]"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          I agree to a demo identity check. I understand no Aadhaar data is collected and
          that only my verification status is stored with my artisan profile.
        </span>
      </label>

      {result?.status === "failed" ? (
        <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 px-4 py-3 text-xs text-destructive">
          <XCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            {result.reason}. You can try again or continue and verify later — your account
            still works.
          </span>
        </div>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onClick={run}
        className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-warm py-4 text-base font-bold text-primary-foreground shadow-card disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-5 animate-spin" /> : null}
        {busy ? "Verifying…" : result ? "Try again" : t("startVerification")}
      </button>

      {onSkip ? (
        <button
          type="button"
          onClick={async () => {
            try {
              await skip({});
              await refreshProfile();
            } catch {
              /* non-blocking */
            }
            onSkip();
          }}
          className="tap w-full py-2 text-center text-sm font-semibold text-muted-foreground"
        >
          {t("verifyLater")}
        </button>
      ) : null}
    </div>
  );
}
