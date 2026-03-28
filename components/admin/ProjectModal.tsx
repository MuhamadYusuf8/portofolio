"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Type, Link as LinkIcon, Image as ImageIcon, Code, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Tipe data untuk form
interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any | null; // Berisi data jika sedang mode Edit, null jika Add New
}

const DEFAULT_FORM = {
  title: "",
  slug: "",
  description: "",
  content: "",
  imageUrl: "",
  techStack: "", // Akan di-split jadi array saat disubmit
  category: "FEATURED",
  githubUrl: "",
  liveUrl: "",
  isPublished: false,
};

export default function ProjectModal({ isOpen, onClose, editData }: ProjectModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Efek: Jika modal dibuka, isi form dengan editData (jika ada) atau kosongkan
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // Pemetaan ketat: Memastikan tidak ada nilai 'null' atau 'undefined' yang masuk ke input
        setFormData({
          title: editData.title || editData.name || "", // Menangkap 'name' dari Overview atau 'title' dari Projects
          slug: editData.slug || "",
          description: editData.description || "",
          content: editData.content || "",
          imageUrl: editData.imageUrl || "",
          techStack: editData.techStack ? editData.techStack.join(", ") : (editData.tech ? editData.tech.join(", ") : ""),
          category: editData.category || "FEATURED",
          githubUrl: editData.githubUrl || "",
          liveUrl: editData.liveUrl || "",
          isPublished: editData.isPublished !== undefined ? editData.isPublished : (editData.status === "published"),
        });
      } else {
        setFormData(DEFAULT_FORM);
      }
      setError("");
    }
  }, [isOpen, editData]);

  // Efek: Auto-generate Slug berdasarkan Title (hanya untuk Add New)
  useEffect(() => {
    if (!editData && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Siapkan payload, ubah techStack string menjadi array
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((s: string) => s.trim()).filter(Boolean),
      };

      // Tentukan URL dan Method (POST untuk Add, PATCH untuk Edit)
      const url = editData ? `/api/projects/${editData.id}` : `/api/projects`;
      const method = editData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan proyek");
      }

      router.refresh(); // Segarkan data tabel di belakang
      onClose(); // Tutup modal
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Latar Belakang Gelap (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel Slide-out dari Kanan */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {editData ? "Edit Project" : "Add New Project"}
                </h2>
                <p className="text-xs text-white/40 mt-1">
                  {editData ? "Perbarui detail portofoliomu." : "Tambahkan karya terbaikmu."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form id="project-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Judul & Slug */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Project Title</label>
                    <div className="relative">
                      <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="e.g. E-Voting System" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">URL Slug</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white/70 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="e-voting-system" />
                    </div>
                  </div>
                </div>

                {/* Kategori & Tech Stack */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none">
                      <option value="FEATURED">Featured</option>
                      <option value="EXPLORATION">Exploration</option>
                      <option value="FREELANCE">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Tech Stack</label>
                    <div className="relative">
                      <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input required type="text" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Next.js, Prisma, CSS" />
                    </div>
                  </div>
                </div>

                {/* Deskripsi Pendek */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none" placeholder="Deskripsi singkat tentang proyek ini..." />
                </div>

                {/* Gambar & Tautan */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Live URL (Opsional)</label>
                      <input type="text" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">GitHub URL (Opsional)</label>
                      <input type="text" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="https://github.com/..." />
                    </div>
                  </div>
                </div>

                {/* Status Publish */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-semibold text-white">Publish Project</p>
                    <p className="text-xs text-white/40">Tampilkan proyek ini di halaman utamamu.</p>
                  </div>
                  <button type="button" onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })} className={`transition-colors ${formData.isPublished ? "text-emerald-400" : "text-white/30"}`}>
                    {formData.isPublished ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer / Aksi */}
            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-3">
              <button onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                Batal
              </button>
              <button type="submit" form="project-form" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors disabled:opacity-50">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editData ? "Simpan Perubahan" : "Buat Proyek"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}