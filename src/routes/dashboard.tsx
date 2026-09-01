import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Sparkles, Users } from "lucide-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { requireAuth } from "@/lib/auth/guards";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { MemoryCard } from "@/components/voyaloom/MemoryCard";
import { seo } from "@/lib/seo/seo";
import amalfi from "@/assets/amalfi-boat.jpg";
import iceland from "@/assets/iceland-beach.jpg";
import morocco from "@/assets/morocco-riad.jpg";
import tokyo from "@/assets/tokyo-alley.jpg";
import paris from "@/assets/paris-cafe.jpg";

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

const trips = [
  {
    slug: "amalfi",
    img: amalfi,
    title: "The Amalfi Coast",
    date: "August 2024",
    moments: 142,
    mood: "Serenity",
    status: "ready",
  },
  {
    slug: "iceland",
    img: iceland,
    title: "Iceland in Gold",
    date: "October 2024",
    moments: 208,
    mood: "Vastness",
    status: "ready",
  },
  {
    slug: "morocco",
    img: morocco,
    title: "Marrakech Nights",
    date: "March 2024",
    moments: 176,
    mood: "Mystic",
    status: "ready",
  },
  {
    slug: "tokyo",
    img: tokyo,
    title: "Tokyo After Rain",
    date: "January 2024",
    moments: 94,
    mood: "Electric",
    status: "processing",
  },
  {
    slug: "paris",
    img: paris,
    title: "Slow Mornings in Paris",
    date: "May 2023",
    moments: 132,
    mood: "Tender",
    status: "ready",
  },
];

function Dashboard() {
  const user = useCurrentUser();
  const firstName = user?.name?.split(" ")[0] ?? user?.username ?? "traveler";

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
            Five journeys. 752 moments. A library of quiet thunder.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { label: "Trips", value: "12" },
            { label: "Moments", value: "1,840" },
            { label: "Chapters", value: "47" },
            { label: "Collaborators", value: "8" },
          ].map((s) => (
            <div key={s.label} className="bg-midnight p-8">
              <p className="font-serif text-4xl text-gold">{s.value}</p>
              <p className="text-[10px] uppercase tracking-luxury text-sand/40 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/create-trip"
            className="group glass-strong p-8 flex items-center gap-5 hover:border-gold transition-colors"
          >
            <div className="size-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:text-midnight transition-colors">
              <Plus className="size-5 text-gold group-hover:text-midnight" />
            </div>
            <div>
              <p className="font-serif text-xl">New trip</p>
              <p className="text-[10px] uppercase tracking-luxury text-sand/40 mt-1">
                Start a new archive
              </p>
            </div>
          </Link>
          <div className="glass-strong p-8 flex items-center gap-5">
            <div className="size-12 rounded-full bg-ember/10 border border-ember/30 flex items-center justify-center">
              <Sparkles className="size-5 text-ember animate-pulse" />
            </div>
            <div>
              <p className="font-serif text-xl">1 album processing</p>
              <p className="text-[10px] uppercase tracking-luxury text-sand/40 mt-1">
                Tokyo After Rain · 64%
              </p>
            </div>
          </div>
          <div className="glass-strong p-8 flex items-center gap-5">
            <div className="size-12 rounded-full bg-sand/10 border border-sand/20 flex items-center justify-center">
              <Users className="size-5 text-sand" />
            </div>
            <div>
              <p className="font-serif text-xl">3 collaborators</p>
              <p className="text-[10px] uppercase tracking-luxury text-sand/40 mt-1">
                Pooling memories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trips grid - cinematic asymmetric */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <h2 className="font-serif text-3xl md:text-4xl">Recent journeys</h2>
          <span className="text-[10px] uppercase tracking-luxury text-sand/40">
            {trips.length} archived
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t) => (
            <MemoryCard
              key={t.slug}
              to={`/trip/${t.slug}`}
              image={t.img}
              title={t.title}
              date={t.date}
              moments={t.moments}
              mood={t.status === "processing" ? "Processing" : t.mood}
            />
          ))}
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
}
