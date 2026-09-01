import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/use-auth";

export function LuxuryNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

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
      className="fixed top-0 left-0 right-0 z-50 glass px-6 md:px-10 py-5 flex justify-between items-center"
    >
      <Link
        to="/"
        className="font-serif italic text-2xl tracking-tight text-sand"
        aria-label="VoyaLoom home"
      >
        VoyaLoom
      </Link>
      <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-luxury font-medium text-sand/70">
        {isAuthenticated ? (
          <Link to="/dashboard" className="hover:text-gold transition-colors">
            Your trips
          </Link>
        ) : (
          <Link to="/how-it-works" className="hover:text-gold transition-colors">
            How it works
          </Link>
        )}
        <Link to="/faq" className="hover:text-gold transition-colors">
          FAQ
        </Link>
        <Link
          to="/album/$slug"
          params={{ slug: "amalfi" }}
          className="hover:text-gold transition-colors"
        >
          Sample album
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-[10px] uppercase tracking-luxury text-sand/60">
            {user?.name?.split(" ")[0] ?? user?.username}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 bg-gold/10 text-gold px-5 py-2 rounded-full border border-gold/30 text-[10px] uppercase tracking-luxury font-medium hover:bg-gold hover:text-midnight transition-all disabled:opacity-50"
          >
            <LogOut className="size-3" />
            {signingOut ? "Signing out" : "Sign out"}
          </button>
        </div>
      ) : (
        <Link
          to="/get-started"
          className="bg-gold/10 text-gold px-5 py-2 rounded-full border border-gold/30 text-[10px] uppercase tracking-luxury font-medium hover:bg-gold hover:text-midnight transition-all"
        >
          Get started
        </Link>
      )}
    </motion.nav>
  );
}
