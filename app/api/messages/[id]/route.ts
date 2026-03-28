import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH: Untuk mengubah status isRead menjadi true
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true, data: updatedMessage });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengupdate pesan" }, { status: 500 });
  }
}

// DELETE: Untuk menghapus pesan
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.message.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Pesan dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus pesan" }, { status: 500 });
  }
}