import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { seo } from "@/lib/seo/seo";
import heroImg from "@/assets/hero-tuscany.jpg";

export const Route = createFileRoute("/get-started")({
  head: () =>
    seo({
      title: "Get started",
      description:
        "Create a free VoyaLoom account or sign in to start turning your travel photos into a cinematic AI-built album. Free for up to 100 images and 2 trips.",
      path: "/get-started",
    }),
  component: GetStarted,
});

function GetStarted() {
  return (
    <div className="relative min-h-screen bg-midnight text-sand overflow-hidden">
      <LuxuryNavbar />

      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover opacity-25 animate-slow-zoom"
        />
        <div className="absolute inset-0 cinematic-gradient" />
      </div>

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-midnight z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-midnight z-20" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute size-1 rounded-full bg-gold/40"
            initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
              Get started with VoyaLoom
            </span>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-6">
              Start your <em className="font-light text-gradient-gold">travel album.</em>
            </h1>
            <p className="font-serif italic text-lg text-sand/60 max-w-xl mx-auto">
              Sign in, or create a free account and turn your first trip's photos into a cinematic
              album.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChoiceCard
              to="/login"
              delay={0.2}
              eyebrow="Returning"
              icon={<KeyRound className="size-5 text-gold" />}
              title="Sign in"
              description="Pick up where you left off. Your travel albums are waiting."
              cta="Sign in"
            />
            <ChoiceCard
              to="/signup"
              delay={0.35}
              featured
              eyebrow="First time"
              icon={<Sparkles className="size-5 text-midnight" />}
              title="Create account"
              description="Free for up to 100 images and 2 trips. Start your first album in minutes."
              cta="Create a free account"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-center text-xs text-sand/40 mt-12"
          >
            By continuing you agree to our{" "}
            <Link to="/terms" className="text-sand/60 underline-offset-4 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-sand/60 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  to,
  delay,
  eyebrow,
  icon,
  title,
  description,
  cta,
  featured,
}: {
  to: "/login" | "/signup";
  delay: number;
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={to}
        className={`group block glass-strong rounded-sm p-10 h-full relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
          featured ? "border-gold/40 shadow-gold" : "hover:border-white/30"
        }`}
      >
        {featured && (
          <div className="absolute top-0 right-0 bg-gold text-midnight text-[9px] uppercase tracking-ultra font-semibold px-3 py-1">
            Recommended
          </div>
        )}

        <div
          className={`size-14 rounded-full flex items-center justify-center mb-8 border ${
            featured ? "bg-gold border-gold" : "bg-gold/10 border-gold/30"
          }`}
        >
          {icon}
        </div>

        <span className="text-[10px] uppercase tracking-ultra text-gold mb-3 block">{eyebrow}</span>
        <h2 className="font-serif text-4xl mb-4 leading-tight">{title}</h2>
        <p className="text-sand/60 font-light leading-relaxed mb-10 min-h-[3.5rem]">
          {description}
        </p>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-luxury text-gold font-semibold border-t border-white/10 pt-6">
          {cta}
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
