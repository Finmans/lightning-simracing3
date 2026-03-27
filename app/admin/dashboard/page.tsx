import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { readProducts } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";
import { Package, Tag, Eye, TrendingUp, Plus, ShoppingCart, RotateCcw, AlertTriangle, Boxes } from "lucide-react";

export default async function Dashboard() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== process.env.ADMIN_SECRET) redirect("/admin/login");

  const products = await readProducts();
  const forSale = products.filter((p) => (p.type === "sale" || p.type === "both") && p.status === "active");
  const forRent = products.filter((p) => (p.type === "rent" || p.type === "both") && p.status === "active");
  const sold = products.filter((p) => p.status === "sold");
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalStock = products.filter((p) => p.status === "active").reduce((sum, p) => sum + (p.stockQuantity ?? 1), 0);
  const lowStockProducts = products.filter((p) => p.status === "active" && (p.stockQuantity ?? 1) <= 1);
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-[#6B7280] text-sm mt-1">ภาพรวมร้านค้า Lightning SimRacing</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-bold rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสินค้า
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { icon: ShoppingCart, label: "สินค้าขาย", value: forSale.length, color: "#3B82F6", bg: "#3B82F6/10" },
            { icon: RotateCcw, label: "สินค้าเช่า", value: forRent.length, color: "#22C55E", bg: "#22C55E/10" },
            { icon: Boxes, label: "สต็อครวม", value: `${totalStock} ชิ้น`, color: "#38BDF8", bg: "#38BDF8/10" },
            { icon: Tag, label: "ขายแล้ว", value: sold.length, color: "#F59E0B", bg: "#F59E0B/10" },
            { icon: Eye, label: "ยอดชม", value: totalViews, color: "#8B5CF6", bg: "#8B5CF6/10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#6B7280]">{stat.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">สต็อคเหลือน้อย</h2>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{lowStockProducts.length} รายการ</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 bg-[#111827] hover:bg-[#1E293B] border border-amber-500/20 rounded-xl transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg bg-[#1E293B] bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: p.images[0] ? `url(${p.images[0]})` : undefined }}
                  />
                  <div>
                    <p className="text-xs font-medium text-white truncate max-w-[140px]">{p.title}</p>
                    <p className="text-[10px] text-amber-400">
                      {(p.stockQuantity ?? 1) === 0 ? "หมดสต็อค" : `เหลือ ${p.stockQuantity} ชิ้น`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Products */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B]">
            <h2 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              สินค้าล่าสุด
            </h2>
            <Link href="/admin/products" className="text-sm text-[#3B82F6] hover:underline">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="divide-y divide-[#1E293B]">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E293B]/30 transition-colors">
                <div
                  className="w-12 h-12 rounded-xl bg-[#1E293B] bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: p.images[0] ? `url(${p.images[0]})` : undefined }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{p.title}</p>
                  <p className="text-xs text-[#6B7280]">{p.brand} · {p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {p.salePrice && (
                    <p className="text-sm font-bold text-[#3B82F6]">฿{p.salePrice.toLocaleString()}</p>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === "active" ? "bg-green-500/20 text-green-400" :
                      p.status === "sold" ? "bg-red-500/20 text-red-400" :
                      "bg-[#374151] text-[#9CA3AF]"
                    }`}>
                      {p.status === "active" ? "ใช้งาน" : p.status === "sold" ? "ขายแล้ว" : p.status}
                    </span>
                    {p.status === "active" && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        (p.stockQuantity ?? 1) === 0 ? "bg-red-500/10 border-red-500/20 text-red-400" :
                        (p.stockQuantity ?? 1) <= 1 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        "bg-[#1E293B] border-[#374151] text-[#6B7280]"
                      }`}>
                        {(p.stockQuantity ?? 1) === 0 ? "หมด" : `${p.stockQuantity ?? 1} ชิ้น`}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="text-xs text-[#6B7280] hover:text-white transition-colors ml-2"
                >
                  แก้ไข
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
