"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Mail, Lock, Zap, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";

// ─── Magnetic Button ──────────────────────────────────────────────────────────

function MagneticButton({
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 350, damping: 22 });
  const y = useSpring(0, { stiffness: 350, damping: 22 });

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
      y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [x, y, disabled]);

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x, y }}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ─── Animated grid lines ──────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />

      {/* Faint dot intersections */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />

      {/* Cyan glow — top left */}
      <motion.div
        className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Indigo glow — bottom right */}
      <motion.div
        className="absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, -20, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Subtle center vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}

// ─── Sweeping shine animation ─────────────────────────────────────────────────

function ShineButton({
  children,
  isLoading,
  disabled,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <MagneticButton
      type="submit"
      disabled={disabled}
      className="relative w-full h-12 rounded-xl font-semibold text-sm overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {/* Base gradient */}
      <span
        className="absolute inset-0 rounded-xl transition-all duration-300"
        style={{
          background: hovered
            ? "linear-gradient(135deg, #0891b2, #06b6d4, #0e7490)"
            : "linear-gradient(135deg, #0e7490, #06b6d4, #0891b2)",
          boxShadow: hovered
            ? "0 0 32px rgba(6,182,212,0.45), 0 0 8px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 0 16px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Sweep shine */}
      <motion.span
        className="absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={hovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : { backgroundPosition: "200% 0" }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2.5 text-white">
        {isLoading ? (
          <>
            <motion.span
              className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
            />
            <span className="tracking-wide">Authenticating…</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-wide">Secure Login</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </span>
    </MagneticButton>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function GlassInput({
  id,
  type: inputType,
  value,
  onChange,
  placeholder,
  icon,
  label,
  autoComplete,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  label: string;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = inputType === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : inputType;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30"
      >
        {label}
      </label>
      <div className="relative">
        {/* Glow ring on focus */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -inset-px rounded-xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.35), rgba(99,102,241,0.20))",
                filter: "blur(1px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Left icon */}
        <span
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            focused ? "text-cyan-400" : "text-white/20"
          }`}
        >
          {icon}
        </span>

        <input
          id={id}
          type={resolvedType}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            relative w-full h-11 pl-10 pr-${isPassword ? "10" : "4"} rounded-xl text-sm
            bg-white/[0.03] border text-white/80 placeholder-white/15
            outline-none transition-all duration-200 font-light tracking-wide
            ${focused ? "border-cyan-500/40 bg-white/[0.05]" : "border-white/[0.08] hover:border-white/[0.13]"}
          `}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  // ── NextAuth logic — untouched ──
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email atau Password salah.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] flex items-center justify-center px-4 overflow-hidden">
      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      <GridBackground />

      {/* Card entrance */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[380px] z-10"
      >
        {/* Top edge highlight — the "glass edge" effect */}
        <div
          className="absolute -top-px left-8 right-8 h-px rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(255,255,255,0.15), rgba(6,182,212,0.5), transparent)",
          }}
        />

        {/* Glass card */}
        <div
          className="relative rounded-2xl border border-white/[0.08] px-8 py-9"
          style={{
            background: "rgba(255,255,255,0.018)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.04) inset,
              0 1px 0 rgba(255,255,255,0.07) inset,
              0 40px 80px rgba(0,0,0,0.6),
              0 12px 32px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Logo + heading */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-5 shadow-lg shadow-cyan-500/20"
              style={{
                background: "linear-gradient(135deg, #0e7490, #06b6d4)",
                boxShadow: "0 0 24px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <Zap className="w-5 h-5 text-white" fill="white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-2xl font-black tracking-tighter text-white mb-1 font-mono">
                MY<span className="text-cyan-400">.</span>admin
              </h1>
              <p className="text-[11px] text-white/25 uppercase tracking-[0.18em] font-medium">
                Secure Access Portal
              </p>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
              Sign in
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-4"
          >
            <GlassInput
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@example.com"
              icon={<Mail className="w-4 h-4" />}
              label="Email Address"
              autoComplete="email"
            />

            <GlassInput
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••••••"
              icon={<Lock className="w-4 h-4" />}
              label="Password"
              autoComplete="current-password"
            />

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/20"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-400/90 font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="pt-1">
              <ShineButton isLoading={isLoading} disabled={isLoading || !email || !password}>
                {null}
              </ShineButton>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-7 text-center text-[10px] text-white/15 leading-relaxed"
          >
            Protected by NextAuth · Muhamad Yusuf © {new Date().getFullYear()}
          </motion.p>
        </div>

        {/* Outer bottom shadow bloom */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(6,182,212,0.12), transparent 70%)",
            filter: "blur(16px)",
          }}
        />
      </motion.div>
    </div>
  );
}