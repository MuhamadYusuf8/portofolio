"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["ALL", "FEATURED", "FREELANCE", "EXPLORATION"];

export default function ProjectsArchiveClient({ initialProjects }: { initialProjects: any[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Logika Filter
  const filteredProjects = initialProjects.filter((project) => 
    activeCategory === "ALL" ? true : project.category === activeCategory
  );

  return (
    <section className="min-h-screen pb-24">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/10">
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest">Digital Archive</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6"
            >
              All <span className="text-white/40">Projects.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg leading-relaxed"
            >
              Kumpulan lengkap eksplorasi digital, studi kasus, dan sistem produksi yang telah saya bangun.
            </motion.p>
          </div>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  isActive ? "text-black" : "text-white/40 hover:text-white bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat === "ALL" ? "All Works" : cat}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid with AnimatePresence for smooth filtering */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all duration-500 flex flex-col"
              >
                {/* Image Container */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center text-white/10">
                      No Preview
                    </div>
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                     {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" className="p-3 rounded-full bg-white text-black hover:bg-cyan-400 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                     )}
                     {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank" className="p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/10 transition-colors">
                        <Github className="w-5 h-5" />
                      </Link>
                     )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-1 rounded bg-cyan-400/10 border border-cyan-400/20">
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      {project.techStack.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="text-[10px] text-white/30 font-mono italic">#{tech}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/40 text-sm line-clamp-2 leading-relaxed mb-8 flex-1">
                    {project.description}
                  </p>
                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all w-fit"
                  >
                    View Case Study <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State jika filter kosong */}
          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
            >
              <p className="text-white/30 font-mono text-sm">Belum ada proyek di kategori ini.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}