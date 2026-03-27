import { supabaseAdmin } from "./supabase";
import { Product } from "./types";

// Convert snake_case from DB to camelCase for app
function mapRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    title: row.title as string,
    brand: (row.brand as string) || "",
    category: (row.category as Product["category"]) || "accessory",
    type: (row.type as Product["type"]) || "sale",
    condition: (row.condition as Product["condition"]) || "good",
    salePrice: (row.sale_price as number) ?? null,
    originalPrice: (row.original_price as number) ?? null,
    rentPricePerDay: (row.rent_price_per_day as number) ?? null,
    rentPricePerWeek: (row.rent_price_per_week as number) ?? null,
    rentPricePerMonth: (row.rent_price_per_month as number) ?? null,
    description: (row.description as string) || "",
    features: (row.features as string[]) || [],
    specs: (row.specs as Record<string, string>) || {},
    images: (row.images as string[]) || [],
    status: (row.status as Product["status"]) || "active",
    featured: (row.featured as boolean) || false,
    stockQuantity: (row.stock_quantity as number) ?? 1,
    views: (row.views as number) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// Convert camelCase to snake_case for DB
function mapProductToRow(p: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.category !== undefined) row.category = p.category;
  if (p.type !== undefined) row.type = p.type;
  if (p.condition !== undefined) row.condition = p.condition;
  if (p.salePrice !== undefined) row.sale_price = p.salePrice;
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice;
  if (p.rentPricePerDay !== undefined) row.rent_price_per_day = p.rentPricePerDay;
  if (p.rentPricePerWeek !== undefined) row.rent_price_per_week = p.rentPricePerWeek;
  if (p.rentPricePerMonth !== undefined) row.rent_price_per_month = p.rentPricePerMonth;
  if (p.description !== undefined) row.description = p.description;
  if (p.features !== undefined) row.features = p.features;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.images !== undefined) row.images = p.images;
  if (p.status !== undefined) row.status = p.status;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.stockQuantity !== undefined) row.stock_quantity = p.stockQuantity;
  if (p.views !== undefined) row.views = p.views;
  return row;
}

export async function readProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("readProducts error:", error);
    return [];
  }

  return data.map((row) => mapRowToProduct(row as Record<string, unknown>));
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToProduct(data as Record<string, unknown>);
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "views">
): Promise<Product> {
  const id = `p${Date.now()}`;
  const now = new Date().toISOString();

  const row = {
    ...mapProductToRow(data),
    id,
    views: 0,
    created_at: now,
    updated_at: now,
  };

  const { data: result, error } = await supabaseAdmin
    .from("products")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("createProduct error:", error);
    throw error;
  }

  return mapRowToProduct(result as Record<string, unknown>);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> {
  const { data: result, error } = await supabaseAdmin
    .from("products")
    .update({ ...mapProductToRow(data), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !result) {
    console.error("updateProduct error:", error);
    return null;
  }

  return mapRowToProduct(result as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) {
    console.error("deleteProduct error:", error);
    return false;
  }
  return true;
}

export async function incrementViews(id: string): Promise<void> {
  try {
    await supabaseAdmin.rpc("increment_views", { product_id: id });
  } catch (err) {
    console.error("incrementViews error:", err);
  }
}
