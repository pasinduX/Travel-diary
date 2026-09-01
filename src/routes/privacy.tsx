import { createFileRoute, Link } from "@tanstack/react-router";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy",
      description:
        "How VoyaLoom handles the photos you upload and the account information you provide.",
      path: "/privacy",
    }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />

      <article className="pt-40 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] mb-4">Privacy Policy</h1>
        <p className="text-[10px] uppercase tracking-luxury text-sand/40 mb-12">
          Last updated: September 2026
        </p>

        <div className="space-y-10 text-sand/70 font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Photos you upload</h2>
            <p>
              When you upload photos to a trip, VoyaLoom stores them so it can build and display
              your album. Your photos are processed using AI in order to analyze scenes and moments,
              organize and curate the collection, and generate descriptions. Your photos are used to
              create your album — they are not used to replace it with AI-generated images.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Account information</h2>
            <p>
              To use VoyaLoom you create an account with an email address and password, or by
              continuing with Google. If you use Google sign-in, Google shares basic profile
              information such as your name and email address with VoyaLoom. This information is
              used to identify your account and let you sign in.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">How your data is used</h2>
            <p>
              VoyaLoom uses your uploaded photos and account information only to provide the
              service: creating trips, building albums, letting you sign in, and enforcing the free
              usage limits (currently up to 100 images and up to 2 trips per account).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Deleting your data</h2>
            <p>
              You can request deletion of your account and the photos associated with it by
              contacting VoyaLoom. When your account is deleted, your trips and uploaded photos are
              removed.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Changes to this policy</h2>
            <p>
              VoyaLoom may update this policy as the product develops. Material changes will be
              reflected by the “last updated” date above.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-sand mb-3">Contact</h2>
            <p>
              Questions about privacy or a data request can be sent to the VoyaLoom team. See the{" "}
              <Link to="/faq" className="text-gold hover:underline">
                FAQ
              </Link>{" "}
              for more about how VoyaLoom works.
            </p>
          </section>
        </div>
      </article>

      <CinematicFooter />
    </div>
  );
}
