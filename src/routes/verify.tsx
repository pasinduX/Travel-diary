import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail } from "lucide-react";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { seo } from "@/lib/seo/seo";
import heroImg from "@/assets/midnight-bonfire.jpg";

export const Route = createFileRoute("/verify")({
  head: () =>
    seo({
      title: "Verify your account",
      description: "Enter the six-digit code we sent to verify your VoyaLoom account.",
      path: "/verify",
      robots: "private",
    }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);

  return (
    <div className="relative min-h-screen bg-midnight text-sand overflow-hidden">
      <LuxuryNavbar />

      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover opacity-20 animate-slow-zoom"
        />
        <div className="absolute inset-0 cinematic-gradient" />
      </div>

      {/* Floating embers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute size-1 rounded-full bg-gold/50"
            initial={{ x: `${Math.random() * 100}%`, y: "100%", opacity: 0 }}
            animate={{ y: "-10%", opacity: [0, 1, 0] }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-strong rounded-sm p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="size-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8 shadow-gold"
          >
            <Mail className="size-6 text-gold" />
          </motion.div>

          <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
            One last thing
          </span>
          <h1 className="font-serif text-4xl leading-tight mb-4">
            Confirm your <em className="font-light text-gradient-gold">passage.</em>
          </h1>
          <p className="font-serif italic text-base text-sand/60 mb-10">
            We've sent a six-digit cipher to your inbox.
            <br />
            Enter it below to unseal your archive.
          </p>

          <div className="flex justify-center mb-10">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(v) => {
                setCode(v);
                if (v.length === 6) {
                  setTimeout(() => navigate({ to: "/dashboard" }), 400);
                }
              }}
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="size-14 text-2xl font-serif border-white/15 bg-midnight/50 first:rounded-sm last:rounded-sm rounded-sm border-l data-[active=true]:ring-gold data-[active=true]:border-gold"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <button
            type="button"
            disabled={code.length !== 6}
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full bg-gold text-midnight py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enter the archive
          </button>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => setResent(true)}
              className="text-[10px] uppercase tracking-luxury text-sand/60 hover:text-gold transition-colors"
            >
              {resent ? "✓ A new cipher is on its way" : "Didn't receive it? Resend"}
            </button>
            <p className="text-xs text-sand/40">
              Wrong email?{" "}
              <Link to="/signup" className="text-gold hover:underline">
                Start again
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
