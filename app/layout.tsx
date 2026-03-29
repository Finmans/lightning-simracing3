import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lightning SimRacing - ร้านค้าอุปกรณ์ Sim Racing มือสอง",
  description:
    "ซื้อขายอุปกรณ์ Sim Racing มือสอง Fanatec, Simagic, Moza สภาพดี ราคาคุ้มค่า และบริการเช่าถึงบ้านในกรุงเทพและปริมณฑล",
  keywords: ["sim racing มือสอง", "ซื้อ sim racing", "เช่า sim racing", "fanatec ไทย", "simagic ไทย", "moza ไทย"],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
