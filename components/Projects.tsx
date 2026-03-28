"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Projects({ initialProjects }: { initialProjects: any[] }) {
  return (
    <section id="projects" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-[1200px]">
        {/* Header & View All Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest">Selected Works</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-white tracking-tighter"
            >
              Karya <span className="text-white/40">Unggulan.</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/project" 
              className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 text-sm font-semibold text-white"
            >
              Lihat Semua Arsip Proyek 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
            </Link>
          </motion.div>
        </div>

        {/* Grid 4 Proyek Teaser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initialProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-500 flex flex-col"
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
                  <div className="w-full h-full bg-white/[0.02] flex items-center justify-center text-white/20 font-mono text-sm">
                    No Preview
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {project.liveUrl && (
                    <Link href={project.liveUrl} target="_blank" className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Content Box */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-2 py-1 rounded bg-cyan-400/10 border border-cyan-400/20">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/40 text-sm line-clamp-2 leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>
                <Link 
                  href={`/projects/${project.slug}`} 
                  className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-cyan-400 transition-colors w-fit"
                >
                  Baca Case Study <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}