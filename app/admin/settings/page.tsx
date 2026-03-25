"use client";

import { useState, useEffect, useRef } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { Upload, Save, Loader2, Check, Image as ImageIcon, Phone, MapPin, MessageCircle, Type } from "lucide-react";
import Image from "next/image";

export default function AdminSettings() {
  const [form, setForm] = useState({
    heroImage: "",
    heroCardTitle: "",
    heroCardPrice: "",
    siteName: "",
    phone: "",
    lineId: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setForm);
  }, []);

  async function uploadImage(file: File, field: "heroImage") {
    if (field === "heroImage") setUploadingHero(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, [field]: url }));
    }
    if (field === "heroImage") setUploadingHero(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const labelClass = "block text-sm font-medium text-[#9CA3AF] mb-1.5";
  const inputClass = "w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors text-sm";

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <AdminNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">ตั้งค่าเว็บไซต์</h1>
          <p className="text-[#6B7280] text-sm mt-1">แก้ไขรูปภาพและข้อมูลทั่วไปของเว็บ</p>
        </div>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#3B82F6]" />
              รูปหน้าแรก (Hero)
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Current image preview */}
              <div>
                <p className={labelClass}>รูปปัจจุบัน</p>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1E293B] border border-[#374151]">
                  {form.heroImage ? (
                    <Image src={form.heroImage} alt="Hero" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#374151]">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload new */}
              <div className="flex flex-col gap-3">
                <p className={labelClass}>เปลี่ยนรูป</p>
                <button
                  type="button"
                  onClick={() => heroFileRef.current?.click()}
                  className="flex-1 rounded-xl border-2 border-dashed border-[#1E293B] hover:border-[#3B82F6] flex flex-col items-center justify-center gap-2 py-8 transition-colors"
                >
                  {uploadingHero ? (
                    <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-[#6B7280]" />
                      <span className="text-sm text-[#6B7280]">คลิกเพื่ออัพโหลด</span>
                      <span className="text-xs text-[#374151]">JPG, PNG, WebP</span>
                    </>
                  )}
                </button>
                <input
                  ref={heroFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "heroImage")}
                />
                <div>
                  <p className={labelClass}>หรือใส่ URL รูป</p>
                  <input
                    className={inputClass}
                    placeholder="https://..."
                    value={form.heroImage}
                    onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Hero card text */}
            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#1E293B]">
              <div>
                <label className={labelClass}>ชื่อสินค้าบน Hero Card</label>
                <input
                  className={inputClass}
                  placeholder="Fanatec GT DD Pro Bundle"
                  value={form.heroCardTitle}
                  onChange={(e) => setForm({ ...form, heroCardTitle: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>ราคาบน Hero Card</label>
                <input
                  className={inputClass}
                  placeholder="฿32,900"
                  value={form.heroCardPrice}
                  onChange={(e) => setForm({ ...form, heroCardPrice: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Site Info */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#3B82F6]" />
              ข้อมูลร้านค้า
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>ชื่อร้าน</label>
                <input
                  className={inputClass}
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass + " flex items-center gap-1.5"}>
                    <Phone className="w-3.5 h-3.5" /> เบอร์โทร
                  </label>
                  <input
                    className={inputClass}
                    placeholder="099-999-9999"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass + " flex items-center gap-1.5"}>
                    <MessageCircle className="w-3.5 h-3.5" /> LINE ID
                  </label>
                  <input
                    className={inputClass}
                    placeholder="@lightningsimracing"
                    value={form.lineId}
                    onChange={(e) => setForm({ ...form, lineId: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass + " flex items-center gap-1.5"}>
                  <MapPin className="w-3.5 h-3.5" /> พื้นที่จัดส่ง
                </label>
                <input
                  className={inputClass}
                  placeholder="กรุงเทพมหานคร และปริมณฑล"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#3B82F6]" />
              โลโก้
            </h2>
            <p className="text-xs text-[#6B7280] mb-4">
              แทนไฟล์ <code className="bg-[#1E293B] px-1.5 py-0.5 rounded text-[#60A5FA]">/public/logo.svg</code> ด้วยไฟล์ใหม่ (SVG หรือ PNG ขนาด 180×40px แนะนำ)
            </p>
            <LogoUploader />
          </div>

          {/* Save button */}
          <div className="flex justify-end pb-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl transition-all disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? "บันทึกแล้ว!" : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function LogoUploader() {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    // Upload to /api/upload/logo which replaces /public/logo.svg
    const res = await fetch("/api/upload/logo", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 h-10 bg-[#1E293B] rounded-lg flex items-center justify-center overflow-hidden border border-[#374151]">
        <Image src="/logo.svg" alt="Logo" width={120} height={32} className="object-contain" />
      </div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] hover:bg-[#374151] text-white text-sm rounded-xl transition-colors"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : done ? <Check className="w-4 h-4 text-green-400" /> : <Upload className="w-4 h-4" />}
        {done ? "อัพโหลดแล้ว!" : "เปลี่ยนโลโก้"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/svg+xml,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
    </div>
  );
}
