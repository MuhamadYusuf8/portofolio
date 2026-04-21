"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Tutup menu saat halaman berpindah
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/project" },
    { name: "Skills", href: "/skills" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-5 pointer-events-none px-4"
      >
        <div className={`pointer-events-auto flex items-center gap-1 px-3 md:px-4 py-2.5 rounded-2xl transition-all duration-500 w-full max-w-xl md:w-auto ${
          scrolled
            ? "bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40"
            : "border border-transparent"
        }`}>

          {/* Logo */}
          <Link href="/" className="text-white/90 font-bold text-sm mr-auto md:mr-4 tracking-tight font-mono hover:text-white transition-colors">
            MY<span className="text-cyan-400">.</span>dev
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 text-sm rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? "text-white bg-white/[0.08]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link href="/contact" className="ml-2 px-4 py-1.5 text-sm font-semibold text-black bg-white rounded-xl hover:bg-cyan-400 transition-all duration-200">
              Hire Me
            </Link>
          </div>

          {/* Mobile: Hire Me + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/contact" className="px-3 py-1.5 text-xs font-semibold text-black bg-white rounded-xl hover:bg-cyan-400 transition-all duration-200">
              Hire Me
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-50 rounded-2xl overflow-hidden md:hidden"
              style={{
                background: "rgba(10,10,10,0.96)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(40px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div className="p-3 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "text-white bg-white/[0.08] border border-white/10"
                            : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        {link.name}
                        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-2 pb-1 px-1">
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-xl text-sm font-bold text-black bg-white hover:bg-cyan-400 transition-all duration-200"
                  >
                    Hire Me
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}