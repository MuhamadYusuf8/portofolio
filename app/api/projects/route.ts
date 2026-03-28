import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Kita tangkap SEMUA data dari form, termasuk URL
    const { 
      title, slug, description, content, 
      imageUrl, liveUrl, githubUrl, // Ini yang tadinya tertinggal
      techStack, category, isPublished 
    } = body;

    // Simpan ke database Supabase
    const newProject = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        imageUrl,    // Simpan Image URL
        liveUrl,     // Simpan Live URL
        githubUrl,   // Simpan Github URL
        techStack,
        category,
        isPublished
      },
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error POST Project:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan proyek" }, { status: 500 });
  }
}