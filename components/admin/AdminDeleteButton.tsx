"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function AdminDeleteButton({ id, title }: { id: string; title: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          {loading ? "..." : "ยืนยัน"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-2 py-1.5 text-xs text-[#9CA3AF] hover:text-white bg-[#1E293B] rounded-lg"
        >
          ยกเลิก
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
      title={`ลบ ${title}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
