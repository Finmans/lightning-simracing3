"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, Gauge, Gamepad2, Loader2 } from "lucide-react";
import Image from "next/image";

interface ShowcaseProduct {
  id: string;
  brandId: string;
  brandName: string;
  brandColor: string;
  productName: string;
  productType: string;
  productImage: string;
  productHighlight: string;
  sortOrder: number;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  products: ShowcaseProduct[];
}

// Fallback data if API fails
const fallbackBrands: Brand[] = [
  {
    id: "fanatec",
    name: "FANATEC",
    logo: "F",
    color: "#3B82F6",
    description: "แบรนด์ชั้นนำระดับโลกสำหรับ Sim Racing อุปกรณ์ Direct Drive คุณภาพสูง",
    products: [
      {
        id: "showcase-1",
        brandId: "fanatec",
        brandName: "FANATEC",
        brandColor: "#3B82F6",
        productName: "GT DD Pro",
        productType: "Wheel Base",
        productImage: "https://images.unsplash.com/photo-1570352481356-e633565f3b5c?w=400&auto=format&fit=crop",
        productHighlight: "8Nm Direct Drive",
        sortOrder: 1,
      },
      {
        id: "showcase-2",
        brandId: "fanatec",
        brandName: "FANATEC",
        brandColor: "#3B82F6",
        productName: "CSL DD+",
        productType: "Wheel Base",
        productImage: "https://images.unsplash.com/photo-1614609953905-baeff400aab3?w=400&auto=format&fit=crop",
        productHighlight: "15Nm Force Feedback",
        sortOrder: 2,
      },
      {
        id: "showcase-3",
        brandId: "fanatec",
        brandName: "FANATEC",
        brandColor: "#3B82F6",
        productName: "Clubsport V3",
        productType: "Pedals",
        productImage: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&auto=format",
        productHighlight: "LoadCell Brake",
        sortOrder: 3,
      },
    ],
  },
];

