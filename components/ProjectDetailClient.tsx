"use client";

import {
  useRef,
  useState,
  useEffect,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Code2,
  Database,
  Layers,
  Terminal,
  Zap,
  Shield,
  Calendar,
  Tag,
  User,
  Monitor,
  Circle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectDetailData {
  title: string;
  description: string;
  content?: string | null;
  imageUrl?: string | null;
  techStack: string[];
  category: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  createdAt: Date | string;
  role?: string;
}

// ─── Tech icon map ────────────────────────────────────────────────────────────

const TECH_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  "next.js":      { icon: <Globe className="w-3.5 h-3.5" />,    color: "text-white/70" },
  nextjs:         { icon: <Globe className="w-3.5 h-3.5" />,    color: "text-white/70" },
  react:          { icon: <Zap className="w-3.5 h-3.5" />,      color: "text-cyan-400" },
  laravel:        { icon: <Code2 className="w-3.5 h-3.5" />,    color: "text-red-400" },
  php:            { icon: <Code2 className="w-3.5 h-3.5" />,    color: "text-violet-400" },
  typescript:     { icon: <Terminal className="w-3.5 h-3.5" />, color: "text-blue-400" },
  javascript:     { icon: <Terminal className="w-3.5 h-3.5" />, color: "text-amber-400" },
  postgresql:     { icon: <Database className="w-3.5 h-3.5" />, color: "text-sky-400" },
  mysql:          { icon: <Database className="w-3.5 h-3.5" />, color: "text-orange-400" },
  "tailwind css": { icon: <Layers className="w-3.5 h-3.5" />,   color: "text-teal-400" },
  tailwind:       { icon: <Layers className="w-3.5 h-3.5" />,   color: "text-teal-400" },
  docker:         { icon: <Shield className="w-3.5 h-3.5" />,   color: "text-blue-500" },
  "vue.js":       { icon: <Zap className="w-3.5 h-3.5" />,      color: "text-emerald-400" },
  prisma:         { icon: <Database className="w-3.5 h-3.5" />, color: "text-white/60" },
};

function getTechConfig(tag: string) {
  return TECH_ICONS[tag.toLowerCase()] ?? { icon: <Code2 className="w-3.5 h-3.5" />, color: "text-white/40" };
}

// ─── Grain overlay ────────────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.032]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ─── Ambient scroll glow ──────────────────────────────────────────────────────

function AmbientGlow({ scrollY }: { scrollY: ReturnType<typeof useSpring> }) {
  const opacity = useTransform(scrollY, [0, 400], [0.18, 0.06]);
  const y = useTransform(scrollY, [0, 800], [0, -120]);

  return (
    <motion.div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none z-0"
      style={{ opacity, y }}
    >
      <div
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.22) 0%, rgba(6,182,212,0.10) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </motion.div>
  );
}

// ─── Reading progress bar ─────────────────────────────────────────────────────

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1.5px] z-50 origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
        boxShadow: "0 0 10px rgba(99,102,241,0.7)",
      }}
    />
  );
}

// ─── Back button (DIPERBAIKI) ──────────────────────────────────────────────────

function BackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      // Kita naikkan z-index ke 50 agar selalu di atas overlay gandum/grain
      className="fixed top-8 left-8 z-[60]" 
    >
      <Link
        href="/#projects" // Diarahkan ke ID projects di halaman utama
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="tracking-widest uppercase">Back to Projects</span>
      </Link>
    </motion.div>
  );
}

// ─── Hero monolith ────────────────────────────────────────────────────────────

