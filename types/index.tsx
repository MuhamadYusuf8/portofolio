export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  accent: string;
  glow: string;
  size: "large" | "tall" | "wide" | "small";
  link?: string;
  stats?: { label: string; value: string }[];
}

export interface Skill {
  name: string;
  icon: React.ReactNode;
}