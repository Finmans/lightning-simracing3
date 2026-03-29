import { Metadata } from "next";
import { readProducts } from "@/lib/db";
import { ProductCategory } from "@/lib/types";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductCard from "@/components/sections/ProductCard";
import ShopFilters from "@/components/sections/ShopFilters";
import Link from "next/link";
import { Tag, RotateCcw, ShoppingBag, ChevronRight } from "lucide-react";

const BASE_URL = "https://lightning-simracing.vercel.app";
const SITE_NAME = "Lightning SimRacing";

export const metadata: Metadata = {
  title: `ซื้อสินค้ามือสอง | ${SITE_NAME}`,
  description:
    "ซื้อสินค้าอุปกรณ์ Sim Racing มือสอง Fanatec, Simagic, Moza, Logitech สภาพดี ราคาคุ้มค่า มีรูปจริง พร้อมส่ง จัดส่งฟรี ติดตั้งฟรีในกรุงเทพและปริมณฑล",
  keywords: [
    "ซื้อ sim racing มือสอง",
    "fanatec มือสอง",
    "simagic มือสอง",
    "moza มือสอง",
    "direct drive wheel มือสอง",
    "sim racing bundle",
  ],
  openGraph: {
    title: `ซื้อสินค้ามือสอง | ${SITE_NAME}`,
    description: "อุปกรณ์ Sim Racing มือสอง สภาพดี ราคาคุ้มค่า จัดส่งฟรี ติดตั้งฟรี",
    url: `${BASE_URL}/shop`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `ซื้อสินค้ามือสอง | ${SITE_NAME}`,
    description: "อุปกรณ์ Sim Racing มือสอง สภาพดี ราคาคุ้มค่า จัดส่งฟรี",
  },
  alternates: {
    canonical: `${BASE_URL}/shop`,
  },
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const allProducts = (await readProducts()).filter(
    (p) => p.type === "sale" && p.status === "active"
  );

  let products = allProducts;
  if (sp.category) products = products.filter((p) => p.category === sp.category);
  if (sp.brand) products = products.filter((p) => p.brand.toLowerCase() === sp.brand?.toLowerCase());
  if (sp.q) products = products.filter((p) =>
    `${p.title} ${p.brand} ${p.description}`.toLowerCase().includes(sp.q!.toLowerCase())
  );

  const brands = [...new Set(allProducts.map((p) => p.brand))];
  const categories = [...new Set(allProducts.map((p) => p.category))] as ProductCategory[];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 pb-16">

        {/* Hero Header */}
        <div className="relative bg-gradient-to-b from-[#050510] to-black overflow-hidden">
          {/* Grid bg */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }}
          />
          {/* Blue glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
            {/* Mode switcher tabs */}
            <div className="flex gap-2 mb-8">
              <div className="flex bg-[#111827] border border-[#1E293B] rounded-2xl p-1 gap-1">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] rounded-xl">
                  <Tag className="w-4 h-4 text-white" />
                  <span className="text-sm font-black text-white uppercase tracking-wide">ซื้อสินค้ามือสอง</span>
                </div>
                <Link
                  href="/rent"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#6B7280] hover:text-white hover:bg-[#1E293B] transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wide">เช่าอุปกรณ์</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-5 h-5 text-[#3B82F6]" />
                  <p className="text-xs font-bold tracking-[0.3em] text-[#3B82F6] uppercase">สินค้ามือสอง</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  ซื้อ<span className="text-[#3B82F6]">อุปกรณ์</span><br />
                  <span className="text-[#6B7280] text-2xl md:text-3xl font-bold">Sim Racing มือสอง</span>
                </h1>
                <p className="text-[#6B7280] text-sm mt-3 max-w-lg">
                  อุปกรณ์สภาพดี ราคาคุ้มค่า มีรูปจริง พร้อมส่ง — ซื้อแล้วจัดส่งถึงบ้าน
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-3xl font-black text-[#3B82F6]">{allProducts.length}</p>
                  <p className="text-xs text-[#6B7280]">รายการทั้งหมด</p>
                </div>
                <div className="w-px h-10 bg-[#1E293B]" />
                <Link
                  href="/rent"
                  className="flex items-center gap-2 text-xs text-[#22C55E] hover:text-white transition-colors group"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  ดูสินค้าให้เช่า
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />
          </div>
        </div>

        {/* Filters + Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <ShopFilters
            brands={brands}
            categories={categories}
            currentBrand={sp.brand}
            currentCategory={sp.category as ProductCategory | undefined}
            currentQ={sp.q}
            mode="sale"
          />

          {products.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-12 h-12 text-[#374151] mx-auto mb-4" />
              <p className="text-[#6B7280] text-lg">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
              <Link href="/shop" className="mt-4 inline-block text-[#3B82F6] hover:underline text-sm">ล้างตัวกรอง</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} mode="sale" index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
