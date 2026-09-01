import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/use-auth";

export function LuxuryNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
      toast.success("Signed out.");
      await navigate({ to: "/" });
    } catch {
      toast.error("Could not sign you out.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-midnight/95 border-b border-white/10 px-4 sm:px-6 md:px-10 py-5 flex justify-between items-center"
    >
      <Link
        to="/"
        className="font-serif italic text-xl sm:text-2xl tracking-tight text-sand shrink-0"
        aria-label="VoyaLoom home"
      >
        VoyaLoom
      </Link>
      <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center bg-gold/10 text-gold px-3 sm:px-5 py-2 rounded-full border border-gold/30 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-luxury font-medium hover:bg-gold hover:text-midnight transition-all"
            >
              Dashboard
            </Link>
            <span className="hidden sm:block text-[10px] uppercase tracking-luxury text-sand/60">
              {user?.name?.split(" ")[0] ?? user?.username}
            </span>
          </div>
        ) : (
          <Link
            to="/get-started"
            className="bg-gold/10 text-gold px-5 py-2 rounded-full border border-gold/30 text-[10px] uppercase tracking-luxury font-medium hover:bg-gold hover:text-midnight transition-all"
          >
            Get started
          </Link>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex items-center justify-center size-9 rounded-full border border-white/10 text-sand/80 hover:border-gold hover:text-gold transition-colors"
        >
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute top-full right-4 sm:right-6 mt-2 w-64 rounded-sm border border-white/10 bg-midnight p-3 shadow-cinematic"
        >
          <nav className="flex flex-col" aria-label="Mobile navigation">
            <Link
              to="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 px-4 py-3 text-[10px] uppercase tracking-luxury text-sand/80 hover:text-gold transition-colors"
            >
              How it works
            </Link>
            <Link
              to="/faq"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 px-4 py-3 text-[10px] uppercase tracking-luxury text-sand/80 hover:text-gold transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/album/$slug"
              params={{ slug: "amalfi" }}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-[10px] uppercase tracking-luxury text-sand/80 hover:text-gold transition-colors"
            >
              Sample album
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-3 text-left text-[10px] uppercase tracking-luxury text-gold hover:text-sand transition-colors disabled:opacity-50"
              >
                <LogOut className="size-3" />
                {signingOut ? "Signing out" : "Sign out"}
              </button>
            )}
          </nav>
        </div>
      )}
    </motion.nav>
  );
}
