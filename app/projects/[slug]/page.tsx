import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetailClient";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: { 
      slug,
      isPublished: true 
    },
  });

  if (!project) {
    notFound();
  }

  const projectData = {
    title: project.title,
    description: project.description,
    content: project.content,
    imageUrl: project.imageUrl,
    techStack: project.techStack,
    category: project.category,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    createdAt: project.createdAt,
    role: "Lead Full-Stack Developer"
  };

  return (
    // Menghapus Navbar di sini agar tampilan lebih bersih (High-End feel)
    <main className="bg-[#050505] min-h-screen">
      <ProjectDetailClient data={projectData} />
      <Footer />
    </main>
  );
}