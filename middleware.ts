import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Fungsi middleware eksplisit yang diwajibkan oleh Next.js
export async function middleware(req: NextRequest) {
  // Mengecek apakah user memiliki token (sudah login)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Jika tidak ada token dan mencoba mengakses /dashboard, tendang ke /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Jika aman, persilakan masuk
  return NextResponse.next();
}

// Menentukan rute mana yang dijaga oleh satpam ini
export const config = {
  matcher: ['/dashboard/:path*'],
};