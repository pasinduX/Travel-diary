import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { googleCallbackFn } from "@/services/auth.functions";
import { seo } from "@/lib/seo/seo";

/**
 * Landing point for the Google OAuth redirect.
 *
 * Expects the backend to redirect here with `?code=&state=` after it has
 * handled the Google exchange. We forward those to the backend's
 * `/api/v1/auth/google/callback` (server-side), store the resulting session,
 * and move the user on. If your backend completes the flow entirely on its
 * own, point its post-login redirect at `/dashboard` instead and this route
 * is simply unused.
 */
const searchSchema = z.object({
  code: z.string().optional().catch(undefined),
  state: z.string().optional().catch(undefined),
  error: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/auth/google/callback")({
  validateSearch: searchSchema,
  head: () => seo({ title: "Signing you in", robots: "private" }),
  component: GoogleCallback,
});

function GoogleCallback() {
  const navigate = useNavigate();
  const router = useRouter();
  const { code, state, error } = Route.useSearch();
  const started = useRef(false);
  const [message, setMessage] = useState("Completing your sign-in…");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function complete() {
      if (error) {
        toast.error("Google sign-in was cancelled.");
        await navigate({ to: "/login" });
        return;
      }
      if (!code || !state) {
        toast.error("That sign-in link is incomplete. Please try again.");
        await navigate({ to: "/login" });
        return;
      }

      try {
        await googleCallbackFn({ data: { code, state } });
        await router.invalidate();
        await navigate({ to: "/dashboard" });
      } catch (err) {
        setMessage("");
        toast.error(err instanceof Error ? err.message : "Could not finish signing you in.");
        await navigate({ to: "/login" });
      }
    }

    void complete();
  }, [code, state, error, navigate, router]);

  return (
    <div className="min-h-screen bg-midnight text-sand flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="size-6 animate-spin text-gold" />
        <p className="font-serif italic text-lg text-sand/70">{message}</p>
      </div>
    </div>
  );
}
