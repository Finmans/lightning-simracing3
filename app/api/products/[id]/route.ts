import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct, incrementViews } from "@/lib/db";
import { cookies } from "next/headers";

function isAdmin() {
  const cookieStore = cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  incrementViews(id);
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const product = updateProduct(id, body);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const ok = deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
