import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ChapterSectionProps {
  number: string;
  title: string;
  quote: string;
  description: string;
  image: string;
  mood: string;
  reverse?: boolean;
}

export function ChapterSection({
  number,
  title,
  quote,
  description,
  image,
  mood,
  reverse,
}: ChapterSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center py-32 px-6 md:px-12 overflow-hidden"
    >
      <div
        className={`max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <motion.div style={{ opacity }} className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-4">
            <span className="font-serif italic text-gold text-2xl">{number}</span>
            <div className="h-px flex-1 bg-gold/30 max-w-[80px]" />
            <span className="text-[10px] uppercase tracking-luxury text-gold/80">{mood}</span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] text-sand">{title}</h2>
          <p className="font-serif italic text-xl md:text-2xl text-sand/70 leading-relaxed">
            "{quote}"
          </p>
          <p className="text-sand/50 font-light leading-relaxed max-w-md">{description}</p>
        </motion.div>

        <div className="lg:col-span-7 relative">
          <motion.div
            style={{ y }}
            className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-cinematic"
          >
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
