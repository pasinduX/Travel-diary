import { motion } from "framer-motion";

interface FloatingGalleryProps {
  images: { src: string; alt: string }[];
}

const positions = [
  "top-0 left-[5%] w-[28%] aspect-[3/4] rotate-[-3deg] z-20",
  "top-[12%] right-[8%] w-[24%] aspect-[4/5] rotate-[2deg] z-10",
  "top-[45%] left-[28%] w-[22%] aspect-square rotate-[1deg] z-30",
  "bottom-[8%] right-[18%] w-[26%] aspect-[3/4] rotate-[-2deg] z-20",
  "bottom-[20%] left-[2%] w-[20%] aspect-square rotate-[4deg] z-10",
];

export function FloatingGallery({ images }: FloatingGalleryProps) {
  return (
    <div className="relative h-[700px] md:h-[800px] max-w-6xl mx-auto">
      {images.slice(0, 5).map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, zIndex: 40, rotate: 0 }}
          className={`absolute overflow-hidden rounded-sm shadow-cinematic bg-charcoal border border-white/10 ${positions[i]}`}
        >
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="font-serif italic text-5xl md:text-7xl text-gold/15 text-center leading-tight max-w-2xl">
          The art of remembering.
        </p>
      </div>
    </div>
  );
}
