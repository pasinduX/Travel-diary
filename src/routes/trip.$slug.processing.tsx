import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { TripAnalysisProgress } from "@/components/voyaloom/TripAnalysisProgress";
import { AlbumRenderer } from "@/components/album/AlbumRenderer";
import { AlbumGenerationLoader } from "@/components/album/AlbumGenerationLoader";
import { toImageMap } from "@/components/album/createAlbumPlan";
import { requireAuth } from "@/lib/auth/guards";
import type { AlbumPlan } from "@/interface/album";
import type { TripAnalysisStatus } from "@/interface/trip-analysis";
import { generateAlbumFn, getAlbumFn } from "@/services/album.functions";
import { getTripAnalysisStatusFn } from "@/services/trip-analysis.functions";
import { listTripImagesFn } from "@/services/trip-image.functions";
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
  const [album, setAlbum] = useState<{ plan: AlbumPlan; images: Record<string, string> } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    console.info("[VoyaLoom][Processing] opened", { tripId });

    async function poll(): Promise<void> {
      try {
        const nextStatus = await getTripAnalysisStatusFn({ data: { tripId } });
        if (cancelled) return;
        if (nextStatus.total === 0) {
          console.warn("[VoyaLoom][Processing] trip has no images", { tripId });
          setError("This journey does not have any photographs yet.");
          return;
        }
        setStatus(nextStatus);
        setError(null);
        console.info("[VoyaLoom][Processing] analysis status", { tripId, ...nextStatus });
        if (!nextStatus.readyToGenerate) {
          timeout = setTimeout(() => void poll(), 3000);
        } else {
          try {
            const [plan, images] = await Promise.all([
              getAlbumFn({ data: { tripId } }),
              listTripImagesFn({ data: { tripId } }),
            ]);
            if (cancelled) return;
            console.info("[VoyaLoom][Processing] existing album found", { tripId });
            setAlbum({ plan, images: toImageMap(images) });
          } catch {
            console.info("[VoyaLoom][Processing] no existing album; showing generate action", {
              tripId,
            });
            // A trip can be analysis-ready without having been generated yet.
          }
        }
      } catch (reason) {
        if (cancelled) return;
        console.error("[VoyaLoom][Processing] failed to read analysis status", { tripId, reason });
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

  async function handleGenerateAlbum() {
    console.info("[VoyaLoom][Processing] generate clicked", {
      tripId,
      ready,
      disabled: !ready || generating,
    });
    setGenerating(true);
    const startedAt = Date.now();
    try {
      const [plan, images] = await Promise.all([
        generateAlbumFn({ data: { tripId } }),
        listTripImagesFn({ data: { tripId } }),
      ]);
      const remaining = 1200 - (Date.now() - startedAt);
      if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
      console.info("[VoyaLoom][Processing] generation succeeded", {
        tripId,
        durationMs: Date.now() - startedAt,
      });
      setAlbum({ plan, images: toImageMap(images) });
    } catch (reason) {
      console.error("[VoyaLoom][Processing] generation failed", { tripId, reason });
      setError(reason instanceof Error ? reason.message : "Could not generate your album.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-midnight text-sand">
      <LuxuryNavbar />
      <main className="mx-auto max-w-5xl px-6 pb-32 pt-40 md:px-12">
        {status && !album && <TripAnalysisProgress status={status} />}
        {generating && <AlbumGenerationLoader />}
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
        {status && !album && !error && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              data-testid="generate-album-button"
              onClick={() => void handleGenerateAlbum()}
              disabled={!ready || generating}
              aria-busy={generating}
              className="inline-flex items-center gap-3 bg-gold px-8 py-4 text-[10px] font-semibold uppercase tracking-luxury text-midnight transition-colors hover:bg-sand disabled:cursor-wait disabled:opacity-60"
            >
              {generating && <Loader2 className="size-4 animate-spin" />}
              {generating
                ? "Organizing your album"
                : ready
                  ? "Generate album"
                  : "Waiting for analysis"}
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center border border-white/20 px-8 py-4 text-[10px] uppercase tracking-luxury transition-colors hover:border-gold hover:text-gold"
            >
              Back to dashboard
            </Link>
          </div>
        )}
        {album && <AlbumRenderer album={album.plan} images={album.images} />}
      </main>
    </div>
  );
}