export default function Equipment3D() {
  const [brands, setBrands] = useState<Brand[]>(fallbackBrands);
  const [activeBrand, setActiveBrand] = useState<Brand>(fallbackBrands[0]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/showcase");
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            // Group products by brand
            const brandMap = new Map<string, Brand>();
            data.products.forEach((p: ShowcaseProduct) => {
              if (!brandMap.has(p.brandId)) {
                brandMap.set(p.brandId, {
                  id: p.brandId,
                  name: p.brandName,
                  logo: p.brandName[0],
                  color: p.brandColor,
                  description: "",
                  products: [],
                });
              }
              brandMap.get(p.brandId)!.products.push(p);
            });
            const groupedBrands = Array.from(brandMap.values());
            setBrands(groupedBrands);
            setActiveBrand(groupedBrands[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch showcase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section id="equipment" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 hud-grid-bg opacity-30" />

      {/* 3D Grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-56 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-floor opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ perspective: "1000px" }}>
        <div className="absolute w-[900px] h-[900px] ring-z opacity-30" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${activeBrand.color}15` }} />
        </div>
        <div className="absolute w-[600px] h-[600px] ring-x opacity-20" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${activeBrand.color}20` }} />
        </div>
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scan-line" style={{ animationDuration: "12s", opacity: 0.25 }} />
      </div>

      {/* Large glow behind active brand */}
      <motion.div
        key={activeBrand.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[180px] pointer-events-none"
        style={{ backgroundColor: `${activeBrand.color}10` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 mb-4">
            <Gamepad2 className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-[#60A5FA] text-sm uppercase tracking-widest font-medium">
              อุปกรณ์ระดับโปร
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white mb-4">
            PREMIUM{" "}
            <span className="brand-gradient-text">EQUIPMENT</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            อุปกรณ์ Sim Racing ระดับโลก พร้อมให้เช่าครบทุกแบรนด์ชั้นนำ
          </p>
        </motion.div>

        {/* Brand Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-14"
        >
          {brands.map((brand) => {
            const isActive = activeBrand.id === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand)}
                className={`relative group px-6 py-3 rounded-xl border border-dashed transition-all duration-300 ${
                  isActive
                    ? "bg-opacity-15 scale-105"
                    : "border-[#1A1A2E] hover:border-opacity-40"
                }`}
                style={{
                  borderColor: isActive ? `${brand.color}60` : undefined,
                  backgroundColor: isActive ? `${brand.color}15` : "transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBrandGlow"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: `0 0 30px ${brand.color}20, 0 0 60px ${brand.color}10`,
                    }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-lg font-black border border-dashed transition-all"
                    style={{
                      color: brand.color,
                      borderColor: `${brand.color}40`,
                      backgroundColor: `${brand.color}10`,
                    }}
                  >
                    {brand.logo}
                  </div>
                  <div className="text-left">
                    <div
                      className="text-sm font-black uppercase tracking-wider"
                      style={{ color: isActive ? brand.color : "#A1A1AA" }}
                    >
                      {brand.name}
                    </div>
                    <div className="text-[10px] text-[#71717A] uppercase tracking-wider hidden sm:block">
                      {brand.products.length} products
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Active Brand Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand description */}
            <div className="text-center mb-10">
              <p className="text-[#A1A1AA] text-base max-w-lg mx-auto">
                {activeBrand.description}
              </p>
            </div>

            {/* 3D Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
              {activeBrand.products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, rotateY: -15, y: 40 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  onMouseEnter={() => setHoveredProduct(product.productName)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group preserve-3d"
                >
                  <motion.div
                    animate={{
                      rotateY: hoveredProduct === product.productName ? 5 : 0,
                      rotateX: hoveredProduct === product.productName ? -3 : 0,
                      scale: hoveredProduct === product.productName ? 1.03 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative bg-[#0A0A1A] border border-dashed rounded-2xl overflow-hidden transition-colors"
                    style={{
                      borderColor:
                        hoveredProduct === product.productName
                          ? `${activeBrand.color}60`
                          : "#1A1A2E",
                      boxShadow:
                        hoveredProduct === product.productName
                          ? `0 20px 60px ${activeBrand.color}15, 0 0 30px ${activeBrand.color}10`
                          : "none",
                    }}
                  >
                    {/* Product type badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-dashed"
                        style={{
                          color: activeBrand.color,
                          borderColor: `${activeBrand.color}40`,
                          backgroundColor: `${activeBrand.color}10`,
                        }}
                      >
                        {product.productType}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                      <Image
                        src={product.productImage}
                        alt={product.productName}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-85 group-hover:scale-110 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${activeBrand.color}15 0%, transparent 70%)`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A1A] via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-white text-xl font-black uppercase mb-1 group-hover:text-glow-white transition-all">
                        {product.productName}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Gauge
                          className="h-4 w-4"
                          style={{ color: activeBrand.color }}
                        />
                        <span
                          className="text-sm font-bold"
                          style={{ color: activeBrand.color }}
                        >
                          {product.productHighlight}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#71717A] text-xs uppercase tracking-wider">
                          {activeBrand.name}
                        </span>
                        <div
                          className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: activeBrand.color }}
                        >
                          รายละเอียด
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    {/* Corner accents */}
                    <div
                      className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        borderRight: `2px dashed ${activeBrand.color}40`,
                        borderTop: `2px dashed ${activeBrand.color}40`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        borderLeft: `2px dashed ${activeBrand.color}40`,
                        borderBottom: `2px dashed ${activeBrand.color}40`,
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Brand CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-12"
            >
              <a
                href="#packages"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-base transition-all hover:scale-105"
                style={{
                  backgroundColor: activeBrand.color,
                  color: "#000",
                  boxShadow: `0 0 30px ${activeBrand.color}40, 0 0 60px ${activeBrand.color}15`,
                }}
              >
                <Zap className="h-5 w-5" fill="currentColor" />
                เช่าอุปกรณ์ {activeBrand.name}
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
