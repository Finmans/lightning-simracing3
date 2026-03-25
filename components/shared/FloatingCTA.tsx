"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, Zap } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile bottom bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0A1A]/95 backdrop-blur-md border-t border-dashed border-[#1A1A2E] px-4 py-3"
          >
            <div className="flex gap-3">
              <a
                href="tel:0XX-XXX-XXXX"
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-[#3B82F6]/40 text-[#60A5FA] rounded-lg font-bold text-sm uppercase tracking-wider"
              >
                <Phone className="h-4 w-4" />
                โทร
              </a>
              <a
                href="https://line.me/ti/p/~@lightningsimracing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#3B82F6] text-white rounded-lg font-black text-sm uppercase tracking-wider glow-blue"
              >
                <Zap className="h-4 w-4" fill="currentColor" />
                จองผ่าน LINE เลย
              </a>
            </div>
          </motion.div>

          {/* Desktop floating button */}
          <div className="fixed bottom-8 right-6 z-50 hidden md:flex flex-col items-end gap-3">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="flex flex-col gap-2"
                >
                  <a
                    href="tel:0XX-XXX-XXXX"
                    className="flex items-center gap-3 px-4 py-3 bg-[#0A0A1A] border border-dashed border-[#3B82F6]/40 text-white rounded-xl text-sm font-medium hover:bg-[#3B82F6]/10 transition-all group"
                  >
                    <Phone className="h-4 w-4 text-[#60A5FA] group-hover:scale-110 transition-transform" />
                    <span>โทรสอบถาม</span>
                  </a>
                  <a
                    href="https://line.me/ti/p/~@lightningsimracing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-[#3B82F6] text-white rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-all glow-blue group"
                  >
                    <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Line: @lightningsimracing</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setOpen(!open)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-14 rounded-full bg-[#3B82F6] text-white flex items-center justify-center glow-blue-lg shadow-2xl"
            >
              <motion.div
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
              </motion.div>
            </motion.button>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
