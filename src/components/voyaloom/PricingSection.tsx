import { Link } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PricingPlan } from "@/interface/pricing";
import { useAuth } from "@/lib/auth/use-auth";
import {
  changePricingPlanFn,
  getCurrentPricingPlanFn,
  listPricingPlansFn,
} from "@/services/pricing.functions";

export function PricingSection() {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const requests: [Promise<PricingPlan[]>, Promise<PricingPlan | null>] = [
      listPricingPlansFn(),
      isAuthenticated ? getCurrentPricingPlanFn() : Promise.resolve(null),
    ];

    Promise.all(requests)
      .then(([availablePlans, activePlan]) => {
        if (cancelled) return;
        setPlans(availablePlans);
        setCurrentPlan(activePlan);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Could not load pricing plans.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  async function selectPlan(plan: PricingPlan): Promise<void> {
    if (!isAuthenticated) return;
    if (plan.slug === currentPlan?.slug) return;

    setUpdatingSlug(plan.slug);
    try {
      const updatedPlan = await changePricingPlanFn({ data: { slug: plan.slug } });
      setCurrentPlan(updatedPlan);
      toast.success(`You are now on the ${updatedPlan.name} plan.`);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not update your plan.");
    } finally {
      setUpdatingSlug(null);
    }
  }

  return (
    <section
      id="pricing"
      className="border-y border-white/5 bg-charcoal/20 px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="mb-5 block text-[10px] uppercase tracking-ultra text-gold">Pricing</span>
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            Choose the room your memories need.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sand/60 font-light leading-relaxed">
            Start free, then move up when your archive grows. You can change your plan whenever you
            need to.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-12 text-sand/50">
            <Loader2 className="size-4 animate-spin text-gold" />
            <span className="text-[10px] uppercase tracking-luxury">Loading plans</span>
          </div>
        )}

        {error && <p className="py-12 text-center text-sm text-ember">{error}</p>}

        {!loading && !error && (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            {plans.map((plan) => {
              const isCurrent = plan.slug === currentPlan?.slug;
              const isUpdating = updatingSlug === plan.slug;
              return (
                <article
                  key={plan.slug}
                  className={`flex flex-col justify-between gap-8 border p-6 sm:p-8 ${
                    isCurrent ? "border-gold/50 bg-gold/5" : "border-white/10 bg-midnight/40"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-3xl">{plan.name}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-sand/50">
                          {plan.description}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="shrink-0 rounded-full border border-gold/30 px-3 py-1 text-[9px] uppercase tracking-luxury text-gold">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-6 font-serif text-3xl text-gold">{formatPrice(plan)}</p>
                    <ul className="mt-6 space-y-3 text-sm text-sand/65">
                      <li className="flex items-center gap-2">
                        <Check className="size-3 text-gold" />
                        Up to {plan.limits.numberOfTrips} trips
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3 text-gold" />
                        Up to {plan.limits.maxImages} images
                      </li>
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="size-3 text-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => void selectPlan(plan)}
                      disabled={isCurrent || updatingSlug !== null}
                      className="w-full border border-gold/30 bg-gold/10 px-5 py-3 text-[10px] uppercase tracking-luxury text-gold transition-colors hover:bg-gold hover:text-midnight disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCurrent
                        ? "Current plan"
                        : isUpdating
                          ? "Updating plan"
                          : `Choose ${plan.name}`}
                    </button>
                  ) : (
                    <Link
                      to="/get-started"
                      className="w-full border border-gold/30 bg-gold/10 px-5 py-3 text-center text-[10px] uppercase tracking-luxury text-gold transition-colors hover:bg-gold hover:text-midnight"
                    >
                      Get started
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function formatPrice(plan: PricingPlan): string {
  if (plan.price === 0) return "Free";
  return `${plan.currency} ${plan.price.toFixed(2)} / ${plan.interval}`;
}
