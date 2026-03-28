"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { MapPin } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const NODES = [
  {
    id: "sd",
    label: "SD",
    title: "The Spark",
    subtitle: "Elementary School",
    location: "Padang, West Sumatra",
    period: "2007 – 2013",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.22)",
    description:
      "Origin point. In the coastal city of Padang, a young mind awakened to the elegance of numbers and the language of logic — quietly laying the neural pathways for everything that followed.",
    tags: ["Curiosity", "Mathematics", "Padang Origins"],
    isMaster: false,
  },
  {
    id: "smp",
    label: "SMP",
    title: "Discovery Protocol",
    subtitle: "Junior High School",
    location: "Padang, West Sumatra",
    period: "2013 – 2016",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.22)",
    description:
      "First contact with technology. Circuits and logic gates revealed a new grammar — the moment digital curiosity transformed into a genuine, consuming obsession with how machines think.",
    tags: ["Tech Discovery", "Logic Systems", "Digital Awakening"],
    isMaster: false,
  },
  {
    id: "smk",
    label: "SMK",
    title: "Competition Crucible",
    subtitle: "Vocational High School",
    location: "West Sumatra",
    period: "2016 – 2019",
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.22)",
    description:
      "Competitive programming at Universitas Andalas (Unand) and UNP forged discipline under pressure. Every contest was a forge — precision and algorithm mastery sharpened under the clock.",
    tags: ["Unand Competition", "UNP Competition", "Coding Fundamentals", "Algorithms"],
    isMaster: false,
  },
  {
    id: "kuliah",
    label: "S1",
    title: "The Convergence",
    subtitle: "President University — Informatics",
    location: "Bekasi, West Java",
    period: "2019 – 2023",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.26)",
    description:
      "The master node. Informatics Engineering, Robotics Club, Comstat Project Manager — and the crown jewel: a live Attendance System (Sistem Absensi) deployed for the city government of Pariaman.",
    tags: ["Informatics Engineering", "Robotics Club", "Comstat PM", "Sistem Absensi Pariaman"],
    isMaster: true,
  },
] as const;

type Node = (typeof NODES)[number];

// ─── Micro Visual SVG Components ────────────────────────────────────────────────

function BookSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="30" height="30">
      <rect x="8" y="6" width="26" height="36" rx="2" stroke={color} strokeWidth="1.2" opacity="0.55" />
      <rect x="11" y="6" width="3" height="36" fill={color} opacity="0.14" />
      <line x1="16" y1="16" x2="30" y2="16" stroke={color} strokeWidth="0.9" opacity="0.45" />
      <line x1="16" y1="21" x2="28" y2="21" stroke={color} strokeWidth="0.9" opacity="0.35" />
      <line x1="16" y1="26" x2="30" y2="26" stroke={color} strokeWidth="0.9" opacity="0.35" />
      <line x1="16" y1="31" x2="27" y2="31" stroke={color} strokeWidth="0.9" opacity="0.35" />
      <circle cx="22" cy="39" r="1.5" fill={color} opacity="0.45" />
      <path d="M 34 6 L 40 6 L 40 28 L 34 28" stroke={color} strokeWidth="0.9" opacity="0.25" strokeDasharray="2 2" />
    </svg>
  );
}

function CircuitSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="30" height="30">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.2" opacity="0.55" />
      <circle cx="36" cy="12" r="3" stroke={color} strokeWidth="1.2" opacity="0.55" />
      <circle cx="12" cy="36" r="3" stroke={color} strokeWidth="1.2" opacity="0.55" />
      <circle cx="36" cy="36" r="3" stroke={color} strokeWidth="1.2" opacity="0.55" />
      <circle cx="24" cy="24" r="5" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <line x1="12" y1="15" x2="12" y2="33" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="36" y1="15" x2="36" y2="33" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="15" y1="12" x2="33" y2="12" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="15" y1="36" x2="33" y2="36" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="19" y1="24" x2="12" y2="24" stroke={color} strokeWidth="0.8" opacity="0.45" strokeDasharray="1.5 1.5" />
      <line x1="29" y1="24" x2="36" y2="24" stroke={color} strokeWidth="0.8" opacity="0.45" strokeDasharray="1.5 1.5" />
      <line x1="24" y1="19" x2="24" y2="12" stroke={color} strokeWidth="0.8" opacity="0.45" strokeDasharray="1.5 1.5" />
      <line x1="24" y1="29" x2="24" y2="36" stroke={color} strokeWidth="0.8" opacity="0.45" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

function TrophySvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="30" height="30">
      <path
        d="M16 8H32V24C32 30.627 28.418 34 24 34C19.582 34 16 30.627 16 24Z"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path
        d="M16 14C10 14 8 18 8 22C8 26 11 28.5 14.5 28"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M32 14C38 14 40 18 40 22C40 26 37 28.5 33.5 28"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.4"
        strokeLinecap="round"
      />
      <line x1="24" y1="34" x2="24" y2="39" stroke={color} strokeWidth="1.5" opacity="0.45" />
      <line x1="18" y1="39" x2="30" y2="39" stroke={color} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      <path
        d="M21.5 22L23 24.5L26.5 19.5"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RobotSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="30" height="30">
      <rect x="14" y="6" width="20" height="15" rx="3" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <circle cx="19" cy="13" r="2.5" fill={color} opacity="0.45" />
      <circle cx="29" cy="13" r="2.5" fill={color} opacity="0.45" />
      <line x1="24" y1="6" x2="24" y2="3" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <circle cx="24" cy="2" r="1.2" fill={color} opacity="0.75" />
      <rect x="12" y="23" width="24" height="16" rx="2" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <rect x="17" y="27" width="5" height="5" rx="1" stroke={color} strokeWidth="0.9" opacity="0.5" />
      <rect x="26" y="27" width="5" height="5" rx="1" stroke={color} strokeWidth="0.9" opacity="0.5" />
      <line x1="12" y1="27" x2="6" y2="32" stroke={color} strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
      <line x1="36" y1="27" x2="42" y2="32" stroke={color} strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
      <line x1="24" y1="21" x2="24" y2="23" stroke={color} strokeWidth="2" opacity="0.38" />
    </svg>
  );
}

const MICRO_MAP: Record<string, (c: string) => React.ReactNode> = {
  sd: (c) => <BookSvg color={c} />,
  smp: (c) => <CircuitSvg color={c} />,
  smk: (c) => <TrophySvg color={c} />,
  kuliah: (c) => <RobotSvg color={c} />,
};

// ─── Decorative Scan Line ────────────────────────────────────────────────────────

