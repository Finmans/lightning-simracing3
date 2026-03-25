"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const items = [
  "FANATEC GT DD PRO",
  "SIMAGIC ALPHA MINI",
  "MOZA R9 V2",
  "NLR GT ELITE COCKPIT",
  "TRIPLE SCREEN SETUP",
  "PLAYSTATION 5",
  "META QUEST 3 VR",
  "LOGITECH G923",
  "FREE DELIVERY",
  "SAME DAY INSTALL",
];

export default function Marquee() {
  const repeated = [...items, ...items];

  return (
    <div className="py-4 bg-[#3B82F6]/5 border-y border-dashed border-[#3B82F6]/20 overflow-hidden">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#52525B] flex-shrink-0"
          >
            <Zap className="h-3 w-3 text-[#3B82F6]" fill="currentColor" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
