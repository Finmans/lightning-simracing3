import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { readProducts } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";
import { CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/types";
import { Plus, Pencil, Eye, Package, AlertTriangle } from "lucide-react";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export default async function AdminProducts() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== process.env.ADMIN_SECRET) redirect("/admin/login");

  const products = await readProducts();

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">จัดการสินค้า</h1>
            <p className="text-[#6B7280] text-sm mt-1">ทั้งหมด {products.length} รายการ</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-bold rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสินค้า
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="w-16 h-16 text-[#374151] mb-4" />
            <p className="text-[#9CA3AF] text-lg">ยังไม่มีสินค้า</p>
            <Link href="/admin/products/new" className="mt-4 text-[#3B82F6] hover:underline text-sm">
              + เพิ่มสินค้าแรก
            </Link>
          </div>
        ) : (
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden">
            {/* Low stock warning */}
            {products.filter((p) => p.status === "active" && (p.stockQuantity ?? 1) <= 1).length > 0 && (
              <div className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border-b border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-400">
                  มี {products.filter((p) => p.status === "active" && (p.stockQuantity ?? 1) <= 1).length} รายการที่สต็อคเหลือน้อย (≤1 ชิ้น)
                </p>
              </div>
            )}

            {/* Header */}
            <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-[#1E293B] text-xs text-[#6B7280] uppercase tracking-wider">
              <span>รูป</span>
              <span>ชื่อสินค้า</span>
              <span>ประเภท</span>
              <span>ราคา</span>
              <span>สต็อค</span>
              <span>สถานะ</span>
              <span>จัดการ</span>
            </div>
            <div className="divide-y divide-[#1E293B]">
              {products.map((p) => {
                const stock = p.stockQuantity ?? 1;
                const stockColor = stock === 0 ? "text-red-400" : stock <= 1 ? "text-amber-400" : "text-green-400";
                const stockBg = stock === 0 ? "bg-red-500/10 border-red-500/20" : stock <= 1 ? "bg-amber-500/10 border-amber-500/20" : "bg-green-500/10 border-green-500/20";
                return (
                <div key={p.id} className="grid md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto] grid-cols-1 gap-4 px-6 py-4 hover:bg-[#1E293B]/30 transition-colors items-center">
                  {/* Image */}
                  <div
                    className="w-14 h-14 rounded-xl bg-[#1E293B] bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: p.images[0] ? `url(${p.images[0]})` : undefined }}
                  />
                  {/* Info */}
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{p.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {p.brand} · {CATEGORY_LABELS[p.category]} · {CONDITION_LABELS[p.condition]}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye className="w-3 h-3 text-[#374151]" />
                      <span className="text-xs text-[#374151]">{p.views} ครั้ง</span>
                    </div>
                  </div>
                  {/* Type */}
                  <div className="flex gap-1">
                    {(p.type === "sale" || p.type === "both") && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">ขาย</span>
                    )}
                    {(p.type === "rent" || p.type === "both") && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E]">เช่า</span>
                    )}
                  </div>
                  {/* Price */}
                  <div className="text-right">
                    {p.salePrice && (
                      <p className="text-sm font-bold text-[#3B82F6]">฿{p.salePrice.toLocaleString()}</p>
                    )}
                    {p.rentPricePerDay && (
                      <p className="text-xs text-[#22C55E]">฿{p.rentPricePerDay.toLocaleString()}/วัน</p>
                    )}
                  </div>
                  {/* Stock */}
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${stockBg} ${stockColor}`}>
                      {stock === 0 ? "หมด" : `${stock} ชิ้น`}
                    </span>
                    {stock <= 1 && stock > 0 && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> เหลือน้อย
                      </span>
                    )}
                  </div>
                  {/* Status */}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.status === "active" ? "bg-green-500/20 text-green-400" :
                    p.status === "sold" ? "bg-red-500/20 text-red-400" :
                    p.status === "rented" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-[#374151] text-[#9CA3AF]"
                  }`}>
                    {p.status === "active" ? "ใช้งาน" : p.status === "sold" ? "ขายแล้ว" : p.status === "rented" ? "ถูกเช่า" : "ซ่อน"}
                  </span>
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-[#1E293B] hover:bg-[#374151] rounded-lg transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      แก้ไข
                    </Link>
                    <AdminDeleteButton id={p.id} title={p.title} />
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