function ScanLine({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${color}40, transparent)` }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
    </motion.div>
  );
}

// ─── Individual Node Row ─────────────────────────────────────────────────────────

function NodeRow({ node, index }: { node: Node; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });
  const [hovered, setHovered] = useState(false);
  const isLeft = index % 2 === 0;
  const orbSize = node.isMaster ? 100 : 76;

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 sm:gap-8 lg:gap-14 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* ── Info Card ─── */}
      <div className={`flex-1 flex ${isLeft ? "justify-end" : "justify-start"}`}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 18 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.15 }}
          style={{ perspective: 1000 }}
          className="w-full max-w-[340px] lg:max-w-[375px]"
        >
          <motion.div
            animate={
              hovered
                ? { rotateY: isLeft ? 5 : -5, rotateX: -2.5, scale: 1.025 }
                : { rotateY: 0, rotateX: 0, scale: 1 }
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative rounded-2xl overflow-hidden cursor-default"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%)",
              border: "1px solid rgba(255,255,255,0.055)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: hovered
                ? `0 28px 70px ${node.glow}, 0 0 0 1px ${node.color}20`
                : "0 8px 32px rgba(0,0,0,0.55)",
              transition: "box-shadow 0.45s ease",
            }}
          >
            {/* Card ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-60px",
                [isLeft ? "right" : "left"]: "-60px",
                width: "200px",
                height: "200px",
                background: `radial-gradient(circle, ${node.color}1A 0%, transparent 70%)`,
                opacity: hovered ? 1 : 0.55,
                transition: "opacity 0.45s ease",
              }}
            />

            {/* Scan line animation */}
            {hovered && <ScanLine color={node.color} />}

            {/* Card inner */}
            <div className="p-6 lg:p-7 relative z-10">
              {/* Period row */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-mono text-[10px] font-bold tracking-[0.38em] uppercase"
                  style={{ color: node.color }}
                >
                  {node.period}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{
                    background: `linear-gradient(${isLeft ? "to right" : "to left"}, ${node.color}55, transparent)`,
                  }}
                />
              </div>

              {/* Title */}
              <h3
                className="text-[1.45rem] font-extralight text-white/92 tracking-tight leading-snug mb-1"
                style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
              >
                {node.title}
              </h3>
              <p className="font-mono text-[9px] tracking-[0.35em] text-white/28 uppercase mb-5">
                {node.subtitle}
              </p>

              {/* Description */}
              <p className="text-[13.5px] text-white/42 leading-relaxed font-light mb-5">
                {node.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-[0.22em] px-2.5 py-[5px] rounded-full font-mono"
                    style={{
                      color: node.color,
                      background: `${node.color}0D`,
                      border: `1px solid ${node.color}25`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 pt-1">
                <MapPin
                  size={9}
                  className="flex-shrink-0"
                  style={{ color: node.color, opacity: 0.5 }}
                />
                <span className="text-[10px] font-mono text-white/22 tracking-widest">
                  {node.location}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Central Orb ─── */}
      <div className="relative flex-shrink-0 flex flex-col items-center z-10">
        {/* Pulse rings (only after in view) */}
        {isInView && (
          <>
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: orbSize,
                height: orbSize,
                border: `1px solid ${node.color}90`,
              }}
              animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: orbSize,
                height: orbSize,
                border: `1px solid ${node.color}55`,
              }}
              animate={{ scale: [1, 3.4], opacity: [0.3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
            />
          </>
        )}

        {/* Master-node extra ring */}
        {node.isMaster && isInView && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orbSize,
              height: orbSize,
              border: `1px solid ${node.color}35`,
            }}
            animate={{ scale: [1, 4.6], opacity: [0.18, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
        )}

        {/* Orb body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.15 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.05 }}
          whileHover={{ scale: 1.16 }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative rounded-full flex items-center justify-center cursor-pointer select-none"
          style={{
            width: orbSize,
            height: orbSize,
            background: `radial-gradient(circle at 33% 28%, ${node.color}2E, ${node.color}07 62%, transparent)`,
            border: `1px solid ${node.color}55`,
            boxShadow: hovered
              ? `0 0 55px ${node.glow}, 0 0 100px ${node.glow}90, inset 0 0 35px ${node.color}14`
              : `0 0 24px ${node.glow}, inset 0 0 14px ${node.color}0A`,
            transition: "box-shadow 0.45s ease",
          }}
        >
          {/* Inner decorative ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orbSize * 0.6,
              height: orbSize * 0.6,
              border: `1px solid ${node.color}22`,
            }}
          />
          {/* Micro visual icon */}
          <div className="relative z-10">{MICRO_MAP[node.id]?.(node.color)}</div>
        </motion.div>

        {/* Level label */}
        <motion.span
          className="mt-4 font-mono text-[9px] font-bold tracking-[0.5em] uppercase"
          style={{ color: node.color, opacity: 0.6 }}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
        >
          {node.label}
        </motion.span>
      </div>

      {/* ── Spacer (desktop layout balance) ─── */}
      <div className="flex-1 hidden lg:block" />
    </div>
  );
}

// ─── Main Story Component ────────────────────────────────────────────────────────

export default function Story() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.92", "end 0.38"],
  });

  const rawPathLen = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathLength = useSpring(rawPathLen, { stiffness: 55, damping: 20, restDelta: 0.001 });

  // Parallax for background glows
  const glowY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const glowY3 = useTransform(scrollYProgress, [0, 1], [80, 260]);

  const heading1 = "The".split("");
  const heading2 = "Journey".split("");

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#050505] overflow-hidden"
    >
      {/* ── Grain Texture Overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── Parallax Ambient Glows ── */}
      <motion.div
        className="absolute pointer-events-none z-[1]"
        style={{ top: "4%", left: "6%", y: glowY1 }}
      >
        <div
          className="w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.055) 0%, transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none z-[1]"
        style={{ top: "33%", right: "2%", y: glowY2 }}
      >
        <div
          className="w-[650px] h-[650px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.065) 0%, transparent 70%)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none z-[1]"
        style={{ top: "58%", left: "2%", y: glowY3 }}
      >
        <div
          className="w-[550px] h-[550px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.055) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ── Main Content ── */}
      <div className="relative z-[3] max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">

        {/* ─── Header Section ─── */}
        <div className="pt-28 pb-20 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <div
              className="h-px w-14"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(6,182,212,0.5))",
              }}
            />
            <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-cyan-400/50">
              Chronicle Axis · Educational Archive
            </span>
            <div
              className="h-px w-14"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(6,182,212,0.5))",
              }}
            />
          </motion.div>

          {/* ── Split-letter heading ── */}
          <h2
            className="overflow-hidden leading-[0.88] tracking-[-0.04em] font-extralight mb-7"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
            aria-label="The Journey"
          >
            {/* "The" */}
            <span className="inline-block mr-[0.2em] text-white/88">
              {heading1.map((char, i) => (
                <motion.span
                  key={`the-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 55, rotateX: -85 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.76,
                    delay: 0.22 + i * 0.065,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  style={{ transformOrigin: "bottom center", display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>

            {/* "Journey" — gradient */}
            <span className="inline-block">
              {heading2.map((char, i) => (
                <motion.span
                  key={`j-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 55, rotateX: -85 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.76,
                    delay: 0.5 + i * 0.058,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  style={{
                    transformOrigin: "bottom center",
                    display: "inline-block",
                    background:
                      "linear-gradient(130deg, #06b6d4 0%, #7c3aed 55%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25, ease: "easeOut" }}
            className="text-white/28 text-sm lg:text-[15px] font-light tracking-wide max-w-xs mx-auto"
          >
            A living archive of growth, discipline, and the relentless pursuit of
            technological mastery
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5, ease: [0.215, 0.61, 0.355, 1] }}
            className="mt-12 mx-auto"
            style={{
              width: "1px",
              height: "60px",
              background:
                "linear-gradient(to bottom, rgba(6,182,212,0.5), transparent)",
              transformOrigin: "top",
            }}
          />
        </div>

        {/* ─── Timeline Section ─── */}
        <div className="relative pb-32">
          {/* ─── SVG Chronicle Path ─── */}
          <div className="absolute inset-0 flex justify-center pointer-events-none z-[4]">
            <svg
              className="h-full overflow-visible"
              style={{ width: "52px" }}
              viewBox="0 0 52 1000"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Main gradient */}
                <linearGradient id="chronicleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                  <stop offset="28%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="63%" stopColor="#7c3aed" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
                </linearGradient>

                {/* Glow filter */}
                <filter id="pathGlow" x="-200%" y="-20%" width="500%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Subtle glow clone */}
                <filter id="pathGlowSoft" x="-400%" y="-30%" width="900%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                  </feMerge>
                </filter>
              </defs>

              {/* Soft ambient glow behind the path */}
              <motion.path
                d="M 26 0 C 26 70, 18 160, 26 250 C 34 340, 18 420, 26 500 C 34 580, 18 660, 26 750 C 34 840, 26 930, 26 1000"
                fill="none"
                stroke="url(#chronicleGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#pathGlowSoft)"
                style={{ pathLength, opacity: 0.35 }}
              />

              {/* Main crisp path */}
              <motion.path
                d="M 26 0 C 26 70, 18 160, 26 250 C 34 340, 18 420, 26 500 C 34 580, 18 660, 26 750 C 34 840, 26 930, 26 1000"
                fill="none"
                stroke="url(#chronicleGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#pathGlow)"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* ─── Node Rows ─── */}
          <div className="flex flex-col gap-24 lg:gap-36">
            {NODES.map((node, i) => (
              <NodeRow key={node.id} node={node} index={i} />
            ))}
          </div>

          {/* ─── Terminal node ─── */}
          <motion.div
            className="flex justify-center mt-20 lg:mt-28"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-px h-12"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)",
                }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#8b5cf6",
                  boxShadow: "0 0 16px rgba(139,92,246,0.6)",
                }}
              />
              <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-violet-400/45 mt-1">
                Ongoing
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}