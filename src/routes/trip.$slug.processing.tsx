import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { TripAnalysisProgress } from "@/components/voyaloom/TripAnalysisProgress";
import { requireAuth } from "@/lib/auth/guards";
import type { TripAnalysisStatus } from "@/interface/trip-analysis";
import { getTripAnalysisStatusFn } from "@/services/trip-analysis.functions";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/trip/$slug/processing")({
  beforeLoad: ({ context, location }) => requireAuth(context, location.pathname),
  head: () =>
    seo({
      title: "Understanding your journey",
      description: "VoyaLoom is analyzing your travel photographs.",
      robots: "private",
    }),
  component: TripProcessing,
});

function TripProcessing() {
  const { slug: tripId } = Route.useParams();
  const [status, setStatus] = useState<TripAnalysisStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    async function poll(): Promise<void> {
      try {
        const nextStatus = await getTripAnalysisStatusFn({ data: { tripId } });
        if (cancelled) return;
        if (nextStatus.total === 0) {
          setError("This journey does not have any photographs yet.");
          return;
        }
        setStatus(nextStatus);
        setError(null);
        if (!nextStatus.readyToGenerate) {
          timeout = setTimeout(() => void poll(), 3000);
        }
      } catch (reason) {
        if (cancelled) return;
        setError(reason instanceof Error ? reason.message : "Could not read analysis progress.");
      }
    }

    void poll();
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [tripId]);

  const ready = status?.readyToGenerate === true;

  return (
    <div className="min-h-screen bg-midnight text-sand">
      <LuxuryNavbar />
      <main className="mx-auto max-w-5xl px-6 pb-32 pt-40 md:px-12">
        {status && <TripAnalysisProgress status={status} />}
        {!status && !error && (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-sand/50">
            <Loader2 className="size-5 animate-spin text-gold" />
            <span className="text-[10px] uppercase tracking-luxury">Opening your journey</span>
          </div>
        )}
        {error && (
          <div className="mx-auto max-w-xl py-20 text-center">
            <h1 className="font-serif text-4xl">We couldn&apos;t read the journey yet.</h1>
            <p className="mt-4 text-sm text-sand/50">Please try again in a moment.</p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-[10px] uppercase tracking-luxury transition-colors hover:border-gold hover:text-gold"
            >
              Back to dashboard
            </Link>
          </div>
        )}
        {ready && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled
              title="Album generation will be connected when the backend endpoint is available."
              className="inline-flex cursor-not-allowed items-center gap-3 bg-gold px-8 py-4 text-[10px] uppercase tracking-luxury font-semibold text-midnight opacity-60"
            >
              Generate album
              <ArrowRight className="size-4" />
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center border border-white/20 px-8 py-4 text-[10px] uppercase tracking-luxury transition-colors hover:border-gold hover:text-gold"
            >
              Back to dashboard
            </Link>
          </div>
        )}
      </main>
      <CinematicFooter />
    </div>
  );
}
