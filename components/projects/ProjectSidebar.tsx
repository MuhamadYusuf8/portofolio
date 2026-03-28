"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useInView } from "framer-motion";
import { ExternalLink, Github, Calendar, Eye, Clock, Tag, Share2, Globe, Code2, Database, Layers, Terminal, Zap, Shield } from "lucide-react";

// Tipe Data
export interface ProjectData {
  title: string; description: string; tags: string[]; category: string;
  createdAt: string; views: number; liveUrl?: string; githubUrl?: string; readTime?: string;
}

// Mapping Icon
const TAG_ICONS: Record<string, React.ReactNode> = {
  "next.js": <Globe className="w-3.5 h-3.5" />, react: <Globe className="w-3.5 h-3.5" />,
  laravel: <Code2 className="w-3.5 h-3.5" />, php: <Code2 className="w-3.5 h-3.5" />,
  postgresql: <Database className="w-3.5 h-3.5" />, mysql: <Database className="w-3.5 h-3.5" />,
  tailwind: <Layers className="w-3.5 h-3.5" />, typescript: <Terminal className="w-3.5 h-3.5" />,
};

function getTagIcon(tag: string) { return TAG_ICONS[tag.toLowerCase()] ?? <Code2 className="w-3.5 h-3.5" />; }

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function GlowButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useSpring(0, { stiffness: 350, damping: 22 }); const my = useSpring(0, { stiffness: 350, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return; const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.22); my.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };
  const isPrimary = variant === "primary";

  return (
    <motion.a ref={ref} href={href} target="_blank" rel="noopener noreferrer" style={{ x: mx, y: my }} onMouseMove={handleMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
      className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold overflow-hidden transition-colors duration-200 ${isPrimary ? "text-black" : "text-white/70 hover:text-white border border-white/[0.08] bg-white/[0.03]"}`}>
      {isPrimary && (
        <>
          <motion.span className="absolute inset-0" style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6, #6366f1)" }} animate={{ opacity: hovered ? 1 : 0.9 }} />
          <motion.span className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)", backgroundSize: "200% 100%" }} animate={hovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}} transition={{ duration: 0.6 }} />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  );
}

export default function ProjectSidebar({ data }: { data: ProjectData }) {
  return (
    <aside className="flex flex-col gap-5">
      <Reveal delay={0.25}>
        <div className="flex flex-col gap-3">
          {data.liveUrl && <GlowButton href={data.liveUrl} variant="primary"><ExternalLink className="w-4 h-4" /> Live Preview</GlowButton>}
          {data.githubUrl && <GlowButton href={data.githubUrl} variant="secondary"><Github className="w-4 h-4" /> View Source</GlowButton>}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="rounded-2xl border border-white/[0.07] p-5 bg-white/[0.018] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, i) => (
              <div key={tag} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/55 text-xs font-medium hover:bg-white/[0.07] transition-all">
                <span className="text-violet-400">{getTagIcon(tag)}</span>{tag}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.35}>
        <div className="rounded-2xl border border-white/[0.07] p-5 space-y-3.5 bg-white/[0.015] backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 mb-1">Details</p>
          <div className="flex items-center gap-2 text-white/35 text-sm"><Tag className="w-3.5 h-3.5 text-white/25" /> {data.category}</div>
          <div className="flex items-center gap-2 text-white/35 text-sm"><Calendar className="w-3.5 h-3.5 text-white/25" /> {new Date(data.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          <div className="flex items-center gap-2 text-white/35 text-sm"><Eye className="w-3.5 h-3.5 text-white/25" /> {data.views.toLocaleString()} views</div>
        </div>
      </Reveal>
    </aside>
  );
}