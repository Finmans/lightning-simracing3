import { supabaseAdmin } from "./supabase";

export interface ShowcaseProduct {
  id: string;
  brandId: string;
  brandName: string;
  brandColor: string;
  productName: string;
  productType: string;
  productImage: string;
  productHighlight: string;
  sortOrder: number;
}

export async function readShowcaseProducts(): Promise<ShowcaseProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("homepage_showcase")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("readShowcaseProducts error:", error);
    return [];
  }

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    brandId: row.brand_id as string,
    brandName: row.brand_name as string,
    brandColor: row.brand_color as string,
    productName: row.product_name as string,
    productType: row.product_type as string,
    productImage: row.product_image as string,
    productHighlight: row.product_highlight as string,
    sortOrder: row.sort_order as number,
  }));
}

export async function updateShowcaseProduct(
  id: string,
  data: Partial<Omit<ShowcaseProduct, "id">>
): Promise<boolean> {
  const updateData: Record<string, unknown> = {};
  if (data.productName !== undefined) updateData.product_name = data.productName;
  if (data.productType !== undefined) updateData.product_type = data.productType;
  if (data.productImage !== undefined) updateData.product_image = data.productImage;
  if (data.productHighlight !== undefined) updateData.product_highlight = data.productHighlight;
  if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("homepage_showcase")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("updateShowcaseProduct error:", error);
    return false;
  }
  return true;
}
