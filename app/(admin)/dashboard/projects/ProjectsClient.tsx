"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  FolderKanban,
  Layers,
  X,
  AlertTriangle,
  ArrowUpDown,
  Star,
  Compass,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import DashboardLayout from "@/components/admin/DashboardLayout";
import ProjectModal from "@/components/admin/ProjectModal"; 

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "FEATURED" | "EXPLORATION" | "FREELANCE";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  imageUrl?: string | null;
  techStack: string[];
  category: Category;
  liveUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  Category | "ALL",
  { label: string; icon: React.ReactNode; accent: string; bg: string; border: string; dot: string }
> = {
  ALL: {
    label: "All Projects",
    icon: <FolderKanban className="w-3.5 h-3.5" />,
    accent: "text-white/60",
    bg: "bg-white/[0.05]",
    border: "border-white/[0.08]",
    dot: "bg-white/30",
  },
  FEATURED: {
    label: "Featured",
    icon: <Star className="w-3.5 h-3.5" />,
    accent: "text-cyan-400",
    bg: "bg-cyan-500/[0.08]",
    border: "border-cyan-500/[0.18]",
    dot: "bg-cyan-400",
  },
  EXPLORATION: {
    label: "Exploration",
    icon: <Compass className="w-3.5 h-3.5" />,
    accent: "text-violet-400",
    bg: "bg-violet-500/[0.08]",
    border: "border-violet-500/[0.18]",
    dot: "bg-violet-400",
  },
  FREELANCE: {
    label: "Freelance",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    accent: "text-amber-400",
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/[0.18]",
    dot: "bg-amber-400",
  },
};

