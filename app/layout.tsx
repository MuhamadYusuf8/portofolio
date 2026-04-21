// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhamad Yusuf | Full-Stack Developer",
  description: "Portofolio Muhamad Yusuf, Mahasiswa Informatika President University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Hapus Navbar dan Footer dari sini, biarkan children saja */}
      <body className={`${inter.className} bg-[#050505] text-white antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}