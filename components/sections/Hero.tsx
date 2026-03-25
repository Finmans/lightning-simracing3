"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, RotateCcw, ArrowRight, Zap, Shield, Truck } from "lucide-react";

const badges = [
  { icon: Shield, text: "ของแท้ 100%" },
  { icon: Truck, text: "จัดส่งฟรี กทม." },
  { icon: Zap, text: "สินค้ามือสอง" },
];
const brands = ["FANATEC", "SIMAGIC", "MOZA", "LOGITECH", "NLR"];

/* ─────────────── 3D Grid Floor ─────────────── */
function GridFloor() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-72 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-floor opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
    </div>
  );
}

/* ─────────────── Orbiting Rings ─────────────── */
function OrbitRings() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      style={{ perspective: "900px" }}
    >
      {/* Ring 1 – slow X rotation */}
      <div
        className="absolute w-[700px] h-[700px] ring-x"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#3B82F6]/12" />
        {/* Glowing dot on ring */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#3B82F6] rounded-full"
          style={{ boxShadow: "0 0 14px 4px rgba(59,130,246,0.8)" }}
        />
      </div>

      {/* Ring 2 – medium Y rotation */}
      <div
        className="absolute w-[500px] h-[500px] ring-y"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#38BDF8]/10" />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#38BDF8] rounded-full"
          style={{ boxShadow: "0 0 10px 3px rgba(56,189,248,0.7)" }}
        />
      </div>

      {/* Ring 3 – fast Z rotation */}
      <div
        className="absolute w-[880px] h-[880px] ring-z"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-full border border-[#8B5CF6]/8" />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full"
          style={{ boxShadow: "0 0 8px 2px rgba(139,92,246,0.8)" }}
        />
      </div>
    </div>
  );
}

/* ─────────────── Depth Particles (z-simulated) ─────────────── */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 23 + 7) % 100,
  size: 0.5 + (i % 4) * 0.7,          // size = depth proxy
  dur: 2.5 + (i % 5) * 0.8,
  delay: i * 0.15,
  color: i % 3 === 0 ? "#38BDF8" : i % 3 === 1 ? "#3B82F6" : "#8B5CF6",
  opacity: 0.15 + (i % 4) * 0.18,
}));

