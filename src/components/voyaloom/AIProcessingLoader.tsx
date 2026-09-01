import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stages = ["Sending your photographs", "Securing your upload", "Starting image analysis"];

export function AIProcessingLoader() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="relative inline-block mb-12">
        <div className="absolute inset-0 blur-3xl bg-gold/30 animate-pulse-gold rounded-full" />
        <div className="relative border border-gold/30 bg-midnight size-52 rounded-full flex items-center justify-center">
          <div className="absolute size-44 rounded-full border-2 border-gold/10 border-t-gold animate-spin-slow" />
          <div
            className="absolute size-32 rounded-full border border-gold/20 border-b-gold animate-spin-slow"
            style={{ animationDuration: "12s", animationDirection: "reverse" }}
          />
          <span className="text-[10px] uppercase tracking-ultra text-gold">
            {String(Math.round(((active + 1) / stages.length) * 100)).padStart(2, "0")}%
          </span>
        </div>
      </div>
      <h2 className="font-serif text-4xl md:text-5xl text-sand mb-10">Preparing your journey</h2>
      <div className="space-y-3">
        {stages.map((stage, i) => (
          <motion.div
            key={stage}
            animate={{
              opacity: i <= active ? 1 : 0.3,
              x: i === active ? 8 : 0,
            }}
            className="flex items-center gap-4 text-sm tracking-widest uppercase justify-center"
          >
            <span
              className={`size-1.5 rounded-full transition-colors ${
                i < active ? "bg-gold" : i === active ? "bg-gold animate-pulse" : "bg-white/20"
              }`}
            />
            <span className={i === active ? "text-gold" : "text-sand/60"}>{stage}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
