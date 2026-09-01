import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { ChapterSection } from "@/components/voyaloom/ChapterSection";
import { MemoryTimeline } from "@/components/voyaloom/MemoryTimeline";
import { AnimatedQuote } from "@/components/voyaloom/AnimatedQuote";
import { seo } from "@/lib/seo/seo";
import amalfi from "@/assets/amalfi-boat.jpg";
import iceland from "@/assets/iceland-beach.jpg";
import morocco from "@/assets/morocco-riad.jpg";
import tokyo from "@/assets/tokyo-alley.jpg";
import paris from "@/assets/paris-cafe.jpg";
import bonfire from "@/assets/midnight-bonfire.jpg";
import departure from "@/assets/departure-terminal.jpg";

export const Route = createFileRoute("/trip/$slug")({
  head: ({ params }) =>
    seo({
      title: `${formatTitle(params.slug)} — sample travel album`,
      description: `A sample VoyaLoom travel album showing how AI organizes trip photos into a cinematic story.`,
      // Demo content that renders the same for any slug — keep it out of the
      // index but let link equity flow to the real marketing pages.
      robots: "follow",
    }),
  component: TripDetails,
});

function formatTitle(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

const chapters = [
  {
    number: "I",
    title: "The Departure",
    quote: "The world began to soften the moment we left.",
    description: "Early light through terminal glass. The quiet thrill of an unwritten week ahead.",
    image: departure,
    mood: "Anticipation",
  },
  {
    number: "II",
    title: "Streets & Cafés",
    quote: "Espresso steam and overheard languages we didn't speak.",
    description:
      "Wandering slow mornings through narrow lanes. Marble tables, vintage cameras, time bending sideways.",
    image: paris,
    mood: "Tender",
  },
  {
    number: "III",
    title: "Golden Beaches",
    quote: "The sea kept its own time, indifferent and generous.",
    description:
      "Endless horizons folding into sunset. Salt on skin. The rhythm of waves becoming our own.",
    image: iceland,
    mood: "Serenity",
  },
  {
    number: "IV",
    title: "Midnight Adventures",
    quote: "We danced barefoot around fire we built ourselves.",
    description:
      "Hours dissolved into sparks. The dark made us braver. Stars older than language watched us laugh.",
    image: bonfire,
    mood: "Electric",
  },
  {
    number: "V",
    title: "Final Goodbye",
    quote: "We left a small piece of ourselves at the harbor.",
    description:
      "One last look at the horizon before the journey becomes memory, then myth, then story.",
    image: amalfi,
    mood: "Bittersweet",
  },
];

function TripDetails() {
  const { slug } = Route.useParams();
  const title = formatTitle(slug);

  return (
    <div className="bg-midnight text-sand">
      <LuxuryNavbar />

      {/* Hero */}
      <section className="relative h-screen overflow-hidden flex items-end pb-20 px-6 md:px-12 grain">
        <div className="absolute inset-0 z-0">
          <img src={amalfi} alt="" className="w-full h-full object-cover animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-midnight/40" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-16 bg-midnight z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-midnight z-10" />

        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-[10px] uppercase tracking-ultra text-gold mb-6 block"
          >
            A VoyaLoom sample album
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="font-serif text-6xl md:text-9xl leading-[0.9] mb-8"
          >
            The {title} Coast
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-wrap items-center gap-8 text-[10px] uppercase tracking-luxury text-sand/60"
          >
            <span>142 Moments</span>
            <span className="size-1 rounded-full bg-gold" />
            <span>5 Chapters</span>
            <span className="size-1 rounded-full bg-gold" />
            <span>Memory Score · 94</span>
            <span className="size-1 rounded-full bg-gold" />
            <span className="text-gold">AI Mood · Quiet Serenity</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 flex gap-4"
          >
            <Link
              to="/album/$slug"
              params={{ slug }}
              className="group inline-flex items-center gap-3 bg-gold text-midnight px-8 py-4 text-[10px] uppercase tracking-luxury font-semibold hover:bg-sand transition-all shadow-gold"
            >
              <Play className="size-4" fill="currentColor" />
              Play album
            </Link>
            <button className="px-8 py-4 border border-white/20 text-[10px] uppercase tracking-luxury hover:bg-white/5 transition-all">
              Share
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats + AI label */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatedQuote text="The world felt infinite from the bow of that boat." />
          </div>
          <div className="lg:col-span-4 glass-strong p-10 rounded-sm">
            <span className="text-gold text-[10px] uppercase tracking-luxury mb-4 block">
              AI Sentiment Analysis
            </span>
            <h3 className="font-serif text-3xl mb-4">Quiet Serenity</h3>
            <p className="text-sand/50 text-sm leading-relaxed mb-6">
              The model detected a tonal shift toward the coast. Colors warmed to ochre and deep
              blue. This album emphasizes the stillness of the Mediterranean.
            </p>
            <div className="h-px w-12 bg-gold/50" />
          </div>
        </div>
      </section>

      {/* Chapter index */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <h2 className="font-serif text-4xl">Chapters</h2>
          <span className="text-[10px] uppercase tracking-luxury text-sand/40">5 acts</span>
        </div>
        <MemoryTimeline
          items={chapters.map((c) => ({ number: c.number, title: c.title, mood: c.mood }))}
          active={0}
        />
      </section>

      {/* Chapter sections */}
      {chapters.map((c, i) => (
        <ChapterSection key={c.number} {...c} reverse={i % 2 === 1} />
      ))}

      {/* Generated by */}
      <section className="py-32 px-8 text-center border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
            Built by VoyaLoom
          </span>
          <h3 className="font-serif text-4xl mb-8">Every chapter was composed for you.</h3>
          <Link
            to="/album/$slug"
            params={{ slug }}
            className="inline-flex items-center gap-3 text-gold border-b border-gold/40 pb-1 text-xs uppercase tracking-luxury hover:border-gold transition-colors"
          >
            Watch the full album <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </section>

      <CinematicFooter />
    </div>
  );
}
