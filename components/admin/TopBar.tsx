"use client";

import { useRef, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { Menu, Plus, Bell, ChevronRight } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
  breadcrumbs?: { label: string; href?: string }[];
  onAddProjectClick?: () => void; // Properti baru untuk memicu Modal
}

// Menambahkan onClick ke props MagneticButton
function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 400, damping: 25 });
  const y = useSpring(0, { stiffness: 400, damping: 25 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
      y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [x, y]);

  return (
    <motion.button ref={ref} style={{ x, y }} className={className} onClick={onClick}>
      {children}
    </motion.button>
  );
}

export default function TopBar({ onMenuClick, breadcrumbs = [{ label: "Overview" }], onAddProjectClick }: TopBarProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-5 bg-black/80 backdrop-blur-xl border-b border-white/[0.06] flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden flex-shrink-0 p-1.5 rounded-md text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors">
          <Menu className="w-4 h-4" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-white/25 font-medium hidden sm:block">Dashboard</span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0 hidden sm:block" />
              <span className={`font-medium truncate ${i === breadcrumbs.length - 1 ? "text-white/80" : "text-white/35"}`}>
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Center greeting */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
        <p className="text-sm text-white/30 font-medium whitespace-nowrap">
          {greeting}, <span className="text-white/70 font-semibold">Yusuf</span>
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="relative p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </button>

        {/* Tombol yang akan memanggil fungsi onAddProjectClick */}
        <MagneticButton onClick={onAddProjectClick} className="group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors duration-150 overflow-hidden shadow-lg shadow-cyan-500/20">
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)" }} />
          <Plus className="w-3.5 h-3.5 relative z-10 group-hover:rotate-90 transition-transform duration-200" />
          <span className="relative z-10 hidden sm:inline">Add Project</span>
        </MagneticButton>
      </div>
    </header>
  );
}