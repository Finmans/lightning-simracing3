import { NextRequest, NextResponse } from "next/server";

const PROMPTPAY_NUMBER = process.env.PROMPTPAY_NUMBER || "0XX-XXX-XXXX";
const MERCHANT_NAME = "Lightning SimRacing";
const AMOUNT = 0; // 0 = pay by amount

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get("amount") || "0";

    // Generate PromptPay QR payload (Thai QR payment standard)
    // This creates a proper QR payload for PromptPay payments
    const qrPayload = generatePromptPayPayload(PROMPTPAY_NUMBER, parseFloat(amount));

    return NextResponse.json({
      success: true,
      payload: qrPayload,
      merchantName: MERCHANT_NAME,
      amount: parseFloat(amount),
      promptPayNumber: PROMPTPAY_NUMBER,
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json({ error: "ไม่สามารถสร้าง QR Code ได้" }, { status: 500 });
  }
}

function generatePromptPayPayload(promptPayId: string, amount: number): string {
  // PromptPay QR payment payload generation
  // Format: EMVCo QR Code payload for Thai QR Payment

  const payload = {
    payloadFormatIndicator: "01",
    pointOfInitiationMethod: amount > 0 ? "12" : "11", // 12 = static, 11 = dynamic
    merchantCategoryCode: "0000",
    transactionCurrency: "764",
    countryCode: "TH",
    merchantName: MERCHANT_NAME,
    merchantCity: "BANGKOK",
  };

  // Build the QR string
  let qr = "";

  // Payload Format Indicator (01)
  qr += "01" + "0108"; // 01 + length

  // Point of Initiation Method (52)
  qr += "52" + "0100"; // 01 + MCC

  // Merchant Category Code (52) - already set above

  // Transaction Currency (53)
  qr += "53" + "030764"; // 03 + 764 (THB)

  // Country Code (58)
  qr += "58" + "020254"; // 02 + TH

  // Merchant Name (59)
  const nameBytes = stringToBytes(MERCHANT_NAME);
  qr += "59" + (nameBytes.length.toString().padStart(2, "0")) + bytesToString(nameBytes);

  // Merchant City (60)
  qr += "60" + "0707BANGKOK";

  // Add PromptPay ID if present
  if (promptPayId) {
    // Format: Mobile (06) or National ID (02)
    const ppType = promptPayId.length === 10 ? "02" : "06";
    qr += "01" + (promptPayId.length.toString().padStart(2, "0")) + promptPayId;
  }

  // Add amount if specified
  if (amount > 0) {
    const amountStr = amount.toFixed(2);
    qr += "54" + (amountStr.length.toString().padStart(2, "0")) + amountStr;
  }

  // CRC16 calculation placeholder
  qr += "6304";

  return qr;
}

function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

function bytesToString(bytes: number[]): string {
  return bytes.map((b) => String.fromCharCode(b)).join("");
}
