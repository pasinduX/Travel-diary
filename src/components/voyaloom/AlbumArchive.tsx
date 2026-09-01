import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import amalfi from "@/assets/amalfi-boat.jpg";
import iceland from "@/assets/iceland-beach.jpg";
import morocco from "@/assets/morocco-riad.jpg";
import tokyo from "@/assets/tokyo-alley.jpg";
import paris from "@/assets/paris-cafe.jpg";
import bonfire from "@/assets/midnight-bonfire.jpg";
import departure from "@/assets/departure-terminal.jpg";
import coastAerial from "@/assets/amalfi-coast-aerial.jpg";
import positano from "@/assets/positano-stairs.jpg";
import ravello from "@/assets/ravello-terrace.jpg";
import lemons from "@/assets/lemon-grove.jpg";
import boatSunset from "@/assets/boat-sunset.jpg";
import trattoria from "@/assets/trattoria-night.jpg";

/**
 * Shape mirrors what the future AI pipeline will return per photo:
 * place (geo/vision), timeOfDay (EXIF + light analysis), palette + mood,
 * and an aspect hint so the layout engine can align tiles.
 */
interface Memory {
  src: string;
  place: string;
  time: "Morning" | "Golden Hour" | "Blue Hour" | "Midnight";
  mood: string;
  palette: string;
  aspect: "portrait" | "landscape" | "square";
}

const MEMORIES: Memory[] = [
  {
    src: coastAerial,
    place: "Amalfi",
    time: "Golden Hour",
    mood: "Awe",
    palette: "Terracotta · Teal",
    aspect: "landscape",
  },
  {
    src: positano,
    place: "Positano",
    time: "Morning",
    mood: "Tender",
    palette: "Bougainvillea · Cream",
    aspect: "portrait",
  },
  {
    src: ravello,
    place: "Ravello",
    time: "Blue Hour",
    mood: "Stillness",
    palette: "Cypress · Indigo",
    aspect: "landscape",
  },
  {
    src: lemons,
    place: "Amalfi",
    time: "Golden Hour",
    mood: "Warmth",
    palette: "Citrus · Leaf",
    aspect: "portrait",
  },
  {
    src: boatSunset,
    place: "Atrani",
    time: "Golden Hour",
    mood: "Serenity",
    palette: "Ember · Rose",
    aspect: "landscape",
  },
  {
    src: trattoria,
    place: "Positano",
    time: "Blue Hour",
    mood: "Intimate",
    palette: "Candlelight · Dusk",
    aspect: "portrait",
  },
  {
    src: amalfi,
    place: "Atrani",
    time: "Morning",
    mood: "Freedom",
    palette: "Salt · Sky",
    aspect: "portrait",
  },
  {
    src: paris,
    place: "Positano",
    time: "Morning",
    mood: "Slow",
    palette: "Espresso · Linen",
    aspect: "landscape",
  },
  {
    src: bonfire,
    place: "Atrani",
    time: "Midnight",
    mood: "Electric",
    palette: "Spark · Night",
    aspect: "landscape",
  },
  {
    src: departure,
    place: "Naples",
    time: "Morning",
    mood: "Anticipation",
    palette: "Glass · Steel",
    aspect: "landscape",
  },
  {
    src: tokyo,
    place: "Positano",
    time: "Midnight",
    mood: "Wonder",
    palette: "Lantern · Cobalt",
    aspect: "portrait",
  },
  {
    src: iceland,
    place: "Atrani",
    time: "Golden Hour",
    mood: "Vast",
    palette: "Sand · Horizon",
    aspect: "landscape",
  },
  {
    src: morocco,
    place: "Ravello",
    time: "Golden Hour",
    mood: "Hidden",
    palette: "Clay · Shadow",
    aspect: "portrait",
  },
  {
    src: coastAerial,
    place: "Positano",
    time: "Morning",
    mood: "Arrival",
    palette: "Pastel · Marine",
    aspect: "square",
  },
  {
    src: trattoria,
    place: "Amalfi",
    time: "Midnight",
    mood: "Celebration",
    palette: "Wine · Ember",
    aspect: "square",
  },
  {
    src: lemons,
    place: "Ravello",
    time: "Morning",
    mood: "Fresh",
    palette: "Zest · Dew",
    aspect: "square",
  },
  {
    src: boatSunset,
    place: "Capri",
    time: "Blue Hour",
    mood: "Drift",
    palette: "Violet · Foam",
    aspect: "portrait",
  },
  {
    src: ravello,
    place: "Capri",
    time: "Blue Hour",
    mood: "Quiet",
    palette: "Stone · Twilight",
    aspect: "portrait",
  },
  {
    src: bonfire,
    place: "Capri",
    time: "Midnight",
    mood: "Alive",
    palette: "Flame · Velvet",
    aspect: "portrait",
  },
  {
    src: positano,
    place: "Capri",
    time: "Golden Hour",
    mood: "Radiant",
    palette: "Bloom · Sun",
    aspect: "landscape",
  },
];

