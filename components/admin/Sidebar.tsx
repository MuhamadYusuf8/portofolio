"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview",  href: "/dashboard",          icon: LayoutDashboard },
  { label: "Projects",  href: "/dashboard/projects",  icon: FolderKanban },
  { label: "Messages",  href: "/dashboard/messages",  icon: MessageSquare,  badge: 3 },
  { label: "Settings",  href: "/dashboard/settings",  icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarWidth = collapsed ? "w-[64px]" : "w-[220px]";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center h-14 px-4 border-b border-white/[0.06] flex-shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
            <Zap className="w-3.5 h-3.5 text-black" fill="currentColor" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-bold text-white tracking-tight overflow-hidden whitespace-nowrap font-mono"
              >
                MY<span className="text-cyan-400">.</span>admin
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle — desktop only */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex text-white/30 hover:text-white/70 transition-colors p-1 rounded-md hover:bg-white/[0.06]"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="hidden lg:flex mx-auto mt-3 text-white/30 hover:text-white/70 transition-colors p-1.5 rounded-md hover:bg-white/[0.06]"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onMobileClose}>
              <motion.div
                className={`relative flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-150 group ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                }`}
                whileHover={{ x: collapsed ? 0 : 2 }}
                transition={{ duration: 0.15 }}
              >
                {/* Active indicator bar */}
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-cyan-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative flex-shrink-0">
                  <Icon className="w-4 h-4" />
                  {item.badge && collapsed && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-500 text-black text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto flex-shrink-0 px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 border-t border-white/[0.06] pt-3 space-y-0.5">
        {/* User avatar */}
        <div
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md">
            MY
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-white/80 whitespace-nowrap leading-none mb-0.5">
                  Muhamad Yusuf
                </p>
                <p className="text-[10px] text-white/30 whitespace-nowrap leading-none">
                  Administrator
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-colors duration-150 group ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 bg-black border-r border-white/[0.06] overflow-hidden z-30"
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[220px] bg-black border-r border-white/[0.06] flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}