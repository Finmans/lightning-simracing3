import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSettings, writeSettings } from "@/lib/settings";

export async function GET() {
  return NextResponse.json(await readSettings());
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const updated = await writeSettings(data);
  return NextResponse.json(updated);
}
