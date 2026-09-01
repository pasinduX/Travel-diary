import { motion } from "framer-motion";
import type { TripAnalysisStatus } from "@/interface/trip-analysis";

interface TripAnalysisProgressProps {
  status: TripAnalysisStatus;
}

export function TripAnalysisProgress({ status }: TripAnalysisProgressProps) {
  const hasFailures = status.failed > 0;
  const percentage = Math.round(status.percentage);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="relative mx-auto mb-12 h-44 w-52">
        <div className="absolute left-4 top-4 h-32 w-36 -rotate-6 rounded-sm border border-gold/20 bg-charcoal/60 shadow-cinematic" />
        <div className="absolute left-10 top-1 h-32 w-36 rotate-6 rounded-sm border border-gold/30 bg-midnight/80 shadow-cinematic" />
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [-2, 1, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-6 top-6 flex h-32 w-36 items-center justify-center rounded-sm border border-gold/50 bg-midnight shadow-cinematic"
        >
          <span className="font-serif text-5xl text-gold">{percentage}%</span>
        </motion.div>
      </div>

      <h2 className="mb-4 font-serif text-4xl text-sand md:text-5xl">
        {status.readyToGenerate ? "Your trip is ready." : "Understanding your journey"}
      </h2>
      <p className="mb-8 font-serif italic text-xl text-sand/60">
        {status.readyToGenerate
          ? "We've finished understanding your photographs."
          : getProgressMessage(status)}
      </p>

      <div
        className="h-1 overflow-hidden bg-white/10"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gold"
        />
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-3 text-[10px] uppercase tracking-luxury text-sand/40">
        <span>
          {status.analyzed} of {status.total} photographs analyzed
        </span>
        {status.processing > 0 && <span>{status.processing} currently being analyzed</span>}
      </div>

      {hasFailures && (
        <p className="mt-8 text-sm text-sand/50">
          {status.failed} photograph{status.failed === 1 ? "" : "s"} couldn&apos;t be analyzed.
        </p>
      )}
    </div>
  );
}

function getProgressMessage(status: TripAnalysisStatus): string {
  if (status.processing > 0) return "Looking through your photographs";
  if (status.queued > 0) return "Finding places and moments";
  if (status.analyzed > 0) return "Finding the photographs that tell the story";
  return "Preparing your journey";
}
