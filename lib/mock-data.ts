export interface Package {
  id: string;
  name: string;
  tier: string;
  pricePerDay: number;
  description: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  specs: {
    wheelBase: string;
    pedals: string;
    cockpit: string;
    monitor: string;
    console: string;
  };
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  category: string;
}

export interface EquipmentBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  products: {
    name: string;
    type: string;
    image: string;
    highlight: string;
  }[];
}

export const packages: Package[] = [
  {
    id: "set-a",
    name: "Set A",
    tier: "Standard",
    pricePerDay: 500,
    description: "เหมาะสำหรับมือใหม่ที่ต้องการสัมผัสประสบการณ์ Sim Racing ครั้งแรก",
    image: "https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=600&auto=format&fit=crop",
    badge: "เริ่มต้น",
    badgeColor: "blue",
    features: [
      "จัดส่งถึงบ้านฟรี",
      "ติดตั้งให้ฟรี",
      "สอนการใช้งาน",
      "รับคืนฟรี",
    ],
    specs: {
      wheelBase: "Logitech G923",
      pedals: "Logitech Pedals 3-pedal",
      cockpit: "NLR Victory Simulator",
      monitor: "27\" 144Hz",
      console: "PlayStation 5",
    },
  },
  {
    id: "set-b",
    name: "Set B",
    tier: "Professional",
    pricePerDay: 1200,
    description: "สำหรับผู้เล่นระดับกลางที่ต้องการความสมจริงของ Direct Drive",
    image: "https://images.unsplash.com/photo-1760553121003-93afc4d88ae0?w=600&auto=format&fit=crop",
    badge: "ยอดนิยม",
    badgeColor: "cyan",
    features: [
      "จัดส่งถึงบ้านฟรี",
      "ติดตั้งให้ฟรี",
      "สอนการใช้งาน",
      "รับคืนฟรี",
      "Force Feedback แรง 15Nm",
    ],
    specs: {
      wheelBase: "Fanatec DD+ 15Nm",
      pedals: "Fanatec CSL Pedals LoadCell",
      cockpit: "NLR GT Elite",
      monitor: "32\" 165Hz Curved",
      console: "PlayStation 5",
    },
  },
  {
    id: "set-c",
    name: "Set C",
    tier: "GT DD Pro",
    pricePerDay: 1800,
    description: "ระดับสูงสุดสำหรับนักแข่งมืออาชีพ ประสบการณ์สมจริงที่สุด",
    image: "https://images.unsplash.com/photo-1752959807835-3af0030dc3a9?w=600&auto=format&fit=crop",
    badge: "Pro",
    badgeColor: "orange",
    features: [
      "จัดส่งถึงบ้านฟรี",
      "ติดตั้งให้ฟรี",
      "สอนการใช้งาน",
      "รับคืนฟรี",
      "GT DD Pro 8Nm",
      "Motion Platform Support",
    ],
    specs: {
      wheelBase: "Fanatec GT DD Pro 8Nm",
      pedals: "Fanatec Clubsport V3",
      cockpit: "NLR GT Elite Lite",
      monitor: "34\" 165Hz UltraWide",
      console: "PlayStation 5",
    },
  },
];

