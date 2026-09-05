import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type VerificationStatus = "pending" | "verified" | "failed" | "skipped";

export type Profile = {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  preferred_language: string;
  artisan_name: string | null;
  craft_category: string | null;
  experience_years: number | null;
  village: string | null;
  district: string | null;
  state: string | null;
  profile_complete: boolean;
  verification_status: VerificationStatus;
  verification_method: string | null;
  verified_at: string | null;
};

type AuthCtx = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  session: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

/** Mobile numbers are turned into a stable internal account address.
 *  No SMS/identity data is stored anywhere in the app. */
export function mobileToAccountEmail(mobile: string) {
  return `${normalizeMobile(mobile)}@artisan.craftlink.app`;
}

export function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, "").slice(-10);
}

export function isValidMobile(mobile: string) {
  return /^[6-9]\d{9}$/.test(normalizeMobile(mobile));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next?.user) {
        setTimeout(() => void loadProfile(next.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      session,
      profile,
      loading,
      refreshProfile: async () => {
        if (session?.user) await loadProfile(session.user.id);
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
      },
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
