import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { cookies } from "next/headers";

const DATA_PATH = process.cwd() + "/data/posts.json";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET() {
  try {
    const data = readFileSync(DATA_PATH, "utf-8");
    const posts = JSON.parse(data);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = readFileSync(DATA_PATH, "utf-8");
    const posts = JSON.parse(data);

    const newPost = {
      id: `post-${Date.now()}`,
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      excerpt: body.excerpt,
      content: body.content,
      image: body.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      author: "Lightning SimRacing",
      publishedAt: body.publishedAt || new Date().toISOString().split("T")[0],
      category: body.category || "Guide",
      featured: body.featured || false,
      tags: body.tags || [],
    };

    posts.unshift(newPost);
    writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2));

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = readFileSync(DATA_PATH, "utf-8");
    const posts = JSON.parse(data);

    const index = posts.findIndex((p: any) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...body };
    writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2));

    return NextResponse.json(posts[index]);
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const data = readFileSync(DATA_PATH, "utf-8");
    const posts = JSON.parse(data);

    const filtered = posts.filter((p: any) => p.id !== id);
    writeFileSync(DATA_PATH, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
