import { NextRequest, NextResponse } from "next/server";
import { sendLINEAlert } from "@/lib/lineNotify";

export async function POST(req: NextRequest) {
  try {
    const { productId, productName, name, phone, email, rentalDays, message, type } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    const orderType = type === "rent" ? "🗓️ สั่งเช่า" : "🛒 สั่งซื้อ";
    const rentalInfo = rentalDays ? `\n📅 ระยะเวลาเช่า: ${rentalDays} วัน` : "";

    const lineMsg = `${orderType}

🛍️ สินค้า: ${productName || "ไม่ระบุ"}
${productId ? `🔗 ID: ${productId}` : ""}

👤 ชื่อ: ${name}
📱 โทร: ${phone}
${email ? `📧 Email: ${email}` : ""}
${rentalInfo}
${message ? `\n💬 หมายเหตุ: ${message}` : ""}

⏰ ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`;

    await sendLINEAlert(lineMsg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
