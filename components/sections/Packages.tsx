"use client";

import { motion } from "framer-motion";
import { Check, Zap, Star } from "lucide-react";
import { packages } from "@/lib/mock-data";
import Image from "next/image";

const badgeStyles: Record<string, string> = {
  blue: "border-[#3B82F6]/40 text-[#3B82F6] bg-[#3B82F6]/10",
  cyan: "border-[#38BDF8]/40 text-[#38BDF8] bg-[#38BDF8]/10",
  orange: "border-[#F59E0B]/40 text-[#F59E0B] bg-[#F59E0B]/10",
};

const borderStyles: Record<string, string> = {
  blue: "hover:border-[#3B82F6]/40",
  cyan: "hover:border-[#38BDF8]/40",
  orange: "hover:border-[#F59E0B]/40",
};

const accentStyles: Record<string, string> = {
  blue: "text-[#3B82F6]",
  cyan: "text-[#38BDF8]",
  orange: "text-[#F59E0B]",
};

const ctaStyles: Record<string, string> = {
  blue: "bg-[#3B82F6] text-white hover:bg-[#2563EB] glow-blue",
  cyan: "bg-[#38BDF8] text-[#000] hover:bg-[#0EA5E9] glow-cyan",
  orange: "bg-[#F59E0B] text-[#000] hover:bg-[#D97706] glow-orange",
};

const glowStyles: Record<string, string> = {
  blue: "0 20px 60px rgba(59,130,246,0.15)",
  cyan: "0 20px 60px rgba(56,189,248,0.15)",
  orange: "0 20px 60px rgba(245,158,11,0.15)",
};

export default function Packages() {
  return (
    <section id="packages" className="py-24 relative">
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 hud-grid-bg opacity-30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 mb-4">
            <Star className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-[#60A5FA] text-sm uppercase tracking-widest font-medium">
              แพ็กเกจบริการ
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white mb-4">
            เลือก<span className="brand-gradient-text">ชุดอุปกรณ์</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            3 ระดับ ตั้งแต่มือใหม่ไปจนถึงระดับ Pro พร้อมอุปกรณ์ระดับโลก
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => {
            const color = pkg.badgeColor || "blue";
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`group relative bg-[#0A0A1A] border border-dashed border-[#1A1A2E] rounded-xl overflow-hidden transition-all duration-300 ${borderStyles[color]}`}
                style={{
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = glowStyles[color];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div
                    className={`absolute top-4 right-4 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-dashed rounded-full ${badgeStyles[color]}`}
                  >
                    {pkg.badge}
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <Image
                    src={pkg.image}
                    alt={`${pkg.name} ${pkg.tier}`}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A1A] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className={`text-3xl font-black uppercase ${accentStyles[color]}`}>
                      {pkg.name}
                    </span>
                    <span className="text-white font-bold text-lg ml-2 uppercase">{pkg.tier}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-end gap-1 mb-3">
                    <span className={`text-4xl font-black price-mono ${accentStyles[color]}`}>
                      {pkg.pricePerDay.toLocaleString()}฿
                    </span>
                    <span className="text-[#71717A] text-sm mb-1">/วัน</span>
                  </div>

                  <p className="text-[#A1A1AA] text-sm mb-4 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Specs */}
                  <div className="space-y-1.5 mb-5 border-t border-dashed border-[#1A1A2E] pt-4">
                    {Object.entries(pkg.specs).map(([key, val]) => {
                      const labels: Record<string, string> = {
                        wheelBase: "Wheel Base",
                        pedals: "Pedals",
                        cockpit: "Cockpit",
                        monitor: "Monitor",
                        console: "Console",
                      };
                      return (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-[#52525B] uppercase tracking-wider">{labels[key]}</span>
                          <span className="text-[#E4E4E7] font-medium">{val}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                        <Check className={`h-3.5 w-3.5 flex-shrink-0 ${accentStyles[color]}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#calculator"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 ${ctaStyles[color]}`}
                  >
                    <Zap className="h-4 w-4" fill="currentColor" />
                    เลือกแพ็กเกจนี้
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-[#52525B] text-sm mt-10"
        >
          * ราคารวมค่าจัดส่ง ติดตั้ง และรับคืนอุปกรณ์แล้ว | พื้นที่ให้บริการ: กรุงเทพและปริมณฑล
        </motion.p>
      </div>
    </section>
  );
}
