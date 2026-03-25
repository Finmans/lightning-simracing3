"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, Clock, MapPin, Zap } from "lucide-react";
const serviceAreas = ["กรุงเทพมหานคร", "ปทุมธานี", "รังสิต", "คลองหลวง", "นนทบุรี", "สมุทรปราการ"];

const contactItems = [
  {
    icon: <MessageCircle className="h-6 w-6" />,
    label: "Line",
    value: "@lightningsimracing",
    href: "https://line.me/ti/p/~@lightningsimracing",
    color: "#3B82F6",
    description: "ตอบเร็วที่สุด แนะนำ",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    label: "โทรศัพท์",
    value: "0XX-XXX-XXXX",
    href: "tel:0XX-XXX-XXXX",
    color: "#38BDF8",
    description: "จ-อา 09:00-20:00",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    label: "Email",
    value: "contact@lightningsimracing.com",
    href: "mailto:contact@lightningsimracing.com",
    color: "#F59E0B",
    description: "ตอบภายใน 24 ชม.",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 hud-grid-bg opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 mb-4">
            <MessageCircle className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-[#60A5FA] text-sm uppercase tracking-widest font-medium">
              ติดต่อเรา
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white mb-4">
            พร้อม<span className="brand-gradient-text">ให้บริการ</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg">ติดต่อเราได้หลายช่องทาง ตอบไวทุกวัน</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact channels */}
          <div className="space-y-4">
            {contactItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 bg-[#0A0A1A] border border-dashed rounded-xl transition-all group"
                style={{ borderColor: `${item.color}30` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${item.color}08`;
                  e.currentTarget.style.boxShadow = `0 0 30px ${item.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0A0A1A";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="flex-shrink-0 h-12 w-12 rounded-lg border border-dashed flex items-center justify-center"
                  style={{
                    color: item.color,
                    borderColor: `${item.color}40`,
                    backgroundColor: `${item.color}10`,
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: item.color }}
                    >
                      {item.label}
                    </span>
                    <span className="text-[#52525B] text-xs">{item.description}</span>
                  </div>
                  <p className="text-white font-bold truncate">{item.value}</p>
                </div>
                <div
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: item.color }}
                >
                  <Zap className="h-5 w-5" fill="currentColor" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="bg-[#0A0A1A] border border-dashed border-[#1A1A2E] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-[#38BDF8]" />
                <span className="text-white font-bold uppercase tracking-wider text-sm">
                  เวลาทำการ
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  { day: "จันทร์ - ศุกร์", time: "09:00 - 20:00" },
                  { day: "เสาร์ - อาทิตย์", time: "09:00 - 20:00" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between">
                    <span className="text-[#A1A1AA] text-sm">{row.day}</span>
                    <span className="text-[#38BDF8] font-mono text-sm">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0A1A] border border-dashed border-[#1A1A2E] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-[#F59E0B]" />
                <span className="text-white font-bold uppercase tracking-wider text-sm">
                  พื้นที่ให้บริการ
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 text-sm text-[#A1A1AA] border border-dashed border-[#1A1A2E] rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-[#52525B] text-xs mt-3">
                * ค่าจัดส่งรวมในราคาแพ็กเกจแล้ว ไม่มีค่าใช้จ่ายเพิ่ม
              </p>
            </div>

            <a
              href="https://line.me/ti/p/~@lightningsimracing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 bg-[#3B82F6] text-white font-black uppercase tracking-wider rounded-xl text-lg hover:bg-[#2563EB] transition-all glow-blue-lg hover:scale-105"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.437-6.977C23.176 13.999 24 12.241 24 10.314" />
              </svg>
              จองผ่าน Line เลย!
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
