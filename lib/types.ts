export type ProductCategory =
  | "wheel-base"
  | "wheel"
  | "pedals"
  | "cockpit"
  | "monitor"
  | "accessory"
  | "bundle";

export type ProductCondition = "new" | "like-new" | "good" | "fair";
export type ProductType = "sale" | "rent" | "both";
export type ProductStatus = "active" | "sold" | "rented" | "inactive";

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  type: ProductType;
  condition: ProductCondition;
  salePrice: number | null;
  originalPrice: number | null;
  rentPricePerDay: number | null;
  rentPricePerWeek: number | null;
  rentPricePerMonth: number | null;
  description: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  status: ProductStatus;
  featured: boolean;
  stockQuantity: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "wheel-base": "Wheel Base",
  wheel: "Steering Wheel",
  pedals: "แป้นเหยียบ",
  cockpit: "Cockpit",
  monitor: "จอมอนิเตอร์",
  accessory: "อุปกรณ์เสริม",
  bundle: "ชุดสำเร็จ",
};

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "ใหม่",
  "like-new": "เหมือนใหม่",
  good: "ดี",
  fair: "พอใช้",
};

export const CONDITION_COLORS: Record<ProductCondition, string> = {
  new: "#22C55E",
  "like-new": "#3B82F6",
  good: "#F59E0B",
  fair: "#8B5CF6",
};
