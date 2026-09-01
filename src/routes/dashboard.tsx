import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { requireAuth } from "@/lib/auth/guards";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { MemoryCard } from "@/components/voyaloom/MemoryCard";
import type { DashboardData, DashboardTrip } from "@/services/dashboard.functions";
import { getDashboardDataFn } from "@/services/dashboard.functions";
import { deleteTripFn } from "@/services/trip.functions";
import { getCurrentPricingPlanFn } from "@/services/pricing.functions";
import type { PricingPlan } from "@/interface/pricing";
import { seo } from "@/lib/seo/seo";
import heroImg from "@/assets/hero-tuscany.jpg";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => requireAuth(context, location.pathname),
  head: () =>
    seo({
      title: "Your trips",
      description: "Browse your VoyaLoom travel albums.",
      robots: "private",
    }),
  component: Dashboard,
});

function Dashboard() {
  const user = useCurrentUser();
  const firstName = user?.name?.split(" ")[0] ?? user?.username ?? "traveler";
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getDashboardDataFn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Could not load your trips.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    getCurrentPricingPlanFn()
      .then((activePlan) => {
        if (cancelled) return;
        setCurrentPlan(activePlan);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setPlanError(reason instanceof Error ? reason.message : "Could not load pricing plans.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const trips = data?.trips ?? [];
  const isLoading = data === null && error === null;

  async function handleDeleteTrip(trip: DashboardTrip) {
    const tripName = trip.title || trip.destination || "this trip";
    if (!window.confirm(`Delete ${tripName}? This cannot be undone.`)) return;

    setDeletingTripId(trip.id);
    try {
      await deleteTripFn({ data: { id: trip.id } });
      setData((current) =>
        current
          ? {
              trips: current.trips.filter((item) => item.id !== trip.id),
              imageCount: current.imageCount - trip.imageCount,
            }
          : current,
      );
      toast.success(`${tripName} deleted.`);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not delete that trip.");
    } finally {
      setDeletingTripId(null);
    }
  }

  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />

      {/* Hero header */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
            Welcome back, {firstName}
          </span>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] mb-6">Your archive.</h1>
          <p className="font-serif italic text-xl text-sand/60 max-w-xl">
            {isLoading
              ? "Gathering your journeys."
              : `${trips.length} ${trips.length === 1 ? "journey" : "journeys"}. ${data?.imageCount ?? 0} ${data?.imageCount === 1 ? "image" : "images"}.`}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-px bg-white/5 border border-white/5 max-w-xl">
          {[
            { label: "Trips", value: data ? String(trips.length) : "—" },
            { label: "Images", value: data ? String(data.imageCount) : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-midnight p-8">
              <p className="font-serif text-4xl text-gold">{s.value}</p>
              <p className="text-[10px] uppercase tracking-luxury text-sand/40 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-3 block">
              Membership
            </span>
            <h2 className="font-serif text-3xl md:text-4xl">Your plan</h2>
          </div>
          <a
            href="/#pricing"
            className="inline-flex items-center border border-gold/30 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-luxury text-gold transition-colors hover:bg-gold hover:text-midnight"
          >
            Upgrade plan
          </a>
        </div>

        {planError && <p className="text-sm text-ember">{planError}</p>}
        {!planError && currentPlan && (
          <div className="flex max-w-2xl flex-wrap items-center gap-6 border border-gold/30 bg-gold/5 px-6 py-5">
            <div>
              <p className="font-serif text-3xl text-gold">{currentPlan.name}</p>
              <p className="mt-1 text-xs text-sand/50">
                Up to {currentPlan.limits.numberOfTrips} trips and {currentPlan.limits.maxImages}{" "}
                images
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-luxury text-sand/40">Active plan</span>
          </div>
        )}
      </section>

      {/* Trips grid - cinematic asymmetric */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12 border-b border-white/10 pb-6">
          <h2 className="font-serif text-3xl md:text-4xl">Recent journeys</h2>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-luxury text-sand/40">
              {data ? `${trips.length} archived` : "Loading"}
            </span>
            <Link
              to="/create-trip"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-luxury text-gold transition-all hover:bg-gold hover:text-midnight"
            >
              <Plus className="size-3" />
              New trip
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-20 text-sand/50">
            <Loader2 className="size-4 animate-spin text-gold" />
            <span className="text-[10px] uppercase tracking-luxury">Loading your trips</span>
          </div>
        )}

        {error && <p className="py-20 text-center text-sm text-ember">{error}</p>}

        {data && trips.length === 0 && (
          <div className="glass-strong py-20 px-6 text-center">
            <h3 className="font-serif text-3xl mb-3">Your archive is waiting.</h3>
            <p className="text-sand/50 text-sm mb-8">Create your first trip to begin.</p>
            <Link
              to="/create-trip"
              className="inline-flex bg-gold text-midnight px-8 py-3 text-[10px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors"
            >
              Create a trip
            </Link>
          </div>
        )}

        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <DashboardTripCard
                key={trip.id}
                trip={trip}
                deleting={deletingTripId === trip.id}
                onDelete={() => void handleDeleteTrip(trip)}
              />
            ))}
          </div>
        )}
      </section>

      <CinematicFooter />
    </div>
  );
}

function DashboardTripCard({
  trip,
  onDelete,
  deleting,
}: {
  trip: DashboardTrip;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <MemoryCard
      to={`/trip/${trip.id}`}
      image={trip.coverImageUrl || heroImg}
      title={trip.title || trip.destination || "Untitled trip"}
      date={formatDate(trip.departure)}
      moments={trip.imageCount}
      momentLabel={trip.imageCount === 1 ? "image" : "images"}
      mood={trip.cinematicMood || undefined}
      onDelete={onDelete}
      deleting={deleting}
    />
  );
}

function formatDate(value: string): string {
  if (!value) return "New trip";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}
