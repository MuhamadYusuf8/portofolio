import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mencocokkan input dengan data di .env
        if (
          credentials &&
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Jika cocok, kembalikan data user (Admin)
          return { id: "1", name: "Muhamad Yusuf", email: credentials.email };
        }
        // Jika salah, tolak login
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login", // Mengarahkan user yang belum login ke halaman ini
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // Sesi login bertahan 30 hari
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };