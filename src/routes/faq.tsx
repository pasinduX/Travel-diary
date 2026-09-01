import { createFileRoute, Link } from "@tanstack/react-router";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { FaqList } from "@/components/voyaloom/FaqList";
import { FAQ_ITEMS } from "@/lib/seo/faq";
import { ldJson, seo } from "@/lib/seo/seo";
import { breadcrumbLd, faqPageLd } from "@/lib/seo/structured-data";

export const Route = createFileRoute("/faq")({
  head: () => {
    const base = seo({
      title: "FAQ",
      description:
        "Answers to common questions about VoyaLoom: what it is, whether it generates AI images, how it builds a travel album from your photos, upload and trip limits, and whether it's free.",
      path: "/faq",
    });
    return {
      ...base,
      meta: [
        ...base.meta,
        ldJson(faqPageLd()),
        ldJson(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ),
      ],
    };
  },
  component: Faq,
});

function Faq() {
  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />

      <main className="pt-40 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
        <span className="text-[10px] uppercase tracking-ultra text-gold mb-6 block">
          Frequently asked questions
        </span>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-8">
          Everything about VoyaLoom, answered.
        </h1>
        <p className="text-lg text-sand/60 font-light leading-relaxed mb-12">
          VoyaLoom is a free AI travel album generator. Upload your trip photos and AI organizes,
          curates, and describes them into a cinematic album — always from your own photos.
        </p>

        <FaqList items={FAQ_ITEMS} />

        <div className="mt-14 flex flex-wrap gap-4">
          <Link
            to="/get-started"
            className="inline-block bg-gold text-midnight px-10 py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold"
          >
            Create your album — free
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center px-10 py-4 border border-white/20 text-[11px] uppercase tracking-luxury hover:bg-white/5 transition-colors"
          >
            See how it works
          </Link>
        </div>
      </main>

      <CinematicFooter />
    </div>
  );
}
