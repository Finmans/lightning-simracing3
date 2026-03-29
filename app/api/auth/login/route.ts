import { NextRequest, NextResponse } from "next/server";
import { sendLINEAlert } from "@/lib/lineNotify";

// Simple in-memory tracking (resets on server restart - OK for Vercel serverless)
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const ALERT_THRESHOLD = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);
  const now = Date.now();

  // Check if IP is locked out
  const attemptData = failedAttempts.get(clientIP);
  if (attemptData && now - attemptData.lastAttempt < LOCKOUT_DURATION) {
    if (attemptData.count >= ALERT_THRESHOLD) {
      return NextResponse.json(
        { error: "ระบบรักษาความปลอดภัย: ทดลองเข้าสู่ระบบหลายครั้ง กรุณารอ 15 นาที" },
        { status: 429 }
      );
    }
  }

  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    // Track failed attempt
    const current = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    const newCount = current.count + 1;
    failedAttempts.set(clientIP, { count: newCount, lastAttempt: now });

    // Send LINE alert if threshold reached
    if (newCount >= ALERT_THRESHOLD) {
      const alertMsg = `🚨 ⚠️ Lightning SimRacing Admin Alert!

🔴 มีคนพยายามเข้าหน้า Admin
📍 IP: ${clientIP}
⏰ เวลา: ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}
🔢 จำนวนครั้ง: ${newCount} ครั้ง

💡 กรุณาตรวจสอบ!`;

      await sendLINEAlert(alertMsg);

      // Clear the counter after alert sent
      failedAttempts.delete(clientIP);
    }

    return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  // Success - clear failed attempts
  failedAttempts.delete(clientIP);

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // Send success notification
  const successMsg = `✅ Lightning SimRacing Admin Login

👤 มีการเข้าสู่ระบบ Admin
📍 IP: ${clientIP}
⏰ เวลา: ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`;

  await sendLINEAlert(successMsg);

  return res;
}
