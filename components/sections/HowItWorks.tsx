"use client";

import { motion } from "framer-motion";
import { Package, CreditCard, Truck, Zap } from "lucide-react";
const howItWorksSteps = [
  { step: "01", title: "เลือกสินค้า", description: "เลือกสินค้าที่ต้องการจากร้าน หรือโทรสอบถามสเปคได้เลย", icon: "Package", color: "blue" },
  { step: "02", title: "ติดต่อ LINE", description: "กดปุ่ม 'สนใจ' ส่งข้อความผ่าน LINE หรือโทรหาเราได้เลย", icon: "CreditCard", color: "cyan" },
  { step: "03", title: "นัดรับ/จัดส่ง", description: "นัดรับสินค้าที่ร้านหรือจัดส่งถึงบ้าน กทม.+ปริมณฑล", icon: "Truck", color: "orange" },
  { step: "04", title: "รับสินค้าได้เลย!", description: "ชำระเงินและรับสินค้า มือสองสภาพดีที่คุ้มค่าที่สุด", icon: "Zap", color: "blue" },
];

const iconMap: Record<string, React.ReactNode> = {
  Package: <Package className="h-7 w-7" />,
  CreditCard: <CreditCard className="h-7 w-7" />,
  Truck: <Truck className="h-7 w-7" />,
  Zap: <Zap className="h-7 w-7" fill="currentColor" />,
};

const colorMap: Record<string, { text: string; border: string; bg: string; hex: string }> = {
  blue: {
    text: "text-[#3B82F6]",
    border: "border-[#3B82F6]/40",
    bg: "bg-[#3B82F6]/10",
    hex: "#3B82F6",
  },
  cyan: {
    text: "text-[#38BDF8]",
    border: "border-[#38BDF8]/40",
    bg: "bg-[#38BDF8]/10",
    hex: "#38BDF8",
  },
  orange: {
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B]/40",
    bg: "bg-[#F59E0B]/10",
    hex: "#F59E0B",
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 hud-grid-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#F59E0B]/30 bg-[#F59E0B]/5 mb-4">
            <Truck className="h-4 w-4 text-[#F59E0B]" />
            <span className="text-[#F59E0B] text-sm uppercase tracking-widest font-medium">
              วิธีสั่งบริการ
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white mb-4">
            ง่ายแค่{" "}
            <span className="brand-gradient-text">4 ขั้นตอน</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg">จองวันนี้ พรุ่งนี้เล่นได้เลย</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t border-dashed border-[#1A1A2E] z-0 -translate-x-1/2" />
                )}

                <div
                  className={`relative z-10 bg-[#0A0A1A] border border-dashed ${c.border} rounded-xl p-6 text-center transition-all duration-300`}
                  style={{
                    boxShadow: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${c.hex}15, 0 0 60px ${c.hex}08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-black font-mono ${c.bg} ${c.text} border border-dashed ${c.border} rounded-full`}>
                    {step.step}
                  </div>

                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-xl ${c.bg} border border-dashed ${c.border} ${c.text} mb-4 mt-2`}>
                    {iconMap[step.icon]}
                  </div>

                  <h3 className="text-white font-bold text-lg uppercase mb-2">{step.title}</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="#packages"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3B82F6] text-white font-black uppercase tracking-wider rounded text-base hover:bg-[#2563EB] transition-all glow-blue hover:scale-105"
          >
            <Zap className="h-5 w-5" fill="currentColor" />
            เริ่มจองเลย
          </a>
        </motion.div>
      </div>
    </section>
  );
}
