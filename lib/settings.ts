import { supabaseAdmin } from "./supabase";

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
  const { data, error } = supabaseAdmin
    .from("settings")
    .select("*")
    .eq("id", "site_settings")
    .single();

  if (error || !data) return defaults;

  const row = data as Record<string, unknown>;
  return {
    heroImage: (row.hero_image as string) || defaults.heroImage,
    heroCardTitle: (row.hero_card_title as string) || defaults.heroCardTitle,
    heroCardPrice: (row.hero_card_price as string) || defaults.heroCardPrice,
    siteName: (row.site_name as string) || defaults.siteName,
    phone: (row.phone as string) || defaults.phone,
    lineId: (row.line_id as string) || defaults.lineId,
    address: (row.address as string) || defaults.address,
  };
}

export function writeSettings(data: Partial<SiteSettings>): SiteSettings {
  const current = readSettings();
  const updated = { ...current, ...data };

  const row = {
    id: "site_settings",
    hero_image: updated.heroImage,
    hero_card_title: updated.heroCardTitle,
    hero_card_price: updated.heroCardPrice,
    site_name: updated.siteName,
    phone: updated.phone,
    line_id: updated.lineId,
    address: updated.address,
    updated_at: new Date().toISOString(),
  };

  supabaseAdmin
    .from("settings")
    .upsert(row)
    .then(({ error }) => {
      if (error) console.error("writeSettings error:", error);
    });

  return updated;
}
