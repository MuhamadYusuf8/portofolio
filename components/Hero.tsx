"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Github,
  Mail,
  Linkedin,
  Zap,
  Shield,
  Globe,
  Code2,
  Database,
  Layers,
  Terminal,
  ChevronRight,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Coffee,
  Star,
  Download,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  { name: "Next.js", icon: <Globe className="w-4 h-4" /> },
  { name: "Laravel", icon: <Code2 className="w-4 h-4" /> },
  { name: "PostgreSQL", icon: <Database className="w-4 h-4" /> },
  { name: "Tailwind", icon: <Layers className="w-4 h-4" /> },
  { name: "TypeScript", icon: <Terminal className="w-4 h-4" /> },
  { name: "Vue.js", icon: <Zap className="w-4 h-4" /> },
  { name: "MySQL", icon: <Database className="w-4 h-4" /> },
  { name: "Docker", icon: <Shield className="w-4 h-4" /> },
  { name: "React", icon: <Globe className="w-4 h-4" /> },
  { name: "Prisma", icon: <Layers className="w-4 h-4" /> },
];

const STATS = [
  { value: "1", label: "Years\nCoding", icon: <Coffee className="w-4 h-4" /> },
  { value: "17+", label: "Projects\nBuilt", icon: <Briefcase className="w-4 h-4" /> },
  { value: "500+", label: "Students\nServed", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "99%", label: "Uptime\nRecord", icon: <Star className="w-4 h-4" /> },
];

const FLOATING_BADGES = [
  { label: "Next.js", color: "border-white/20 text-white/60", pos: "top-[6%]  right-[2%]", delay: 0 },
  { label: "Laravel", color: "border-red-500/30 text-red-400", pos: "top-[28%] left-[2%]", delay: 0.3 },
  { label: "Full-Stack", color: "border-cyan-500/30 text-cyan-400", pos: "bottom-[32%] right-[2%]", delay: 0.6 },
  { label: "TypeScript", color: "border-blue-500/30 text-blue-400", pos: "bottom-[12%] left-[2%]", delay: 0.9 },
  { label: "PostgreSQL", color: "border-sky-500/30 text-sky-400", pos: "top-[55%] left-[2%]", delay: 1.1 },
];

// ─── Magnetic hook ────────────────────────────────────────────────────────────

function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [strength, x, y]);
  return { ref, x, y };
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ value }: { value: string }) {
  const num = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/\d/g, "");
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || isNaN(num)) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, num]);
  return <span ref={ref}>{isNaN(num) ? value : `${display}${suffix}`}</span>;
}

// ─── Typing text ──────────────────────────────────────────────────────────────

function TypingText({ phrases }: { phrases: string[] }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const cur = phrases[phraseIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (charIdx < cur.length) t = setTimeout(() => setCharIdx(c => c + 1), 60);
      else t = setTimeout(() => setDeleting(true), 2200);
    } else {
      if (charIdx > 0) t = setTimeout(() => setCharIdx(c => c - 1), 35);
      else { setDeleting(false); setPhraseIdx(p => (p + 1) % phrases.length); }
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, phraseIdx, phrases]);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="text-cyan-400">
      {phrases[phraseIdx].slice(0, charIdx)}
      <span className={`inline-block w-0.5 h-5 ml-0.5 bg-cyan-400 align-middle transition-opacity ${blink ? "opacity-100" : "opacity-0"}`} />
    </span>
  );
}

// ─── Background blobs ─────────────────────────────────────────────────────────

function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-60 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", filter: "blur(80px)" }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// ─── Tech marquee ─────────────────────────────────────────────────────────────

function TechMarquee() {
  const items = [...TECH_STACK, ...TECH_STACK];
  return (
    <div
      className="relative overflow-hidden w-full py-2"
      style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
    >
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white/50 text-sm font-medium whitespace-nowrap">
            <span className="text-cyan-400">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}


// ─── Photo card ───────────────────────────────────────────────────────────────
// 🔧 Ganti /photo.jpg dengan path foto Anda di folder /public

function PhotoCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[400px] mx-auto lg:mx-0 lg:ml-auto"
    >
      {/* Floating badges - hidden on small screens to prevent overflow */}
      {FLOATING_BADGES.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7 + badge.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute ${badge.pos} z-20 hidden lg:block`}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md whitespace-nowrap ${badge.color}`}
            style={{ background: "rgba(0,0,0,0.55)" }}
          >
            {badge.label}
          </motion.div>
        </motion.div>
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(6,182,212,0.18), rgba(139,92,246,0.10), transparent)",
          filter: "blur(32px)",
          transform: "scale(1.2)",
        }}
      />

      {/* Photo frame */}
      <div
        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-white/[0.09]"
        style={{
          boxShadow: "0 50px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.1) inset",
        }}
      >
        {!imgError ? (
          <img
            src="/yusuf2.jpeg"
            alt="Muhamad Yusuf"
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Placeholder (muncul jika foto tidak ada) */}
        {imgError && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: "linear-gradient(145deg, #0a0a14, #0d1120, #070710)" }}
          >
            {/* Abstract avatar */}
            <div className="relative">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center border border-white/10"
                style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))" }}
              >
                <span className="text-4xl font-black text-white/30 font-mono tracking-tighter">MY</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-500/20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
            <div className="text-center px-6">
              <p className="text-white/25 text-xs font-mono mb-1">Muhamad Yusuf</p>
              <p className="text-white/15 text-[10px] font-mono">Tambahkan foto ke /public/photo.jpg</p>
            </div>
            {/* Decorative code lines */}
            <div className="absolute bottom-8 left-6 right-6 space-y-1.5">
              {["const dev = 'yusuf'", "stack: ['Next', 'Laravel']", "status: 'available'"].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.2 }}
                  className="text-[10px] font-mono text-white/10 truncate"
                >
                  <span className="text-cyan-500/30">{">_"}</span> {line}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, rgba(5,7,20,0.85) 0%, transparent 100%)" }}
        />

        {/* Status badge at bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(5,7,20,0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <p className="text-white/85 text-xs font-bold leading-none">Muhamad Yusuf</p>
                <p className="text-emerald-400/70 text-[10px] mt-0.5 leading-none">Open to work</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-white/20">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px]">ID</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Outer decorative ring */}
      <motion.div
        className="absolute -inset-4 rounded-[2.5rem] border border-white/[0.03] pointer-events-none"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-8 rounded-[3rem] border border-white/[0.015] pointer-events-none"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.div>
  );
}

