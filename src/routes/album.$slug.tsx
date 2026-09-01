import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Volume2, VolumeX, Share2, Download } from "lucide-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { ChapterSection } from "@/components/voyaloom/ChapterSection";
import { AnimatedQuote } from "@/components/voyaloom/AnimatedQuote";
import { AlbumArchive } from "@/components/voyaloom/AlbumArchive";
import { seo } from "@/lib/seo/seo";
import amalfi from "@/assets/amalfi-boat.jpg";
import iceland from "@/assets/iceland-beach.jpg";
import morocco from "@/assets/morocco-riad.jpg";
import tokyo from "@/assets/tokyo-alley.jpg";
import paris from "@/assets/paris-cafe.jpg";
import bonfire from "@/assets/midnight-bonfire.jpg";
import departure from "@/assets/departure-terminal.jpg";

export const Route = createFileRoute("/album/$slug")({
  head: ({ params }) =>
    seo({
      title: `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} — sample album`,
      description:
        "A sample VoyaLoom travel album — a scrollable cinematic story built by AI from a set of trip photos.",
      robots: "follow",
    }),
  component: Album,
});

const chapters = [
  {
    number: "I",
    title: "The Departure",
    quote: "The world began to soften the moment we left.",
    description: "Early light through terminal glass.",
    image: departure,
    mood: "Anticipation",
  },
  {
    number: "II",
    title: "Streets & Cafés",
    quote: "Espresso steam and overheard languages.",
    description: "Wandering slow mornings through narrow lanes.",
    image: paris,
    mood: "Tender",
  },
  {
    number: "III",
    title: "Golden Beaches",
    quote: "The sea kept its own time.",
    description: "Endless horizons folding into sunset.",
    image: iceland,
    mood: "Serenity",
  },
  {
    number: "IV",
    title: "Midnight Adventures",
    quote: "We danced barefoot around fire we built ourselves.",
    description: "Hours dissolved into sparks.",
    image: bonfire,
    mood: "Electric",
  },
  {
    number: "V",
    title: "Final Goodbye",
    quote: "We left a small piece of ourselves at the harbor.",
    description: "One last look before memory becomes myth.",
    image: amalfi,
    mood: "Bittersweet",
  },
];

function Album() {
  const { slug } = Route.useParams();
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

  return (
    <div ref={ref} className="bg-midnight text-sand">
      <LuxuryNavbar />

      {/* Cinematic letterbox bars - persistent */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-midnight z-40 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-midnight z-40 pointer-events-none" />

      {/* Music toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="fixed bottom-12 right-8 z-50 size-12 rounded-full glass-strong flex items-center justify-center hover:border-gold transition-colors"
      >
        {muted ? (
          <VolumeX className="size-4 text-sand/60" />
        ) : (
          <Volume2 className="size-4 text-gold" />
        )}
      </button>

      {/* Opening hero */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center grain">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img src={amalfi} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-midnight/40" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] uppercase tracking-ultra text-gold mb-8 block"
          >
            A VoyaLoom sample album
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.6 }}
            className="font-serif text-7xl md:text-[10rem] leading-[0.9]"
          >
            The {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="font-serif italic text-2xl text-sand/70 mt-8"
          >
            A film in five chapters
          </motion.p>
        </div>
      </section>

      {/* Opening memory quote */}
      <section className="py-40 px-8 bg-midnight">
        <AnimatedQuote text="Some journeys end. The good ones never quite leave." />
      </section>

      {/* Chapter sections */}
      {chapters.map((c, i) => (
        <ChapterSection key={c.number} {...c} reverse={i % 2 === 1} />
      ))}

      {/* AI-categorized archive */}
      <AlbumArchive />

      {/* Highlighted hero moment */}
      <section className="relative h-screen overflow-hidden flex items-end pb-32 px-8">
        <div className="absolute inset-0">
          <img src={bonfire} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="relative z-10 max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
            Hero Moment · 04:12 of the album
          </span>
          <h2 className="font-serif text-5xl md:text-7xl leading-tight">
            "And the night, as it turned out, knew our names."
          </h2>
        </motion.div>
      </section>

      {/* Ending credits */}
      <section className="py-40 px-8 bg-charcoal/30 border-y border-white/5 grain relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-8 block">
            End Credits
          </span>
          <h2 className="font-serif text-6xl md:text-8xl mb-16">Fin.</h2>

          <div className="space-y-8 text-sand/60">
            <Credit role="Cinematography" name="Your eye, your hands" />
            <Credit role="Score" name="Composed by atmosphere" />
            <Credit role="Editor" name="VoyaLoom" />
            <Credit role="Starring" name="The places you went · The you that went there" />
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-4">
            <button className="inline-flex items-center gap-3 bg-gold text-midnight px-8 py-4 text-[10px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold">
              <Share2 className="size-4" /> Share film
            </button>
            <button className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-[10px] uppercase tracking-luxury hover:bg-white/5 transition-colors">
              <Download className="size-4" /> Export
            </button>
          </div>

          <p className="mt-20 text-[10px] uppercase tracking-ultra text-sand/30">
            Built by VoyaLoom from the photos you upload
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-6 text-[10px] uppercase tracking-luxury text-gold border-b border-gold/40 pb-1"
          >
            Return to archive
          </Link>
        </motion.div>
      </section>

      <CinematicFooter />
    </div>
  );
}

function Credit({ role, name }: { role: string; name: string }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-center md:gap-12 items-center">
      <span className="text-[10px] uppercase tracking-luxury text-gold/70 md:w-48 md:text-right">
        {role}
      </span>
      <span className="font-serif italic text-2xl text-sand">{name}</span>
    </div>
  );
}
