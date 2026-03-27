import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

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

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { data, error } = await supabaseAdmin.storage
    .from("images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "ไม่สามารถอัพโหลดไฟล์ได้: " + error.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