export const equipmentBrands: EquipmentBrand[] = [
  {
    id: "fanatec",
    name: "FANATEC",
    logo: "F",
    description: "แบรนด์ชั้นนำระดับโลกสำหรับ Sim Racing อุปกรณ์ Direct Drive คุณภาพสูง",
    color: "#3B82F6",
    products: [
      {
        name: "GT DD Pro",
        type: "Wheel Base",
        image: "https://images.unsplash.com/photo-1570352481356-e633565f3b5c?w=400&auto=format&fit=crop",
        highlight: "8Nm Direct Drive",
      },
      {
        name: "CSL DD+",
        type: "Wheel Base",
        image: "https://images.unsplash.com/photo-1614609953905-baeff400aab3?w=400&auto=format&fit=crop",
        highlight: "15Nm Force Feedback",
      },
      {
        name: "Clubsport V3",
        type: "Pedals",
        image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&auto=format",
        highlight: "LoadCell Brake",
      },
    ],
  },
  {
    id: "simagic",
    name: "SIMAGIC",
    logo: "S",
    description: "นวัตกรรม Direct Drive จากจีน คุณภาพเทียบเท่าแบรนด์ยุโรปในราคาที่ดีกว่า",
    color: "#F59E0B",
    products: [
      {
        name: "Alpha Mini",
        type: "Wheel Base",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format",
        highlight: "10Nm Direct Drive",
      },
      {
        name: "Alpha U",
        type: "Wheel Base",
        image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&auto=format",
        highlight: "15Nm Flagship",
      },
      {
        name: "P2000",
        type: "Pedals",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format",
        highlight: "Hydraulic Pedals",
      },
    ],
  },
  {
    id: "moza",
    name: "MOZA",
    logo: "M",
    description: "อุปกรณ์ Sim Racing รุ่นใหม่ล่าสุด Direct Drive ราคาเข้าถึงง่าย คุณภาพจัดเต็ม",
    color: "#8B5CF6",
    products: [
      {
        name: "R9 V2",
        type: "Wheel Base",
        image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&auto=format",
        highlight: "9Nm Direct Drive",
      },
      {
        name: "R12",
        type: "Wheel Base",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format",
        highlight: "12Nm High Torque",
      },
      {
        name: "CRP Pedals",
        type: "Pedals",
        image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&auto=format",
        highlight: "Load Cell + Clutch",
      },
    ],
  },
];

export const addOns: AddOn[] = [
  {
    id: "extra-monitor",
    name: "จอเพิ่มเติม (Triple Screen)",
    description: "เพิ่มจอข้างเพื่อมุมมองแบบ Triple Screen",
    pricePerDay: 300,
    category: "display",
  },
  {
    id: "vr-headset",
    name: "VR Headset (Meta Quest 3)",
    description: "สัมผัสประสบการณ์ Virtual Reality",
    pricePerDay: 400,
    category: "vr",
  },
  {
    id: "shifter",
    name: "Gear Shifter (Fanatec)",
    description: "เกียร์ธรรมดาสำหรับรถ GT",
    pricePerDay: 150,
    category: "input",
  },
  {
    id: "handbrake",
    name: "Handbrake",
    description: "แฮนด์เบรคสำหรับรถ Rally",
    pricePerDay: 150,
    category: "input",
  },
  {
    id: "gaming-chair",
    name: "Gaming Chair",
    description: "เก้าอี้เกมมิ่งสำหรับผู้ชม",
    pricePerDay: 100,
    category: "comfort",
  },
];

export const rentalDays = [1, 3, 7, 14, 30];

export const discounts: Record<number, number> = {
  1: 0,
  3: 0.05,
  7: 0.10,
  14: 0.15,
  30: 0.20,
};

export const howItWorksSteps = [
  {
    step: "01",
    title: "เลือกแพ็กเกจ",
    description: "เลือกชุดอุปกรณ์ที่เหมาะกับคุณ ตั้งแต่มือใหม่ไปจนถึงระดับ Pro",
    icon: "Package",
    color: "blue",
  },
  {
    step: "02",
    title: "จองและชำระเงิน",
    description: "ติดต่อผ่าน Line หรือโทรศัพท์ ยืนยันวันที่และชำระเงินล่วงหน้า",
    icon: "CreditCard",
    color: "cyan",
  },
  {
    step: "03",
    title: "จัดส่งถึงบ้าน",
    description: "ทีมงานจัดส่งและติดตั้งอุปกรณ์ครบชุดถึงบ้านคุณ พร้อมสอนการใช้งาน",
    icon: "Truck",
    color: "orange",
  },
  {
    step: "04",
    title: "สนุกได้เลย!",
    description: "เล่นได้ตามระยะเวลาที่เช่า เมื่อครบกำหนดทีมงานจะมารับอุปกรณ์คืน",
    icon: "Zap",
    color: "blue",
  },
];

export const serviceAreas = [
  "กรุงเทพมหานคร",
  "ปทุมธานี",
  "รังสิต",
  "คลองหลวง",
  "นนทบุรี",
  "สมุทรปราการ",
];
