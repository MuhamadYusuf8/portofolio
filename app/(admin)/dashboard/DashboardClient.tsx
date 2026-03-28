"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Eye,
  MessageSquare,
  TrendingUp,
  Pencil,
  Trash2,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Circle,
  Activity,
} from "lucide-react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import ProjectModal from "@/components/admin/ProjectModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number;
  suffix?: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  sparkline: number[];
  accent: string;
  glowColor: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: "published" | "draft" | "archived";
  views: number;
  updatedAt: string;
  tech: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    label: "Total Projects",
    value: 12,
    change: "+2 this month",
    positive: true,
    icon: <FolderKanban className="w-4 h-4" />,
    sparkline: [4, 5, 5, 7, 8, 9, 10, 12],
    accent: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.12)",
  },
  {
    label: "Total Views",
    value: 24830,
    change: "+18% vs last month",
    positive: true,
    icon: <Eye className="w-4 h-4" />,
    sparkline: [8000, 10200, 9800, 14000, 17200, 19000, 22000, 24830],
    accent: "text-violet-400",
    glowColor: "rgba(139,92,246,0.12)",
  },
  {
    label: "Unread Messages",
    value: 3,
    change: "2 need reply",
    positive: false,
    icon: <MessageSquare className="w-4 h-4" />,
    sparkline: [1, 2, 1, 3, 2, 4, 3, 3],
    accent: "text-amber-400",
    glowColor: "rgba(251,191,36,0.10)",
  },
  {
    label: "Avg. Session",
    value: 4,
    suffix: "m 32s",
    change: "+12s vs last week",
    positive: true,
    icon: <Activity className="w-4 h-4" />,
    sparkline: [2.5, 3, 3.2, 3.8, 4.1, 3.9, 4.3, 4.5],
    accent: "text-emerald-400",
    glowColor: "rgba(52,211,153,0.10)",
  },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const fillPath = `M${pts[0]} ${pts.slice(1).map((p) => `L${p}`).join(" ")} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#grad-${color})`} />
      <polyline points={polyline} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const sparkColors: Record<string, string> = {
  "text-cyan-400": "#22d3ee",
  "text-violet-400": "#a78bfa",
  "text-amber-400": "#fbbf24",
  "text-emerald-400": "#34d399",
};

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({ target, suffix }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {target > 999 ? val.toLocaleString("en-US") : val}
      {suffix && <span className="text-base font-medium ml-0.5 text-white/50">{suffix}</span>}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    published: {
      label: "Published",
      icon: <CheckCircle2 className="w-3 h-3" />,
      cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    draft: {
      label: "Draft",
      icon: <Circle className="w-3 h-3" />,
      cls: "text-white/40 bg-white/[0.04] border-white/10",
    },
    archived: {
      label: "Archived",
      icon: <Clock className="w-3 h-3" />,
      cls: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  };
  const { label, icon, cls } = map[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cls}`}>
      {icon}
      {label}
    </span>
  );
}

// ─── Stat Card Component ──────────────────────────────────────────────────────

function StatCardComponent({ stat, index }: { stat: StatCard; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-5 bg-white/[0.025] border border-white/[0.07] backdrop-blur-sm overflow-hidden group cursor-default transition-colors duration-200 hover:bg-white/[0.04]"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 30% 30%, ${stat.glowColor}, transparent 70%)` }}
        animate={{ opacity: hovered ? 1 : 0.5 }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-black tracking-tight ${stat.accent}`}>
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            </p>
          </div>
          <div className={`p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] ${stat.accent}`}>
            {stat.icon}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            {stat.positive ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingUp className="w-3 h-3 text-amber-400" />
            )}
            <span className={`text-[11px] font-medium ${stat.positive ? "text-emerald-400" : "text-amber-400"}`}>
              {stat.change}
            </span>
          </div>
          <Sparkline data={stat.sparkline} color={sparkColors[stat.accent] || "#22d3ee"} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Projects Table ───────────────────────────────────────────────────────────

function ProjectsTable({ 
  projects, 
  onEdit, 
  onDelete 
}: { 
  projects: Project[], 
  onEdit: (p: Project) => void, 
  onDelete: (id: string) => void 
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold text-white/80">Recent Projects</h2>
          <p className="text-[11px] text-white/25 mt-0.5">{projects.length} total entries</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
          View all
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 px-6 py-2.5 border-b border-white/[0.04]">
        {["Project", "Category", "Status", "Views", "Updated", ""].map((h, i) => (
          <div
            key={i}
            className={`text-[10px] font-semibold uppercase tracking-widest text-white/20 ${
              i === 0 ? "col-span-4" :
              i === 1 ? "col-span-2" :
              i === 2 ? "col-span-2" :
              i === 3 ? "col-span-1" :
              i === 4 ? "col-span-2" :
              "col-span-1 text-right"
            }`}
          >
            {h}
          </div>
        ))}
      </div>

      <div className="divide-y divide-white/[0.04]">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="grid grid-cols-12 gap-4 px-6 py-3.5 hover:bg-white/[0.03] transition-colors group items-center"
          >
            <div className="col-span-4 min-w-0">
              <p className="text-sm font-medium text-white/70 group-hover:text-white/90 truncate transition-colors">
                {project.name}
              </p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {project.tech.map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <span className="text-xs text-white/35 font-medium">{project.category}</span>
            </div>

            <div className="col-span-2">
              <StatusBadge status={project.status} />
            </div>

            <div className="col-span-1">
              <span className="text-xs font-mono text-white/35">
                {project.views > 0 ? project.views.toLocaleString("en-US") : "—"}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-xs text-white/25">{project.updatedAt}</span>
            </div>

            <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button onClick={() => onEdit(project)} className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(project.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="px-6 py-8 text-center text-white/40 text-sm">
            Belum ada proyek yang ditambahkan.
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

function ActivityFeed() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const items = [
    { text: "Dashboard connected to Supabase", time: "Just now", dot: "bg-emerald-400" },
    { text: "Prisma schema updated", time: "2h ago", dot: "bg-cyan-400" },
    { text: "New message from recruiter", time: "1d ago", dot: "bg-white/20" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white/80">Activity</h2>
        <p className="text-[11px] text-white/25 mt-0.5">Recent events</p>
      </div>
      <div className="px-6 py-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
            className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0"
          >
            <div className="mt-1.5 flex-shrink-0">
              <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/55 leading-relaxed">{item.text}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Quick Stats Row ──────────────────────────────────────────────────────────

function QuickStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const items = [
    { label: "Database", value: "Supabase", color: "text-emerald-400" },
    { label: "ORM", value: "Prisma", color: "text-white/40" },
    { label: "Status", value: "Connected", color: "text-cyan-400" },
    { label: "Latency", value: "12ms", color: "text-violet-400" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: i * 0.07 }}
          className="px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex items-center justify-between"
        >
          <span className="text-[11px] text-white/30 font-medium">{item.label}</span>
          <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────


export default function DashboardClient({ 
  projectsData, 
  totalProjects, 
  totalViews,
  unreadMessages 
}: { 
  projectsData: Project[];
  totalProjects: number;
  totalViews: number;
  unreadMessages: number;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Failed to delete project.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Array STATS dimasukkan ke dalam komponen agar bisa menggunakan data dinamis
  const STATS: StatCard[] = [
    {
      label: "Total Projects",
      value: totalProjects,
      change: "Updated just now", 
      positive: true,
      icon: <FolderKanban className="w-4 h-4" />,
      sparkline: [4, 5, 5, 7, 8, 9, 10, Math.max(12, totalProjects)],
      accent: "text-cyan-400",
      glowColor: "rgba(6,182,212,0.12)",
    },
    {
      label: "Total Views",
      value: totalViews,
      change: "Across all projects", 
      positive: true,
      icon: <Eye className="w-4 h-4" />,
      sparkline: [8000, 10200, 9800, 14000, 17200, 19000, 22000, Math.max(24830, totalViews)],
      accent: "text-violet-400",
      glowColor: "rgba(139,92,246,0.12)",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      change: unreadMessages > 0 ? "Needs your attention" : "All caught up",
      positive: unreadMessages === 0, // Merah jika ada pesan, hijau jika kosong
      icon: <MessageSquare className="w-4 h-4" />,
      sparkline: [1, 2, 1, 3, 2, 4, 3, Math.max(3, unreadMessages)],
      accent: "text-amber-400",
      glowColor: "rgba(251,191,36,0.10)",
    },
    {
      label: "Avg. Session",
      value: 4,
      suffix: "m 32s",
      change: "+12s vs last week",
      positive: true,
      icon: <Activity className="w-4 h-4" />,
      sparkline: [2.5, 3, 3.2, 3.8, 4.1, 3.9, 4.3, 4.5],
      accent: "text-emerald-400",
      glowColor: "rgba(52,211,153,0.10)",
    },
  ];

  return (
    <DashboardLayout 
      breadcrumbs={[{ label: "Overview" }]}
      onAddClick={() => {
        setSelectedProject(null);
        setIsModalOpen(true);
      }}
    >
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }} 
        editData={selectedProject} 
      />

      <div className="px-5 py-6 max-w-[1400px] mx-auto space-y-6">

        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl font-bold text-white/90 tracking-tight">Overview</h1>
          <p suppressHydrationWarning className="text-xs text-white/30 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {STATS.map((stat, i) => (
            <StatCardComponent key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <QuickStats />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
          <ProjectsTable 
            projects={projectsData} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}