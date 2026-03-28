import prisma from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const initialProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProjectsClient initialProjects={initialProjects} />;
}