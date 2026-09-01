import { motion } from "framer-motion";

export function AnimatedQuote({ text, author }: { text: string; author?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto text-center"
    >
      <p className="font-serif italic text-3xl md:text-5xl leading-tight text-sand/90">"{text}"</p>
      {author && <p className="mt-8 text-[10px] uppercase tracking-ultra text-gold">— {author}</p>}
    </motion.div>
  );
}
