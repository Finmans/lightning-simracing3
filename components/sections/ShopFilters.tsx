"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCategory, CATEGORY_LABELS } from "@/lib/types";
import { Search, X } from "lucide-react";
import { useRef, useTransition } from "react";

interface Props {
  brands: string[];
  categories: ProductCategory[];
  currentBrand?: string;
  currentCategory?: ProductCategory;
  currentQ?: string;
  mode: "sale" | "rent";
}

export default function ShopFilters({ brands, categories, currentBrand, currentCategory, currentQ, mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  const basePath = mode === "sale" ? "/shop" : "/rent";
  const activeColor = mode === "sale" ? "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/40" : "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/40";

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
        <input
          ref={inputRef}
          defaultValue={currentQ}
          placeholder="ค้นหาสินค้า..."
          className="w-full bg-[#111827] border border-[#1E293B] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#374151] focus:border-[#3B82F6] focus:outline-none transition-colors"
          onKeyDown={(e) => e.key === "Enter" && updateParam("q", inputRef.current?.value || null)}
        />
        {currentQ && (
          <button onClick={() => { if (inputRef.current) inputRef.current.value = ""; updateParam("q", null); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        {/* All */}
        <button
          onClick={() => router.push(basePath)}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${!currentCategory && !currentBrand ? activeColor : "text-[#6B7280] border-[#1E293B] hover:border-[#374151] hover:text-white"}`}
        >
          ทั้งหมด
        </button>

        {/* Categories */}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParam("category", currentCategory === cat ? null : cat)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${currentCategory === cat ? activeColor : "text-[#6B7280] border-[#1E293B] hover:border-[#374151] hover:text-white"}`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}

        {/* Separator */}
        {brands.length > 0 && <div className="w-px bg-[#1E293B] mx-1" />}

        {/* Brands */}
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => updateParam("brand", currentBrand === brand ? null : brand)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${currentBrand === brand ? activeColor : "text-[#6B7280] border-[#1E293B] hover:border-[#374151] hover:text-white"}`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Active filters summary */}
      {(currentCategory || currentBrand || currentQ) && (
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span>กรองด้วย:</span>
          {currentQ && <span className="px-2 py-0.5 bg-[#1E293B] rounded-full text-white">"{currentQ}"</span>}
          {currentCategory && <span className="px-2 py-0.5 bg-[#1E293B] rounded-full text-white">{CATEGORY_LABELS[currentCategory]}</span>}
          {currentBrand && <span className="px-2 py-0.5 bg-[#1E293B] rounded-full text-white">{currentBrand}</span>}
          <button onClick={() => router.push(basePath)} className="text-[#3B82F6] hover:underline ml-1">ล้างทั้งหมด</button>
        </div>
      )}
    </div>
  );
}
