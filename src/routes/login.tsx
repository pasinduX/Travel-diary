import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { requireGuest } from "@/lib/auth/guards";
import { startGoogleSignIn } from "@/lib/auth/google";
import { loginFn } from "@/services/auth.functions";
import { seo } from "@/lib/seo/seo";
import heroImg from "@/assets/hero-tuscany.jpg";

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => requireGuest(context),
  head: () =>
    seo({
      title: "Sign in",
      description: "Sign in to VoyaLoom to open your travel albums.",
      path: "/login",
      robots: "follow",
    }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const router = useRouter();
  const { redirect } = Route.useSearch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const disabled = pending || !username.trim() || !password;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (disabled) return;

    setPending(true);
    try {
      await loginFn({ data: { username: username.trim(), password } });
      await router.invalidate();
      await navigate({ to: redirect ?? "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign you in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-midnight text-sand overflow-hidden">
      <LuxuryNavbar />
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover opacity-25 animate-slow-zoom"
        />
        <div className="absolute inset-0 cinematic-gradient" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute size-1 rounded-full bg-gold/40"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-strong rounded-sm p-10"
        >
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
              Welcome back
            </span>
            <h1 className="font-serif text-4xl">Return to your archive</h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field
              label="Username"
              type="text"
              autoComplete="username"
              placeholder="your_handle"
              value={username}
              onChange={setUsername}
            />
            <Field
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />
            <button
              type="submit"
              disabled={disabled}
              className="w-full bg-gold text-midnight py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? "Signing in" : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-luxury text-sand/40">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={startGoogleSignIn}
            className="w-full border border-white/20 py-4 text-[11px] uppercase tracking-luxury hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <p className="text-center text-xs text-sand/50 mt-8">
            New here?{" "}
            <Link to="/signup" className="text-gold hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-luxury text-sand/60 mb-2">
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-midnight/50 border border-white/10 px-4 py-3 text-sand placeholder:text-sand/30 focus:border-gold focus:outline-none transition-colors text-sm"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.35 11.1H12v3.2h5.35c-.23 1.2-.92 2.21-1.96 2.9v2.4h3.17c1.85-1.7 2.92-4.21 2.92-7.2 0-.7-.06-1.37-.18-2z" />
      <path d="M12 21c2.65 0 4.87-.88 6.5-2.4l-3.17-2.4c-.88.6-2 .95-3.33.95-2.56 0-4.73-1.73-5.5-4.06H3.22v2.55C4.86 18.84 8.18 21 12 21z" />
      <path d="M6.5 13.09a5.4 5.4 0 010-3.18V7.36H3.22a9 9 0 000 8.28L6.5 13.09z" />
      <path d="M12 6.58c1.44 0 2.74.5 3.76 1.46l2.81-2.81C16.87 3.71 14.65 2.8 12 2.8 8.18 2.8 4.86 5 3.22 7.36L6.5 9.92C7.27 7.58 9.44 6.58 12 6.58z" />
    </svg>
  );
}
