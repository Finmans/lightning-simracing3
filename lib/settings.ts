import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

export interface SiteSettings {
  heroImage: string;
  heroCardTitle: string;
  heroCardPrice: string;
  siteName: string;
  phone: string;
  lineId: string;
  address: string;
}

const defaults: SiteSettings = {
  heroImage: "https://images.unsplash.com/photo-1636036704268-017faa3b6557?w=800&auto=format&fit=crop",
  heroCardTitle: "Fanatec GT DD Pro Bundle",
  heroCardPrice: "฿32,900",
  siteName: "Lightning SimRacing",
  phone: "099-999-9999",
  lineId: "@lightningsimracing",
  address: "กรุงเทพมหานคร และปริมณฑล",
};

export function readSettings(): SiteSettings {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return defaults;
    return { ...defaults, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")) };
  } catch {
    return defaults;
  }
}

export function writeSettings(data: Partial<SiteSettings>): SiteSettings {
  const current = readSettings();
  const updated = { ...current, ...data };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2));
  return updated;
}
