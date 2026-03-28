import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillsClient from "@/components/Skills";

export const metadata = {
  title: "Skills & Arsenal | Muhamad Yusuf",
  description: "Technical ecosystem, frameworks, and tools I use to build digital products.",
};

export default function SkillsPage() {
  return (
    <main className="bg-transparent min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24">
        <SkillsClient />
      </div>
      <Footer />
    </main>
  );
}