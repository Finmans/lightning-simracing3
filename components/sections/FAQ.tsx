"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "สินค้ามือสองสภาพเป็นอย่างไร? ดูได้ก่อนไหม?",
    a: "ทุกชิ้นตรวจสอบก่อนขายเสมอ มีรูปประกอบชัดเจน สามารถนัดดูสินค้าก่อนได้ หรือถามรายละเอียดเพิ่มเติมผ่าน LINE ได้เลย",
    color: "#3B82F6",
  },
  {
    q: "ชำระเงินอย่างไร?",
    a: "รับชำระผ่าน โอนเงินธนาคาร / PromptPay หากซื้อสินค้านัดรับชำระเมื่อรับของ หากสั่งจัดส่งโอนล่วงหน้าแล้วแจ้งสลิป",
    color: "#60A5FA",
  },
  {
    q: "มีประกันไหม? ถ้าสินค้ามีปัญหาหลังซื้อ?",
    a: "สินค้าบางรายการยังมีประกันเหลืออยู่ (ระบุในรายละเอียด) สำหรับสินค้าที่หมดประกันแล้ว ทดสอบก่อนขาย หากมีปัญหาติดต่อได้ทันที",
    color: "#F59E0B",
  },
  {
    q: "ใช้กับ PS5 และ PC ได้ไหม?",
    a: "ส่วนใหญ่รองรับทั้ง PC และ PS5 ตรวจสอบได้จากสเปคในหน้าสินค้า บางรุ่นรองรับ Xbox ด้วย",
    color: "#8B5CF6",
  },
  {
    q: "จัดส่งสินค้าถึงที่ไหนได้บ้าง?",
    a: "จัดส่งฟรีในกรุงเทพมหานคร ปทุมธานี รังสิต คลองหลวง นนทบุรี และสมุทรปราการ หากอยู่นอกพื้นที่ติดต่อสอบถามราคาจัดส่งได้เลย",
    color: "#38BDF8",
  },
  {
    q: "สินค้าเช่ามีบริการอะไรบ้าง?",
    a: "ชุดเช่ารวม จัดส่ง ติดตั้ง สอนการใช้งาน และรับคืน ฟรีทุกอย่าง เช่าได้ตั้งแต่ 1 วัน, 1 สัปดาห์ หรือ 1 เดือน ราคาดีกว่ายิ่งเช่านาน",
    color: "#3B82F6",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-dashed rounded-xl overflow-hidden transition-colors"
      style={{
        borderColor: isOpen ? `${faq.color}40` : "#1A1A2E",
        backgroundColor: isOpen ? `${faq.color}05` : "#0A0A1A",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span
          className="font-bold text-sm sm:text-base transition-colors"
          style={{ color: isOpen ? "#fff" : "#E4E4E7" }}
        >
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 0 }}
          className="flex-shrink-0"
          style={{ color: isOpen ? faq.color : "#52525B" }}
        >
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5">
              <div
                className="h-px w-full mb-4"
                style={{
                  background: `linear-gradient(90deg, ${faq.color}30, transparent)`,
                }}
              />
              <p className="text-[#A1A1AA] text-sm leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 hud-grid-bg opacity-20" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 mb-4">
            <HelpCircle className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-[#60A5FA] text-sm uppercase tracking-widest font-medium">
              คำถามที่พบบ่อย
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
            มีคำถาม<span className="brand-gradient-text">?</span>
          </h2>
          <p className="text-[#71717A] text-base mt-2">
            ตอบทุกข้อสงสัยก่อนตัดสินใจเช่า
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-6 bg-[#0A0A1A] border border-dashed border-[#3B82F6]/30 rounded-2xl text-center"
        >
          <p className="text-[#A1A1AA] text-sm mb-3">
            ยังมีข้อสงสัยอื่น? ติดต่อเราได้เลยครับ
          </p>
          <a
            href="https://line.me/ti/p/~@lightningsimracing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white font-bold rounded-lg text-sm uppercase tracking-wider hover:bg-[#2563EB] transition-all glow-blue hover:scale-105"
          >
            ถามผ่าน Line
          </a>
        </motion.div>
      </div>
    </section>
  );
}
