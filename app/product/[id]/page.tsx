import { getProduct, readProducts } from "@/lib/db";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, CONDITION_LABELS, CONDITION_COLORS } from "@/lib/types";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductImages from "@/components/sections/ProductImages";
import Link from "next/link";
import { ChevronLeft, MessageCircle, Phone, CheckCircle, Truck, ShieldCheck, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product || product.status === "inactive") notFound();

  const allProducts = (await readProducts()).filter(
    (p) => p.id !== id && p.status === "active" && p.brand === product.brand
  ).slice(0, 4);

  const conditionColor = CONDITION_COLORS[product.condition];
  const discount = product.originalPrice && product.salePrice
    ? Math.round((1 - product.salePrice / product.originalPrice) * 100)
    : 0;

  const lineMsg = encodeURIComponent(
    `สนใจสินค้า: ${product.title}\nราคา: ฿${(product.salePrice ?? product.rentPricePerDay)?.toLocaleString()}\nhttps://lightning-simracing.com/product/${id}`
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-8">
            <Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link>
            <span>/</span>
            {(product.type === "sale" || product.type === "both") && (
              <Link href="/shop" className="hover:text-white transition-colors">ซื้อสินค้า</Link>
            )}
            {product.type === "rent" && (
              <Link href="/rent" className="hover:text-white transition-colors">เช่าอุปกรณ์</Link>
            )}
            <span>/</span>
            <span className="text-white truncate">{product.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <ProductImages images={product.images} title={product.title} />

            {/* Info */}
            <div className="space-y-6">
              {/* Brand + Category + Condition */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-[#3B82F6] uppercase">{product.brand}</span>
                <span className="w-1 h-1 bg-[#374151] rounded-full" />
                <span className="text-xs text-[#6B7280]">{CATEGORY_LABELS[product.category]}</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-bold ml-auto"
                  style={{ background: `${conditionColor}20`, color: conditionColor }}
                >
                  {CONDITION_LABELS[product.condition]}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{product.title}</h1>

              {/* Price */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 space-y-3">
                {(product.type === "sale" || product.type === "both") && product.salePrice && (
                  <div>
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">ราคาขาย</p>
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-black text-[#3B82F6]">
                        ฿{product.salePrice.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-[#6B7280] line-through mb-0.5">
                          ฿{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-sm font-bold rounded-lg mb-0.5">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {(product.type === "rent" || product.type === "both") && (
                  <div className={product.salePrice ? "pt-3 border-t border-[#1E293B]" : ""}>
                    <p className="text-xs text-[#22C55E] uppercase tracking-wider mb-2">ราคาเช่า</p>
                    <div className="grid grid-cols-3 gap-3">
                      {product.rentPricePerDay && (
                        <div className="text-center bg-[#0A0A0F] rounded-xl p-2">
                          <p className="text-lg font-bold text-white">฿{product.rentPricePerDay.toLocaleString()}</p>
                          <p className="text-xs text-[#6B7280]">/ วัน</p>
                        </div>
                      )}
                      {product.rentPricePerWeek && (
                        <div className="text-center bg-[#0A0A0F] rounded-xl p-2">
                          <p className="text-lg font-bold text-white">฿{product.rentPricePerWeek.toLocaleString()}</p>
                          <p className="text-xs text-[#6B7280]">/ สัปดาห์</p>
                        </div>
                      )}
                      {product.rentPricePerMonth && (
                        <div className="text-center bg-[#0A0A0F] rounded-xl p-2">
                          <p className="text-lg font-bold text-white">฿{product.rentPricePerMonth.toLocaleString()}</p>
                          <p className="text-xs text-[#6B7280]">/ เดือน</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://line.me/ti/p/~@lightningsimracing?text=${lineMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#06C755] hover:bg-[#05A847] text-white font-bold rounded-xl transition-all text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  สนใจ? ติดต่อ LINE
                </a>
                <a
                  href="tel:0XX-XXX-XXXX"
                  className="flex items-center justify-center gap-2 py-3.5 px-6 bg-[#1E293B] hover:bg-[#374151] text-white font-bold rounded-xl transition-all text-sm"
                >
                  <Phone className="w-4 h-4" />
                  โทร
                </a>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "จัดส่งฟรี", sub: "กทม. + ปริมณฑล" },
                  { icon: ShieldCheck, label: "ของแท้ 100%", sub: "ตรวจสอบได้" },
                  { icon: Tag, label: "ราคาคุ้มค่า", sub: "มือสองสภาพดี" },
                ].map((g) => (
                  <div key={g.label} className="text-center bg-[#111827] border border-[#1E293B] rounded-xl p-3">
                    <g.icon className="w-5 h-5 text-[#3B82F6] mx-auto mb-1" />
                    <p className="text-xs font-bold text-white">{g.label}</p>
                    <p className="text-xs text-[#6B7280]">{g.sub}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">รายละเอียด</h2>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">จุดเด่น</h2>
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                        <CheckCircle className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs */}
              {Object.keys(product.specs).length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">สเปค</h2>
                  <div className="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden">
                    {Object.entries(product.specs).map(([k, v], i) => (
                      <div key={k} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t border-[#1E293B]" : ""}`}>
                        <span className="text-[#6B7280]">{k}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {allProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-white mb-6">สินค้าอื่นจาก {product.brand}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {allProducts.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden hover:border-[#3B82F6]/50 transition-colors group">
                    <div className="aspect-square bg-[#1E293B] bg-cover bg-center" style={{ backgroundImage: p.images[0] ? `url(${p.images[0]})` : undefined }} />
                    <div className="p-3">
                      <p className="text-sm font-medium text-white truncate group-hover:text-[#3B82F6] transition-colors">{p.title}</p>
                      {p.salePrice && <p className="text-sm text-[#3B82F6] font-bold">฿{p.salePrice.toLocaleString()}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
