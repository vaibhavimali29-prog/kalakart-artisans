import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isValidMobile, mobileToAccountEmail, normalizeMobile, useAuth } from "@/lib/auth";
import { LanguageSwitch, useI18n } from "@/lib/i18n";
import { SpeakLabel, VoiceFill } from "@/components/kk/voice-input";
import { requestDemoOtp, verifyDemoOtp } from "@/lib/otp.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — CraftLink AI" },
      {
        name: "description",
        content: "Log in to your CraftLink AI artisan account with your mobile number and password, or a demo OTP.",
      },
      { property: "og:title", content: "Login — CraftLink AI" },
      { property: "og:description", content: "Secure artisan sign-in for CraftLink AI." },
    ],
  }),
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) void navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function loginWithPassword() {
    if (!isValidMobile(mobile)) return toast.error(t("errMobile"));
    if (password.length < 6) return toast.error(t("errPassword"));
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: mobileToAccountEmail(mobile),
      password,
    });
    setBusy(false);
    if (error) {
      toast.error("We could not find that mobile number and password together.", {
        description: "Please check and try again, or use OTP login.",
      });
      return;
    }
    toast.success(t("okLogin"));
    void navigate({ to: "/dashboard", replace: true });
  }

  async function sendOtp() {
    if (!isValidMobile(mobile)) return toast.error(t("errMobile"));
    setBusy(true);
    try {
      const res = await requestDemoOtp({ data: { mobile: normalizeMobile(mobile) } });
      setOtpSent(true);
      toast.success("Demo code sent", { description: `Use demo code ${res.demoCode}` });
    } catch {
      toast.error(t("errGeneric"));
    }
    setBusy(false);
  }

  async function confirmOtp() {
    setBusy(true);
    try {
      const res = await verifyDemoOtp({ data: { mobile: normalizeMobile(mobile), code } });
      if (!res.ok) {
        toast.error(res.error);
        setBusy(false);
        return;
      }
      const { error } = await supabase.auth.verifyOtp({
        type: "magiclink",
        token_hash: res.tokenHash,
      });
      if (error) throw error;
      toast.success(t("okLogin"));
      void navigate({ to: "/dashboard", replace: true });
    } catch {
      toast.error(t("errGeneric"));
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen justify-center bg-beige">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-gradient-surface px-5 pb-8 pt-5 shadow-float">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            aria-label="Go back"
            className="tap grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <LanguageSwitch />
        </div>

        <div className="mt-8 rise">
          <h1 className="font-display text-3xl font-bold text-foreground">{t("welcomeBack")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Login to manage your crafts and orders.
          </p>
        </div>

        <div className="mt-6 flex rounded-2xl bg-secondary p-1">
          {(["password", "otp"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "tap flex-1 rounded-xl py-2.5 text-sm font-semibold",
                mode === m ? "bg-card text-primary shadow-soft" : "text-muted-foreground",
              )}
            >
              {m === "password" ? t("password") : "OTP"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          <Field label={t("mobile")} icon={<Smartphone className="size-4" />}>
            <input
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="98765 43210"
              className="w-full bg-transparent text-base outline-none"
            />
            <VoiceFill onText={(text) => setMobile(text.replace(/\D/g, ""))} />
          </Field>

          {mode === "password" ? (
            <>
              <Field label={t("password")} icon={<KeyRound className="size-4" />}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-transparent text-base outline-none"
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  toast("Password help", {
                    description: "Use OTP login for now, then set a new password in Profile.",
                  })
                }
                className="w-full text-right text-xs font-semibold text-primary"
              >
                {t("forgotPassword")}
              </button>
              <PrimaryButton busy={busy} onClick={loginWithPassword} label={t("login")} />
            </>
          ) : (
            <>
              {otpSent ? (
                <Field label="6-digit code" icon={<KeyRound className="size-4" />}>
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full bg-transparent text-base tracking-[0.4em] outline-none"
                  />
                </Field>
              ) : null}
              <div className="rounded-2xl bg-gold/20 px-4 py-3 text-xs font-medium text-[#5b3a12]">
                Demo mode: no real SMS is sent. Use the code <b>123456</b>.
              </div>
              <PrimaryButton
                busy={busy}
                onClick={otpSent ? confirmOtp : sendOtp}
                label={otpSent ? "Verify & Login" : t("continueWithOtp")}
              />
            </>
          )}
        </div>

        <Link to="/register" className="mt-auto pt-8 text-center text-sm font-semibold text-primary">
          {t("noAccount")}
        </Link>
      </div>
    </div>
  );
}

export function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        {label}
        <SpeakLabel text={label} />
      </span>
      <span className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-soft">
        {icon ? <span className="text-primary">{icon}</span> : null}
        {children}
      </span>
    </label>
  );
}

export function PrimaryButton({
  busy,
  onClick,
  label,
}: {
  busy?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-warm py-4 text-base font-bold text-primary-foreground shadow-card disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-5 animate-spin" /> : null}
      {label}
    </button>
  );
}
