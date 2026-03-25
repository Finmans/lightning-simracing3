import Image from "next/image";
import Link from "next/link";

const serviceAreas = ["กรุงเทพมหานคร", "ปทุมธานี", "รังสิต", "คลองหลวง", "นนทบุรี", "สมุทรปราการ"];

export default function Footer() {
  return (
    <footer className="border-t border-dashed border-[#1A1A2E] bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image src="/logo.svg" alt="Lightning SimRacing" width={180} height={40} className="h-8 w-auto mb-4" />
            <p className="text-[#52525B] text-sm leading-relaxed">
              ร้านค้าอุปกรณ์ Sim Racing มือสองคุณภาพสูง พร้อมบริการเช่าถึงบ้าน
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">ร้านค้า</h4>
            <ul className="space-y-2">
              {[
                { href: "/shop", label: "ซื้อสินค้ามือสอง" },
                { href: "/rent", label: "เช่าอุปกรณ์" },
                { href: "/shop?category=bundle", label: "ชุดสำเร็จ" },
                { href: "/shop?category=wheel-base", label: "Wheel Base" },
                { href: "/shop?category=pedals", label: "Pedals" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#52525B] hover:text-[#3B82F6] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">ข้อมูล</h4>
            <ul className="space-y-2">
              {[
                { href: "/#how-it-works", label: "วิธีสั่งซื้อ" },
                { href: "/#faq", label: "คำถามที่พบบ่อย" },
                { href: "/#contact", label: "ติดต่อเรา" },
                { href: "/admin", label: "Admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#52525B] hover:text-[#3B82F6] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">พื้นที่จัดส่ง</h4>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span key={area} className="text-[#52525B] text-xs border border-dashed border-[#1A1A2E] px-2 py-1 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-[#1A1A2E] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#52525B] text-xs">© 2025 Lightning SimRacing. All rights reserved.</p>
          <p className="text-[#52525B] text-xs">
            LINE:{" "}
            <a href="https://line.me/ti/p/~@lightningsimracing" className="text-[#3B82F6] hover:underline">
              @lightningsimracing
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
