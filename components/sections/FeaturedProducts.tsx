import { readProducts } from "@/lib/db";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { ShoppingBag, RotateCcw, ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const products = readProducts().filter((p) => p.featured && p.status === "active");
  const forSale = products.filter((p) => p.type === "sale").slice(0, 4);
  const forRent = products.filter((p) => p.type === "rent").slice(0, 4);

  return (
    <section className="py-20 px-4 sm:px-6 bg-black">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* For Sale */}
        {forSale.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#3B82F6] uppercase">สินค้ามือสอง</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">สินค้าแนะนำ</h2>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors font-medium"
              >
                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {forSale.map((p, i) => (
                <ProductCard key={p.id} product={p} mode="sale" index={i} />
              ))}
            </div>
          </div>
        )}

        {/* For Rent */}
        {forRent.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#22C55E] uppercase">บริการเช่า</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">เช่าอุปกรณ์ถึงบ้าน</h2>
              </div>
              <Link
                href="/rent"
                className="flex items-center gap-1.5 text-sm text-[#22C55E] hover:text-[#4ADE80] transition-colors font-medium"
              >
                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {forRent.map((p, i) => (
                <ProductCard key={p.id} product={p} mode="rent" index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
