import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

// Memaksa Next.js untuk selalu mengambil data terbaru (tidak di-cache)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Mengambil data proyek untuk tabel
  const dbProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 2. MENGHITUNG STATISTIK ASLI DARI DATABASE
  // A. Total Proyek
  const totalProjects = await prisma.project.count();
  
  // B. Total Views (Menjumlahkan semua angka di kolom views)
  const viewsAggregate = await prisma.project.aggregate({
    _sum: { views: true }
  });
  const totalViews = viewsAggregate._sum.views || 0;

  // C. Unread Messages (Menghitung pesan yang belum dibaca)
  const unreadMessages = await prisma.message.count({
    where: { isRead: false }
  });

  // 3. Memformat data database agar cocok dengan tabel UI
  const formattedProjects = dbProjects.map((project) => ({
    id: project.id,
    name: project.title, // 'name' dipakai oleh UI DashboardClient
    title: project.title, // 'title' ditambahkan agar aman untuk Modal
    slug: project.slug,
    description: project.description,
    content: project.content,
    imageUrl: project.imageUrl,       // <--- INI DITAMBAHKAN
    liveUrl: project.liveUrl,         // <--- INI DITAMBAHKAN
    githubUrl: project.githubUrl,     // <--- INI DITAMBAHKAN
    isPublished: project.isPublished, // <--- INI DITAMBAHKAN
    category: project.category, 
    status: project.isPublished ? "published" : "draft",
    views: project.views,
    updatedAt: project.updatedAt.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    }),
    tech: project.techStack || [],
  }));

  // 4. Melempar semua data ke Client Component
  return (
    <DashboardClient 
      projectsData={formattedProjects as any} 
      totalProjects={totalProjects}
      totalViews={totalViews}
      unreadMessages={unreadMessages}
    />
  );
}