const FILTER_TABS: (Category | "ALL")[] = ["ALL", "FEATURED", "EXPLORATION", "FREELANCE"];

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  project,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  project: Project;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClick={onCancel}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[400px] rounded-2xl border border-white/[0.07] overflow-hidden"
          style={{
            background: "rgba(10,10,10,0.95)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.7)",
          }}
        >
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.45), transparent)" }}
          />
          <div className="p-7">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-bold text-white/90 tracking-tight mb-1.5">Delete Project</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-1">
              Are you sure you want to delete <span className="text-white/70 font-medium">"{project.title}"</span>?
            </p>
            <p className="text-xs text-white/25 mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 h-10 rounded-xl text-sm font-medium text-white/50 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:text-white/70 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ boxShadow: "0 0 16px rgba(239,68,68,0.2)" }}
              >
                {isDeleting ? (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <><Trash2 className="w-3.5 h-3.5" />Delete</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: Category }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.accent} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        isPublished ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/[0.18]" : "text-amber-400 bg-amber-500/[0.06] border-amber-500/[0.15]"
      }`}
    >
      <motion.span
        className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-400" : "bg-amber-400"}`}
        animate={isPublished ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

// ─── Tech Stack Pills ─────────────────────────────────────────────────────────

function TechPills({ stack }: { stack: string[] }) {
  const visible = stack.slice(0, 3);
  const overflow = stack.length - 3;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {visible.map((tech, index) => (
        <span key={`${tech}-${index}`} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/[0.04] border border-white/[0.07] text-white/45 hover:text-white/70 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-150">
          {tech}
        </span>
      ))}
      {overflow > 0 && <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-cyan-500/[0.06] border border-cyan-500/[0.12] text-cyan-500/70">+{overflow}</span>}
    </div>
  );
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function Thumbnail({ imageUrl, title }: { imageUrl?: string | null; title: string }) {
  const initials = title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (imageUrl) {
    return (
      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/[0.07] flex-shrink-0">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/[0.07] flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-white/50 font-mono">{initials}</span>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isFiltered, onClear, onAdd }: { isFiltered: boolean; onClear: () => void; onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", filter: "blur(20px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
          {isFiltered ? <Search className="w-8 h-8 text-white/20" /> : <FolderKanban className="w-8 h-8 text-white/20" />}
        </div>
      </div>
      <h3 className="text-base font-semibold text-white/60 mb-2 tracking-tight">
        {isFiltered ? "No results found" : "No projects yet"}
      </h3>
      <p className="text-sm text-white/25 max-w-xs leading-relaxed mb-6">
        {isFiltered ? "Try adjusting your search or filter to find what you're looking for." : "Get started by creating your first project. It'll appear here once added."}
      </p>
      {isFiltered ? (
        <button onClick={onClear} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/50 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:text-white/70 transition-all duration-150">
          <X className="w-3.5 h-3.5" /> Clear filters
        </button>
      ) : (
        <button onClick={onAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors duration-150">
          <Plus className="w-4 h-4" /> Add First Project
        </button>
      )}
    </motion.div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatsRow({ projects }: { projects: Project[] }) {
  const total = projects.length;
  const published = projects.filter((p) => p.isPublished).length;
  const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
  const stats = [
    { label: "Total", value: total, icon: <FolderKanban className="w-3.5 h-3.5" />, color: "text-white/50" },
    { label: "Published", value: published, icon: <TrendingUp className="w-3.5 h-3.5" />, color: "text-emerald-400" },
    { label: "Drafts", value: total - published, icon: <Layers className="w-3.5 h-3.5" />, color: "text-amber-400" },
    { label: "Total Views", value: totalViews.toLocaleString(), icon: <Eye className="w-3.5 h-3.5" />, color: "text-cyan-400" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05] group hover:bg-white/[0.04] transition-colors duration-150">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/20 mb-0.5">{stat.label}</p>
            <p className={`text-lg font-black tracking-tight font-mono ${stat.color}`}>{stat.value}</p>
          </div>
          <span className={`${stat.color} opacity-40 group-hover:opacity-70 transition-opacity`}>{stat.icon}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function TableRow({
  project,
  index,
  onDeleteClick,
  onEditClick,
}: {
  project: Project;
  index: number;
  onDeleteClick: (p: Project) => void;
  onEditClick: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group border-b border-white/[0.04] last:border-0 transition-colors duration-150 hover:bg-white/[0.028]"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <Thumbnail imageUrl={project.imageUrl} title={project.title} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-white/75 group-hover:text-white/90 transition-colors truncate leading-snug max-w-[180px]">
                {project.title}
              </p>
              {project.isFeatured && (
                <span title="Karya Unggulan di Homepage" className="flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/25 font-mono mt-0.5 truncate max-w-[200px]">
              /{project.slug}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell"><CategoryBadge category={project.category} /></td>
      <td className="px-4 py-3.5 hidden md:table-cell"><StatusBadge isPublished={project.isPublished} /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell"><TechPills stack={project.techStack} /></td>
      <td className="px-4 py-3.5 hidden xl:table-cell">
        <div className="flex items-center gap-1.5"><Eye className="w-3 h-3 text-white/20" /><span className="text-xs font-mono text-white/35">{project.views.toLocaleString()}</span></div>
      </td>
      <td className="px-4 py-3.5 hidden xl:table-cell">
        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-white/20" /><span className="text-xs text-white/25">{new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
      </td>
      <td className="px-4 py-3.5">
        <div className={`flex items-center justify-end gap-1 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={() => onEditClick(project)}
            className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150"
            title="Edit project"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteClick(project)}
            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category | "ALL">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<"createdAt" | "views" | "title">("createdAt");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    let list = [...initialProjects];
    if (activeFilter !== "ALL") list = list.filter((p) => p.category === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.techStack.some((t) => t.toLowerCase().includes(q)));
    }
    list.sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [initialProjects, search, activeFilter, sortBy]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = search.trim().length > 0 || activeFilter !== "ALL";

  return (
    <DashboardLayout 
      breadcrumbs={[{ label: "Projects" }]}
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

      <div className="px-5 py-7 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/15">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-white/90">Projects Management</h1>
            </div>
            <p className="text-sm text-white/30 ml-0.5">Manage, publish, and organize your portfolio projects.</p>
          </div>
        </motion.div>

        <StatsRow projects={initialProjects} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
            <input type="text" placeholder="Search projects, slugs, tech..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-9 rounded-xl text-sm bg-white/[0.03] border border-white/[0.07] text-white/70 placeholder-white/20 outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all duration-200 font-light" style={{ backdropFilter: "blur(16px)" }} />
            <AnimatePresence>
              {search && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(16px)" }}>
            {FILTER_TABS.map((tab) => {
              const cfg = CATEGORY_CONFIG[tab];
              const active = activeFilter === tab;
              return (
                <button key={tab} onClick={() => setActiveFilter(tab)} className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap ${active ? cfg.accent : "text-white/30 hover:text-white/60"}`}>
                  {active && <motion.div layoutId="filterPill" className={`absolute inset-0 rounded-lg ${cfg.bg} border ${cfg.border}`} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span className="relative z-10">{cfg.icon}</span>
                  <span className="relative z-10 hidden sm:inline">{tab === "ALL" ? "All" : cfg.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="h-10 pl-3 pr-8 rounded-xl text-xs font-medium bg-white/[0.03] border border-white/[0.07] text-white/45 outline-none focus:border-white/[0.12] transition-all duration-150 appearance-none cursor-pointer" style={{ backdropFilter: "blur(16px)" }}>
              <option value="createdAt">Latest</option>
              <option value="views">Most Viewed</option>
              <option value="title">A–Z</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="relative rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.018)", backdropFilter: "blur(30px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 24px 60px rgba(0,0,0,0.45)" }}>
          <div className="absolute top-0 left-10 right-10 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(139,92,246,0.2), transparent)" }} />

          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {[
                      { label: "Project", cls: "pl-5 pr-4 w-[260px]" },
                      { label: "Category", cls: "px-4 hidden sm:table-cell" },
                      { label: "Status", cls: "px-4 hidden md:table-cell" },
                      { label: "Tech Stack", cls: "px-4 hidden lg:table-cell" },
                      { label: "Views", cls: "px-4 hidden xl:table-cell" },
                      { label: "Created", cls: "px-4 hidden xl:table-cell" },
                      { label: "", cls: "px-4 w-20" },
                    ].map((col) => (
                      <th key={col.label} className={`${col.cls} py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/20`}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((project, i) => (
                      <TableRow
                        key={project.id}
                        project={project}
                        index={i}
                        onDeleteClick={setDeleteTarget}
                        onEditClick={(p) => {
                          setSelectedProject(p);
                          setIsModalOpen(true);
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
                <p className="text-[11px] text-white/20">Showing <span className="text-white/40 font-medium">{filtered.length}</span> of <span className="text-white/40 font-medium">{initialProjects.length}</span> projects</p>
                {isFiltered && <button onClick={() => { setSearch(""); setActiveFilter("ALL"); }} className="text-[11px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1"><X className="w-3 h-3" />Clear filters</button>}
              </div>
            </div>
          ) : (
            <EmptyState 
              isFiltered={isFiltered} 
              onClear={() => { setSearch(""); setActiveFilter("ALL"); }} 
              onAdd={() => { setSelectedProject(null); setIsModalOpen(true); }}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {deleteTarget && <DeleteModal project={deleteTarget} onConfirm={handleDelete} onCancel={() => !isDeleting && setDeleteTarget(null)} isDeleting={isDeleting} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}