function DepthParticles() {
  return (
    <>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 4}px`,
            height: `${p.size * 4}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 6}px ${p.color}`,
          }}
          animate={{
            y: [-p.size * 10, p.size * 10, -p.size * 10],
            x: [-p.size * 4, p.size * 4, -p.size * 4],
            scale: [1, 1 + p.size * 0.3, 1],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

/* ─────────────── Light Beams ─────────────── */
function LightBeams() {
  const beams = [
    { left: "20%", height: "60%", delay: "0s", dur: "4s", top: "10%" },
    { left: "45%", height: "80%", delay: "1.5s", dur: "5s", top: "0%" },
    { left: "70%", height: "50%", delay: "0.8s", dur: "3.5s", top: "20%" },
    { left: "85%", height: "70%", delay: "2s", dur: "6s", top: "5%" },
  ];
  return (
    <>
      {beams.map((b, i) => (
        <div
          key={i}
          className="light-beam"
          style={{
            left: b.left,
            height: b.height,
            top: b.top,
            animationDelay: b.delay,
            animationDuration: b.dur,
            width: "1.5px",
          }}
        />
      ))}
    </>
  );
}

/* ─────────────── Scan Line ─────────────── */
function ScanLine() {
  return <div className="scan-line" style={{ animationDuration: "8s" }} />;
}

/* ─────────────── 3D Tilt Card (right side) ─────────────── */
interface TiltCardProps {
  heroImage: string;
  heroCardTitle: string;
  heroCardPrice: string;
}
function TiltCard({ heroImage, heroCardTitle, heroCardPrice }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-100, 100], [12, -12]);
  const rotateY = useTransform(springX, [-100, 100], [-12, 12]);
  const glareX = useTransform(springX, [-100, 100], [0, 100]);
  const glareY = useTransform(springY, [-100, 100], [0, 100]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative cursor-pointer"
      >
        {/* Main card */}
        <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-[#1E293B] bg-[#111827] relative">
          <Image
            src={heroImage}
            alt="Sim Racing Setup"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Holographic glare overlay */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(59,130,246,0.25) 0%, rgba(56,189,248,0.1) 30%, transparent 65%)`
              ),
            }}
          />
          {/* Holo shimmer */}
          <div className="absolute inset-0 holo-shimmer rounded-3xl opacity-60" />

          {/* Product info */}
          <div className="absolute bottom-0 left-0 right-0 p-6" style={{ transform: "translateZ(20px)" }}>
            <p className="text-xs text-[#9CA3AF] mb-1">สินค้าแนะนำ</p>
            <h3 className="text-white font-black text-xl text-glow-white">
              {heroCardTitle}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-black text-[#3B82F6] text-glow-blue">{heroCardPrice}</span>
            </div>
          </div>

          {/* Corner HUD decorations */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#3B82F6]/60 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#3B82F6]/60 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#3B82F6]/60 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#3B82F6]/60 rounded-br-lg" />
        </div>

        {/* Floating stat – top right */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5 -right-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-4 shadow-2xl"
          style={{ transform: "translateZ(40px)", boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}
        >
          <p className="text-xs text-[#6B7280]">สินค้าในร้าน</p>
          <p className="text-2xl font-black text-white text-glow-white">50+</p>
          <p className="text-xs text-[#22C55E]">รายการ</p>
          <div className="absolute -inset-px rounded-2xl border border-[#3B82F6]/20 pointer-events-none ring-pulse" />
        </motion.div>

        {/* Floating stat – bottom left */}
        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-5 -left-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-4 shadow-2xl"
          style={{ transform: "translateZ(40px)", boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}
        >
          <p className="text-xs text-[#6B7280]">ลูกค้าพอใจ</p>
          <p className="text-2xl font-black text-[#3B82F6] text-glow-blue">120+</p>
          <p className="text-xs text-[#9CA3AF]">คน</p>
          <div className="absolute -inset-px rounded-2xl border border-[#38BDF8]/20 pointer-events-none ring-pulse" style={{ animationDelay: "1.5s" }} />
        </motion.div>

        {/* Floating label – top left */}
        <motion.div
          animate={{ x: [-4, 4, -4], y: [2, -2, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 left-8 bg-[#3B82F6] text-white text-xs font-black px-3 py-1.5 rounded-full"
          style={{ transform: "translateZ(50px)", boxShadow: "0 0 20px rgba(59,130,246,0.6)" }}
        >
          FEATURED
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────── Main Hero ─────────────── */
interface HeroProps {
  heroImage?: string;
  heroCardTitle?: string;
  heroCardPrice?: string;
}
export default function Hero({
  heroImage = "https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=800&auto=format&fit=crop",
  heroCardTitle = "Fanatec GT DD Pro Bundle",
  heroCardPrice = "฿32,900",
}: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* ── Layer 1: Parallax background ── */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {/* Base grid */}
        <div className="absolute inset-0 hud-grid-bg opacity-30" />

        {/* Deep ambient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* 3D Orbit rings */}
        <OrbitRings />

        {/* Scan line */}
        <ScanLine />

        {/* Light beams */}
        <LightBeams />

        {/* Depth particles */}
        <DepthParticles />

        {/* 3D Grid floor */}
        <GridFloor />
      </motion.div>

      {/* ── Layer 2: Content ── */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left: Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-dashed border-[#3B82F6]/40 rounded-full"
              style={{ boxShadow: "0 0 20px rgba(59,130,246,0.15)" }}
            >
              <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#3B82F6] uppercase">
                ร้านค้า Sim Racing มือสอง
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  อุปกรณ์
                </motion.span>
                <motion.span
                  className="block brand-gradient-text text-glow-blue"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  SIM RACING
                </motion.span>
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  คุณภาพสูง
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-[#9CA3AF] text-lg leading-relaxed max-w-md"
            >
              สินค้ามือสองสภาพดี แบรนด์ชั้นนำ Fanatec · Simagic · Moza
              ราคาคุ้มค่า พร้อมบริการเช่าถึงบ้าน
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              {badges.map((b, i) => (
                <motion.div
                  key={b.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1E293B] rounded-xl hover:border-[#3B82F6]/40 transition-colors"
                >
                  <b.icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-xs text-[#9CA3AF] font-medium">{b.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, type: "spring" }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group relative flex items-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl transition-all glow-blue text-sm uppercase tracking-wider overflow-hidden"
              >
                {/* animated shine */}
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
                <ShoppingBag className="w-4 h-4 relative z-10" />
                <span className="relative z-10">ดูสินค้าทั้งหมด</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/rent"
                className="flex items-center gap-2 px-8 py-4 bg-transparent border border-[#22C55E]/50 hover:bg-[#22C55E]/10 text-[#22C55E] font-bold rounded-xl transition-all text-sm uppercase tracking-wider"
                style={{ boxShadow: "0 0 15px rgba(34,197,94,0.1)" }}
              >
                <RotateCcw className="w-4 h-4" />
                เช่าอุปกรณ์
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-4 pt-4 border-t border-dashed border-[#1A1A2E]"
            >
              <span className="text-xs text-[#374151] uppercase tracking-wider flex-shrink-0">
                แบรนด์ที่มี
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                {brands.map((b, i) => (
                  <motion.span
                    key={b}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 + i * 0.1 }}
                    className="text-xs font-black text-[#6B7280] hover:text-[#3B82F6] transition-colors cursor-default"
                  >
                    {b}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: 3D Tilt Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.45, duration: 1, type: "spring", stiffness: 80 }}
            className="hidden lg:block"
          >
            <TiltCard heroImage={heroImage} heroCardTitle={heroCardTitle} heroCardPrice={heroCardPrice} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-center pb-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-[#374151]"
          >
            <div className="w-5 h-9 border-2 border-[#374151] rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ opacity: [1, 0], y: [0, 14] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
                className="w-1 h-2 bg-[#3B82F6] rounded-full"
              />
            </div>
            <span className="text-xs tracking-widest uppercase">Scroll</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
