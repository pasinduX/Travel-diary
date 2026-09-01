import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

interface MemoryCardProps {
  to: string;
  image: string;
  title: string;
  date: string;
  moments: number;
  mood?: string;
  momentLabel?: string;
  onDelete?: () => void;
  deleting?: boolean;
  actions?: ReactNode;
}

export function MemoryCard({
  to,
  image,
  title,
  date,
  moments,
  mood,
  momentLabel = "moments",
  onDelete,
  deleting = false,
  actions,
}: MemoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      className="group relative overflow-hidden rounded-sm cursor-pointer"
    >
      <Link to={to}>
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
          <motion.img
            src={image}
            alt={title}
            variants={{ hover: { scale: 1.08 } }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-[filter] duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" />
          {mood && (
            <div className="absolute top-5 right-5 glass-strong px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-gold">
              {mood}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <p className="text-[10px] uppercase tracking-ultra text-gold mb-2">{date}</p>
            <h3 className="font-serif text-3xl text-sand mb-2 leading-tight">{title}</h3>
            <p className="text-xs text-sand/50">
              {moments} {momentLabel}
            </p>
            <motion.div
              variants={{ hover: { width: "100%" } }}
              initial={{ width: "20%" }}
              transition={{ duration: 0.6 }}
              className="h-px bg-gold mt-4"
            />
          </div>
        </div>
      </Link>
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${title}`}
          disabled={deleting}
          onClick={onDelete}
          className="absolute right-5 top-16 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-midnight/75 text-sand/70 opacity-100 transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-wait disabled:opacity-60 md:opacity-0 md:group-hover:opacity-100"
        >
          {deleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </button>
      )}
      {actions && <div className="grid grid-cols-3 gap-px bg-white/10">{actions}</div>}
    </motion.div>
  );
}
