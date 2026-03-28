import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'share.google',
      },
      {
        protocol: 'https',
        hostname: 'd1ldvf68ux039x.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
      },
      {
        protocol: 'https',
        hostname: 'kldhqnxcjqsiutfjrpdu.supabase.co',
      },
      // 👇 TAMBAHKAN HOSTNAME GOOGLE DRIVE DI SINI
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
};

export default nextConfig;