import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Lightning SimRacing",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0A0A0F] text-white antialiased">{children}</div>;
}
