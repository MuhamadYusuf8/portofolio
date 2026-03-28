import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Story from "@/components/Story";

export const metadata = {
  title: "About | Muhamad Yusuf",
  description: "Arsip digital tentang pertumbuhan, kedisiplinan, dan pengejaran akan penguasaan teknologi.",
};

export default function AboutPage() {
  return (
    <main className="bg-transparent min-h-screen pt-20">
      <Navbar />
      
      {/* Komponen timeline SVG raksasa kita sekarang punya halamannya sendiri! */}
      <Story />
      
      <Footer />
    </main>
  );
}