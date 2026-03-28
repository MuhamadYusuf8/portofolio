"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";

// ─── ICON IMPORTS (react-icons/si untuk logo brand asli) ─────────────────────
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiFramer, SiThreedotjs,
  SiLaravel, SiNodedotjs, SiPython, SiGraphql, SiDocker,
  SiPostgresql, SiMysql, SiMongodb, SiRedis, SiPrisma,
  SiArduino, SiRaspberrypi, SiEspressif, SiAutodesk,
  SiGit, SiGithubactions, SiVercel, SiFigma,
  SiPostman, SiVite, SiPnpm, SiLinux, SiNeovim
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend",
    accent: "#00FFF0",       // cyan
    glowRgb: "0,255,240",
    tagline: "Interfaces that feel alive.",
    skills: [
      { name: "Next.js", brand: "#ffffff", sub: "App Router · RSC · SSR", icon: SiNextdotjs },
      { name: "React", brand: "#61DAFB", sub: "Hooks · Context · Concurrent", icon: SiReact },
      { name: "TypeScript", brand: "#3178C6", sub: "Strict · Generics · DX", icon: SiTypescript },
      { name: "Tailwind", brand: "#38BDF8", sub: "Utility-First · JIT", icon: SiTailwindcss },
      { name: "Framer Motion", brand: "#FF0055", sub: "Spring · Gesture · Scroll", icon: SiFramer },
      { name: "Three.js", brand: "#FF6900", sub: "WebGL · GLSL · R3F", icon: SiThreedotjs },
    ],
  },
  {
    id: "backend",
    index: "02",
    label: "Backend",
    accent: "#A855F7",       // violet
    glowRgb: "168,85,247",
    tagline: "Servers that scale, APIs that endure.",
    skills: [
      { name: "Laravel", brand: "#FF2D20", sub: "Eloquent · Queues · Auth", icon: SiLaravel },
      { name: "Node.js", brand: "#8CC84B", sub: "Express · Fastify · Streams", icon: SiNodedotjs },
      { name: "Python", brand: "#FFD43B", sub: "FastAPI · Django · Asyncio", icon: SiPython },
      { name: "REST & GraphQL", brand: "#E10098", sub: "OpenAPI · Federation", icon: SiGraphql },
      { name: "Docker", brand: "#2496ED", sub: "Compose · Swarm · CI", icon: SiDocker },
    ],
  },
  {
    id: "database",
    index: "03",
    label: "Database",
    accent: "#F59E0B",       // amber
    glowRgb: "245,158,11",
    tagline: "Data modeled. Queries optimized.",
    skills: [
      { name: "PostgreSQL", brand: "#336791", sub: "JSONB · Window Fn · RLS", icon: SiPostgresql },
      { name: "MySQL", brand: "#4479A1", sub: "InnoDB · Replication", icon: SiMysql },
      { name: "MongoDB", brand: "#47A248", sub: "Aggregation · Atlas", icon: SiMongodb },
      { name: "Redis", brand: "#FF4438", sub: "Cache · Pub/Sub · Streams", icon: SiRedis },
      { name: "Prisma", brand: "#0C344B", sub: "ORM · Migrations · Studio", icon: SiPrisma },
    ],
  },
  {
    id: "hardware",
    index: "04",
    label: "Hardware",
    accent: "#10B981",       // emerald
    glowRgb: "16,185,129",
    tagline: "Code that touches the physical world.",
    skills: [
      { name: "Arduino", brand: "#00979D", sub: "C++ · Sensors · PWM", icon: SiArduino },
      { name: "Raspberry Pi", brand: "#C51A4A", sub: "GPIO · Linux · IoT", icon: SiRaspberrypi },
      { name: "ESP32", brand: "#E7352C", sub: "WiFi · BLE · RTOS", icon: SiEspressif },
      { name: "CAD / 3D", brand: "#FF8C00", sub: "Fusion 360 · FDM", icon: SiAutodesk },
    ],
  },
];

