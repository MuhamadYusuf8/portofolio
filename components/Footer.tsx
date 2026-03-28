"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

/* ─── Magnetic button hook ─────────────────────────────────────── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, sx, sy, onMove, onLeave };
}

/* ─── Social link with magnetic effect ─────────────────────────── */
function SocialLink({
  href,
  label,
  Icon,
  delay,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  delay: number;
}) {
  const { ref, sx, sy, onMove, onLeave } = useMagnetic(0.4);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={() => {
        onLeave();
        setHovered(false);
      }}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-center gap-2 px-5 py-3 rounded-xl cursor-pointer select-none"
      style={{
        x: sx,
        y: sy,
        border: "1px solid rgba(255,255,255,0.06)",
        background: hovered
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.015)",
        transition: "background 0.3s",
      }}
    >
      {/* Glow on hover */}
      {hovered && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            boxShadow: "0 0 20px rgba(6,182,212,0.08)",
          }}
        />
      )}
      <Icon
        size={15}
        style={{ color: hovered ? "#06b6d4" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}
      />
      <span
        className="text-xs font-mono tracking-[0.18em] uppercase"
        style={{
          color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
          transition: "color 0.3s",
        }}
      >
        {label}
      </span>
      <ArrowUpRight
        size={11}
        style={{
          color: "#06b6d4",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translate(1px,-1px)" : "translate(0,0)",
          transition: "all 0.3s",
        }}
      />
    </motion.a>
  );
}

/* ─── Easter egg secret link ────────────────────────────────────── */
function SecretDot() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/dashboard" aria-label="Admin portal">
      <motion.span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cursor-pointer relative"
        style={{
          color: hovered ? "#06b6d4" : "#06b6d4",
          display: "inline-block",
        }}
      >
        {/* Pulse glow — only visible on hover */}
        <AnimatePresenceInline visible={hovered}>
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "rgba(6,182,212,0.15)",
              filter: "blur(6px)",
              borderRadius: "50%",
              transform: "scale(2.5)",
            }}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: [0, 1, 0], scale: [1.5, 2.5, 1.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </AnimatePresenceInline>
        <motion.span
          animate={
            hovered
              ? { textShadow: "0 0 12px rgba(6,182,212,0.9)" }
              : { textShadow: "0 0 0px rgba(6,182,212,0)" }
          }
          transition={{ duration: 0.3 }}
          style={{ fontFamily: "inherit" }}
        >
          .
        </motion.span>
      </motion.span>
    </Link>
  );
}

/* Tiny helper — AnimatePresence equivalent for inline spans */
function AnimatePresenceInline({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  if (!visible) return null;
  return <>{children}</>;
}

/* ─── Main Footer ───────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer
      className="relative bg-transparent overflow-hidden pt-8 pb-16 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
    >
      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Ambient bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none opacity-[0.035]"
        style={{
          background: "radial-gradient(ellipse at bottom, #8b5cf6, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Massive typographic sign-off ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-white/20 mb-6"
          >
            Based in Earth · Available Everywhere
          </p>

          {/* Brand name with easter egg */}
          <div
            className="text-[clamp(4rem,14vw,12rem)] font-black leading-none tracking-[-0.04em] text-white select-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            MY<SecretDot />dev
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div
          className="w-full h-px mb-12"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
          }}
        />

        {/* ── Socials + tagline row ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/20 text-sm font-light tracking-wide max-w-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Crafting digital products that live at the intersection of
              engineering precision and design obsession.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-3">
            <SocialLink
              href="https://github.com"
              label="GitHub"
              Icon={Github}
              delay={0.1}
            />
            <SocialLink
              href="https://linkedin.com"
              label="LinkedIn"
              Icon={Linkedin}
              delay={0.2}
            />
            <SocialLink
              href="mailto:hello@my.dev"
              label="Email"
              Icon={Mail}
              delay={0.3}
            />
          </div>
        </div>

        {/* ── Bottom copyright strip ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/15"
          >
            © {new Date().getFullYear()} MY.dev — All Rights Reserved
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/10"
          >
            Designed & Built with obsession
          </motion.p>
        </div>
      </div>
    </footer>
  );
}