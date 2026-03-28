import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { name, email, message } = requestBody;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    // MEMASUKKAN DATA SESUAI KOLOM SUPABASE
    const newMessage = await prisma.message.create({
      data: { 
        senderName: name, 
        senderEmail: email, 
        body: message 
      },
    });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error POST Message:", error);
    return NextResponse.json({ success: false, message: "Gagal mengirim pesan" }, { status: 500 });
  }
}