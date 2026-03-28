"use client";

import { motion } from "framer-motion";

export default function PlasmaMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />
      <motion.div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 w-[400px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute bottom-0 -right-32 w-[500px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(79,70,229,0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />
    </div>
  );
}