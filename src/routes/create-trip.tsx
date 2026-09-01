import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { DestinationAutocomplete } from "@/components/voyaloom/DestinationAutocomplete";
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

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-40 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
            Chapter {String(step).padStart(2, "0")} of 03
          </span>
          <h1 className="mb-4 font-serif text-4xl leading-[0.98] sm:text-5xl md:text-7xl">
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
          <p className="mb-9 max-w-xl font-serif text-base italic text-sand/60 sm:mb-12 sm:text-lg">
            {step === 1 && "Name your journey. Mark its coordinates on the map of memory."}
            {step === 2 && "A trip is bound by time — give us its first and final frame."}
            {step === 3 && "Tell us its mood. We will compose the rest."}
          </p>

          {/* Progress */}
          <div className="mb-9 flex gap-2 sm:mb-12">
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
            className="glass-strong space-y-6 rounded-sm p-5 sm:p-10"
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
                <DestinationAutocomplete value={form.destination} onChange={set("destination")} />
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
                      className={`border px-3 py-3 text-left transition-all sm:px-5 sm:py-4 ${
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

          <div className="mt-8 flex flex-col-reverse items-stretch gap-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
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
              className="group inline-flex w-full items-center justify-center gap-3 bg-gold px-6 py-4 text-[10px] font-semibold uppercase tracking-luxury text-midnight shadow-gold transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8 sm:text-[11px]"
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
