import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsArchiveClient from "@/components/ProjectsArchiveClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects Archive | Muhamad Yusuf",
  description: "A complete repository of my web systems, freelance work, and digital explorations.",
};

export default async function ProjectsPage() {
  // Mengambil SEMUA proyek yang sudah di-publish
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-transparent min-h-screen pt-32">
      <Navbar />
      {/* Mengirim data ke komponen interaktif */}
      <ProjectsArchiveClient initialProjects={projects} />
      <Footer />
    </main>
  );
}