import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { CinematicHero } from "@/components/voyaloom/CinematicHero";
import { MemoryCard } from "@/components/voyaloom/MemoryCard";
import { AnimatedQuote } from "@/components/voyaloom/AnimatedQuote";
import { FloatingGallery } from "@/components/voyaloom/FloatingGallery";
import { FaqList } from "@/components/voyaloom/FaqList";
import { ldJson, seo } from "@/lib/seo/seo";
import { FAQ_ITEMS } from "@/lib/seo/faq";
import { faqPageLd, softwareApplicationLd } from "@/lib/seo/structured-data";
import amalfi from "@/assets/amalfi-boat.jpg";
import iceland from "@/assets/iceland-beach.jpg";
import morocco from "@/assets/morocco-riad.jpg";
import tokyo from "@/assets/tokyo-alley.jpg";
import paris from "@/assets/paris-cafe.jpg";
import bonfire from "@/assets/midnight-bonfire.jpg";

const HOME_FAQ = FAQ_ITEMS.slice(0, 5);

export const Route = createFileRoute("/")({
  head: () => {
    const base = seo({
      appendSuffix: false,
      description:
        "Turn your travel photos into a cinematic story. Upload your trip photos and VoyaLoom uses AI to analyze the moments, organize and curate your best shots, write descriptions, and build a beautiful travel album — automatically, and always from your own photos.",
      path: "/",
    });
    return {
      ...base,
      meta: [...base.meta, ldJson(softwareApplicationLd()), ldJson(faqPageLd(HOME_FAQ))],
    };
  },
  component: Landing,
});

function Landing() {
  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />
      <CinematicHero />

      {/* What is VoyaLoom — answer-first */}
      <section className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
            What is VoyaLoom?
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            An AI travel album generator that works with your real photos.
          </h2>
          <p className="text-sand/60 font-light leading-relaxed text-lg">
            VoyaLoom turns the photos from a trip into a cinematic travel album. You upload your
            trip photos and AI analyzes the images, understands the moments, organizes and curates
            the strongest shots, writes contextual descriptions, adds fitting quotes, and lays
            everything out as a scrollable visual story. You skip the hours of sorting, choosing,
            and arranging — the memories stay yours.
          </p>
        </motion.div>
      </section>

      {/* Featured sample albums */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-end justify-between mb-16 border-b border-white/10 pb-8"
        >
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
              Sample albums
            </span>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight max-w-2xl">
              What a finished VoyaLoom album looks like.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MemoryCard
            to="/album/amalfi"
            image={amalfi}
            title="The Amalfi Coast"
            date="Sample album"
            moments={142}
            mood="Serenity"
          />
          <MemoryCard
            to="/album/iceland"
            image={iceland}
            title="Iceland in Gold"
            date="Sample album"
            moments={208}
            mood="Vastness"
          />
          <MemoryCard
            to="/album/morocco"
            image={morocco}
            title="Marrakech Nights"
            date="Sample album"
            moments={176}
            mood="Mystic"
          />
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 px-8 border-y border-white/5 bg-charcoal/30 relative grain">
        <AnimatedQuote
          text="It felt less like looking at my photos and more like watching a documentary of my own trip."
          author="An early VoyaLoom traveler"
        />
      </section>

      {/* Floating gallery */}
      <section className="py-32 px-8 relative overflow-hidden">
        <FloatingGallery
          images={[
            { src: tokyo, alt: "Neon-lit alley in Tokyo at night" },
            { src: paris, alt: "Morning light in a Paris café" },
            { src: bonfire, alt: "Friends around a bonfire after dark" },
            { src: amalfi, alt: "A small boat on the water off the Amalfi Coast" },
            { src: iceland, alt: "A black-sand beach in Iceland at golden hour" },
          ]}
        />
      </section>

      {/* How it works */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
            How VoyaLoom works
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight max-w-3xl">
            From a full camera roll to a finished album.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              n: "01",
              t: "Upload your trip photos",
              d: "Create a trip and add the photos you took. No sorting or naming needed — upload them as they are.",
            },
            {
              n: "02",
              t: "AI reads and organizes them",
              d: "VoyaLoom analyzes each image to understand scenes and moments, groups related photos, curates the strongest shots, and writes contextual descriptions and quotes.",
            },
            {
              n: "03",
              t: "Get a cinematic album",
              d: "Your photos are arranged into a scrollable visual story you can revisit and share. Your originals stay in the album archive.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="relative"
            >
              <span className="font-serif italic text-gold/40 text-7xl">{s.n}</span>
              <h3 className="font-serif text-3xl mt-4 mb-4">{s.t}</h3>
              <p className="text-sand/60 font-light leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-3 text-gold border-b border-gold/40 pb-1 text-xs uppercase tracking-luxury hover:border-gold transition-colors"
          >
            Read the full walkthrough
          </Link>
        </div>
      </section>

      {/* What VoyaLoom does with your photos — AI clarification */}
      <section className="py-32 px-6 md:px-12 bg-charcoal/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
              What the AI does
            </span>
            <ul className="space-y-3 text-sand/70 font-light leading-relaxed">
              <li>Analyzes your uploaded travel photos</li>
              <li>Understands scenes, settings, and moments</li>
              <li>Groups related photos and curates the strongest ones</li>
              <li>Identifies the meaningful parts of a trip</li>
              <li>Writes contextual descriptions for the story</li>
              <li>Adds suitable quotes where they fit</li>
              <li>Arranges everything into a cinematic album</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 }}
          >
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
              What the AI does not do
            </span>
            <p className="text-sand/70 font-light leading-relaxed">
              VoyaLoom does not generate AI images and does not replace your travel photos with
              artificial ones. Every photo in your album is a photo you took and uploaded. The AI
              organizes and presents your real memories — it doesn't invent them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Free usage */}
      <section className="py-28 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
            Free to use
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            VoyaLoom is currently free.
          </h2>
          <p className="text-sand/60 font-light leading-relaxed text-lg">
            You can upload up to 100 images and create up to 2 trips per account at no cost. There
            are no paid plans right now — just create an account and start your first album.
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
            Frequently asked questions
          </span>
          <h2 className="font-serif text-5xl md:text-6xl leading-tight">
            Common questions about VoyaLoom.
          </h2>
        </motion.div>

        <FaqList items={HOME_FAQ} />

        <div className="mt-10">
          <Link
            to="/faq"
            className="inline-flex items-center gap-3 text-gold border-b border-gold/40 pb-1 text-xs uppercase tracking-luxury hover:border-gold transition-colors"
          >
            See all questions
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bonfire} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/70 to-midnight" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
            Turn your last trip into an album.
          </h2>
          <p className="text-sand/60 mb-12 max-w-xl mx-auto">
            Upload your photos and let AI do the sorting, curating, and storytelling. Free for up to
            100 images and 2 trips.
          </p>
          <Link
            to="/get-started"
            className="inline-block bg-gold text-midnight px-12 py-5 text-xs uppercase tracking-luxury font-semibold hover:bg-sand transition-all shadow-gold"
          >
            Create your album — free
          </Link>
        </motion.div>
      </section>

      <CinematicFooter />
    </div>
  );
}
