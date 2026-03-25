import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminNav from "@/components/admin/AdminNav";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProduct() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== process.env.ADMIN_SECRET) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <AdminNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/admin/products" className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-white transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" />
            กลับ
          </Link>
          <h1 className="text-2xl font-bold text-white">เพิ่มสินค้าใหม่</h1>
          <p className="text-[#6B7280] text-sm mt-1">กรอกข้อมูลสินค้าที่ต้องการลงขาย/ให้เช่า</p>
        </div>
        <ProductForm mode="new" />
      </main>
    </div>
  );
}
