import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * identityVerificationService — DEMO ONLY.
 *
 * This module simulates an Aadhaar e-KYC style identity check so the product
 * flow can be demonstrated end to end. It NEVER accepts, transmits or stores
 * Aadhaar numbers, Aadhaar images, OTPs or biometric data. Only verification
 * metadata (status, method, timestamp, provider reference) is persisted.
 *
 * Replace the mock block inside `startVerification` with a call to an
 * authorized Aadhaar authentication / e-KYC provider before production. The
 * function signatures and the stored metadata shape stay the same.
 */

export type VerificationResult = {
  status: "verified" | "failed";
  referenceId: string;
  method: string;
  verifiedAt: string | null;
  displayName: string | null;
  reason?: string;
};

const DEMO_REFERENCE_PREFIX = "DEMO-EKYC";
const ALLOWED_DEMO_IDS = ["DEMO-ARTISAN-001", "DEMO-ARTISAN-002", "DEMO-ARTISAN-003"];

const FAILURE_REASONS = [
  "Verification service unavailable",
  "Details could not be verified",
  "Verification session expired",
];

/** Start a (mock) verification session for the signed-in artisan. */
export const startVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { testId: string; consent: boolean }) => {
    const testId = String(input?.testId ?? "").trim().toUpperCase();
    if (!input?.consent) throw new Error("Consent is required to start verification.");
    if (!testId) throw new Error("Please enter the test verification ID.");
    if (/^\d{8,}$/.test(testId.replace(/\s/g, ""))) {
      // Defensive: never accept anything that looks like a real Aadhaar number.
      throw new Error("Only demo verification IDs are accepted in this prototype.");
    }
    return { testId, consent: true };
  })
  .handler(async ({ data, context }): Promise<VerificationResult> => {
    const { supabase, userId } = context;

    // ---- MOCK PROVIDER CALL — replace with authorized e-KYC provider ----
    const success = ALLOWED_DEMO_IDS.includes(data.testId);
    const referenceId = `${DEMO_REFERENCE_PREFIX}-${Date.now().toString(36).toUpperCase()}`;
    // --------------------------------------------------------------------

    if (!success) {
      await supabase
        .from("profiles")
        .update({
          verification_status: "failed",
          verification_method: "Aadhaar e-KYC Demo",
          provider_reference_id: referenceId,
        })
        .eq("id", userId);

      return {
        status: "failed",
        referenceId,
        method: "Aadhaar e-KYC Demo",
        verifiedAt: null,
        displayName: null,
        reason: FAILURE_REASONS[1],
      };
    }

    const verifiedAt = new Date().toISOString();
    const { error } = await supabase
      .from("profiles")
      .update({
        verification_status: "verified",
        verification_method: "Aadhaar e-KYC Demo",
        verified_at: verifiedAt,
        provider_reference_id: referenceId,
      })
      .eq("id", userId);

    if (error) {
      console.error("[identityVerification] update failed", error);
      throw new Error("Verification service is temporarily unavailable.");
    }

    return {
      status: "verified",
      referenceId,
      method: "Aadhaar e-KYC Demo",
      verifiedAt,
      displayName: "Demo Artisan",
    };
  });

/** Current verification status for the signed-in artisan. */
export const checkVerificationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("verification_status, verification_method, verified_at")
      .eq("id", context.userId)
      .maybeSingle();
    return {
      status: data?.verification_status ?? "pending",
      method: data?.verification_method ?? null,
      verifiedAt: data?.verified_at ?? null,
    };
  });

/** Full (non-sensitive) verification result for display. */
export const getVerificationResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("full_name, verification_status, verification_method, verified_at, provider_reference_id")
      .eq("id", context.userId)
      .maybeSingle();
    return {
      displayName: data?.verification_status === "verified" ? "Demo Artisan" : null,
      status: data?.verification_status ?? "pending",
      method: data?.verification_method ?? null,
      verifiedAt: data?.verified_at ?? null,
      referenceId: data?.provider_reference_id ?? null,
    };
  });

/** Record that the artisan chose to verify later. */
export const skipVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("profiles")
      .update({ verification_status: "skipped", verification_method: null })
      .eq("id", context.userId);
    return { ok: true };
  });
