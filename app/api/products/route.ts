import { NextRequest, NextResponse } from "next/server";
import { readProducts, createProduct } from "@/lib/db";
import { cookies } from "next/headers";

function isAdmin() {
  const cookieStore = cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const status = searchParams.get("status");

  let products = readProducts();

  if (type) products = products.filter((p) => p.type === type || p.type === "both");
  if (category) products = products.filter((p) => p.category === category);
  if (featured === "true") products = products.filter((p) => p.featured);
  if (status) products = products.filter((p) => p.status === status);
  else products = products.filter((p) => p.status === "active");

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const product = createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
