"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Trash2, Clock } from "lucide-react";
import DashboardLayout from "@/components/admin/DashboardLayout";

// TIPE DATA DISESUAIKAN DENGAN SUPABASE
type Message = {
  id: string;
  senderName: string; 
  senderEmail: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
};

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const handleRead = async (msg: Message) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      await fetch(`/api/messages/${msg.id}`, { method: "PATCH" });
      router.refresh(); 
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Hapus pesan ini?")) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
      await fetch(`/api/messages/${id}`, { method: "DELETE" });
      router.refresh();
    }
  };

  return (
    <DashboardLayout breadcrumbs={[{ label: "Messages" }]}>
      <div className="px-5 py-6 max-w-[1400px] mx-auto h-[calc(100vh-100px)] flex flex-col">
        
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white/90 tracking-tight">Inbox</h1>
          <p className="text-xs text-white/40 mt-1">Kelola semua pesan masuk dari pengunjung.</p>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          
          {/* KIRI: Daftar Pesan */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/[0.05] flex flex-col h-1/2 md:h-full overflow-y-auto custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white/30 p-8 text-center">
                <Mail className="w-8 h-8 mb-3 opacity-50" />
                <p className="text-sm">Belum ada pesan masuk.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => handleRead(msg)}
                  className={`p-5 border-b border-white/[0.05] cursor-pointer transition-all duration-200 hover:bg-white/[0.04] flex items-start gap-4 ${selectedMsg?.id === msg.id ? 'bg-white/[0.06] border-l-2 border-l-cyan-400' : ''}`}
                >
                  <div className="relative mt-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-white/70 font-bold">
                      {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : "?"}
                    </div>
                    {!msg.isRead && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 border-2 border-[#0a0a0a] rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm truncate pr-2 ${!msg.isRead ? 'text-white font-bold' : 'text-white/70 font-medium'}`}>
                        {msg.senderName || "Tanpa Nama"}
                      </h3>
                      <span className="text-[10px] text-white/30 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${!msg.isRead ? 'text-white/80' : 'text-white/40'}`}>
                      {msg.body || "Pesan kosong..."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* KANAN: Detail Pesan */}
          <div className="flex-1 h-1/2 md:h-full bg-[#030303]/50 flex flex-col overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {selectedMsg ? (
                <motion.div 
                  key={selectedMsg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 h-full flex flex-col"
                >
                  <div className="flex items-start justify-between border-b border-white/[0.05] pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedMsg.senderName || "Tanpa Nama"}</h2>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedMsg.senderEmail || "Tidak ada email"}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(selectedMsg.createdAt).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(selectedMsg.id, e)}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                      title="Hapus Pesan"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMsg.body || "Tidak ada isi pesan."}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/[0.05]">
                    <a 
                      href={`mailto:${selectedMsg.senderEmail}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-cyan-400 transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Balas via Email
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-white/20"
                >
                  <div className="w-20 h-20 mb-6 rounded-full bg-white/[0.02] flex items-center justify-center">
                    <Mail className="w-8 h-8" />
                  </div>
                  <p>Pilih pesan untuk membaca detailnya.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}