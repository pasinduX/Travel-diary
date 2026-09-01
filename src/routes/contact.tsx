import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact us",
      description: "Get in touch with the VoyaLoom team.",
      path: "/contact",
    }),
  component: Contact,
});

function Contact() {
  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />

      <main className="mx-auto max-w-5xl px-6 pb-28 pt-40 md:px-12">
        <section className="max-w-3xl">
          <span className="mb-6 block text-[10px] uppercase tracking-ultra text-gold">
            Contact VoyaLoom
          </span>
          <h1 className="mb-8 font-serif text-5xl leading-[0.95] md:text-7xl">
            Let&apos;s talk about your journey.
          </h1>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-sand/60">
            Have a question, found something that needs attention, or simply want to share a story
            from your travels? We&apos;d love to hear from you.
          </p>
        </section>

        <a
          href="mailto:info.voyaloom@gmail.com"
          className="group mt-16 flex max-w-2xl items-center justify-between gap-6 border-y border-white/10 py-8 transition-colors hover:border-gold/50"
        >
          <span className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <Mail className="size-5" />
            </span>
            <span>
              <span className="mb-1 block text-[9px] uppercase tracking-ultra text-gold/70">
                Email us
              </span>
              <span className="text-base text-sand sm:text-lg">info.voyaloom@gmail.com</span>
            </span>
          </span>
          <ArrowUpRight className="size-5 shrink-0 text-sand/40 transition-colors group-hover:text-gold" />
        </a>
      </main>

      <CinematicFooter />
    </div>
  );
}
