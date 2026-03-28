import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Tangkap SEMUA data perubahan
    const { 
      title, slug, description, content, 
      imageUrl, liveUrl, githubUrl,
      techStack, category, isPublished 
    } = body;

    // Update data di database
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        imageUrl,
        liveUrl,
        githubUrl,
        techStack,
        category,
        isPublished
      },
    });

    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("Error PATCH Project:", error);
    return NextResponse.json({ success: false, message: "Gagal mengupdate proyek" }, { status: 500 });
  }
}

// Fungsi DELETE tetap dipertahankan
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Proyek dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus proyek" }, { status: 500 });
  }
}