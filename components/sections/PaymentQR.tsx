"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, Copy, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface Props {
  amount?: number;
  productName?: string;
}

export default function PaymentQR({ amount = 0, productName }: Props) {
  const [qrImage, setQrImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentData, setPaymentData] = useState<{ merchantName: string; amount: number; promptPayNumber: string } | null>(null);

  useEffect(() => {
    generateQR();
  }, [amount]);

  async function generateQR() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/payment/qr?amount=${amount}`);
      const data = await res.json();

      if (data.success) {
        setPaymentData(data);

        // Generate QR code image
        const QRCode = (await import("qrcode")).default;
        const qr = await QRCode.toDataURL(data.payload, {
          width: 280,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        setQrImage(qr);
      } else {
        setError("ไม่สามารถสร้าง QR Code ได้");
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด");
    }

    setLoading(false);
  }

  function copyPromptPay() {
    if (paymentData?.promptPayNumber) {
      navigator.clipboard.writeText(paymentData.promptPayNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0A1A] border border-dashed border-[#22C55E]/30 rounded-2xl p-6 max-w-sm mx-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#22C55E]/20 rounded-xl mb-3">
          <QrCode className="w-6 h-6 text-[#22C55E]" />
        </div>
        <h3 className="text-xl font-black text-white">ชำระเงิน</h3>
        {productName && <p className="text-sm text-[#A1A1AA] mt-1">{productName}</p>}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin mb-3" />
          <p className="text-[#A1A1AA] text-sm">กำลังสร้าง QR Code...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-8 text-red-400">
          <AlertCircle className="w-8 h-8 mb-3" />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <>
          {qrImage && (
            <div className="flex justify-center mb-6">
              <img src={qrImage} alt="Payment QR" className="rounded-xl" />
            </div>
          )}

          {paymentData && (
            <div className="space-y-3">
              {amount > 0 && (
                <div className="text-center">
                  <p className="text-xs text-[#A1A1AA] uppercase tracking-wider">จำนวนเงิน</p>
                  <p className="text-3xl font-black text-[#22C55E]">฿{amount.toLocaleString()}</p>
                </div>
              )}

              <div className="border-t border-dashed border-[#1E293B] pt-3">
                <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">พร้อมเพย์</p>
                <div className="flex items-center justify-between bg-[#0A0A0F] rounded-lg px-4 py-3">
                  <span className="font-mono text-white">{paymentData.promptPayNumber}</span>
                  <button
                    onClick={copyPromptPay}
                    className="text-[#22C55E] hover:text-[#16A34A] transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#52525B] text-center">
                สแกน QR Code ด้วยแอปธนาคารของคุณ<br />
                หรือกดคัดลอกเลขบัญชีไปวางในแอป
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
