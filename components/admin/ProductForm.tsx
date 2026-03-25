"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductCategory, ProductCondition, ProductType, ProductStatus, CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/types";
import { Upload, X, Plus, Minus, ChevronDown, Save, Loader2 } from "lucide-react";
import Image from "next/image";

type FormMode = "new" | "edit";

interface Props {
  mode: FormMode;
  initialData?: Product;
}

const emptyForm = {
  title: "",
  brand: "",
  category: "wheel-base" as ProductCategory,
  type: "sale" as ProductType,
  condition: "like-new" as ProductCondition,
  salePrice: "",
  originalPrice: "",
  rentPricePerDay: "",
  rentPricePerWeek: "",
  rentPricePerMonth: "",
  description: "",
  features: [""],
  specs: [{ key: "", value: "" }],
  images: [] as string[],
  status: "active" as ProductStatus,
  featured: false,
  stockQuantity: "1",
};

export default function ProductForm({ mode, initialData }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title,
        brand: initialData.brand,
        category: initialData.category,
        type: initialData.type,
        condition: initialData.condition,
        salePrice: initialData.salePrice?.toString() ?? "",
        originalPrice: initialData.originalPrice?.toString() ?? "",
        rentPricePerDay: initialData.rentPricePerDay?.toString() ?? "",
        rentPricePerWeek: initialData.rentPricePerWeek?.toString() ?? "",
        rentPricePerMonth: initialData.rentPricePerMonth?.toString() ?? "",
        description: initialData.description,
        features: initialData.features.length ? initialData.features : [""],
        specs: Object.entries(initialData.specs).map(([key, value]) => ({ key, value })),
        images: initialData.images,
        status: initialData.status,
        featured: initialData.featured,
        stockQuantity: (initialData.stockQuantity ?? 1).toString(),
      };
    }
    return emptyForm;
  });

  async function handleImageUpload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    }
    setUploading(false);
  }

  function removeImage(idx: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      brand: form.brand,
      category: form.category,
      type: form.type,
      condition: form.condition,
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      rentPricePerDay: form.rentPricePerDay ? Number(form.rentPricePerDay) : null,
      rentPricePerWeek: form.rentPricePerWeek ? Number(form.rentPricePerWeek) : null,
      rentPricePerMonth: form.rentPricePerMonth ? Number(form.rentPricePerMonth) : null,
      description: form.description,
      features: form.features.filter(Boolean),
      specs: Object.fromEntries(form.specs.filter((s) => s.key).map((s) => [s.key, s.value])),
      images: form.images,
      status: form.status,
      featured: form.featured,
      stockQuantity: Number(form.stockQuantity) || 1,
    };

    const url = mode === "edit" ? `/api/products/${initialData!.id}` : "/api/products";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
    setSaving(false);
  }

  const labelClass = "block text-sm font-medium text-[#9CA3AF] mb-1.5";
  const inputClass = "w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors text-sm";
  const selectClass = inputClass + " appearance-none cursor-pointer";

  const showSaleFields = form.type === "sale" || form.type === "both";
  const showRentFields = form.type === "rent" || form.type === "both";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">ข้อมูลพื้นฐาน</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ชื่อสินค้า *</label>
            <input required className={inputClass} placeholder="เช่น Fanatec GT DD Pro 8Nm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>แบรนด์ *</label>
            <input required className={inputClass} placeholder="Fanatec / Simagic / Moza..." value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <label className={labelClass}>หมวดหมู่</label>
            <select className={selectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <div className="relative">
            <label className={labelClass}>ประเภท</label>
            <select className={selectClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProductType })}>
              <option value="sale">ขายสินค้ามือสอง</option>
              <option value="rent">ให้เช่า</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <div className="relative">
            <label className={labelClass}>สภาพสินค้า</label>
            <select className={selectClass} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value as ProductCondition })}>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>รายละเอียด</label>
          <textarea
            rows={4}
            className={inputClass + " resize-none"}
            placeholder="อธิบายสินค้า สภาพ ประวัติการใช้งาน..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">ราคา</h2>
        {showSaleFields && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ราคาขาย (฿)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>ราคาเดิม / ราคา Retail (฿)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
            </div>
          </div>
        )}
        {showRentFields && (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>ราคาเช่า/วัน (฿)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.rentPricePerDay} onChange={(e) => setForm({ ...form, rentPricePerDay: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>ราคาเช่า/สัปดาห์ (฿)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.rentPricePerWeek} onChange={(e) => setForm({ ...form, rentPricePerWeek: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>ราคาเช่า/เดือน (฿)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.rentPricePerMonth} onChange={(e) => setForm({ ...form, rentPricePerMonth: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* Images */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">รูปภาพ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#1E293B] group">
              <Image src={img} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-xs bg-[#3B82F6] text-white px-2 py-0.5 rounded-full">หลัก</span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#1E293B] hover:border-[#3B82F6] flex flex-col items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280]">อัพโหลด</span>
              </>
            )}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
        />
        <p className="text-xs text-[#374151]">รองรับ JPG, PNG, WebP รูปแรกจะเป็นรูปหลัก</p>
      </div>

      {/* Features */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">จุดเด่น</h2>
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                placeholder={`จุดเด่นที่ ${i + 1}`}
                value={f}
                onChange={(e) => {
                  const arr = [...form.features];
                  arr[i] = e.target.value;
                  setForm({ ...form, features: arr });
                }}
              />
              <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, j) => j !== i) })}
                className="w-10 h-10 rounded-xl bg-[#1E293B] hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0">
                <Minus className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, features: [...form.features, ""] })}
            className="flex items-center gap-2 text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors mt-2">
            <Plus className="w-4 h-4" /> เพิ่มจุดเด่น
          </button>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">สเปค</h2>
        <div className="space-y-2">
          {form.specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputClass} placeholder="ชื่อ เช่น Max Torque" value={s.key}
                onChange={(e) => { const arr = [...form.specs]; arr[i] = { ...arr[i], key: e.target.value }; setForm({ ...form, specs: arr }); }} />
              <input className={inputClass} placeholder="ค่า เช่น 8Nm" value={s.value}
                onChange={(e) => { const arr = [...form.specs]; arr[i] = { ...arr[i], value: e.target.value }; setForm({ ...form, specs: arr }); }} />
              <button type="button" onClick={() => setForm({ ...form, specs: form.specs.filter((_, j) => j !== i) })}
                className="w-10 h-10 rounded-xl bg-[#1E293B] hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0">
                <Minus className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, specs: [...form.specs, { key: "", value: "" }] })}
            className="flex items-center gap-2 text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors mt-2">
            <Plus className="w-4 h-4" /> เพิ่มสเปค
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">ตั้งค่า</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <label className={labelClass}>สถานะ</label>
            <select className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}>
              <option value="active">ใช้งาน (แสดงในร้าน)</option>
              <option value="sold">ขายแล้ว</option>
              <option value="rented">ถูกเช่าอยู่</option>
              <option value="inactive">ซ่อน</option>
            </select>
            <ChevronDown className="absolute right-3 top-9 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <div>
            <label className={labelClass}>จำนวนสต็อค (ชิ้น)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, stockQuantity: String(Math.max(0, Number(form.stockQuantity) - 1)) })}
                className="w-10 h-10 rounded-xl bg-[#1E293B] hover:bg-[#374151] flex items-center justify-center text-white font-bold text-lg transition-colors flex-shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                className={inputClass + " text-center"}
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, stockQuantity: String(Number(form.stockQuantity) + 1) })}
                className="w-10 h-10 rounded-xl bg-[#1E293B] hover:bg-[#374151] flex items-center justify-center text-white font-bold text-lg transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {Number(form.stockQuantity) === 0 && (
              <p className="text-xs text-red-400 mt-1">สต็อคหมด — สินค้าจะยังแสดงแต่มีป้าย &quot;หมด&quot;</p>
            )}
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${form.featured ? "bg-[#3B82F6]" : "bg-[#374151]"}`}
                onClick={() => setForm({ ...form, featured: !form.featured })}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm text-[#9CA3AF]">แสดงในหน้าแรก (Featured)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button type="button" onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 text-sm text-[#9CA3AF] hover:text-white bg-[#1E293B] rounded-xl transition-colors">
          ยกเลิก
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {mode === "new" ? "เพิ่มสินค้า" : "บันทึก"}
        </button>
      </div>
    </form>
  );
}
