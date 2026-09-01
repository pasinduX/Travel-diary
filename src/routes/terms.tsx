import { createFileRoute, Link } from "@tanstack/react-router";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms of Use",
      description: "The terms for using VoyaLoom, the free AI travel album generator.",
      path: "/terms",
    }),
  component: Terms,
});

function Terms() {
  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />

      <article className="pt-40 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] mb-4">Terms of Use</h1>
        <p className="text-[10px] uppercase tracking-luxury text-sand/40 mb-12">
          Last updated: September 2026
        </p>

        <div className="space-y-10 text-sand/70 font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">The service</h2>
            <p>
              VoyaLoom is an AI travel album generator. You upload photos from a trip and VoyaLoom
              uses AI to analyze, organize, curate, and describe them, then arranges them into a
              cinematic album. VoyaLoom is provided as-is while in early access.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Your account</h2>
            <p>
              You are responsible for keeping your account credentials secure and for the activity
              on your account. You must provide accurate information when signing up.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Your content</h2>
            <p>
              You keep ownership of the photos you upload. By uploading them you allow VoyaLoom to
              store and process them for the purpose of building and displaying your album. Only
              upload photos you have the right to use.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Usage limits</h2>
            <p>
              VoyaLoom is currently free. Each account may upload up to 100 images and create up to
              2 trips. These limits may change as the product develops.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Acceptable use</h2>
            <p>
              Do not use VoyaLoom to upload unlawful content, to infringe someone else's rights, or
              to attempt to disrupt or abuse the service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Changes</h2>
            <p>
              VoyaLoom may update these terms or the service itself. Continued use after a change
              means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Contact</h2>
            <p>
              For questions about these terms, contact the VoyaLoom team. See the{" "}
              <Link to="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>{" "}
              for how your data is handled.
            </p>
          </section>
        </div>
      </article>

      <CinematicFooter />
    </div>
  );
}
