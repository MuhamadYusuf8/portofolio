"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); // Mendeteksi URL saat ini untuk efek "Menu Aktif"

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Daftar menu disesuaikan untuk sistem multi-halaman
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/project" },
    { name: "Skills", href: "/skills" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      // Tambahkan pointer-events-none di container luar agar tidak menghalangi klik di area transparan
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 pointer-events-none"
    >
      {/* Kembalikan pointer-events-auto di dalam kotak menu agar tombol bisa diklik */}
      <div className={`pointer-events-auto flex items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-500 ${
        scrolled 
          ? "bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40" 
          : "border border-transparent"
      }`}>
        
        {/* Logo diklik akan mengarah ke Home (/) */}
        <Link href="/" className="text-white/90 font-bold text-sm mr-4 tracking-tight font-mono hover:text-white transition-colors">
          MY<span className="text-cyan-400">.</span>dev
        </Link>
        
        {navLinks.map((link) => {
          const isActive = pathname === link.href; // Cek apakah URL sama dengan link menu
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`px-4 py-1.5 text-sm rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? "text-white bg-white/[0.08]" // Nyala terang jika sedang di halaman tersebut
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]" // Redup jika tidak aktif
              }`}
            >
              {link.name}
            </Link>
          );
        })}
        
        {/* Tombol Hire Me diarahkan ke halaman contact */}
        <Link href="/contact" className="ml-2 px-4 py-1.5 text-sm font-semibold text-black bg-white rounded-xl hover:bg-cyan-400 transition-all duration-200">
          Hire Me
        </Link>
      </div>
    </motion.nav>
  );
}