function HeroMonolith({ title, imageUrl, category }: {
  title: string;
  imageUrl?: string | null;
  category: string;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.7, 0.92]);

  // Split title into words for stagger animation
  const words = title.split(" ");

  return (
    <div ref={heroRef} className="relative h-screen min-h-[600px] max-h-[900px] flex flex-col justify-end overflow-hidden">
      {/* Parallax background image */}
      {imageUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </motion.div>
      )}

      {/* Gradient overlay — always present */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          opacity: overlayOpacity,
          background: imageUrl 
            ? "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.50) 70%, rgba(5,5,5,0.30) 100%)"
            : "linear-gradient(135deg, #050505 0%, #0d0d1a 100%)",
        }}
      />

      {/* No-image ambient fill */}
      {!imageUrl && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(99,102,241,0.14) 0%, rgba(6,182,212,0.06) 45%, transparent 70%)",
          }}
        />
      )}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Hero content */}
      <motion.div
        className="relative z-[3] px-6 sm:px-10 lg:px-16 pb-16 lg:pb-24 max-w-[1400px] mx-auto w-full"
        style={{ y: titleY }}
      >
        {/* Category chip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          {category}
        </motion.div>

        {/* Gargantuan title */}
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-x-[0.2em]">
            {words.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.5 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block text-[clamp(3rem,8.5vw,9rem)] font-black tracking-tighter leading-[0.88]"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.55) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Underline separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 h-px w-full max-w-md origin-left"
          style={{
            background: "linear-gradient(90deg, rgba(99,102,241,0.7), rgba(6,182,212,0.4), transparent)",
          }}
        />
      </motion.div>

      {/* Bottom fade into page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[4] pointer-events-none"
        style={{
          background: "linear-gradient(to top, #050505, transparent)",
        }}
      />
    </div>
  );
}

// ─── Golden info row ──────────────────────────────────────────────────────────

function GoldenInfoRow({ category, createdAt, role }: {
  category: string;
  createdAt: Date | string;
  role?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const items = [
    {
      label: "Category",
      value: category,
      icon: <Tag className="w-3.5 h-3.5" />,
    },
    {
      label: "Released",
      value: new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
      label: "Role",
      value: role ?? "Lead Developer",
      icon: <User className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div ref={ref} className="relative py-10 border-y border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.04]">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-1.5 px-0 sm:px-8 first:pl-0 last:pr-0 py-5 sm:py-0"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                <span className="text-indigo-400/60">{item.icon}</span>
                {item.label}
              </div>
              <p className="text-sm font-semibold text-white/65">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Browser frame showcase ───────────────────────────────────────────────────

function BrowserFrameShowcase({ imageUrl, title }: {
  imageUrl: string;
  title: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const frameY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ y: frameY }}
      className="relative"
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.12), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Browser frame */}
      <div
        className="relative rounded-xl overflow-hidden border border-white/[0.07]"
        style={{
          boxShadow: "0 60px 120px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]"
          style={{ background: "rgba(20,20,26,0.95)" }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c, opacity: 0.8 }} />
            ))}
          </div>

          {/* URL bar */}
          <div
            className="flex-1 max-w-sm mx-auto flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[11px] text-white/25 font-mono"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Monitor className="w-3 h-3 text-white/20" />
            <span>myportfolio.dev/projects/{title.toLowerCase().replace(/\s+/g, "-")}</span>
          </div>

          <div className="w-16" />
        </div>

        {/* Screenshot */}
        <div className="relative aspect-[16/9] bg-[#0a0a0f]">
          <Image
            src={imageUrl}
            alt={`${title} screenshot`}
            fill
            className="object-cover object-top"
            quality={95}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Tech micro-card ──────────────────────────────────────────────────────────

function TechMicroCard({ tech, index }: { tech: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cfg = getTechConfig(tech);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl cursor-default overflow-hidden transition-all duration-200"
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span className={cfg.color}>{cfg.icon}</span>
      <span className="text-xs font-medium text-white/55 group-hover:text-white/80">{tech}</span>
    </motion.div>
  );
}

// ─── Live glow button ─────────────────────────────────────────────────────────

function LiveButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 380, damping: 22 });
  const y = useSpring(0, { stiffness: 380, damping: 22 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * 0.2);
      y.set((e.clientY - (r.top + r.height / 2)) * 0.2);
    };
    const onLeave = () => { x.set(0); y.set(0); setHovered(false); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x, y }}
      onMouseEnter={() => setHovered(true)}
      className="relative group flex items-center justify-center gap-2.5 w-full h-12 rounded-xl text-sm font-bold text-black overflow-hidden"
    >
      {/* Base */}
      <span
        className="absolute inset-0 rounded-xl transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #06b6d4, #6366f1, #8b5cf6)",
          boxShadow: hovered
            ? "0 0 40px rgba(99,102,241,0.55), 0 0 16px rgba(6,182,212,0.35), inset 0 1px 0 rgba(255,255,255,0.20)"
            : "0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      />
      {/* Pulse ring */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 rounded-xl"
            style={{ border: "1px solid rgba(99,102,241,0.5)" }}
          />
        )}
      </AnimatePresence>
      {/* Sweep shine */}
      <motion.span
        className="absolute inset-0 rounded-xl"
        style={{
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
          backgroundSize: "200% 100%",
        }}
        animate={hovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}}
        transition={{ duration: 0.6 }}
      />
      <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
      <span className="relative z-10">Live Experience</span>
    </motion.a>
  );
}

// ─── Copy link button ─────────────────────────────────────────────────────────

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-xs font-medium text-white/25 hover:text-white/55 transition-all duration-150"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5 text-emerald-400"
          >
            <Check className="w-3.5 h-3.5" />
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Link
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Command center sidebar ───────────────────────────────────────────────────

