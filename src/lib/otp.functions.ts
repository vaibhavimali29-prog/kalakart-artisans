import { createServerFn } from "@tanstack/react-start";

/**
 * Demo OTP login. No real SMS is sent and no OTP is stored in the database.
 * The code is a fixed, clearly-labelled demo code. Swap `DEMO_CODE` checking
 * for an SMS provider verification call to go live — the client contract stays
 * the same.
 */
const DEMO_CODE = "123456";

function accountEmail(mobile: string) {
  return `${mobile.replace(/\D/g, "").slice(-10)}@artisan.craftlink.app`;
}

export const requestDemoOtp = createServerFn({ method: "POST" })
  .inputValidator((input: { mobile: string }) => {
    const mobile = String(input?.mobile ?? "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(mobile)) throw new Error("Please enter a valid 10-digit mobile number.");
    return { mobile };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("mobile", data.mobile)
      .maybeSingle();

    return {
      sent: true,
      registered: Boolean(profile),
      demoCode: DEMO_CODE,
      demo: true,
    };
  });

export const verifyDemoOtp = createServerFn({ method: "POST" })
  .inputValidator((input: { mobile: string; code: string }) => {
    const mobile = String(input?.mobile ?? "").replace(/\D/g, "").slice(-10);
    const code = String(input?.code ?? "").replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(mobile)) throw new Error("Please enter a valid 10-digit mobile number.");
    if (code.length !== 6) throw new Error("Please enter the 6-digit code.");
    return { mobile, code };
  })
  .handler(async ({ data }) => {
    if (data.code !== DEMO_CODE) {
      return { ok: false as const, error: "That code is not correct. Please try again." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("mobile", data.mobile)
      .maybeSingle();

    if (!profile) {
      return { ok: false as const, error: "This mobile number is not registered yet." };
    }

    const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: accountEmail(data.mobile),
    });

    if (error || !link?.properties?.hashed_token) {
      console.error("[otp] link generation failed", error);
      return { ok: false as const, error: "Login service is temporarily unavailable." };
    }

    return { ok: true as const, tokenHash: link.properties.hashed_token };
  });
