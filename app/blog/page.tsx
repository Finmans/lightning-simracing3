import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

const BASE_URL = "https://lightning-simracing.vercel.app";

const blogData = require("@/data/posts.json");

export const metadata: Metadata = {
  title: `ข่าวสารและบทความ Sim Racing | Lightning SimRacing`,
  description: "อ่านบทความและข่าวสารเกี่ยวกับ Sim Racing ทั้งเรื่องการเลือกซื้ออุปกรณ์ เทคนิคการเล่น และรีวิวต่างๆ จาก Lightning SimRacing",
  openGraph: {
    title: `ข่าวสารและบทความ Sim Racing | Lightning SimRacing`,
    description: "บทความและข่าวสารเกี่ยวกับ Sim Racing จากทีมผู้เชี่ยวชาญ",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = blogData;
  const featured = posts.find((p: any) => p.featured);
  const others = posts.filter((p: any) => !p.featured || p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-[#050510] to-black overflow-hidden">
          <div className="absolute inset-0 hud-grid-bg opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[#A855F7]/30 bg-[#A855F7]/5 mb-4">
                <span className="text-[#A855F7] text-sm uppercase tracking-widest font-medium">Blog & Articles</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                ข่าวสาร & <span className="text-[#A855F7]">บทความ</span>
              </h1>
              <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                อ่านบทความเกี่ยวกับ Sim Racing จากผู้เชี่ยวชาญ ไม่ว่าจะเป็นการเลือกซื้ออุปกรณ์ เทคนิคการเล่น หรือรีวิวต่างๆ
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          {/* Featured Post */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
              <div className="relative overflow-hidden rounded-2xl bg-[#111827] border border-[#1E293B]">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827] hidden md:block" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-3">{featured.category}</span>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-[#A855F7] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[#9CA3AF] mb-6 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featured.publishedAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featured.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden hover:border-[#A855F7]/50 transition-all h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-2">{post.category}</span>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#A855F7] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("th-TH", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1 text-[#A855F7] group-hover:translate-x-1 transition-transform">
                        อ่านต่อ <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Topics */}
          <div className="mt-16 p-6 bg-[#111827] border border-dashed border-[#1E293B] rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">หัวข้อยอดนิยม</h3>
            <div className="flex flex-wrap gap-2">
              {["Direct Drive", "LoadCell", "Cockpit", "VR", "Beginner Guide", "Buying Guide", "Fanatec", "Simagic", "Moza", "Triple Screen"].map((tag) => (
                <span key={tag} className="px-4 py-2 text-sm text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-full hover:bg-[#A855F7]/20 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
