import { NextRequest, NextResponse } from "next/server";
import { sendLINEAlert } from "@/lib/lineNotify";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, product, message } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    // Send LINE notification
    const lineMsg = `📩 **มีลูกค้าติดต่อใหม่!**

👤 ชื่อ: ${name}
📱 โทร: ${phone}
${email ? `📧 Email: ${email}` : ""}
${product ? `🛒 สินค้าที่สนใจ: ${product}` : ""}

💬 ข้อความ:
${message}

⏰ ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`;

    await sendLINEAlert(lineMsg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
