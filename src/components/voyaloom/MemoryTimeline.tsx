import { motion } from "framer-motion";

interface TimelineItem {
  number: string;
  title: string;
  mood: string;
}

export function MemoryTimeline({ items, active }: { items: TimelineItem[]; active?: number }) {
  return (
    <div className="flex flex-col gap-1">
      {items.map((it, i) => (
        <motion.div
          key={it.number}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`group flex items-baseline gap-6 py-4 border-b border-white/5 cursor-pointer transition-colors ${
            active === i ? "text-gold" : "text-sand/60 hover:text-sand"
          }`}
        >
          <span className="font-serif italic text-sm w-8">{it.number}</span>
          <div className="flex-1">
            <h4 className="font-serif text-2xl">{it.title}</h4>
            <p className="text-[10px] uppercase tracking-luxury text-gold/60 mt-1">{it.mood}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
