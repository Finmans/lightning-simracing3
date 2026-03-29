"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";

interface Props {
  productName?: string;
}

export default function ContactForm({ productName }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: productName ? `สนใจสินค้า: ${productName}` : "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-[#0A0A1A] border border-dashed border-[#22C55E]/30 rounded-xl"
      >
        <CheckCircle className="w-16 h-16 text-[#22C55E] mx-auto mb-4" />
        <h3 className="text-xl font-black text-white mb-2">ส่งข้อความสำเร็จ!</h3>
        <p className="text-[#A1A1AA]">เราจะติดต่อกลับภายในไม่เกิน 24 ชั่วโมง</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 px-6 py-2 bg-[#22C55E]/20 text-[#22C55E] rounded-lg text-sm font-bold"
        >
          ส่งข้อความใหม่
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">ชื่อ *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-[#0A0A1A] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors"
            placeholder="กรอกชื่อของคุณ"
          />
        </div>
        <div>
          <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">เบอร์โทร *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="w-full bg-[#0A0A1A] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors"
            placeholder="08X-XXX-XXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">Email (ไม่บังคับ)</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-[#0A0A1A] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">ข้อความ *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
          className="w-full bg-[#0A0A1A] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors resize-none"
          placeholder="บอกเราว่าต้องการอะไร..."
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            ส่งข้อความ
          </>
        )}
      </button>
    </form>
  );
}