// ─── About / Hero section ─────────────────────────────────────────────────────

function AboutHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { ref: magRef, x, y } = useMagnetic(0.4);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center px-4 sm:px-6 pt-24 pb-20 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-14 xl:gap-20 items-center">

          {/* ── Left: Copy ── */}
          <div ref={ref} className="order-2 lg:order-1">

            {/* Available pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-sm font-medium"
            >
              <span className="relative flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              Open to opportunities · Indonesia 🇮🇩
            </motion.div>

            {/* Intro label */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-white/25 text-sm font-mono uppercase tracking-[0.28em] mb-4"
            >
              Hello, I&apos;m
            </motion.p>

            {/* Big name */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(3.5rem,7.5vw,6rem)] font-black tracking-tighter leading-[0.88]"
                style={{
                  background: "linear-gradient(150deg, #ffffff 0%, rgba(255,255,255,0.82) 40%, rgba(6,182,212,0.85) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Muhamad
                <br />
                <span style={{
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(139,92,246,0.9) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Yusuf
                </span>
              </motion.h1>
            </div>

            {/* Role typing */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="h-px w-8 bg-gradient-to-r from-cyan-500 to-transparent" />
              <p className="text-lg text-white/45 font-light min-h-[1.75rem]">
                <TypingText phrases={[
                  "Full-Stack Developer",
                  "Laravel Engineer",
                  "Next.js Specialist",
                  "Informatics Student",
                  "Problem Solver",
                ]} />
              </p>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex items-center gap-1.5 mb-7 text-white/25 text-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400/50" />
              Indonesia · Available for remote work
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.33 }}
              className="text-white/48 text-[1.0625rem] leading-[1.88] mb-9 max-w-[520px] font-light"
            >
              Informatics student turned builder. I craft production-grade web systems
              that{" "}
              <span className="text-white/82 font-medium">actually ship</span> —
              from secure QR attendance platforms deployed to 500+ students, to encrypted
              voting systems with zero downtime. My code{" "}
              <span className="text-white/82 font-medium">solves real problems</span>.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.40 }}
              className="flex flex-wrap gap-3 mb-9"
            >
              {/* Magnetic primary */}
              <motion.div ref={magRef} style={{ x, y }}>
                <a
                  href="#projects"
                  className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6 60%, #6366f1)" }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at 60% 50%, rgba(255,255,255,0.18), transparent 70%)" }} />
                  <Sparkles className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">View My Work</span>
                  <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform relative z-10" />
                  <span className="absolute inset-0 -z-10 blur-xl opacity-35 group-hover:opacity-60 transition-opacity" style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }} />
                </a>
              </motion.div>

              <a
                href="mailto:myucupp9@gmail.com"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white/65 bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] hover:text-white transition-all duration-200"
                style={{ backdropFilter: "blur(12px)" }}
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </a>
            </motion.div>

            {/* Social + resume */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.46 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              {[
                { icon: <Github className="w-4 h-4" />, href: "https://github.com/MuhamadYusuf8", label: "GitHub" },
                { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/in/muhamad-yusuf-b13626380?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", label: "LinkedIn" },
                { icon: <Mail className="w-4 h-4" />, href: "myucupp9@gmail.com", label: "Email" },
              ].map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/30 hover:text-white/65 text-xs font-medium transition-colors duration-200">
                  {s.icon} {s.label}
                </a>
              ))}
              <div className="h-3 w-px bg-white/10 hidden sm:block" />
              <a href="/cv.pdf" download className="flex items-center gap-1.5 text-cyan-400/55 hover:text-cyan-400 text-xs font-medium transition-colors duration-200">
                <Download className="w-3.5 h-3.5" /> Download CV
              </a>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.52 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.055] hover:border-white/[0.09] transition-all duration-200 cursor-default group"
                >
                  <span className="text-white/20 group-hover:text-cyan-400/50 transition-colors">{stat.icon}</span>
                  <span className="text-[1.35rem] font-black text-white/90 tracking-tight font-mono leading-none">
                    <Counter value={stat.value} />
                  </span>
                  <span className="text-[10px] text-white/28 leading-tight font-medium whitespace-pre-line">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Photo ── */}
          <div className="order-1 lg:order-2">
            <PhotoCard />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/15"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Tech stack separator ─────────────────────────────────────────────────────

function TechSeparator() {
  return (
    <div className="relative py-6 border-y border-white/[0.05]">
      <p className="text-center text-white/12 text-[10px] uppercase tracking-[0.28em] font-medium mb-4">
        Tech Stack
      </p>
      <TechMarquee />
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────
// Ini adalah versi standalone About+Hero section.
// Integrasikan AboutHero dan TechSeparator ke page.tsx utama Anda.

export default function Page() {
  return (
    <main className="relative min-h-screen bg-transparent text-white overflow-x-hidden">
      <style>{`
        html { scroll-behavior: smooth; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      <BackgroundBlobs />
      <AboutHero />
      <TechSeparator />

      {/*
        Paste section lain di sini:
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      */}
    </main>
  );
}