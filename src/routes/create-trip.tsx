import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Calendar, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { requireAuth } from "@/lib/auth/guards";
import { createTripFn } from "@/services/trip.functions";
import { seo } from "@/lib/seo/seo";
import heroImg from "@/assets/hero-tuscany.jpg";

export const Route = createFileRoute("/create-trip")({
  beforeLoad: ({ context, location }) => requireAuth(context, location.pathname),
  head: () =>
    seo({
      title: "Create a trip",
      description: "Start a new trip on VoyaLoom.",
      robots: "private",
    }),
  component: CreateTrip,
});

const moods = ["Serenity", "Wanderlust", "Mystic", "Electric", "Tender", "Vastness"];

interface TripForm {
  title: string;
  destination: string;
  departure: string;
  return: string;
  cinematicMood: string;
  intention: string;
}

const EMPTY_FORM: TripForm = {
  title: "",
  destination: "",
  departure: "",
  return: "",
  cinematicMood: moods[0],
  intention: "",
};

function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TripForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const set =
    (key: keyof TripForm) =>
    (value: string): void =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const stepComplete =
    step === 1
      ? form.title.trim() !== "" && form.destination.trim() !== ""
      : step === 2
        ? form.departure !== "" && form.return !== ""
        : form.cinematicMood.trim() !== "";

  async function handleCreate(): Promise<void> {
    if (form.return && form.departure && form.return < form.departure) {
      toast.error("The return date is before departure.");
      return;
    }

    setSubmitting(true);
    try {
      const trip = await createTripFn({
        data: {
          title: form.title,
          destination: form.destination,
          departure: form.departure,
          return: form.return,
          cinematicMood: form.cinematicMood,
          intention: form.intention || undefined,
        },
      });
      toast.success("Your chapter has been opened.");
      await navigate({ to: "/upload", search: { trip: trip.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the trip.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext(): void {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    void handleCreate();
  }

  return (
    <div className="relative min-h-screen bg-midnight text-sand overflow-hidden">
      <LuxuryNavbar />

      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover opacity-15 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/80 to-midnight" />
      </div>

      <section className="relative z-10 pt-40 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
            Chapter {String(step).padStart(2, "0")} of 03
          </span>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-4">
            {step === 1 && (
              <>
                Where did the <em className="font-light text-gradient-gold">story</em> begin?
              </>
            )}
            {step === 2 && (
              <>
                When did the <em className="font-light text-gradient-gold">light</em> change?
              </>
            )}
            {step === 3 && (
              <>
                What was its <em className="font-light text-gradient-gold">essence</em>?
              </>
            )}
          </h1>
          <p className="font-serif italic text-lg text-sand/60 max-w-xl mb-12">
            {step === 1 && "Name your journey. Mark its coordinates on the map of memory."}
            {step === 2 && "A trip is bound by time — give us its first and final frame."}
            {step === 3 && "Tell us its mood. We will compose the rest."}
          </p>

          {/* Progress */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-px flex-1 transition-colors ${s <= step ? "bg-gold" : "bg-white/10"}`}
              />
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-sm p-10 space-y-6"
          >
            {step === 1 && (
              <>
                <Field
                  icon={<Sparkles className="size-4 text-gold" />}
                  label="Trip title"
                  placeholder="The Amalfi Coast"
                  value={form.title}
                  onChange={set("title")}
                />
                <Field
                  icon={<MapPin className="size-4 text-gold" />}
                  label="Destination"
                  placeholder="Positano, Italy"
                  value={form.destination}
                  onChange={set("destination")}
                />
              </>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field
                  icon={<Calendar className="size-4 text-gold" />}
                  label="Departure"
                  type="date"
                  value={form.departure}
                  onChange={set("departure")}
                />
                <Field
                  icon={<Calendar className="size-4 text-gold" />}
                  label="Return"
                  type="date"
                  value={form.return}
                  min={form.departure || undefined}
                  onChange={set("return")}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-sand/60 mb-4">
                  Cinematic mood
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {moods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("cinematicMood")(m)}
                      className={`px-5 py-4 text-left border transition-all ${
                        form.cinematicMood === m
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-white/10 hover:border-white/30 text-sand/70"
                      }`}
                    >
                      <span className="font-serif text-lg italic">{m}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <label className="block text-[10px] uppercase tracking-luxury text-sand/60 mb-2">
                    A line of intention <span className="text-sand/30">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.intention}
                    onChange={(e) => set("intention")(e.target.value)}
                    placeholder="I want to remember the slowness of mornings."
                    className="w-full bg-midnight/50 border border-white/10 px-4 py-3 text-sand placeholder:text-sand/30 focus:border-gold focus:outline-none transition-colors text-sm font-serif italic"
                  />
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || submitting}
              className="text-[10px] uppercase tracking-luxury text-sand/50 hover:text-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!stepComplete || submitting}
              className="group bg-gold text-midnight px-8 py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {step < 3 ? "Continue" : submitting ? "Opening chapter" : "Create trip"}
              {!submitting && (
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      <CinematicFooter />
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  min,
}: {
  icon?: React.ReactNode;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[10px] uppercase tracking-luxury text-sand/60 mb-2">
        {icon} {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-midnight/50 border border-white/10 px-4 py-3 text-sand placeholder:text-sand/30 focus:border-gold focus:outline-none transition-colors text-sm [color-scheme:dark]"
      />
    </div>
  );
}
