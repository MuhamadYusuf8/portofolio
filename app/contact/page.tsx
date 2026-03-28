import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Metadata untuk SEO & Link Sharing (Premium detail)
export const metadata = {
  title: "Contact | Muhamad Yusuf",
  description: "Have an idea worth building? Drop me a message. I respond to every serious inquiry within 24 hours.",
};

export default function ContactPage() {
  return (
    // Background hitam pekat untuk mempertahankan ilusi premium
    <main className="bg-[#050505] min-h-screen">
      <Navbar />
      
      {/* Kita berikan sedikit padding top tambahan (pt-10) di sini 
        agar Navbar yang fixed tidak menabrak judul Contact
      */}
      <div className="pt-10">
        {/* Memanggil komponen mahakarya yang sudah kita buat */}
        <Contact />
      </div>

      <Footer />
    </main>
  );
}