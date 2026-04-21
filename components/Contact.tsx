"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, Variants } from "framer-motion";
import { Send, CheckCircle, Loader2, Mail } from "lucide-react";

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type FormState = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const [orb, setOrb] = useState({ x: 0, y: 0, visible: false });

  // 1. Tambahkan state untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: "",
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = formRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    setOrb({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  // 2. Fungsi handleSubmit yang sungguhan
  const handleSubmit = async () => {
    // Cegah pengiriman jika data kosong
    if (!formData.name || !formData.email || !formData.message) {
      alert("Mohon lengkapi Nama, Email, dan Pesan.");
      return;
    }

    setFormState("loading");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormState("success");
        // Kosongkan form setelah berhasil
        setFormData({ name: "", email: "", project: "", message: "" });
        
        // Kembalikan tombol ke kondisi semula setelah 4 detik
        setTimeout(() => setFormState("idle"), 4000);
      } else {
        setFormState("error");
        alert("Gagal mengirim pesan. Silakan coba lagi.");
        setTimeout(() => setFormState("idle"), 3000);
      }
    } catch (error) {
      console.error(error);
      setFormState("error");
      alert("Terjadi kesalahan jaringan.");
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { id: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
    { id: "project", label: "Project Type", type: "text", placeholder: "Full-Stack Web / Consulting" },
  ];

  return (
    <section
      id="contact"
      className="relative min-h-screen bg-transparent overflow-hidden flex items-center justify-center py-20 px-4 sm:px-6"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />
        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <motion.div
          custom={0}
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px bg-cyan-400/60" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400/70">
            Let&apos;s Collaborate
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.92] tracking-[-0.04em] text-white mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Have an idea
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            worth building?
          </span>
        </motion.h2>

        <motion.p
          custom={2}
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-white/30 text-base sm:text-lg font-light tracking-wide mb-10 sm:mb-16 max-w-md"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Drop me a message. I respond to every serious inquiry within 24 hours.
        </motion.p>

        <motion.div
          custom={3}
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          ref={formRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setOrb((o) => ({ ...o, visible: false }))}
          className="relative rounded-2xl p-6 sm:p-10 md:p-14 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)" }}
          />

          <AnimatePresence>
            {orb.visible && (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: springX,
                  top: springY,
                  x: "-50%",
                  y: "-50%",
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 grid md:grid-cols-2 gap-x-12 gap-y-0">
            <div className="space-y-10">
              {fields.map((field) => (
                <div key={field.id} className="relative">
                  <label
                    htmlFor={field.id}
                    className="block text-[10px] font-mono tracking-[0.25em] uppercase mb-3"
                    style={{
                      color: focused === field.id ? "#06b6d4" : "rgba(255,255,255,0.3)",
                      transition: "color 0.3s",
                    }}
                  >
                    {field.label}
                  </label>
                  {/* 3. Menghubungkan input dengan state formData */}
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    onFocus={() => setFocused(field.id)}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent text-white text-base pb-3 outline-none placeholder:text-white/10"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      borderBottom: "1px solid",
                      borderColor: focused === field.id ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.07)",
                      transition: "border-color 0.3s",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-px"
                    style={{ background: "linear-gradient(90deg, #06b6d4, #8b5cf6)" }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: focused === field.id ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between mt-10 md:mt-0">
              <div className="relative">
                <label
                  htmlFor="message"
                  className="block text-[10px] font-mono tracking-[0.25em] uppercase mb-3"
                  style={{
                    color: focused === "message" ? "#06b6d4" : "rgba(255,255,255,0.3)",
                    transition: "color 0.3s",
                  }}
                >
                  Message
                </label>
                {/* 4. Menghubungkan textarea dengan state formData */}
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell me about your project, timeline, and budget..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent text-white text-base pb-3 outline-none resize-none placeholder:text-white/10"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    borderBottom: "1px solid",
                    borderColor: focused === "message" ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.07)",
                    transition: "border-color 0.3s",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-px"
                  style={{ background: "linear-gradient(90deg, #06b6d4, #8b5cf6)" }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: focused === "message" ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={formState === "loading" || formState === "success"}
                className="relative mt-10 self-start overflow-hidden rounded-xl px-8 py-4 font-mono text-sm tracking-widest uppercase"
                style={{
                  background: formState === "success" ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: formState === "success" ? "#06b6d4" : "white",
                }}
                whileHover={formState === "idle" ? { scale: 1.02, borderColor: "rgba(6,182,212,0.3)" } : {}}
                whileTap={formState === "idle" ? { scale: 0.97 } : {}}
                transition={{ duration: 0.2 }}
              >
                {formState === "idle" && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(6,182,212,0.08) 50%, transparent 60%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {formState === "idle" && (
                    <motion.span
                      key="idle"
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <Send size={14} />
                      Send Message
                    </motion.span>
                  )}
                  {formState === "loading" && (
                    <motion.span
                      key="loading"
                      className="flex items-center gap-3 text-cyan-400"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Loader2 size={14} />
                      </motion.div>
                      Sending...
                    </motion.span>
                  )}
                  {formState === "success" && (
                    <motion.span
                      key="success"
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CheckCircle size={14} />
                      Message Sent
                    </motion.span>
                  )}
                  {formState === "error" && (
                    <motion.span
                      key="error"
                      className="flex items-center gap-3 text-red-400"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Failed to Send
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          <div className="absolute top-6 right-8 flex items-center gap-2 opacity-20">
            <Mail size={12} className="text-cyan-400" />
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
              Encrypted
            </span>
          </div>
        </motion.div>

        <motion.div
          custom={4}
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 flex items-center gap-3"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase">
            Available for new projects — 2026
          </span>
        </motion.div>
      </div>
    </section>
  );
}