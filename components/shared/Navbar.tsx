"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ShoppingBag, RotateCcw, Settings, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/shop", label: "ซื้อสินค้า", icon: ShoppingBag },
  { href: "/rent", label: "เช่าอุปกรณ์", icon: RotateCcw },
  { href: "/blog", label: "บทความ", icon: BookOpen },
  { href: "/#how-it-works", label: "วิธีสั่งซื้อ", icon: null },
  { href: "/#contact", label: "ติดต่อ", icon: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-dashed border-[#1A1A2E]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.svg"
              alt="Lightning SimRacing"
              width={180}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              const isShop = link.href === "/shop";
              const isRent = link.href === "/rent";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isShop
                        ? "text-[#3B82F6] bg-[#3B82F6]/10"
                        : isRent
                        ? "text-[#22C55E] bg-[#22C55E]/10"
                        : "text-white"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:0XX-XXX-XXXX"
              className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>โทรเลย</span>
            </a>
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-all glow-blue hover:scale-105"
            >
              ดูสินค้า
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#A1A1AA] hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0A0A1A] border-b border-dashed border-[#1A1A2E]"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#A855F7] transition-colors py-2.5 border-b border-dashed border-[#1A1A2E]"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2">
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold bg-[#3B82F6] text-white rounded-xl text-center"
                >
                  ซื้อสินค้า
                </Link>
                <Link
                  href="/rent"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold bg-[#22C55E] text-white rounded-xl text-center"
                >
                  เช่าอุปกรณ์
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