function CommandCenter({ data }: { data: ProjectDetailData }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      {data.liveUrl && (
        <Reveal delay={0.1}>
          <LiveButton href={data.liveUrl} />
        </Reveal>
      )}

      {data.githubUrl && (
        <Reveal delay={0.15}>
          <a
            href={data.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2.5 w-full h-11 rounded-xl text-sm font-semibold text-white/60 hover:text-white/90 transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
            GitHub Repository
          </a>
        </Reveal>
      )}

      <Reveal delay={0.2}>
        <CopyLinkButton />
      </Reveal>

      {/* Divider */}
      <div className="h-px bg-white/[0.04] my-1" />

      {/* Tech stack heading */}
      <Reveal delay={0.25}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/18 mb-1">
          Built with
        </p>
      </Reveal>

      {/* Tech micro-cards */}
      <div className="flex flex-col gap-2">
        {data.techStack.map((tech, i) => (
          <TechMicroCard key={tech} tech={tech} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Narrative section parser ─────────────────────────────────────────────────

interface NarrativeBlock {
  icon: React.ReactNode;
  label: string;
  color: string;
  text: string;
}

function parseNarrative(content: string): NarrativeBlock[] {
  // Try to detect sections; if content has headings, use them.
  // Otherwise split into three even parts and assign labels.
  const sections: NarrativeBlock[] = [];

  const h2Regex = /##\s+(.+)\n([\s\S]*?)(?=##|$)/g;
  let match;
  const icons = [
    { icon: <Circle className="w-4 h-4" />, color: "text-amber-400", label: "The Challenge" },
    { icon: <Lightbulb className="w-4 h-4" />, color: "text-cyan-400", label: "The Solution" },
    { icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400", label: "The Impact" },
  ];

  let i = 0;
  while ((match = h2Regex.exec(content)) !== null && i < 3) {
    sections.push({
      icon: icons[i].icon,
      label: match[1].trim(),
      color: icons[i].color,
      text: match[2].trim(),
    });
    i++;
  }

  // If no markdown headings found, treat entire content as narrative
  if (sections.length === 0) {
    const paragraphs = content.split("\n\n").filter(Boolean);
    const chunkSize = Math.ceil(paragraphs.length / 3);
    icons.forEach((icon, idx) => {
      const chunk = paragraphs.slice(idx * chunkSize, (idx + 1) * chunkSize).join("\n\n");
      if (chunk.trim()) {
        sections.push({ ...icon, text: chunk.trim() });
      }
    });
  }

  return sections.slice(0, 3);
}

// ─── Narrative content ────────────────────────────────────────────────────────

function NarrativeContent({ content, description }: {
  content?: string | null;
  description: string;
}) {
  const blocks = content ? parseNarrative(content) : [];

  return (
    <div className="space-y-14">
      {/* Description lead */}
      <Reveal>
        <p className="text-[clamp(1rem,1.8vw,1.2rem)] text-white/45 leading-[1.85] font-light max-w-2xl">
          {description}
        </p>
      </Reveal>

      {/* Narrative blocks */}
      {blocks.length > 0 && (
        <div className="space-y-12">
          {blocks.map((block, i) => (
            <Reveal key={block.label} delay={i * 0.1}>
              <div className="group">
                {/* Section label */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <span className={block.color}>{block.icon}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white/55 uppercase tracking-[0.12em]">
                    {block.label}
                  </h3>
                  <div className="flex-1 h-px bg-white/[0.05] ml-2" />
                </div>

                {/* Content */}
                <div className="ml-0 pl-0">
                  {block.text.split("\n").filter(Boolean).map((para, pi) => (
                    <p
                      key={pi}
                      className="text-[0.9375rem] text-white/40 leading-[1.9] mb-4 last:mb-0 font-light"
                    >
                      {para.replace(/^[-*]\s+/, "")}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Fallback if no content at all */}
      {blocks.length === 0 && !content && (
        <Reveal delay={0.1}>
          <div
            className="px-7 py-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p className="text-sm text-white/25 font-light leading-relaxed">
              Full case study documentation coming soon.
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProjectDetailClient({ data }: { data: ProjectDetailData }) {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 80, damping: 20 });

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "#050505", color: "white" }}
    >
      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        html { scroll-behavior: smooth; }
      `}</style>

      <GrainOverlay />
      <ProgressBar />
      <AmbientGlow scrollY={smoothScrollY} />
      <BackButton />

      {/* ── Hero ── */}
      <HeroMonolith
        title={data.title}
        imageUrl={data.imageUrl}
        category={data.category}
      />

      {/* ── Golden Info Row ── */}
      <GoldenInfoRow
        category={data.category}
        createdAt={data.createdAt}
        role={data.role}
      />

      {/* ── Main Content ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-16 lg:gap-24 items-start">

          {/* ── Left: Narrative + Showcase ── */}
          <div className="space-y-20">
            {/* Narrative */}
            <NarrativeContent content={data.content} description={data.description} />

            {/* Browser frame showcase */}
            {data.imageUrl && (
              <Reveal>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                      Project Showcase
                    </p>
                    <div className="flex-1 h-px bg-white/[0.04]" />
                  </div>
                  <BrowserFrameShowcase imageUrl={data.imageUrl} title={data.title} />
                </div>
              </Reveal>
            )}

            {/* CTA row for mobile */}
            <div className="lg:hidden space-y-3">
              <CommandCenter data={data} />
            </div>
          </div>

          {/* ── Right: Sticky command center (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              {/* Glass card */}
              <div
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 80px rgba(0,0,0,0.5)",
                }}
              >
                {/* Top edge glow */}
                <div
                  className="absolute top-0 left-8 right-8 h-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(99,102,241,0.45), rgba(6,182,212,0.3), transparent)",
                  }}
                />

                {/* Corner ambient */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
                  }}
                />

                <CommandCenter data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer spacer ── */}
      <div className="h-20 lg:h-32" />

      {/* ── Bottom ambient ── */}
      <div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,5,0.8), transparent)",
        }}
      />
    </div>
  );
}