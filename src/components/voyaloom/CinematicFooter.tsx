import { Link } from "@tanstack/react-router";

export function CinematicFooter() {
  return (
    <footer className="relative py-20 px-6 md:px-12 border-t border-white/5 bg-midnight">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Link to="/" className="font-serif italic text-2xl text-sand">
            VoyaLoom
          </Link>
          <p className="mt-4 text-sm text-sand/50 font-light leading-relaxed max-w-xs">
            An AI travel album generator that turns your real trip photos into a cinematic story.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-col gap-3 text-[11px] uppercase tracking-luxury text-sand/60"
        >
          <Link to="/how-it-works" className="hover:text-gold transition-colors w-fit">
            How it works
          </Link>
          <Link to="/faq" className="hover:text-gold transition-colors w-fit">
            FAQ
          </Link>
          <Link to="/get-started" className="hover:text-gold transition-colors w-fit">
            Create an album
          </Link>
        </nav>

        <nav
          aria-label="Legal"
          className="flex flex-col gap-3 text-[11px] uppercase tracking-luxury text-sand/60 md:items-end"
        >
          <Link to="/privacy" className="hover:text-gold transition-colors w-fit">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-gold transition-colors w-fit">
            Terms
          </Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/5 text-[10px] uppercase tracking-ultra text-sand/40">
        © {new Date().getFullYear()} VoyaLoom
      </div>
    </footer>
  );
}
