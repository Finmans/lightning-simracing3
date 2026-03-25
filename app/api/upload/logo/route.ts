import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import path from "path";

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
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "svg";
  const logoPath = path.join(process.cwd(), "public", `logo.${ext}`);

  await writeFile(logoPath, buffer);
  return NextResponse.json({ url: `/logo.${ext}` });
}
