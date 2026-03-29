import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";

const BASE_URL = "https://lightning-simracing.vercel.app";

const blogData = require("@/data/posts.json");

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogData.map((post: any) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData.find((p: any) => p.slug === slug);
  if (!post) return { title: "ไม่พบบทความ" };

  return {
    title: `${post.title} | Lightning SimRacing Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Lightning SimRacing`,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogData.find((p: any) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = blogData
    .filter((p: any) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const contentParagraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าบทความ
          </Link>

          {/* Article */}
          <article>
            {/* Header */}
            <header className="mb-8">
              <span className="text-sm font-bold text-[#A855F7] uppercase tracking-wider">{post.category}</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#9CA3AF] mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>

              {/* Featured Image */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Excerpt */}
              <div className="bg-[#111827] border border-dashed border-[#1E293B] rounded-xl p-5 mb-8">
                <p className="text-lg text-[#D1D5DB] italic">{post.excerpt}</p>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              {contentParagraphs.map((para: string, i: number) => {
                if (para.startsWith("**") && para.endsWith("**")) {
                  return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-4">{para.replace(/\*\*/g, "")}</h3>;
                }
                if (para.startsWith("- ")) {
                  const items = para.split("\n").filter((l: string) => l.startsWith("- "));
                  return (
                    <ul key={i} className="list-disc list-inside text-[#D1D5DB] space-y-2 mb-4">
                      {items.map((item: string, j: number) => (
                        <li key={j}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                if (/^\d+\./.test(para)) {
                  return <p key={i} className="text-[#D1D5DB] mb-4">{para}</p>;
                }
                return <p key={i} className="text-[#D1D5DB] mb-4 leading-relaxed">{para}</p>;
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-dashed border-[#1E293B]">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-sm text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm text-[#9CA3AF] flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                แชร์บทความ:
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${BASE_URL}/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-[#1877F2] text-white rounded-lg hover:bg-[#1876F2]/90"
              >
                Facebook
              </a>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(post.title + " " + BASE_URL + "/blog/" + post.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-[#00B900] text-white rounded-lg hover:bg-[#00B900]/90"
              >
                LINE
              </a>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">บทความที่เกี่ยวข้อง</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp: any) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                    <div className="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden hover:border-[#A855F7]/50 transition-all">
                      <div className="relative h-32">
                        <Image src={rp.image} alt={rp.title} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-[#A855F7] uppercase">{rp.category}</span>
                        <h3 className="text-sm font-bold text-white mt-1 line-clamp-2 group-hover:text-[#A855F7]">
                          {rp.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-[#3B82F6]/10 to-[#A855F7]/10 border border-dashed border-[#3B82F6]/30 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">สนใจอุปกรณ์ Sim Racing?</h3>
            <p className="text-[#9CA3AF] mb-4">ดูสินค้ามือสองคุณภาพดีราคาคุ้มค่าจากเรา</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-[#3B82F6] text-white font-bold rounded-xl hover:bg-[#2563EB] transition-colors"
            >
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
