"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Calculator, Check, Zap, MessageCircle, ChevronRight } from "lucide-react";
import { packages, addOns, rentalDays, discounts } from "@/lib/mock-data";

// Animated price display
function AnimatedPrice({ value, color }: { value: number; color: string }) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span style={{ color, fontFamily: "'Courier New', monospace" }}>
      {display}
    </motion.span>
  );
}

export default function PriceCalculator() {
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState(1);
  const [step, setStep] = useState(1);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const basePrice = selectedPackage.pricePerDay * selectedDays;
  const addOnPrice = addOns
    .filter((a) => selectedAddOns.includes(a.id))
    .reduce((sum, a) => sum + a.pricePerDay * selectedDays, 0);
  const subtotal = basePrice + addOnPrice;
  const discountRate = discounts[selectedDays] || 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;

  const packageColors: Record<string, string> = {
    "set-a": "blue",
    "set-b": "cyan",
    "set-c": "orange",
  };
  const activeColor = packageColors[selectedPackage.id] || "blue";
  const colorMap: Record<string, { border: string; text: string; bg: string; btn: string; hex: string }> = {
    blue: { border: "border-[#3B82F6]", text: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", btn: "bg-[#3B82F6] text-white hover:bg-[#2563EB]", hex: "#3B82F6" },
    cyan: { border: "border-[#38BDF8]", text: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10", btn: "bg-[#38BDF8] text-[#000] hover:bg-[#0EA5E9]", hex: "#38BDF8" },
    orange: { border: "border-[#F59E0B]", text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", btn: "bg-[#F59E0B] text-[#000] hover:bg-[#D97706]", hex: "#F59E0B" },
  };
  const c = colorMap[activeColor];

  const lineMessage = encodeURIComponent(
    `สวัสดีครับ สนใจเช่า ${selectedPackage.name} (${selectedPackage.tier}) ${selectedDays} วัน ราคา ${total.toLocaleString()}฿${selectedAddOns.length > 0 ? ` พร้อมอุปกรณ์เสริม: ${addOns.filter(a => selectedAddOns.includes(a.id)).map(a => a.name).join(", ")}` : ""}`
  );

  const steps = ["ชุดอุปกรณ์", "อุปกรณ์เสริม", "ระยะเวลา"];

  return (
    <section id="calculator" className="py-24 relative">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 hud-grid-bg opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#60A5FA]/30 bg-[#60A5FA]/5 mb-4">
            <Calculator className="h-4 w-4 text-[#60A5FA]" />
            <span className="text-[#60A5FA] text-sm uppercase tracking-widest font-medium">คำนวณราคา</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white mb-3">
            คำนวณ<span className="brand-gradient-text">ราคาเช่า</span>
          </h2>

          {/* Step progress */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(i + 1)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-dashed transition-all ${
                    step === i + 1
                      ? "border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6]"
                      : step > i + 1
                      ? "border-[#3B82F6]/30 bg-[#3B82F6]/5 text-[#52525B]"
                      : "border-[#1A1A2E] text-[#52525B]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                      step > i + 1 ? "bg-[#3B82F6] text-white" : ""
                    }`}
                  >
                    {step > i + 1 ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-[#1A1A2E]" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left config */}
          <div className="lg:col-span-2 space-y-4">

            {/* Step 1: Base Set */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`bg-[#0A0A1A] border border-dashed rounded-xl overflow-hidden transition-all ${
                step === 1 ? "border-[#3B82F6]/40" : "border-[#1A1A2E]"
              }`}
            >
              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-[#3B82F6] text-white text-xs font-black flex items-center justify-center">1</span>
                  <span className="text-white font-bold uppercase tracking-wider">ชุดอุปกรณ์หลัก</span>
                </div>
                <div className={`text-sm font-bold ${c.text}`}>
                  {selectedPackage.name} — {selectedPackage.pricePerDay.toLocaleString()}฿/วัน
                </div>
              </button>

              <AnimatePresence>
                {step === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {packages.map((pkg) => {
                        const pkgColor = packageColors[pkg.id] || "blue";
                        const pc = colorMap[pkgColor];
                        const isActive = selectedPackage.id === pkg.id;
                        return (
                          <motion.button
                            key={pkg.id}
                            onClick={() => { setSelectedPackage(pkg); setStep(2); }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative text-left p-4 rounded-xl border border-dashed transition-all ${
                              isActive ? `${pc.border} ${pc.bg}` : "border-[#1A1A2E] hover:border-[#2A2A3E]"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="packageActive"
                                className={`absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${pc.btn}`}
                              >
                                ✓
                              </motion.div>
                            )}
                            <div className={`text-lg font-black uppercase ${isActive ? pc.text : "text-white"}`}>{pkg.name}</div>
                            <div className="text-[#52525B] text-xs uppercase">{pkg.tier}</div>
                            <div className={`text-xl font-black mt-2 ${isActive ? pc.text : "text-[#71717A]"}`}
                              style={{ fontFamily: "'Courier New', monospace" }}>
                              {pkg.pricePerDay.toLocaleString()}฿<span className="text-xs font-normal text-[#52525B]">/วัน</span>
                            </div>
                            <ul className="mt-2 space-y-0.5">
                              {Object.entries(pkg.specs).slice(0, 2).map(([k, v]) => (
                                <li key={k} className="text-[#52525B] text-[11px]">{v}</li>
                              ))}
                            </ul>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step 2: Add-ons */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`bg-[#0A0A1A] border border-dashed rounded-xl overflow-hidden transition-all ${
                step === 2 ? "border-[#F59E0B]/40" : "border-[#1A1A2E]"
              }`}
            >
              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-[#F59E0B] text-black text-xs font-black flex items-center justify-center">2</span>
                  <span className="text-white font-bold uppercase tracking-wider">อุปกรณ์เสริม</span>
                  {selectedAddOns.length > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-[#F59E0B]/20 text-[#F59E0B] rounded-full border border-dashed border-[#F59E0B]/30">
                      +{selectedAddOns.length} รายการ
                    </span>
                  )}
                </div>
                <span className="text-[#52525B] text-xs">ไม่บังคับ</span>
              </button>

              <AnimatePresence>
                {step === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {addOns.map((addon) => {
                        const isActive = selectedAddOns.includes(addon.id);
                        return (
                          <motion.button
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-center gap-3 p-3 rounded-lg border border-dashed transition-all text-left ${
                              isActive ? "border-[#F59E0B]/40 bg-[#F59E0B]/10" : "border-[#1A1A2E] hover:border-[#2A2A3E]"
                            }`}
                          >
                            <motion.div
                              animate={{ scale: isActive ? 1 : 0.9 }}
                              className={`flex-shrink-0 h-5 w-5 rounded border border-dashed flex items-center justify-center transition-all ${
                                isActive ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#1A1A2E]"
                              }`}
                            >
                              {isActive && <Check className="h-3 w-3 text-black" />}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">{addon.name}</div>
                              <div className="text-[#52525B] text-xs">{addon.description}</div>
                            </div>
                            <div className="text-[#F59E0B] text-sm font-bold flex-shrink-0"
                              style={{ fontFamily: "'Courier New', monospace" }}>
                              +{addon.pricePerDay}฿/วัน
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    <div className="px-5 pb-4">
                      <motion.button
                        onClick={() => setStep(3)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 border border-dashed border-[#3B82F6]/30 text-[#60A5FA] rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#3B82F6]/10 transition-all flex items-center justify-center gap-2"
                      >
                        ถัดไป: เลือกระยะเวลา <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step 3: Rental Days */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`bg-[#0A0A1A] border border-dashed rounded-xl overflow-hidden transition-all ${
                step === 3 ? "border-[#8B5CF6]/40" : "border-[#1A1A2E]"
              }`}
            >
              <button
                onClick={() => setStep(3)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-[#8B5CF6] text-white text-xs font-black flex items-center justify-center">3</span>
                  <span className="text-white font-bold uppercase tracking-wider">ระยะเวลาเช่า</span>
                </div>
                <div className="text-[#8B5CF6] font-bold text-sm">
                  {selectedDays} วัน {discountRate > 0 && <span className="text-xs">(-{discountRate * 100}%)</span>}
                </div>
              </button>

              <AnimatePresence>
                {step === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <div className="flex flex-wrap gap-3">
                        {rentalDays.map((day) => {
                          const isActive = selectedDays === day;
                          const disc = discounts[day] || 0;
                          return (
                            <motion.button
                              key={day}
                              onClick={() => setSelectedDays(day)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`relative flex flex-col items-center justify-center px-6 py-4 rounded-xl border border-dashed transition-all ${
                                isActive
                                  ? "border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]"
                                  : "border-[#1A1A2E] text-[#71717A] hover:border-[#2A2A3E]"
                              }`}
                            >
                              <span className="text-2xl font-black" style={{ fontFamily: "'Courier New', monospace" }}>{day}</span>
                              <span className="text-xs uppercase tracking-wide">วัน</span>
                              {disc > 0 && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-black bg-[#8B5CF6] text-white rounded-full"
                                >
                                  -{disc * 100}%
                                </motion.span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      {discountRate > 0 && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[#8B5CF6] text-sm mt-3 font-medium"
                        >
                          🎉 เช่า {selectedDays} วัน ลดพิเศษ {discountRate * 100}% ประหยัดไป {discountAmount.toLocaleString()}฿
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Summary (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className={`sticky top-24 bg-[#0A0A1A] border border-dashed ${c.border} rounded-2xl p-6 transition-all`}
              style={{ boxShadow: `0 0 40px ${c.hex}15` }}
            >
              <h3 className={`font-black uppercase tracking-wider mb-6 text-center text-sm ${c.text}`}>
                📋 สรุปราคา
              </h3>

              {/* Breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-dashed border-[#1A1A2E]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white text-sm font-bold">{selectedPackage.name} — {selectedPackage.tier}</div>
                    <div className="text-[#52525B] text-xs">{selectedPackage.pricePerDay.toLocaleString()}฿ × {selectedDays} วัน</div>
                  </div>
                  <span className="text-white text-sm font-bold">{basePrice.toLocaleString()}฿</span>
                </div>

                <AnimatePresence>
                  {addOns.filter((a) => selectedAddOns.includes(a.id)).map((addon) => (
                    <motion.div
                      key={addon.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between"
                    >
                      <span className="text-[#A1A1AA] text-xs truncate flex-1 mr-2">{addon.name}</span>
                      <span className="text-[#F59E0B] text-xs font-mono flex-shrink-0">
                        {(addon.pricePerDay * selectedDays).toLocaleString()}฿
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {discountRate > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex justify-between pt-2 border-t border-dashed border-[#1A1A2E]"
                    >
                      <span className="text-[#8B5CF6] text-sm">ส่วนลด {discountRate * 100}%</span>
                      <span className="text-[#8B5CF6] font-bold text-sm">-{discountAmount.toLocaleString()}฿</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated Total */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#71717A] text-xs uppercase tracking-wider">รวมทั้งหมด</span>
                  <div className="text-right">
                    <div className="text-4xl font-black flex items-center gap-1">
                      <AnimatedPrice value={total} color={c.hex} />
                      <span className={`text-base ${c.text}`}>฿</span>
                    </div>
                    <div className="text-[#52525B] text-xs">({selectedDays} วัน · รวมทุกอย่าง)</div>
                  </div>
                </div>
              </div>

              {/* What's included */}
              <div className="mb-6 p-3 bg-[#3B82F6]/5 border border-dashed border-[#3B82F6]/20 rounded-lg">
                <div className="text-[#3B82F6] text-xs font-bold uppercase tracking-wider mb-2">รวมอยู่แล้ว:</div>
                {["จัดส่งถึงบ้าน", "ติดตั้งให้ฟรี", "สอนการใช้งาน", "รับคืนฟรี"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[#52525B] text-xs mb-0.5">
                    <Check className="h-3 w-3 text-[#3B82F6]" />
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <motion.a
                  href={`https://line.me/ti/p/~@lightningsimracing?message=${lineMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black uppercase tracking-wider transition-colors ${c.btn}`}
                  style={{ boxShadow: `0 0 30px ${c.hex}30` }}
                >
                  <Zap className="h-5 w-5" fill="currentColor" />
                  จองผ่าน Line เลย
                </motion.a>
                <motion.a
                  href="tel:0XX-XXX-XXXX"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-[#1A1A2E] text-[#A1A1AA] hover:text-white hover:border-[#3B82F6]/30 transition-all text-sm font-bold uppercase tracking-wider"
                >
                  <MessageCircle className="h-4 w-4" />
                  โทรสอบถาม
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
