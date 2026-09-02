import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { z } from "zod";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { requireGuest } from "@/lib/auth/guards";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context }) => requireGuest(context),
  head: () =>
    seo({
      title: "Sign in",
      description: "Sign in to VoyaLoom with Auth0.",
      path: "/login",
    }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading } = useAuth0();
  const { redirect } = Route.useSearch();

  return (
    <main className="relative min-h-screen bg-midnight text-sand">
      <LuxuryNavbar />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24">
        <section className="w-full max-w-md glass-strong rounded-sm p-10 text-center">
          <span className="mb-4 block text-[10px] uppercase tracking-ultra text-gold">
            Welcome back
          </span>
          <h1 className="font-serif text-4xl">Return to your archive</h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-sand/60">Continue securely.</p>
          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              void loginWithRedirect({
                appState: { returnTo: redirect ?? "/dashboard" },
              })
            }
            className="mt-8 w-full bg-gold py-4 text-[11px] font-semibold uppercase tracking-luxury text-midnight transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading" : "Continue"}
          </button>
          <button
            type="button"
            onClick={() => void navigate({ to: "/signup" })}
            className="mt-6 text-xs text-sand/50 transition-colors hover:text-gold"
          >
            Need an account? Create one
          </button>
        </section>
      </div>
    </main>
  );
}
