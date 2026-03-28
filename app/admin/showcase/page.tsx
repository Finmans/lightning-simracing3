"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { Upload, X, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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

export default function AdminShowcase() {
  const router = useRouter();
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/showcase");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(productId: string, files: FileList) {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("ไฟล์ใหญ่เกินไป (สูงสุด 5MB)");
      return;
    }

    setUploadingFor(productId);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });

      if (res.ok) {
        const { url } = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, productImage: url } : p))
        );
        setSaved(productId);
        setTimeout(() => setSaved(null), 2000);
      } else {
        const data = await res.json();
        setError(data.error || "อัพโหลดล้มเหลว");
      }
    } catch {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setUploadingFor(null);
    }
  }

  async function handleSave(product: ShowcaseProduct) {
    setSaving(product.id);
    setError(null);

    try {
      const res = await fetch("/api/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          productName: product.productName,
          productType: product.productType,
          productImage: product.productImage,
          productHighlight: product.productHighlight,
        }),
      });

      if (res.ok) {
        setSaved(product.id);
        setTimeout(() => setSaved(null), 2000);
      } else {
        setError("บันทึกล้มเหลว");
      }
    } catch {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setSaving(null);
    }
  }

  function updateProduct(id: string, field: keyof ShowcaseProduct, value: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <AdminNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">หน้าแรก - สินค้าแนะนำ</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            เปลี่ยนรูปและข้อมูลสินค้าที่แสดงในหน้าแรก (Section บนสุด)
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6"
            >
              <div className="flex items-start gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-40 h-28 rounded-xl overflow-hidden bg-[#1E293B] group">
                    <Image
                      src={product.productImage}
                      alt={product.productName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleImageUpload(product.id, e.target.files)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploadingFor === product.id}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                    >
                      {uploadingFor === product.id ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#374151] mt-2 text-center">คลิกเปลี่ยนรูป</p>
                </div>

                {/* Fields */}
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
                      ชื่อสินค้า
                    </label>
                    <input
                      className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors text-sm"
                      value={product.productName}
                      onChange={(e) =>
                        updateProduct(product.id, "productName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
                      ประเภท
                    </label>
                    <input
                      className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors text-sm"
                      value={product.productType}
                      onChange={(e) =>
                        updateProduct(product.id, "productType", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
                      จุดเด่น
                    </label>
                    <input
                      className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors text-sm"
                      value={product.productHighlight}
                      onChange={(e) =>
                        updateProduct(product.id, "productHighlight", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleSave(product)}
                  disabled={saving === product.id}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60"
                >
                  {saving === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved === product.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saved === product.id ? "บันทึกแล้ว" : "บันทึก"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