const CORE_TOOLS = [
  { name: "Git", icon: SiGit },
  { name: "GitHub Actions", icon: SiGithubactions },
  { name: "Vercel", icon: SiVercel },
  { name: "AWS", icon: FaAws },
  { name: "Figma", icon: SiFigma },
  { name: "Postman", icon: SiPostman },
  { name: "Vite", icon: SiVite },
  { name: "pnpm", icon: SiPnpm },
  { name: "Linux", icon: SiLinux },
  { name: "Neovim", icon: SiNeovim },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);
  return active;
}

// ─── MARQUEE STRIP ───────────────────────────────────────────────────────────

function MarqueeStrip({ items, accent }: { items: string[]; accent: string }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-2 border-y" style={{ borderColor: `${accent}33` }}>
      <motion.div
        className="flex gap-10 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs font-mono uppercase tracking-[0.3em] whitespace-nowrap"
            style={{ color: accent }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── SKILL LINE (giant interactive text + logo) ──────────────────────────────

function SkillLine({
  skill,
  accent,
  glowRgb,
  index,
}: {
  skill: { name: string; brand: string; sub: string; icon: any };
  accent: string;
  glowRgb: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const Icon = skill.icon;

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-default select-none overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow that fires on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(ellipse 80% 60% at 30% 50%, rgba(${glowRgb},0.18) 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-white/5 py-5 px-0 group-hover:border-white/10 transition-colors duration-300 relative z-10">
        
        {/* Left: Icon & Giant skill name */}
        <div className="flex items-center gap-4 md:gap-8 shrink-0">
          <motion.div
            className="flex items-center justify-center transition-all duration-300 opacity-20 group-hover:opacity-100 group-hover:scale-110"
            style={{
              color: hovered ? skill.brand : "white",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              filter: hovered ? `drop-shadow(0 0 15px ${skill.brand}80)` : "none"
            }}
          >
            <Icon />
          </motion.div>

          <motion.span
            className="block font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              color: hovered ? skill.brand : "rgba(255,255,255,0.88)",
              transition: "color 0.25s ease",
              textShadow: hovered ? `0 0 40px rgba(${glowRgb},0.5)` : "none",
            }}
          >
            {skill.name}
          </motion.span>
        </div>

        {/* Right: sub-labels + index */}
        <div className="flex items-center gap-6 ml-4 shrink-0">
          <span
            className="hidden md:block text-xs font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: accent }}
          >
            {skill.sub}
          </span>
          <span className="font-mono text-xs text-white/15 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CATEGORY SECTION ────────────────────────────────────────────────────────

function CategorySection({ cat }: { cat: (typeof CATEGORIES)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id={`section-${cat.id}`}
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-24 md:py-32"
    >
      {/* Section header */}
      <motion.div
        className="mb-10 md:mb-14"
        initial={{ opacity: 0, x: -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-4 mb-3">
          <span
            className="font-mono text-sm tracking-[0.3em] uppercase"
            style={{ color: cat.accent }}
          >
            {cat.index} /{" "}{cat.label}
          </span>
          <motion.div
            className="h-px flex-1"
            style={{ background: `linear-gradient(to right, ${cat.accent}66, transparent)` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p
          className="text-sm font-light tracking-wide"
          style={{ color: `${cat.accent}99` }}
        >
          {cat.tagline}
        </p>
      </motion.div>

      {/* Skill lines */}
      <div className="space-y-0">
        {cat.skills.map((skill, i) => (
          <SkillLine
            key={skill.name}
            skill={skill}
            accent={cat.accent}
            glowRgb={cat.glowRgb}
            index={i}
          />
        ))}
      </div>

      {/* Marquee strip at bottom */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <MarqueeStrip
          items={cat.skills.map((s) => s.sub.split(" · ")).flat()}
          accent={cat.accent}
        />
      </motion.div>
    </section>
  );
}

// ─── STICKY INDEX (LEFT SIDEBAR) ─────────────────────────────────────────────

function StickyIndex({ active }: { active: string }) {
  return (
    <aside className="hidden lg:flex flex-col justify-center gap-3 sticky top-0 h-screen w-36 shrink-0 pr-6 z-40">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <a
            key={cat.id}
            href={`#section-${cat.id}`}
            className="group flex items-center gap-3 no-underline"
            style={{ scrollBehavior: "smooth" }}
          >
            <motion.div
              className="h-px"
              animate={{ width: isActive ? 28 : 10, opacity: isActive ? 1 : 0.25 }}
              style={{ background: isActive ? cat.accent : "white" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <motion.span
              animate={{
                color: isActive ? cat.accent : "rgba(255,255,255,0.3)",
                fontSize: isActive ? "0.8rem" : "0.7rem",
              }}
              className="font-mono uppercase tracking-widest whitespace-nowrap transition-colors"
              transition={{ duration: 0.3 }}
            >
              {cat.index}. {cat.label}
            </motion.span>
          </a>
        );
      })}
    </aside>
  );
}

// ─── HERO HEADLINE ───────────────────────────────────────────────────────────

function HeroHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const words = ["Arsenal", "of", "Craft."];

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-start justify-end min-h-[60vh] pb-16"
      style={{ y, opacity }}
    >
      <div className="overflow-hidden mb-2">
        <motion.p
          className="font-mono text-xs tracking-[0.4em] uppercase text-white/30"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Technical Skills
        </motion.p>
      </div>

      <h1
        className="font-black leading-[0.9] tracking-tighter"
        style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
      >
        {words.map((word, i) => (
          <div key={i} className="overflow-hidden inline-block mr-[0.2em]">
            <motion.span
              className="inline-block"
              style={{ color: i === 2 ? "#00FFF0" : "white" }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.4 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </div>
        ))}
      </h1>

      <motion.div
        className="mt-8 h-px w-24"
        style={{ background: "linear-gradient(to right, #00FFF0, transparent)" }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

// ─── CORE TOOLS FOOTER ───────────────────────────────────────────────────────

function CoreToolsFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      className="relative py-28 border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <span className="font-mono text-xs tracking-[0.4em] uppercase text-white/25">
          05 / Core Tools
        </span>
      </motion.div>

      <div className="flex flex-wrap gap-x-8 gap-y-6 items-center">
        {CORE_TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.span
              key={tool.name}
              className="group flex items-center gap-4 font-black tracking-tight text-white/10 hover:text-white/80 transition-colors duration-200 cursor-default"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04 }}
            >
              <Icon className="text-white/10 group-hover:text-[#00FFF0] transition-colors duration-300" />
              {tool.name}
            </motion.span>
          );
        })}
      </div>
    </section>
  );
}

// ─── CURSOR GLOW ─────────────────────────────────────────────────────────────

function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 80, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 80, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(500px at ${xSpring}px ${ySpring}px, rgba(0,255,240,0.04), transparent 70%)`;

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: bg }}
    />
  );
}

// ─── VERTICAL PROGRESS BAR ───────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed right-4 md:right-6 top-0 w-px bg-[#00FFF0] origin-top z-50"
      style={{ scaleY, height: "100vh", opacity: 0.5, boxShadow: "0 0 10px rgba(0,255,240,0.5)" }}
    />
  );
}

// ─── NOISE TEXTURE OVERLAY ───────────────────────────────────────────────────

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function SkillsClient() {
  const categoryIds = CATEGORIES.map((c) => c.id);
  const active = useActiveSection(categoryIds);

  return (
    <div
      className="relative min-h-screen text-white antialiased overflow-clip"
    >
      {/* Layers */}
      <NoiseOverlay />
      <CursorGlow />
      <ScrollProgress />

      {/* Layout: sticky index (left) + scrolling content (right) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 xl:px-16 flex gap-0 lg:gap-12 xl:gap-20">
        {/* Sticky sidebar */}
        <StickyIndex active={active} />

        {/* Main content column */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <HeroHeadline />

          {/* Divider */}
          <div
            className="w-full h-px mb-0"
            style={{ background: "linear-gradient(to right, rgba(0,255,240,0.15), transparent)" }}
          />

          {/* Category sections */}
          {CATEGORIES.map((cat) => (
            <CategorySection key={cat.id} cat={cat} />
          ))}

          {/* Core Tools */}
          <CoreToolsFooter />

          {/* Bottom breathing space */}
          <div className="h-32" />
        </main>
      </div>
    </div>
  );
}