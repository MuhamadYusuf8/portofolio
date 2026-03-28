import { QrCode, Vote, Gamepad2, Globe, Code2, Database, Layers, Terminal, Zap, Shield } from "lucide-react";
import { Project, Skill } from "../types";

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Sistem Absensi Digital QR Code",
    subtitle: "Real-world school attendance system",
    description: "A production-grade digital attendance platform deployed in schools. Teachers generate dynamic QR codes per session; students scan to mark presence instantly. Includes admin dashboards, export to Excel, and fraud detection via session tokens.",
    tags: ["Next.js", "Laravel", "PostgreSQL", "QR Code", "Tailwind"],
    icon: <QrCode className="w-8 h-8" />,
    accent: "from-cyan-500/20 to-blue-600/20",
    glow: "shadow-cyan-500/20",
    size: "large",
    stats: [
      { label: "Students", value: "500+" },
      { label: "Accuracy", value: "99.8%" },
      { label: "Schools", value: "3" },
    ],
  },
  {
    id: 2,
    title: "E-Voting System",
    subtitle: "Secure & scalable election platform",
    description: "End-to-end encrypted voting system built for institutional elections. One-vote-per-user enforcement, real-time tally, audit logs, and role-based access for admins and voters.",
    tags: ["Laravel", "Vue.js", "MySQL", "Encryption"],
    icon: <Vote className="w-8 h-8" />,
    accent: "from-violet-500/20 to-purple-700/20",
    glow: "shadow-violet-500/20",
    size: "tall",
    stats: [
      { label: "Uptime", value: "100%" },
      { label: "Votes", value: "1200+" },
    ],
  },
  {
    id: 3,
    title: "Game Boy UI Replica",
    subtitle: "Creative frontend exploration",
    description: "Pixel-perfect Game Boy recreation in pure CSS and JavaScript — interactive buttons, working screen, sound effects, and playable Snake. A love letter to retro hardware.",
    tags: ["HTML", "CSS", "JavaScript", "Canvas API"],
    icon: <Gamepad2 className="w-8 h-8" />,
    accent: "from-emerald-500/20 to-teal-600/20",
    glow: "shadow-emerald-500/20",
    size: "wide",
  },
];

export const TECH_STACK: Skill[] = [
  { name: "Next.js", icon: <Globe className="w-4 h-4" /> },
  { name: "Laravel", icon: <Code2 className="w-4 h-4" /> },
  { name: "PostgreSQL", icon: <Database className="w-4 h-4" /> },
  { name: "Tailwind CSS", icon: <Layers className="w-4 h-4" /> },
  { name: "TypeScript", icon: <Terminal className="w-4 h-4" /> },
  { name: "Vue.js", icon: <Zap className="w-4 h-4" /> },
  { name: "MySQL", icon: <Database className="w-4 h-4" /> },
  { name: "Docker", icon: <Shield className="w-4 h-4" /> },
  { name: "React", icon: <Globe className="w-4 h-4" /> },
  { name: "Prisma", icon: <Layers className="w-4 h-4" /> },
];