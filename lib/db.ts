import fs from "fs";
import path from "path";
import { Product } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

export function readProducts(): Product[] {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function writeProducts(products: Product[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

export function getProduct(id: string): Product | null {
  return readProducts().find((p) => p.id === id) ?? null;
}

export function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "views">
): Product {
  const products = readProducts();
  const product: Product = {
    ...data,
    id: `p${Date.now()}`,
    stockQuantity: data.stockQuantity ?? 1,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(product);
  writeProducts(products);
  return product;
}

export function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>
): Product | null {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  writeProducts(products);
  return true;
}

export function incrementViews(id: string): void {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index].views = (products[index].views || 0) + 1;
    writeProducts(products);
  }
}
