import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Hanya ambil 4 proyek terbaru yang dipublish untuk "teaser"
  const featuredProjects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 4, // <-- Ini kunci perampingannya!
  });

  return (
    <main className="bg-[#050505] min-h-screen">
      <Navbar />
      
      {/* 1. First Impression */}
      <Hero />

      {/* 2. Teaser Proyek (Hanya 4 terbaik/terbaru) */}
      <Projects initialProjects={featuredProjects} />

      {/* 3. Call to Action */}
      <Contact />

      <Footer />
    </main>
  );
}