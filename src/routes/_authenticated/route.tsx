import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!session) {
      void navigate({ to: "/", replace: true });
      return;
    }
    if (profile && !profile.profile_complete && pathname !== "/register") {
      void navigate({ to: "/register", replace: true });
    }
  }, [loading, session, profile, pathname, navigate]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-beige">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <Outlet />;
}
