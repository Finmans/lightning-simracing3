"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, CATEGORY_LABELS, CONDITION_LABELS, CONDITION_COLORS } from "@/lib/types";
import { MessageCircle, Tag, RotateCcw } from "lucide-react";

interface Props {
  product: Product;
  mode: "sale" | "rent";
  index?: number;
}

export default function ProductCard({ product, mode, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  /* 3D tilt */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 250, damping: 22 });
  const springY = useSpring(my, { stiffness: 250, damping: 22 });
  const rotateX = useTransform(springY, [-80, 80], [10, -10]);
  const rotateY = useTransform(springX, [-80, 80], [-10, 10]);

  /* Glare position */
  const glareX = useTransform(springX, [-80, 80], [0, 100]);
  const glareY = useTransform(springY, [-80, 80], [0, 100]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current!.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  const conditionColor = CONDITION_COLORS[product.condition];
  const discount =
    product.originalPrice && product.salePrice
      ? Math.round((1 - product.salePrice / product.originalPrice) * 100)
      : 0;

  const lineMsg = encodeURIComponent(
    `สนใจ: ${product.title}\n${
      mode === "sale"
        ? `ราคา: ฿${product.salePrice?.toLocaleString()}`
        : `เช่า: ฿${product.rentPricePerDay?.toLocaleString()}/วัน`
    }`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 120, damping: 18 }}
      style={{ perspective: "900px" }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 8 }}
        className="group bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden
                   hover:border-[#3B82F6]/50 transition-colors duration-300 cursor-pointer relative"
      >
        {/* Holographic glare */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(59,130,246,0.18) 0%, rgba(56,189,248,0.08) 35%, transparent 60%)`
            ),
          }}
        />

        {/* Image */}
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-square bg-[#1E293B] overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#374151]">
                📦
              </div>
            )}

            {/* Scan line on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="scan-line" style={{ animationDuration: "3s" }} />
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.06 + 0.2 }}
                  className="text-xs px-2 py-0.5 bg-red-500 text-white font-bold rounded-full shadow-lg"
                  style={{ boxShadow: "0 0 10px rgba(239,68,68,0.6)" }}
                >
                  -{discount}%
                </motion.span>
              )}
              {product.featured && (
                <span
                  className="text-xs px-2 py-0.5 bg-[#3B82F6] text-white font-bold rounded-full"
                  style={{ boxShadow: "0 0 10px rgba(59,130,246,0.6)" }}
                >
                  แนะนำ
                </span>
              )}
            </div>

            {/* Condition */}
            <div className="absolute top-2 right-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold backdrop-blur-sm"
                style={{
                  background: `${conditionColor}25`,
                  color: conditionColor,
                  border: `1px solid ${conditionColor}40`,
                  boxShadow: `0 0 8px ${conditionColor}30`,
                }}
              >
                {CONDITION_LABELS[product.condition]}
              </span>
            </div>

            {/* Type pill — show only relevant mode */}
            <div className="absolute bottom-2 left-2 flex gap-1">
              {mode === "sale" && (product.type === "sale" || product.type === "both") && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 text-white rounded-full font-bold"
                  style={{ background: "rgba(59,130,246,0.85)", boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
                >
                  <Tag className="w-2.5 h-2.5" /> มือสอง
                </span>
              )}
              {mode === "rent" && (product.type === "rent" || product.type === "both") && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 text-white rounded-full font-bold"
                  style={{ background: "rgba(34,197,94,0.85)", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }}
                >
                  <RotateCcw className="w-2.5 h-2.5" /> เช่า
                </span>
              )}
            </div>

            {/* Corner HUD */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#3B82F6]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#3B82F6]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#3B82F6]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#3B82F6]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Content */}
        <div className="p-4" style={{ transform: "translateZ(10px)" }}>
          <p className="text-xs text-[#6B7280] mb-1">
            {product.brand} · {CATEGORY_LABELS[product.category]}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-white text-sm leading-snug mb-3 hover:text-[#3B82F6] transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          {mode === "sale" && product.salePrice ? (
            <div className="flex items-end gap-2 mb-4">
              <motion.span
                className="text-xl font-black text-[#3B82F6]"
                style={{ textShadow: "0 0 10px rgba(59,130,246,0.5)" }}
                animate={{ textShadow: ["0 0 10px rgba(59,130,246,0.3)", "0 0 18px rgba(59,130,246,0.7)", "0 0 10px rgba(59,130,246,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ฿{product.salePrice.toLocaleString()}
              </motion.span>
              {product.originalPrice && (
                <span className="text-sm text-[#6B7280] line-through mb-0.5">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          ) : mode === "rent" && product.rentPricePerDay ? (
            <div className="flex items-end gap-2 mb-4">
              <motion.span
                className="text-xl font-black text-[#22C55E]"
                animate={{ textShadow: ["0 0 10px rgba(34,197,94,0.3)", "0 0 18px rgba(34,197,94,0.7)", "0 0 10px rgba(34,197,94,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ฿{product.rentPricePerDay.toLocaleString()}
              </motion.span>
              <span className="text-sm text-[#6B7280] mb-0.5">/ วัน</span>
            </div>
          ) : null}

          {/* LINE Button */}
          <a
            href={`https://line.me/ti/p/~@lightningsimracing?text=${lineMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center gap-2 w-full py-2.5 bg-[#1E293B] hover:bg-[#06C755]
                       text-[#9CA3AF] hover:text-white text-sm font-bold rounded-xl transition-all duration-300 overflow-hidden group/btn"
          >
            <motion.span
              className="absolute inset-0 bg-white/5"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.4 }}
            />
            <MessageCircle className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{mode === "sale" ? "สนใจซื้อ" : "สนใจเช่า"}</span>
          </a>
        </div>

        {/* Bottom glow bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}
