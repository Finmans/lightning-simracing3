import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { data, error } = await supabaseAdmin.storage
    .from("images")
    .upload(`logo_${Date.now()}`, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "ไม่สามารถอัพโหลดโลโก้ได้: " + error.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(data.path);

  return NextResponse.json({ url: urlData.publicUrl });
}
