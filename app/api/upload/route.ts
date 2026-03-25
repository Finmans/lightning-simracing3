import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Server config error: ADMIN_SECRET not set" }, { status: 500 });
  }
  if (token !== secret) {
    return NextResponse.json({ error: "Unauthorized — กรุณา Login ใหม่" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "ไฟล์ต้องเป็น JPG, PNG, WebP หรือ GIF เท่านั้น" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, filename);

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(uploadPath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "ไม่สามารถบันทึกไฟล์ได้ — อาจเกิดจาก server ไม่อนุญาตเขียนไฟล์" }, { status: 500 });
  }
}
