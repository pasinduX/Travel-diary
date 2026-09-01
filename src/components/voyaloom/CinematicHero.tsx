import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-tuscany.jpg";

export function CinematicHero() {
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center grain">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Rolling Tuscan hills at dawn — the kind of travel photo VoyaLoom turns into an album"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="w-full h-full object-cover animate-slow-zoom opacity-70"
        />
        <div className="absolute inset-0 cinematic-gradient" />
      </div>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-midnight z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-midnight z-20" />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="block text-gold text-xs uppercase tracking-ultra mb-8"
        >
          AI travel album generator
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-sand mb-8"
        >
          Turn your travel photos <br />
          into a <em className="font-light text-gradient-gold">cinematic story.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-base md:text-lg text-sand/60 font-light max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Upload your trip photos and VoyaLoom uses AI to read the moments, organize your memories,
          curate the best shots, and build a beautiful cinematic travel album — from your own
          photos, automatically.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/get-started"
            className="group inline-flex items-center gap-3 bg-gold text-midnight px-10 py-4 text-xs uppercase tracking-luxury font-semibold hover:bg-sand transition-all shadow-gold"
          >
            Create your album — free
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/how-it-works"
            className="px-10 py-4 border border-white/20 text-sand text-xs uppercase tracking-luxury font-semibold hover:bg-white/5 transition-all"
          >
            See how it works
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-ultra text-gold/60">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