const PLACES = ["All", "Amalfi", "Positano", "Ravello", "Atrani", "Capri"];
const TIMES = ["Any time", "Morning", "Golden Hour", "Blue Hour", "Midnight"] as const;

const aspectClass: Record<Memory["aspect"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function AlbumArchive() {
  const [place, setPlace] = useState("All");
  const [time, setTime] = useState<(typeof TIMES)[number]>("Any time");

  const filtered = useMemo(
    () =>
      MEMORIES.filter(
        (m) => (place === "All" || m.place === place) && (time === "Any time" || m.time === time),
      ),
    [place, time],
  );

  // distribute into 3 masonry columns so heights interleave naturally
  const columns = useMemo(() => {
    const cols: Memory[][] = [[], [], []];
    filtered.forEach((m, i) => cols[i % 3].push(m));
    return cols;
  }, [filtered]);

  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mb-16"
      >
        <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
          The Archive · AI-curated
        </span>
        <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-6">
          Every frame, <span className="italic text-sand/70">found & filed.</span>
        </h2>
        <p className="text-sand/50 font-light max-w-xl leading-relaxed">
          {MEMORIES.length} moments read by the model — sorted by where you stood, the hour of
          light, and the feeling in the frame.
        </p>
      </motion.div>

      {/* Place filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PLACES.map((p) => (
          <button
            key={p}
            onClick={() => setPlace(p)}
            className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-luxury border transition-all ${
              place === p
                ? "bg-gold text-midnight border-gold font-semibold"
                : "border-white/15 text-sand/60 hover:border-gold/50 hover:text-sand"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Time-of-day filters */}
      <div className="flex flex-wrap gap-2 mb-14">
        {TIMES.map((t) => (
          <button
            key={t}
            onClick={() => setTime(t)}
            className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-luxury border transition-all ${
              time === t
                ? "bg-sand/15 text-sand border-sand/40"
                : "border-white/10 text-sand/40 hover:text-sand/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Masonry archive */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 items-start">
        <AnimatePresence mode="popLayout">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-4 md:gap-6">
              {col.map((m) => (
                <motion.figure
                  layout
                  key={`${m.src}-${m.place}-${m.time}-${m.mood}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-sm bg-charcoal border border-white/10 shadow-cinematic"
                >
                  <div className={`${aspectClass[m.aspect]} overflow-hidden`}>
                    <img
                      src={m.src}
                      alt={`${m.place} · ${m.time}`}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[0.25] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[9px] uppercase tracking-ultra text-gold">
                      {m.place} · {m.time}
                    </p>
                    <p className="font-serif italic text-lg text-sand mt-1">{m.mood}</p>
                    <p className="text-[9px] uppercase tracking-luxury text-sand/40 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      Palette · {m.palette}
                    </p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center font-serif italic text-2xl text-sand/40 py-20">
          No frames in this light — try another hour.
        </p>
      )}
    </section>
  );
}
