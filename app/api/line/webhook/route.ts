import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// LINE Channel credentials (should be in env vars in production)
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "65f9ba8fcd17ee64229e84891448d45c";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "GethMPJ4TawAp1hTOt7wb8tigGD1VMvB9Q+22QumeakgEWjMCxyojwoR4HeIyzpYhkgwIn5gqwJTavpijKaJVoHV+Dw7ufkxeV6TS9NkwkxL3U7gKoO22rssJA+xgdNzwWBF+ID+vztqO4RN421QswdB04t89/1O/w1cDnyilFU=";

// Verify LINE signature
function verifySignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac("SHA256", LINE_CHANNEL_SECRET);
  hmac.update(body);
  const digest = hmac.digest("base64");
  return digest === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-line-signature") || "";

    // Verify signature
    if (!verifySignature(body, signature)) {
      console.error("LINE signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const events = JSON.parse(body).events || [];

    for (const event of events) {
      if (event.type === "message") {
        const userId = event.source?.userId;
        const userMessage = event.message?.text || "";
        const replyToken = event.replyToken;

        console.log(`📩 Message from ${userId}: ${userMessage}`);

        // Simple auto-reply logic
        let replyMessage = "";

        if (userMessage.toLowerCase().includes("สวัสดี") || userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
          replyMessage = "สวัสดีครับ! 👋 ยินดีต้อนรับสู่ Lightning SimRacing\n\nคุณสนใจอุปกรณ์ Sim Racing มือสองหรือเช่าอุปกรณ์ไหมครับ?\n\n🏪 สินค้าของเรา:\n• Wheel Base (Direct Drive)\n• Steering Wheel\n• Pedals (LoadCell)\n• Cockpit\n• Bundle ครบชุด\n\nต้องการดูสินค้าไหมครับ? เข้าได้ที่ 👉 https://lightning-simracing.vercel.app/shop";
        } else if (userMessage.toLowerCase().includes("ราคา") || userMessage.toLowerCase().includes("price")) {
          replyMessage = "💰 ราคาสินค้าของเราเริ่มตั้งแต่ 8,900 บาท (Bundle) ไปจนถึง 32,900 บาท (Full Setup)\n\nดูสินค้าทั้งหมดได้ที่ 👉 https://lightning-simracing.vercel.app/shop";
        } else if (userMessage.toLowerCase().includes("เช่า") || userMessage.toLowerCase().includes("rent")) {
          replyMessage = "🏠 บริการเช่าอุปกรณ์ Sim Racing!\n\nมีชุดเช่าหลายระดับ:\n• ราคา 500-1,200 บาท/วัน\n• 4,500-6,500 บาท/สัปดาห์\n• 9,000-20,000 บาท/เดือน\n\n📞 ติดต่อสอบถาม: 099-999-9999\n\nดูรายละเอียด: 👉 https://lightning-simracing.vercel.app/rent";
        } else if (userMessage.toLowerCase().includes("ติดต่อ") || userMessage.toLowerCase().includes("เบอร์") || userMessage.toLowerCase().includes("โทร")) {
          replyMessage = "📞 ติดต่อ Lightning SimRacing\n\n📱 โทร: 099-999-9999\n💬 LINE: @lightningsimracing\n📍 บริการใน กรุงเทพฯ และปริมณฑล\n\n🚚 จัดส่งฟรี! ติดตั้งฟรี!";
        } else {
          replyMessage = `ขอบคุณที่ติดต่อ Lightning SimRacing! 🙏\n\nคุณสามารถ:\n• ดูสินค้ามือสอง: https://lightning-simracing.vercel.app/shop\n• ดูสินค้าเช่า: https://lightning-simracing.vercel.app/rent\n• ติดต่อเรา: 099-999-9999\n\nมีอะไรให้ช่วยเพิ่มเติมไหมครับ?`;
        }

        // Send reply via LINE API
        if (replyToken && replyMessage) {
          await fetch("https://api.line.me/v2/bot/message/reply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              replyToken: replyToken,
              messages: [
                {
                  type: "text",
                  text: replyMessage,
                },
              ],
            }),
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LINE Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ status: "LINE Bot Webhook is running", timestamp: new Date().toISOString() });
}
