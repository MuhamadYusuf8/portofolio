"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  onAddClick?: () => void; // Prop baru untuk jembatan trigger modal
}

export default function DashboardLayout({ children, breadcrumbs, onAddClick }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top-left cyan glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #06b6d4, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom-right accent */}
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main panel */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          breadcrumbs={breadcrumbs}
          onAddProjectClick={onAddClick} // Meneruskan prop onAddClick ke TopBar
        />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== "undefined" ? window.location.pathname : "page"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}