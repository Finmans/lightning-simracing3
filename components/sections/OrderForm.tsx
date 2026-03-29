"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, RotateCcw, Loader2, CheckCircle, Calendar } from "lucide-react";
import Link from "next/link";

interface Props {
  productId: string;
  productName: string;
  productPrice: number;
  productType: "sale" | "rent";
  rentPricePerDay?: number;
}

export default function OrderForm({ productId, productName, productPrice, productType, rentPricePerDay }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", rentalDays: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          name: form.name,
          phone: form.phone,
          email: form.email,
          rentalDays: form.rentalDays,
          message: form.message,
          type: productType,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }

    setLoading(false);
  }

  const Icon = productType === "rent" ? RotateCcw : ShoppingBag;
  const label = productType === "rent" ? "สั่งเช่า" : "สั่งซื้อ";
  const price = productType === "rent" && rentPricePerDay
    ? `฿${rentPricePerDay.toLocaleString()}/วัน`
    : `฿${productPrice.toLocaleString()}`;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 bg-[#0A0A1A] border border-dashed border-[#22C55E]/30 rounded-2xl"
      >
        <CheckCircle className="w-16 h-16 text-[#22C55E] mx-auto mb-4" />
        <h3 className="text-xl font-black text-white mb-2">ส่งคำสั่งซื้อสำเร็จ!</h3>
        <p className="text-[#A1A1AA] text-sm mb-4">เราจะติดต่อกลับภายในไม่เกิน 24 ชั่วโมง</p>
        <div className="flex gap-3 justify-center">
          <Link
            href={productType === "rent" ? "/rent" : "/shop"}
            className="px-5 py-2 bg-[#3B82F6]/20 text-[#3B82F6] rounded-lg text-sm font-bold hover:bg-[#3B82F6]/30"
          >
            ดูสินค้าต่อ
          </Link>
          <button
            onClick={() => setSuccess(false)}
            className="px-5 py-2 bg-[#22C55E]/20 text-[#22C55E] rounded-lg text-sm font-bold hover:bg-[#22C55E]/30"
          >
            สั่งซื้อใหม่
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#0A0A1A] border border-dashed border-[#1E293B] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#3B82F6]" />
        </div>
        <div>
          <h3 className="font-black text-white">{label}</h3>
          <p className="text-sm text-[#22C55E] font-bold">{price}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">ชื่อ *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none"
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
            className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none"
            placeholder="08X-XXX-XXXX"
          />
        </div>

        <div>
          <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">Email (ไม่บังคับ)</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none"
            placeholder="email@example.com"
          />
        </div>

        {productType === "rent" && rentPricePerDay && (
          <div>
            <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              จำนวนวันที่ต้องการเช่า *
            </label>
            <input
              type="number"
              min="1"
              value={form.rentalDays}
              onChange={(e) => setForm({ ...form, rentalDays: e.target.value })}
              required
              className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none"
              placeholder="เช่ากี่วัน"
            />
            {form.rentalDays && (
              <p className="text-sm text-[#22C55E] mt-2">
                ค่าเช่าทั้งหมด: ฿{(rentPricePerDay * parseInt(form.rentalDays || "0")).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">หมายเหตุ (ไม่บังคับ)</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={2}
            className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none resize-none"
            placeholder="ข้อความเพิ่มเติม..."
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
          {label}
        </button>

        <p className="text-xs text-[#52525B] text-center">
          เมื่อกดส่ง เราจะติดต่อกลับภายใน 24 ชั่วโมง
        </p>
      </form>
    </div>
  );
}
