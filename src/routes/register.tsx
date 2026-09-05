import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Mail, Palette, Smartphone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isValidMobile, mobileToAccountEmail, normalizeMobile, useAuth } from "@/lib/auth";
import { LanguageSwitch, languageOptions, useI18n } from "@/lib/i18n";
import { Field, PrimaryButton } from "./login";
import { VoiceFill } from "@/components/kk/voice-input";
import { VerificationPanel } from "@/components/kk/verification-panel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register as an Artisan — CraftLink AI" },
      {
        name: "description",
        content:
          "Create your CraftLink AI artisan account in three simple steps: your details, your craft, and an optional demo identity check.",
      },
      { property: "og:title", content: "Register as an Artisan — CraftLink AI" },
      {
        property: "og:description",
        content: "Three simple steps to start selling your handmade crafts online.",
      },
    ],
  }),
  ssr: false,
  component: RegisterPage,
});

const crafts = ["Pottery", "Weaving", "Folk Art", "Textile", "Wood Craft", "Jewellery", "Other"];

function RegisterPage() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { session, refreshProfile } = useAuth();
  const [step, setStep] = useState(session ? 1 : 0);
  const [busy, setBusy] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [artisanName, setArtisanName] = useState("");
  const [craft, setCraft] = useState("");
  const [experience, setExperience] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");

  function validateStep0() {
    if (fullName.trim().length < 2) return t("errName");
    if (!isValidMobile(mobile)) return t("errMobile");
    if (password.length < 6) return t("errPassword");
    return null;
  }

  async function createAccount() {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: mobileToAccountEmail(mobile),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName.trim(),
          mobile: normalizeMobile(mobile),
          contact_email: email.trim() || null,
          preferred_language: lang,
        },
      },
    });
    if (error) {
      setBusy(false);
      toast.error(
        error.message.toLowerCase().includes("already")
          ? "This mobile number is already registered. Please login instead."
          : t("errGeneric"),
      );
      return false;
    }
    setBusy(false);
    return true;
  }

  async function saveArtisanDetails() {
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess.session?.user.id;
    if (!userId) {
      toast.error(t("errSession"));
      void navigate({ to: "/login" });
      return false;
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        artisan_name: artisanName.trim() || fullName.trim(),
        craft_category: craft || null,
        experience_years: experience ? Number(experience) : null,
        village: village.trim() || null,
        district: district.trim() || null,
        state: stateName.trim() || null,
        preferred_language: lang,
        profile_complete: true,
      })
      .eq("id", userId);
    if (error) {
      toast.error(t("errGeneric"));
      return false;
    }
    await refreshProfile();
    return true;
  }

  return (
    <div className="flex min-h-screen justify-center bg-beige">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-gradient-surface px-5 pb-8 pt-5 shadow-float">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}
            className="tap grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
          <LanguageSwitch />
        </div>

        <div className="mt-5 flex gap-2">
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                s <= step ? "bg-gradient-warm" : "bg-secondary",
              )}
            />
          ))}
        </div>

        <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
          {step === 0 ? t("basicInfo") : step === 1 ? t("artisanInfo") : t("verifyIdentity")}
        </h1>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">Step {step + 1} of 3</p>

        {step === 0 ? (
          <div className="space-y-4">
            <Field label={t("fullName")} icon={<UserRound className="size-4" />}>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sunita Devi"
                className="w-full bg-transparent text-base outline-none"
              />
              <VoiceFill onText={setFullName} />
            </Field>
            <Field label={t("mobile")} icon={<Smartphone className="size-4" />}>
              <input
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-transparent text-base outline-none"
              />
              <VoiceFill onText={(x) => setMobile(x.replace(/\D/g, ""))} />
            </Field>
            <Field label={t("email")} icon={<Mail className="size-4" />}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="optional"
                className="w-full bg-transparent text-base outline-none"
              />
            </Field>
            <Field label={t("password")} icon={<KeyRound className="size-4" />}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent text-base outline-none"
              />
            </Field>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                {t("preferredLanguage")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {languageOptions.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "tap rounded-2xl py-3 text-sm font-semibold shadow-soft",
                      lang === l.code ? "bg-gradient-warm text-primary-foreground" : "bg-card",
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

            <PrimaryButton
              busy={busy}
              label={t("continue")}
              onClick={async () => {
                const err = validateStep0();
                if (err) return toast.error(err);
                if (await createAccount()) setStep(1);
              }}
            />
            <Link to="/login" className="block pt-2 text-center text-sm font-semibold text-primary">
              {t("haveAccount")}
            </Link>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <Field label={t("artisanName")} icon={<Palette className="size-4" />}>
              <input
                value={artisanName}
                onChange={(e) => setArtisanName(e.target.value)}
                placeholder="Sunita Terracotta Works"
                className="w-full bg-transparent text-base outline-none"
              />
              <VoiceFill onText={setArtisanName} />
            </Field>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                {t("craftCategory")}
              </p>
              <div className="flex flex-wrap gap-2">
                {crafts.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCraft(c)}
                    className={cn(
                      "tap rounded-full px-4 py-2 text-sm font-semibold shadow-soft",
                      craft === c ? "bg-gradient-warm text-primary-foreground" : "bg-card",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Field label={t("experience")}>
              <input
                inputMode="numeric"
                value={experience}
                onChange={(e) => setExperience(e.target.value.replace(/\D/g, ""))}
                placeholder="12"
                className="w-full bg-transparent text-base outline-none"
              />
            </Field>
            <Field label={t("village")}>
              <input
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-transparent text-base outline-none"
              />
              <VoiceFill onText={setVillage} />
            </Field>
            <Field label={t("district")}>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-transparent text-base outline-none"
              />
            </Field>
            <Field label={t("state")}>
              <input
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full bg-transparent text-base outline-none"
              />
            </Field>

            <PrimaryButton
              busy={busy}
              label={t("continue")}
              onClick={async () => {
                setBusy(true);
                const ok = await saveArtisanDetails();
                setBusy(false);
                if (ok) setStep(2);
              }}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <VerificationPanel
              onDone={() => navigate({ to: "/welcome" })}
              onSkip={() => navigate({ to: "/welcome" })}
            />
          </div>
        ) : null}

        {busy && step === 2 ? <Loader2 className="mx-auto mt-4 size-5 animate-spin" /> : null}
      </div>
    </div>
  );
}
