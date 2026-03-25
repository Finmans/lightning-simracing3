"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { Shield, Clock, Truck, Star } from "lucide-react";

const stats = [
  { end: 50,  suffix: "+",     label: "สินค้าในร้าน",  icon: Star,   color: "#3B82F6", desc: "รายการสินค้าทั้งหมด" },
  { end: 120, suffix: "+",     label: "ลูกค้าพอใจ",   icon: Shield, color: "#F59E0B", desc: "ซื้อ-เช่าแล้ว" },
  { end: 4,   suffix: "",      label: "แบรนด์ชั้นนำ", icon: Clock,  color: "#8B5CF6", desc: "Fanatec · Simagic · Moza · Logitech" },
  { end: 6,   suffix: " โซน", label: "จัดส่งถึงบ้าน", icon: Truck,  color: "#38BDF8", desc: "กทม. และปริมณฑล" },
];

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const { count, ref } = useCountUp(stat.end, 1600);
  const Icon = stat.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [-60, 60], [8, -8]);
  const rotateY = useTransform(sx, [-60, 60], [-8, 8]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = cardRef.current!.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  }
  function onLeave() { mx.set(0); my.set(0); }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.12, type: "spring", stiffness: 100 }}
      style={{ perspective: "800px" }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative bg-[#0A0A1A] border border-dashed border-[#1A1A2E] rounded-2xl p-6 text-center group overflow-hidden cursor-default"
      >
        {/* Animated background orb */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            background: [
              `radial-gradient(circle at 50% 50%, ${stat.color}06 0%, transparent 60%)`,
              `radial-gradient(circle at 50% 50%, ${stat.color}12 0%, transparent 60%)`,
              `radial-gradient(circle at 50% 50%, ${stat.color}06 0%, transparent 60%)`,
            ],
          }}
          transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glare on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${stat.color}15 0%, transparent 65%)`,
            border: `1px dashed ${stat.color}35`,
          }}
        />

        {/* Top glow line */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
        />

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-20 group-hover:opacity-60 transition-opacity"
          style={{ borderColor: stat.color }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r opacity-20 group-hover:opacity-60 transition-opacity"
          style={{ borderColor: stat.color }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l opacity-20 group-hover:opacity-60 transition-opacity"
          style={{ borderColor: stat.color }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-20 group-hover:opacity-60 transition-opacity"
          style={{ borderColor: stat.color }} />

        {/* Icon with 3D lift */}
        <motion.div
          className="inline-flex items-center justify-center h-12 w-12 rounded-xl mb-4 border border-dashed mx-auto"
          style={{
            color: stat.color,
            borderColor: `${stat.color}30`,
            backgroundColor: `${stat.color}12`,
            transform: "translateZ(20px)",
          }}
          animate={{ rotateY: [0, 10, 0, -10, 0] }}
          transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>

        {/* Count */}
        <div className="flex items-center justify-center gap-0.5 mb-1" style={{ transform: "translateZ(15px)" }}>
          <span
            ref={ref}
            className="text-4xl font-black tabular-nums"
            style={{ color: stat.color, fontFamily: "'Courier New', monospace", textShadow: `0 0 20px ${stat.color}60` }}
          >
            {count}
          </span>
          <span className="text-2xl font-black" style={{ color: stat.color }}>
            {stat.suffix}
          </span>
        </div>

        <div className="text-white font-bold text-sm uppercase tracking-wider mb-1">
          {stat.label}
        </div>
        <div className="text-[#52525B] text-xs">{stat.desc}</div>
      </motion.div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-[#050510]" />
      <div className="absolute inset-0 hud-grid-bg opacity-25" />

      {/* Ambient orbs */}
      <motion.div
        className="absolute left-0 top-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
        animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
        animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scan-line" style={{ animationDuration: "10s", opacity: 0.3 }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[#52525B] text-xs uppercase tracking-widest mb-10 font-medium"
        >
          — ตัวเลขที่พิสูจน์คุณภาพบริการ —
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
