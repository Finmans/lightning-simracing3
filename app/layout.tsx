import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SEO from "@/components/seo/SEO";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://lightning-simracing.vercel.app";
const SITE_NAME = "Lightning SimRacing";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} - ร้านค้าอุปกรณ์ Sim Racing มือสอง`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "ซื้อขายอุปกรณ์ Sim Racing มือสอง Fanatec, Simagic, Moza, Logitech สภาพดี ราคาคุ้มค่า และบริการเช่าถึงบ้านในกรุงเทพและปริมณฑล จัดส่งฟรี ติดตั้งฟรี",
  keywords: [
    "sim racing มือสอง",
    "ซื้อ sim racing",
    "เช่า sim racing",
    "fanatec ไทย",
    "simagic ไทย",
    "moza ไทย",
    "direct drive wheel",
    "loadcell pedals",
    "sim racing cockpit",
    "fanatec gt dd pro",
    "simagic alpha",
    "moza r9",
    "NLR GT Elite",
  ],
  authors: [{ name: "Lightning SimRacing" }],
  creator: "Lightning SimRacing",
  publisher: "Lightning SimRacing",
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ร้านค้าอุปกรณ์ Sim Racing มือสอง`,
    description:
      "ซื้อขายอุปกรณ์ Sim Racing มือสอง สภาพดี ราคาคุ้มค่า บริการเช่าถึงบ้าน จัดส่งฟรี ติดตั้งฟรี",
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ร้านค้าอุปกรณ์ Sim Racing มือสอง`,
    description:
      "ซื้อขายอุปกรณ์ Sim Racing มือสอง สภาพดี ราคาคุ้มค่า บริการเช่าถึงบ้าน จัดส่งฟรี",
    images: [DEFAULT_IMAGE],
    creator: "@lightningsimracing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "th-TH": BASE_URL,
    },
  },
  verification: {
    google: "your-google-verification-code", // เพิ่ม Google Search Console verification
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
      <body className="min-h-full flex flex-col bg-black">
        <GoogleAnalytics />
        <SEO />
        {children}
      </body>
    </html>
  );
}
