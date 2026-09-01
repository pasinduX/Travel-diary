import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { requireGuest } from "@/lib/auth/guards";
import { startGoogleSignIn } from "@/lib/auth/google";
import { registerFn } from "@/services/auth.functions";
import { seo } from "@/lib/seo/seo";
import heroImg from "@/assets/iceland-beach.jpg";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => requireGuest(context),
  head: () =>
    seo({
      title: "Create your account",
      description:
        "Create a free VoyaLoom account and turn your first trip's photos into a cinematic AI-built album.",
      path: "/signup",
      robots: "follow",
    }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const disabled =
    pending ||
    !form.name.trim() ||
    !form.username.trim() ||
    !form.email.trim() ||
    form.password.length < 8 ||
    form.password !== form.confirmPassword;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (disabled) return;

    if (form.password !== form.confirmPassword) {
      toast.error("Those passwords don't match.");
      return;
    }

    setPending(true);
    try {
      await registerFn({
        data: {
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        },
      });
      await router.invalidate();
      toast.success("Your archive is ready.");
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create your account.");
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md glass-strong rounded-sm p-10"
        >
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
              A private archive
            </span>
            <h1 className="font-serif text-4xl leading-tight">
              Begin your <em className="font-light text-gradient-gold">story.</em>
            </h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={form.name}
              onChange={set("name")}
            />
            <Field
              label="Username"
              type="text"
              autoComplete="username"
              placeholder="your_handle"
              value={form.username}
              onChange={set("username")}
            />
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@journey.com"
              value={form.email}
              onChange={set("email")}
            />
            <Field
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={set("password")}
            />
            <Field
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Retype your password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              error={passwordsMismatch ? "Passwords don't match." : undefined}
            />
            <button
              type="submit"
              disabled={disabled}
              className="w-full bg-gold text-midnight py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? "Creating account" : "Create account"}
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
            className="w-full border border-white/20 py-4 text-[11px] uppercase tracking-luxury hover:bg-white/5 transition-colors"
          >
            Continue with Google
          </button>

          <p className="text-center text-xs text-sand/50 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Sign in
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
  error,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
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
        aria-invalid={error ? true : undefined}
        className={`w-full bg-midnight/50 border px-4 py-3 text-sand placeholder:text-sand/30 focus:outline-none transition-colors text-sm ${
          error ? "border-ember/70 focus:border-ember" : "border-white/10 focus:border-gold"
        }`}
      />
      {error && <p className="mt-1.5 text-[10px] tracking-luxury text-ember/90">{error}</p>}
    </div>
  );
}
