import { createFileRoute } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { requireGuest } from "@/lib/auth/guards";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => requireGuest(context),
  head: () =>
    seo({
      title: "Create your account",
      description: "Create a VoyaLoom account with Auth0.",
      path: "/signup",
    }),
  component: Signup,
});

function Signup() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <main className="relative min-h-screen bg-midnight text-sand">
      <LuxuryNavbar />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24">
        <section className="w-full max-w-md glass-strong rounded-sm p-10 text-center">
          <span className="mb-4 block text-[10px] uppercase tracking-ultra text-gold">
            A private archive
          </span>
          <h1 className="font-serif text-4xl">Begin your story</h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-sand/60">
            Create your account securely with Auth0.
          </p>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void loginWithRedirect({ appState: { returnTo: "/dashboard" } })}
            className="mt-8 w-full bg-gold py-4 text-[11px] font-semibold uppercase tracking-luxury text-midnight transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading" : "Continue"}
          </button>
        </section>
      </div>
    </main>
  );
}
