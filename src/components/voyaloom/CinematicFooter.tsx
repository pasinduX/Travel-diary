import { Link } from "@tanstack/react-router";

export function CinematicFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-midnight px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Link to="/" className="font-serif italic text-2xl text-sand">
            VoyaLoom
          </Link>
          <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-sand/50">
            An AI travel album generator that turns your real trip photos into a cinematic story.
          </p>
        </div>

        <nav
          aria-label="Explore"
          className="flex flex-col gap-3 text-[11px] uppercase tracking-luxury text-sand/60 md:col-span-2"
        >
          <span className="mb-2 text-[9px] tracking-ultra text-gold/70">Explore</span>
          <Link to="/how-it-works" className="w-fit transition-colors hover:text-gold">
            How it works
          </Link>
          <Link to="/faq" className="w-fit transition-colors hover:text-gold">
            FAQ
          </Link>
          <Link to="/get-started" className="w-fit transition-colors hover:text-gold">
            Create an album
          </Link>
        </nav>

        <nav
          aria-label="Support"
          className="flex flex-col gap-3 text-[11px] uppercase tracking-luxury text-sand/60 md:col-span-3"
        >
          <span className="mb-2 text-[9px] tracking-ultra text-gold/70">Support</span>
          <Link to="/contact" className="w-fit transition-colors hover:text-gold">
            Contact us
          </Link>
          <a
            href="mailto:info.voyaloom@gmail.com"
            className="w-fit normal-case tracking-normal text-sand/50 transition-colors hover:text-gold"
          >
            info.voyaloom@gmail.com
          </a>
        </nav>

        <nav
          aria-label="Legal"
          className="flex flex-col gap-3 text-[11px] uppercase tracking-luxury text-sand/60 md:col-span-2"
        >
          <span className="mb-2 text-[9px] tracking-ultra text-gold/70">Legal</span>
          <Link to="/privacy" className="w-fit transition-colors hover:text-gold">
            Privacy
          </Link>
          <Link to="/terms" className="w-fit transition-colors hover:text-gold">
            Terms
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-white/5 pt-8 text-[10px] uppercase tracking-ultra text-sand/40 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} VoyaLoom</span>
        <span className="tracking-[0.2em]">Made for the memories worth keeping</span>
      </div>
    </footer>
  );
}
