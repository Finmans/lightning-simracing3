import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readShowcaseProducts } from "@/lib/showcase";

export async function GET() {
  try {
    const products = await readShowcaseProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/showcase error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }
  if (token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { updateShowcaseProduct } = await import("@/lib/showcase");
    const success = await updateShowcaseProduct(id, data);
    if (!success) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/showcase error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
