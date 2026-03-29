"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Plus, Edit2, Trash2, X, Check, Image, Calendar, Tag, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
  featured: boolean;
  tags: string[];
}

const CATEGORIES = ["Guide", "Equipment", "Comparison", "Setup", "Tips", "Games", "Buying Guide", "Review"];
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=800",
  "https://images.unsplash.com/photo-1752959807835-3af0030dc3a9?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
  "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800",
];

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "Guide",
    featured: false,
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Fetch posts error:", error);
    }
    setLoading(false);
  }

  function openModal(post?: Post) {
    if (post) {
      setEditingPost(post);
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        featured: post.featured,
        tags: post.tags.join(", "),
      });
    } else {
      setEditingPost(null);
      setForm({ title: "", slug: "", excerpt: "", content: "", image: "", category: "Guide", featured: false, tags: "" });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingPost(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const url = editingPost ? "/api/blog" : "/api/blog";
      const method = editingPost ? "PUT" : "POST";
      if (editingPost) payload.id = editingPost.id;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchPosts();
        closeModal();
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("เกิดข้อผิดพลาด");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบบทความนี้?")) return;

    try {
      await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  function generateSlug(title: string) {
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, slug });
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white mb-2">
                <ArrowLeft className="w-4 h-4" />
                กลับ Dashboard
              </Link>
              <h1 className="text-3xl font-black text-white">จัดการบทความ</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-3 bg-[#A855F7] text-white font-bold rounded-xl hover:bg-[#9333EA] transition-all"
            >
              <Plus className="w-5 h-5" />
              เพิ่มบทความ
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
              <p className="text-[#9CA3AF] text-sm">บทความทั้งหมด</p>
              <p className="text-3xl font-black text-[#A855F7]">{posts.length}</p>
            </div>
            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
              <p className="text-[#9CA3AF] text-sm">แนะนำ</p>
              <p className="text-3xl font-black text-[#3B82F6]">{posts.filter((p) => p.featured).length}</p>
            </div>
            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
              <p className="text-[#9CA3AF] text-sm">หมวดหมู่</p>
              <p className="text-3xl font-black text-[#22C55E]">{new Set(posts.map((p) => p.category)).size}</p>
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="text-center py-20 text-[#6B7280]">กำลังโหลด...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6B7280] text-lg mb-4">ยังไม่มีบทความ</p>
              <button onClick={() => openModal()} className="px-5 py-3 bg-[#A855F7] text-white font-bold rounded-xl">
                เพิ่มบทความแรก
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 flex items-center gap-4">
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E293B]">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-[#A855F7]/20 text-[#A855F7] rounded">{post.category}</span>
                      {post.featured && <span className="text-xs px-2 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] rounded">แนะนำ</span>}
                    </div>
                    <h3 className="font-bold text-white truncate">{post.title}</h3>
                    <p className="text-sm text-[#6B7280]">{new Date(post.publishedAt).toLocaleDateString("th-TH")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => openModal(post)}
                      className="p-2 text-[#9CA3AF] hover:text-[#3B82F6] transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-[#9CA3AF] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0A1A] border border-[#1E293B] rounded-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0A0A1A] border-b border-[#1E293B] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingPost ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
              </h2>
              <button onClick={closeModal} className="text-[#9CA3AF] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">หัวข้อ *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => { setForm({ ...form, title: e.target.value }); if (!editingPost) generateSlug(e.target.value); }}
                  required
                  className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                  placeholder="หัวข้อบทความ"
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                  placeholder="url-slug"
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">คำอธิบายย่อ *</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  required
                  rows={2}
                  className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none resize-none"
                  placeholder="คำอธิบายสั้นๆ สำหรับ preview"
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">เนื้อหา *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                  rows={10}
                  className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none resize-none"
                  placeholder="เนื้อหาบทความ... ใช้ **หัวข้อ** และ - สำหรับ list"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">หมวดหมู่</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Tags (คั่นด้วย ,)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                    placeholder="direct drive, guide"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">รูปภาพ</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-[#0A0A0F] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                  placeholder="https://..."
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {SAMPLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, image: img })}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 ${form.image === img ? "border-[#A855F7]" : "border-transparent"}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-5 h-5 rounded bg-[#0A0A0F] border-[#1E293B] text-[#A855F7] focus:ring-[#A855F7]"
                />
                <label htmlFor="featured" className="text-white">บทความแนะนำ</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-[#1E293B] text-[#9CA3AF] font-bold rounded-xl hover:bg-[#374151]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-[#A855F7] text-white font-bold rounded-xl hover:bg-[#9333EA] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? "กำลังบันทึก..." : (editingPost ? "บันทึก" : "สร้างบทความ")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
